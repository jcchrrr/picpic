import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from '../locales/en_US/translation.json'
import frTranslation from '../locales/fr_FR/translation.json'

const resources = {
  en_US: {
    translation: enTranslation
  },
  fr_FR: {
    translation: frTranslation
  }
}

// Fonction pour déterminer la langue initiale
const getInitialLanguage = (): string => {
  // Vérifier d'abord si une langue est sauvegardée
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && (savedLanguage === 'en_US' || savedLanguage === 'fr_FR')) {
    return savedLanguage
  }

  // Détecter la langue du navigateur
  const browserLanguage = navigator.language.toLowerCase()
  
  // Si c'est français, utiliser fr_FR
  if (browserLanguage.startsWith('fr')) {
    return 'fr_FR'
  }
  
  // Si c'est anglais, utiliser en_US
  if (browserLanguage.startsWith('en')) {
    return 'en_US'
  }
  
  // Pour toute autre langue, fallback sur en_US
  return 'en_US'
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en_US',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n