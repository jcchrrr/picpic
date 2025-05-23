import React from 'react'
import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Languages } from 'lucide-react'
import { FR } from 'country-flag-icons/react/3x2'
import { US } from 'country-flag-icons/react/3x2'

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation()

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
    localStorage.setItem('language', language)
  }

  const languages = [
    { code: 'fr_FR', label: 'Français', flag: FR },
    { code: 'en_US', label: 'English', flag: US }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]
  const CurrentFlag = currentLanguage.flag

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto border-none shadow-none p-2 h-auto">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4" />
          <CurrentFlag className="w-4 h-3" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => {
          const FlagComponent = language.flag
          return (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <FlagComponent className="w-4 h-3" />
                <span>{language.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}