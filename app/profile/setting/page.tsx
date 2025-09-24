"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Bell, Globe, Shield, CreditCard, HelpCircle, LogOut } from "lucide-react"
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { UserProfileService, UserProfile } from "@/lib/user-profile-service";
import "../../../i18n-client";

export default function SettingsPage() {
  const { t } = useTranslation("pages");
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // Estados para las configuraciones
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [activityUpdates, setActivityUpdates] = useState(true)
  const [promotions, setPromotions] = useState(false)
  const [language, setLanguage] = useState("es")
  
  // Estados para la información del usuario
  const [userInfo, setUserInfo] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    description: ''
  })
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch user profile from database
  const fetchUserProfile = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      
      const profile = await UserProfileService.getUserProfile(user.id)
      
      if (profile) {
        setUserProfile(profile)
        setUserInfo({
          fullName: profile.name || user.user_metadata?.full_name || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          description: profile.description || ''
        })
      } else {
        // If no profile exists, use auth user data
        setUserInfo({
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          description: user.user_metadata?.description || ''
        })
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError('Error loading profile data')
      // Fallback to auth user data
      setUserInfo({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        description: user.user_metadata?.description || ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar información del usuario cuando cambie el user
  React.useEffect(() => {
    if (user) {
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const handleSaveChanges = async () => {
    if (!user?.id) return

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const updateData = {
        name: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phone,
        description: userInfo.description
      }

      if (userProfile) {
        // Update existing profile
        const updatedProfile = await UserProfileService.updateUserProfile(user.id, updateData)
        setUserProfile(updatedProfile)
      } else {
        // Create new profile with all required fields
        const newProfileData = {
          user_id: user.id,
          name: userInfo.fullName,
          email: userInfo.email,
          phone: userInfo.phone,
          avatar: '',
          location: '',
          member_since: new Date().toISOString(),
          description: userInfo.description,
          completed_activities: 0,
          reviews: 0,
          rating: 0
        }
        const newProfile = await UserProfileService.createUserProfile(newProfileData)
        setUserProfile(newProfile)
      }

      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Error saving profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center">
            <Link href="/profile" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{t("settings")}</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loadingSettings")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <Link href="/profile" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{t("settings")}</h1>
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          {/* Perfil */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userProfile?.avatar || "/diverse-group.png"} alt={userInfo.fullName} />
                  <AvatarFallback className="bg-emerald-500 text-white">
                    {getInitials(userInfo.fullName || userInfo.email)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="ml-4">
                <h2 className="font-bold">{userInfo.fullName || 'Usuario'}</h2>
                <p className="text-sm text-gray-500">{userInfo.email}</p>
              </div>
              <div className="ml-auto flex gap-2">
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchUserProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : 'Refresh'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? t("cancel") : t("edit")}
                </Button>
              </div>
            </div>
          </div>

          {/* Cuenta */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-semibold mb-4">{t("account")}</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input 
                  id="name" 
                  value={userInfo.fullName}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  className="mt-1" 
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userInfo.email}
                  className="mt-1" 
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">{t("emailCannotBeChanged")}</p>
              </div>
              <div>
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input 
                  id="phone" 
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1" 
                  disabled={!isEditing}
                  placeholder="+54 9 294 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="description">{t("description")}</Label>
                <textarea
                  id="description"
                  value={userInfo.description}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md h-24"
                  placeholder="Escribe una breve descripción sobre ti..."
                  disabled={!isEditing}
                />
              </div>
              {isEditing && (
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? t("saving") : t("saveChanges")}
                </Button>
              )}
            </div>
          </div>


          {/* Métodos de pago */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-emerald-600 mr-2" />
                <h3 className="font-semibold">{t("paymentMethods")}</h3>
              </div>
              <Button variant="outline" size="sm">
                {t("add")}
              </Button>
            </div>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500">{t("noPaymentMethods")}</p>
              <p className="text-sm text-gray-400 mt-1">{t("addCard")}</p>
            </div>
          </div>

          {/* Privacidad y seguridad */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold">{t("privacyAndSecurity")}</h3>
            </div>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-left">
                {t("changePassword")}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                {t("accountPrivacy")}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                {t("downloadMyData")}
              </Button>
            </div>
          </div>

          {/* Ayuda y soporte */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center mb-4">
              <HelpCircle className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold">{t("helpAndSupport")}</h3>
            </div>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-left">
                {t("helpCenter")}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                {t("contactSupport")}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                {t("termsAndConditions")}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                {t("privacyPolicy")}
              </Button>
            </div>
          </div>

          {/* Cerrar sesión */}
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50 mb-6"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? t("loggingOut") : t("logout")}
          </Button>

          <div className="text-center text-xs text-gray-400 mb-6">
            <p>{t("planA")} v1.0.0</p>
            <p>© 2025 {t("planA")}. {t("allRightsReserved")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}