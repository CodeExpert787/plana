'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
export default function TerminosPage() {
  const { t } = useTranslation("pages");
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
          <Link href="/booking/confirmation" className="flex items-center text-emerald-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>{t("return")}</span>
          </Link>
          <h1 className="text-xl font-bold mx-auto pr-10">{t("termsAndConditions")}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="prose prose-emerald max-w-none">
          <h1 className="text-2xl font-bold mb-6">{t("responsibilityClause")}</h1>

          <h2 className="text-xl font-bold mt-6 mb-3">{t("platformResponsibility")}:</h2>
          <p>
            {t("platformResponsibilityDescription")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">{t("providerResponsibility")}:</h2>
          <p>
            {t("providerResponsibilityDescription")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">{t("userResponsibility")}:</h2>
          <p>
            {t("userResponsibilityDescription")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">{t("platformExoneration")}:</h2>
          <p>
            {t("platformExonerationDescription")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">{t("responsibilityInsurance")}:</h2>
          <p>
            {t("responsibilityInsuranceDescription")}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">{t("additionalConsiderations")}:</h2>
          <p>
            {t("additionalConsiderationsDescription")}
          </p>
          <p>
            {t("additionalConsiderationsDescription2")}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/booking/confirmation">
            <Button className="bg-emerald-600 hover:bg-emerald-700">{t("returnToConfirmation")}</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}