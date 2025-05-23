import React from 'react'
import { useTranslation } from 'react-i18next'
import { useImageStore } from '../store/imageStore'
import { processImage } from '../utils/imageProcessor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { InfoIcon } from 'lucide-react'

export const Controls: React.FC = () => {
  const { t } = useTranslation()
  const { 
    resizeOptions, 
    updateResizeOptions, 
    images, 
    isProcessing, 
    setProcessing,
    updateProcessedImage 
  } = useImageStore()

  // Vérifier si il y a des images JPEG/WebP ou si le format de sortie est JPEG/WebP
  const hasCompressibleImages = images.some(img => 
    img.file.type.includes('jpeg') || img.file.type.includes('webp')
  ) || resizeOptions.format === 'jpeg' || resizeOptions.format === 'webp'

  const handleProcess = async () => {
    if (images.length === 0) return

    setProcessing(true)
    
    for (const image of images) {
      try {
        // Vérifier que les dimensions sont chargées
        if (image.dimensions.width === 0 || image.dimensions.height === 0) {
          console.warn('Dimensions non chargées pour l\'image:', image.file.name)
          continue
        }
        
        const { dataUrl, size } = await processImage(image, resizeOptions)
        updateProcessedImage(image.id, dataUrl, size)
      } catch (error) {
        console.error('Erreur lors du traitement de l\'image:', image.file.name, error)
      }
    }
    
    setProcessing(false)
  }

  return (
    <div className="space-y-6">
      {/* Box Redimensionnement */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Checkbox
              id="enableResize"
              checked={resizeOptions.enableResize}
              onCheckedChange={(checked) => updateResizeOptions({ enableResize: !!checked })}
            />
            <Label htmlFor="enableResize" className="text-lg font-semibold cursor-pointer">
              {t('controls.resize.title')}
            </Label>
          </div>
        </CardHeader>
        {resizeOptions.enableResize && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resizeMode">{t('controls.resize.mode')}</Label>
              <Select value={resizeOptions.mode} onValueChange={(value: any) => updateResizeOptions({ mode: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">{t('controls.resize.modes.percentage')}</SelectItem>
                  <SelectItem value="width">{t('controls.resize.modes.width')}</SelectItem>
                  <SelectItem value="height">{t('controls.resize.modes.height')}</SelectItem>
                  <SelectItem value="dimensions">{t('controls.resize.modes.dimensions')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {resizeOptions.mode === 'percentage' && (
              <div className="space-y-2">
                <Label>
                  {t('controls.resize.percentage', { value: resizeOptions.percentage })}
                  {resizeOptions.percentage > 100 && (
                    <span className="text-orange-600 text-xs ml-2">({t('controls.resize.enlargement')})</span>
                  )}
                </Label>
                <Slider
                  value={[resizeOptions.percentage]}
                  onValueChange={([value]) => updateResizeOptions({ percentage: value })}
                  min={10}
                  max={300}
                  step={5}
                />
              </div>
            )}

            {resizeOptions.mode === 'width' && (
              <div className="space-y-2">
                <Label htmlFor="width">{t('controls.resize.width')}</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="5000"
                  value={resizeOptions.width}
                  onChange={(e) => updateResizeOptions({ width: Number(e.target.value) })}
                />
              </div>
            )}

            {resizeOptions.mode === 'height' && (
              <div className="space-y-2">
                <Label htmlFor="height">{t('controls.resize.height')}</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  max="5000"
                  value={resizeOptions.height}
                  onChange={(e) => updateResizeOptions({ height: Number(e.target.value) })}
                />
              </div>
            )}

            {resizeOptions.mode === 'dimensions' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="widthExact">{t('controls.resize.width')}</Label>
                  <Input
                    id="widthExact"
                    type="number"
                    min="1"
                    max="5000"
                    value={resizeOptions.width}
                    onChange={(e) => updateResizeOptions({ width: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heightExact">{t('controls.resize.height')}</Label>
                  <Input
                    id="heightExact"
                    type="number"
                    min="1"
                    max="5000"
                    value={resizeOptions.height}
                    onChange={(e) => updateResizeOptions({ height: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('controls.resize.behavior')}</Label>
                  <Select value={resizeOptions.cropMode} onValueChange={(value: 'fit' | 'fill') => updateResizeOptions({ cropMode: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fit">{t('controls.resize.behaviors.fit')}</SelectItem>
                      <SelectItem value="fill">{t('controls.resize.behaviors.fill')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {resizeOptions.cropMode === 'fill' && (
                  <div className="space-y-2">
                    <Label>{t('controls.resize.cropPosition')}</Label>
                    <Select value={resizeOptions.cropPosition} onValueChange={(value: any) => updateResizeOptions({ cropPosition: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">{t('controls.resize.cropPositions.center')}</SelectItem>
                        <SelectItem value="top">{t('controls.resize.cropPositions.top')}</SelectItem>
                        <SelectItem value="bottom">{t('controls.resize.cropPositions.bottom')}</SelectItem>
                        <SelectItem value="left">{t('controls.resize.cropPositions.left')}</SelectItem>
                        <SelectItem value="right">{t('controls.resize.cropPositions.right')}</SelectItem>
                        <SelectItem value="top-left">{t('controls.resize.cropPositions.topLeft')}</SelectItem>
                        <SelectItem value="top-right">{t('controls.resize.cropPositions.topRight')}</SelectItem>
                        <SelectItem value="bottom-left">{t('controls.resize.cropPositions.bottomLeft')}</SelectItem>
                        <SelectItem value="bottom-right">{t('controls.resize.cropPositions.bottomRight')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Box Optimisation */}
      <Card>
        <CardHeader>
          <CardTitle>{t('controls.optimization.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('controls.optimization.format')}</Label>
            <Select value={resizeOptions.format} onValueChange={(value: any) => updateResizeOptions({ format: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">{t('controls.optimization.formats.original')}</SelectItem>
                <SelectItem value="jpeg">{t('controls.optimization.formats.jpeg')}</SelectItem>
                <SelectItem value="png">{t('controls.optimization.formats.png')}</SelectItem>
                <SelectItem value="webp">{t('controls.optimization.formats.webp')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasCompressibleImages && (
            <div className="space-y-2">
              <Label>
                {t('controls.optimization.quality', { value: resizeOptions.quality })}
                <span className="text-xs text-muted-foreground ml-2">
                  ({t('controls.optimization.qualityNote')})
                </span>
              </Label>
              <Slider
                value={[resizeOptions.quality]}
                onValueChange={([value]) => updateResizeOptions({ quality: value })}
                min={10}
                max={100}
                step={5}
              />
            </div>
          )}

          {resizeOptions.format === 'png' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InfoIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    {t('controls.optimization.pngWarning.title')}
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      {t('controls.optimization.pngWarning.description')}
                      <a href="https://caniuse.com/webp" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                        {t('controls.optimization.pngWarning.link')}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton de traitement */}
      <Button
        onClick={handleProcess}
        disabled={images.length === 0 || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? t('controls.processing') : t('controls.process', { count: images.length })}
      </Button>
    </div>
  )
}