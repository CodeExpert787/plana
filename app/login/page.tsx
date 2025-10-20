"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import "../../i18n-client"

export default function LoginPage() {
  const { t } = useTranslation("pages")
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      // Debug: Log the actual error message
      console.log('Login error:', error.message)
      
      // Provide more helpful error messages
      if (error.message.includes('Email not confirmed') || 
          error.message.toLowerCase().includes('email not confirmed') || 
          error.message.toLowerCase().includes('confirm your email') ||
          error.message.toLowerCase().includes('email confirmation')) {
        setError('Please check your email and click the confirmation link before signing in.')
      } else if (error.message.includes('Invalid login credentials') || 
                 error.message.includes('invalid credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // On success, Supabase redirects to Google and back; session will be picked up on return
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-sky-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-12 w-auto" />
          </div>
          <CardDescription>
            {t("welcomeBack") || "Welcome back! Please sign in to your account."}
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
            
            <div className="space-y-2">
              <Label htmlFor="password">{t("password") || "Password"}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("enterPassword") || "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("signIn") || "Sign In"}
            </Button>
          </form>

          <div className="my-4 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="mx-3 text-xs text-gray-500">{t("or") || "Or"}</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
         >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 48 48"
              className="mr-2"
            >
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.3-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.2 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3 5.1-5.9 6.6l6.2 5.2C37.1 41.1 41 38 43 33.5c1.1-2.3 1.6-5 1.6-8 0-1.3-.1-2.3-.4-5z"/>
            </svg>
            {t("continueWithGoogle") || "Continue with Google"}
          </Button>
          
          <div className="mt-6 text-center text-sm">
            <Link 
              href="/forgot-password" 
              className="text-cyan-600 hover:text-cyan-500 underline"
            >
              {t("forgotPassword") || "Forgot your password?"}
            </Link>
          </div>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">
              {t("dontHaveAccount") || "Don't have an account?"}{" "}
            </span>
            <Link 
              href="/signup" 
              className="text-cyan-600 hover:text-cyan-500 underline font-medium"
            >
              {t("signUp") || "Sign up"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
