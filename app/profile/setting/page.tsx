"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Bell, Globe, Shield, CreditCard, HelpCircle, LogOut } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../../i18n-client";

export default function SettingsPage() {
  const { t } = useTranslation("pages");
  // Estados para las configuraciones
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [activityUpdates, setActivityUpdates] = useState(true)
  const [promotions, setPromotions] = useState(false)
  const [language, setLanguage] = useState("es")

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
          {/* Perfil */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/diverse-group.png" alt="Martín Gómez" />
                  <AvatarFallback className="bg-emerald-500 text-white">MG</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="ml-4">
                <h2 className="font-bold">Martín Gómez</h2>
                <p className="text-sm text-gray-500">martin@example.com</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Editar
              </Button>
            </div>
          </div>

          {/* Cuenta */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-semibold mb-4">{t("account")}</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" defaultValue="Martín Gómez" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" defaultValue="martin@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input id="phone" defaultValue="+54 9 294 123 4567" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="description">{t("description")}</Label>
                <textarea
                  id="description"
                  defaultValue="Amante de la naturaleza y los deportes al aire libre. Siempre buscando nuevas aventuras en la Patagonia."
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md h-24"
                  placeholder="Escribe una breve descripción sobre ti..."
                />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">{t("saveChanges")}</Button>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold">{t("notifications")}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("emailNotifications")}</p>
                  <p className="text-sm text-gray-500">{t("receiveUpdates")}</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("pushNotifications")}</p>
                  <p className="text-sm text-gray-500">{t("receiveNotifications")}</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("activityUpdates")}</p>
                  <p className="text-sm text-gray-500">{t("changesInReservations")}</p>
                </div>
                <Switch checked={activityUpdates} onCheckedChange={setActivityUpdates} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("promotions")}</p>
                  <p className="text-sm text-gray-500">{t("receiveSpecialOffers")}</p>
                </div>
                <Switch checked={promotions} onCheckedChange={setPromotions} />
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center mb-4">
              <Globe className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold">{t("preferences")}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="language">{t("language")}</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="es">{t("spanish")}</option>
                  <option value="en">{t("english")}</option>
                  <option value="pt">{t("portuguese")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="currency">{t("currency")}</Label>
                <select id="currency" className="w-full mt-1 p-2 border border-gray-300 rounded-md" defaultValue="ARS">
                  <option value="ARS">{t("argentinePeso")}</option>
                  <option value="USD">{t("usDollar")}</option>
                  <option value="EUR">{t("euro")}</option>
                </select>
              </div>
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
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 mb-6">
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout")}
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