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
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import "../../i18n-client"

export default function SignupPage() {
  const { t } = useTranslation("pages")
  const { signUp } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [emailConfirmationMessage, setEmailConfirmationMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordsDoNotMatch") || "Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError(t("passwordTooShort") || "Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const { error, data } = await signUp(formData.email, formData.password, formData.fullName)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data?.needsEmailConfirmation) {
      setEmailConfirmationMessage(data.message)
      setSuccess(true)
      setLoading(false)
      // Redirect to login after 5 seconds to give user time to read the message
      setTimeout(() => {
        router.push('/login')
      }, 5000)
    } else {
      setSuccess(true)
      setLoading(false)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
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
                {t("accountCreated") || "Account Created!"}
              </h2>
              <p className="text-gray-600 mb-4">
                {emailConfirmationMessage || t("checkEmailForVerification") || "Please check your email to verify your account."}
              </p>
              <p className="text-sm text-gray-500">
                {t("redirectingToLogin") || "Redirecting to login page..."}
              </p>
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
          <CardTitle className="text-2xl font-bold text-cyan-900">PLAN A</CardTitle>
          <CardDescription>
            {t("createAccount") || "Create your account to get started"}
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
              <Label htmlFor="fullName">{t("fullName") || "Full Name"}</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder={t("enterFullName") || "Enter your full name"}
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t("email") || "Email"}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("enterEmail") || "Enter your email"}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t("password") || "Password"}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("enterPassword") || "Enter your password"}
                  value={formData.password}
                  onChange={handleChange}
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword") || "Confirm Password"}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("confirmPassword") || "Confirm your password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("createAccount") || "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {t("alreadyHaveAccount") || "Already have an account?"}{" "}
            </span>
            <Link 
              href="/login" 
              className="text-cyan-600 hover:text-cyan-500 underline font-medium"
            >
              {t("signIn") || "Sign in"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
