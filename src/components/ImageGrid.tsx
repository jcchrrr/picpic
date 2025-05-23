import React from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, Download, Archive } from 'lucide-react'
import { useImageStore } from '../store/imageStore'
import { formatFileSize, downloadImage, downloadAllAsZip } from '../utils/imageProcessor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const ImageGrid: React.FC = () => {
  const { t } = useTranslation()
  const { images, removeImage } = useImageStore()

  const handleDownload = (image: any) => {
    if (image.processedDataUrl) {
      const extension = image.file.type.split('/')[1]
      const originalName = image.file.name.split('.')[0]
      const filename = `picpic_${originalName}.${extension}`
      downloadImage(image.processedDataUrl, filename)
    }
  }

  const handleDownloadAll = () => {
    downloadAllAsZip(images)
  }

  const processedCount = images.filter(img => img.processedDataUrl).length

  if (images.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('images.title', { count: images.length })}</CardTitle>
          <div className="flex gap-2">
            {processedCount > 0 && (
              <Button
                onClick={handleDownloadAll}
                variant="default"
                size="sm"
              >
                <Archive className="w-4 h-4 mr-1" />
                {t('images.downloadAll', { count: processedCount })}
              </Button>
            )}
            <Button
              onClick={() => useImageStore.getState().clearImages()}
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {t('images.deleteAll')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
      
        <div className="grid grid-cols-1 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg p-4 relative">
              <Button
                onClick={() => removeImage(image.id)}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full shadow-md text-destructive border-border hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 size={12} />
              </Button>
              
              <div className="flex gap-4 items-end">
                <div className="w-32 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                  <img
                    src={image.processedDataUrl || URL.createObjectURL(image.file)}
                    alt={image.file.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-sm truncate">{image.file.name}</p>
                  <div className="text-xs text-muted-foreground">
                    <p>{t('images.original', { width: image.dimensions.width, height: image.dimensions.height })}</p>
                    <p>{t('images.size', { size: formatFileSize(image.originalSize) })}</p>
                    {image.processedSize && image.processedSize > 0 && (
                      <>
                        <p>{t('images.newSize', { size: formatFileSize(image.processedSize) })}</p>
                        {image.originalSize > image.processedSize ? (
                          <p className="text-green-600">
                            {t('images.gain', { size: formatFileSize(image.originalSize - image.processedSize) })}
                          </p>
                        ) : (
                          <p className="text-orange-600">
                            {t('images.increase', { size: formatFileSize(image.processedSize - image.originalSize) })}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {image.processedDataUrl && (
                    <Button
                      onClick={() => handleDownload(image)}
                      variant="default"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {t('images.download')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}