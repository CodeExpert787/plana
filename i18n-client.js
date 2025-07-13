import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./public/locales/en/common.json";
import esCommon from "./public/locales/es/common.json";
import enPages from "./public/locales/en/pages.json";
import esPages from "./public/locales/es/pages.json";

// Add more namespaces as needed

i18n
  .use(initReactI18next)
  .init({
    lng: "es",
    fallbackLng: "en",
    resources: {
      en: { common: enCommon, pages: enPages },
      es: { common: esCommon, pages: esPages },
    },
    ns: ["common", "pages"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 