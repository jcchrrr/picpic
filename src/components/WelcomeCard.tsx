import React from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Zap, Smartphone, Palette, Download, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const WelcomeCard: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          {t('welcome.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {t('welcome.description')}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            {t('welcome.features')}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
              <span>{t('welcome.featuresList.resize')}</span>
            </li>
            <li className="flex items-start gap-2">
              <Palette className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
              <span>{t('welcome.featuresList.optimize')}</span>
            </li>
            <li className="flex items-start gap-2">
              <Settings className="w-4 h-4 mt-0.5 text-gray-600 flex-shrink-0" />
              <span>{t('welcome.featuresList.quality')}</span>
            </li>
            <li className="flex items-start gap-2">
              <Download className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span>{t('welcome.featuresList.download')}</span>
            </li>
          </ul>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">{t('welcome.whyTitle')}</h4>
          <p className="text-xs text-muted-foreground">
            {t('welcome.whyDescription')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}