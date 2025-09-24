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
  const { signIn } = useAuth()
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-sky-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-cyan-900">PLAN A</CardTitle>
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
