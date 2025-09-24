"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing Supabase connection...')

    try {
      if (!supabase) {
        setStatus('❌ Supabase client is null')
        return
      }

      // Test auth service (which we know works)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        setStatus(`❌ Session check failed: ${sessionError.message}`)
        return
      }

      setStatus('✅ Supabase connection successful! Auth service is working.')
      
    } catch (err) {
      setStatus(`❌ Network error: ${err}`)
      console.error('Full error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    setStatus('Testing auth...')

    try {
      if (!supabase) {
        setStatus('❌ Supabase client is null')
        return
      }

      // Test auth connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus(`❌ Auth failed: ${error.message}`)
      } else {
        setStatus('✅ Auth connection successful!')
      }
    } catch (err) {
      setStatus(`❌ Auth error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testBasicNetwork = async () => {
    setLoading(true)
    setStatus('Testing basic network...')

    try {
      // Test basic internet connectivity
      const response = await fetch('https://httpbin.org/get')
      if (response.ok) {
        setStatus('✅ Basic internet connectivity works!')
      } else {
        setStatus(`❌ Basic network test failed: ${response.status}`)
      }
    } catch (err) {
      setStatus(`❌ No internet connection: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    setLoading(true)
    setStatus('Testing signup functionality...')

    try {
      if (!supabase) {
        setStatus('❌ Supabase client is null')
        return
      }

      // Test signup with a test email
      const testEmail = `test-${Date.now()}@example.com`
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      })

      if (error) {
        setStatus(`❌ Signup test failed: ${error.message}`)
      } else if (data.user && !data.user.email_confirmed_at) {
        setStatus(`✅ User created but email needs confirmation. Email: ${testEmail}`)
      } else {
        setStatus('✅ Signup functionality works! User can sign in immediately.')
      }
    } catch (err) {
      setStatus(`❌ Signup error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const disableEmailConfirmation = async () => {
    setLoading(true)
    setStatus('Instructions for disabling email confirmation...')

    try {
      setStatus(`
📧 To disable email confirmation in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Settings
3. Find "Email" section
4. Toggle OFF "Confirm email"
5. Save changes

This will allow users to sign in immediately after signup without email verification.

Current status: Email confirmation is ENABLED (users need to verify email)
      `)
    } catch (err) {
      setStatus(`❌ Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const confirmUserEmail = async () => {
    const email = prompt('Enter the email address to confirm:')
    if (!email) return

    setLoading(true)
    setStatus('Confirming user email...')

    try {
      const response = await fetch('/api/admin/confirm-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus(`✅ ${data.message}`)
      } else {
        setStatus(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      setStatus(`❌ Network error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    const email = prompt('Enter email to test login:')
    const password = prompt('Enter password:')
    if (!email || !password) return

    setLoading(true)
    setStatus('Testing login...')

    try {
      if (!supabase) {
        setStatus('❌ Supabase client is null')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login test result:', { data, error })

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setStatus(`❌ Login failed: Email not confirmed. Use "Manually Confirm User Email" button to fix this.`)
        } else {
          setStatus(`❌ Login failed: ${error.message}`)
        }
      } else {
        setStatus(`✅ Login successful! User: ${data.user?.email}`)
      }
    } catch (err) {
      setStatus(`❌ Login error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={testBasicNetwork} 
                disabled={loading}
                className="w-full"
                variant="secondary"
              >
                Test Basic Internet
              </Button>
              <Button 
                onClick={testConnection} 
                disabled={loading}
                className="w-full"
              >
                Test Supabase Connection
              </Button>
              <Button 
                onClick={testAuth} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Test Auth Connection
              </Button>
              <Button 
                onClick={testSignup} 
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                Test Signup (Creates Test User)
              </Button>
              <Button 
                onClick={disableEmailConfirmation} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                How to Disable Email Confirmation
              </Button>
              <Button 
                onClick={confirmUserEmail} 
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                Manually Confirm User Email (Dev)
              </Button>
              <Button 
                onClick={testLogin} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Test Login (Debug)
              </Button>
            </div>
            
            {status && (
              <div className="p-3 bg-gray-100 rounded-md">
                <p className="text-sm">{status}</p>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
              <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
