import { useTranslation } from "react-i18next"
import mockActivitiesEs from "@/data/mockActivities"
import mockActivitiesEn from "@/data/mockActivities_en"

export function useLocalizedActivities() {
  const { i18n } = useTranslation()
  return i18n.language === "en" ? mockActivitiesEn : mockActivitiesEs
}
