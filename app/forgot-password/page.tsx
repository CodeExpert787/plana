"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from 'react-i18next'
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import "../../i18n-client"

export default function ForgotPasswordPage() {
  const { t } = useTranslation("pages")
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-sky-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-cyan-900 mb-2">
                {t("emailSent") || "Email Sent!"}
              </h2>
              <p className="text-gray-600 mb-4">
                {t("resetPasswordEmailSent") || "We've sent you a password reset link. Please check your email."}
              </p>
              <Link href="/login">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("backToLogin") || "Back to Login"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-sky-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-cyan-900">
            {t("forgotPassword") || "Forgot Password?"}
          </CardTitle>
          <CardDescription>
            {t("forgotPasswordDescription") || "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t("email") || "Email"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("enterEmail") || "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("sendResetLink") || "Send Reset Link"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <Link 
              href="/login" 
              className="text-cyan-600 hover:text-cyan-500 underline"
            >
              <ArrowLeft className="inline h-4 w-4 mr-1" />
              {t("backToLogin") || "Back to Login"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
