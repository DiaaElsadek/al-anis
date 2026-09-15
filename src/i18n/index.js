import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English namespaces
import commonEn from "./locales/en/common.json";
import authEn from "./locales/en/auth.json";
import clientEn from "./locales/en/client.json";
import providerEn from "./locales/en/provider.json";
import adminEn from "./locales/en/admin.json";
import errorsEn from "./locales/en/errors.json";

// Arabic namespaces
import commonAr from "./locales/ar/common.json";
import authAr from "./locales/ar/auth.json";
import clientAr from "./locales/ar/client.json";
import providerAr from "./locales/ar/provider.json";
import adminAr from "./locales/ar/admin.json";
import errorsAr from "./locales/ar/errors.json";

const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    client: clientEn,
    provider: providerEn,
    admin: adminEn,
    errors: errorsEn,
  },
  ar: {
    common: commonAr,
    auth: authAr,
    client: clientAr,
    provider: providerAr,
    admin: adminAr,
    errors: errorsAr,
  },
};

// Initial direction and language apply helper
export function applyDirection(lang) {
  if (typeof document === "undefined") return;
  const isRtl = lang === "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
}

// Read cached language before initialization to avoid flash
let initialLang = "en";
try {
  const cached = localStorage.getItem("alanis_lang");
  if (cached && (cached === "ar" || cached === "en")) {
    initialLang = cached;
  } else if (typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) {
    initialLang = "ar";
  }
} catch {
  // fallback to en
}
applyDirection(initialLang);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    defaultNS: "common",
    ns: ["common", "auth", "client", "provider", "admin", "errors"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "alanis_lang",
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Update direction and lang on every change
i18n.on("languageChanged", (lng) => {
  applyDirection(lng);
});

export default i18n;
