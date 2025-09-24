"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Database, User, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

export function ReviewTroubleshooting() {
  const { user } = useAuth()
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runDiagnostics = async () => {
    setIsChecking(true)
    const diagnostics = {
      userAuthenticated: false,
      supabaseConfigured: false,
      reviewsTableExists: false,
      userProfile: null,
      errors: [] as string[]
    }

    try {
      // Check 1: User Authentication
      if (user) {
        diagnostics.userAuthenticated = true
        diagnostics.userProfile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'Not set'
        }
      } else {
        diagnostics.errors.push('User not authenticated')
      }

      // Check 2: Supabase Configuration
      if (supabase) {
        diagnostics.supabaseConfigured = true
        
        // Check 3: Reviews Table Exists
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('id')
            .limit(1)
          
          if (error) {
            if (error.code === '42P01') {
              diagnostics.errors.push('Reviews table does not exist. Run the SQL script in Supabase.')
            } else {
              diagnostics.errors.push(`Database error: ${error.message}`)
            }
          } else {
            diagnostics.reviewsTableExists = true
          }
        } catch (err) {
          diagnostics.errors.push(`Database connection error: ${err}`)
        }
      } else {
        diagnostics.errors.push('Supabase not configured')
      }

    } catch (err) {
      diagnostics.errors.push(`Unexpected error: ${err}`)
    }

    setResults(diagnostics)
    setIsChecking(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Review System Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </Button>

        {results && (
          <div className="space-y-4">
            {/* User Authentication */}
            <div className="flex items-center space-x-2">
              {results.userAuthenticated ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span>User Authentication</span>
              {results.userProfile && (
                <span className="text-sm text-gray-500">
                  ({results.userProfile.name} - {results.userProfile.email})
                </span>
              )}
            </div>

            {/* Supabase Configuration */}
            <div className="flex items-center space-x-2">
              {results.supabaseConfigured ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span>Supabase Configuration</span>
            </div>

            {/* Reviews Table */}
            <div className="flex items-center space-x-2">
              {results.reviewsTableExists ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span>Reviews Table</span>
            </div>

            {/* Errors */}
            {results.errors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Issues Found:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {results.errors.map((error: string, index: number) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Solutions */}
            {results.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Solutions:</h4>
                <div className="space-y-2 text-sm">
                  {results.errors.includes('User not authenticated') && (
                    <div className="flex items-start space-x-2">
                      <User className="w-4 h-4 mt-0.5 text-blue-500" />
                      <div>
                        <p className="font-medium">Login Required</p>
                        <p>You need to be logged in to submit reviews. Click "Start Adventure" to login.</p>
                      </div>
                    </div>
                  )}
                  
                  {results.errors.includes('Reviews table does not exist') && (
                    <div className="flex items-start space-x-2">
                      <Database className="w-4 h-4 mt-0.5 text-blue-500" />
                      <div>
                        <p className="font-medium">Database Setup Required</p>
                        <p>Run the SQL script in your Supabase dashboard:</p>
                        <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                          database/reviews_table.sql
                        </code>
                      </div>
                    </div>
                  )}
                  
                  {results.errors.includes('Supabase not configured') && (
                    <div className="flex items-start space-x-2">
                      <Settings className="w-4 h-4 mt-0.5 text-blue-500" />
                      <div>
                        <p className="font-medium">Environment Variables</p>
                        <p>Check your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Message */}
            {results.errors.length === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All systems are working correctly! You should be able to submit reviews.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
