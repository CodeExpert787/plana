"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n-client";
import { Globe } from "lucide-react";

export default function LanguageNav() {
  const { t, i18n } = useTranslation("common");
  const [lang, setLang] = useState(i18n.language || "es");

  const switchToEnglish = () => {
    i18n.changeLanguage("en");
    setLang("en");
  };

  const switchToSpanish = () => {
    i18n.changeLanguage("es");
    setLang("es");
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <nav className="flex items-center justify-end bg-white/80 shadow-sm rounded-lg px-4 py-2 mb-4 border border-gray-100">
      {/* <Link href="/admin/email-dashboard" className="text-sm font-medium hover:text-primary transition-colors">
        {t("admin_email")}
      </Link> */}
      <div className="flex items-center  gap-2">
        <Globe className="w-5 h-5 text-gray-500 mr-1" />
        {/* Only show English button if not already in English */}
        {i18n.language !== "en" && (
          <button
            onClick={switchToEnglish}
            className="px-3 py-1 rounded font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-200 transition"
          >
            English
          </button>
        )}

        {/* Only show Spanish button if not already in Spanish */}
        {i18n.language !== "es" && (
          <button
            onClick={switchToSpanish}
            className="px-3 py-1 rounded font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-200 transition"
          >
            Español
          </button>
        )}

      </div>
      
    </nav>
  );
} 