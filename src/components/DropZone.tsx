import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload } from 'lucide-react'
import { useImageStore } from '../store/imageStore'
import { Card, CardContent } from '@/components/ui/card'

interface DropZoneProps {
  onFileSelect?: () => void
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect }) => {
  const { t } = useTranslation()
  const addImages = useImageStore(state => state.addImages)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      addImages(files)
      onFileSelect?.()
    }
  }, [addImages, onFileSelect])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      addImages(files)
      onFileSelect?.()
    }
    // Reset input pour permettre de sélectionner les mêmes fichiers
    e.target.value = ''
  }, [addImages, onFileSelect])

  return (
    <Card
      className="border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <CardContent className="p-12 text-center">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg text-foreground mb-2">
          {t('dropzone.title')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('dropzone.formats')}
        </p>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </CardContent>
    </Card>
  )
}