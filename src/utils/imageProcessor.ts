import { ResizeOptions, ImageItem } from '../store/imageStore'

export const processImage = async (
  image: ImageItem,
  options: ResizeOptions
): Promise<{ dataUrl: string; size: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const { width: originalWidth, height: originalHeight } = img
        let { width: targetWidth, height: targetHeight } = calculateDimensions(
          originalWidth,
          originalHeight,
          options
        )

        // Si aucune transformation n'est nécessaire, retourner l'original
        const needsResize = options.enableResize && (targetWidth !== originalWidth || targetHeight !== originalHeight)
        const needsFormatChange = options.format !== 'original'
        // Pour PNG, la qualité n'a pas d'effet, donc pas besoin de recompresser
        const isPng = image.file.type.includes('png')
        const needsQualityChange = !isPng && options.quality < 100

        if (!needsResize && !needsFormatChange && !needsQualityChange) {
          // Retourner l'image originale sans transformation
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              dataUrl: reader.result as string,
              size: image.file.size
            })
          }
          reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
          reader.readAsDataURL(image.file)
          return
        }

        // Limiter les dimensions pour éviter les problèmes de performance
        const maxDimension = 4000
        if (targetWidth > maxDimension || targetHeight > maxDimension) {
          const ratio = Math.min(maxDimension / targetWidth, maxDimension / targetHeight)
          targetWidth = Math.round(targetWidth * ratio)
          targetHeight = Math.round(targetHeight * ratio)
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        if (options.enableResize) {
          canvas.width = targetWidth
          canvas.height = targetHeight
        } else {
          canvas.width = img.width
          canvas.height = img.height
        }

        // Améliorer la qualité du redimensionnement
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        if (options.enableResize && options.mode === 'dimensions' && options.cropMode === 'fill') {
          // Mode crop : calculer les dimensions et position de crop
          const { sx, sy, sWidth, sHeight } = calculateCropDimensions(
            img.width, img.height, targetWidth, targetHeight, options.cropPosition
          )
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight)
        } else if (options.enableResize) {
          // Mode normal : redimensionnement simple
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        } else {
          // Pas de redimensionnement, juste optimisation
          ctx.drawImage(img, 0, 0)
        }

        const format = options.format === 'original' 
          ? image.file.type 
          : `image/${options.format}`
        
        // Appliquer la qualité pour JPEG et WebP
        const quality = (format.includes('jpeg') || format.includes('webp')) 
          ? options.quality / 100 
          : undefined
        const dataUrl = canvas.toDataURL(format, quality)
        
        // Calcul plus précis de la taille
        const base64Data = dataUrl.split(',')[1]
        const size = Math.round(base64Data.length * 0.75)
        
        resolve({ dataUrl, size })
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = () => reject(new Error('Impossible de charger l\'image'))
    img.src = URL.createObjectURL(image.file)
  })
}

const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  options: ResizeOptions
): { width: number; height: number } => {
  switch (options.mode) {
    case 'percentage':
      // Limiter à 300% maximum pour éviter des images trop grandes
      const factor = Math.min(options.percentage / 100, 3)
      return {
        width: Math.round(originalWidth * factor),
        height: Math.round(originalHeight * factor)
      }
    
    case 'width':
      // Éviter de créer des images plus grandes que 2x l'original
      const limitedWidth = Math.min(options.width, originalWidth * 2)
      const widthRatio = limitedWidth / originalWidth
      return {
        width: limitedWidth,
        height: Math.round(originalHeight * widthRatio)
      }
    
    case 'height':
      // Éviter de créer des images plus grandes que 2x l'original
      const limitedHeight = Math.min(options.height, originalHeight * 2)
      const heightRatio = limitedHeight / originalHeight
      return {
        width: Math.round(originalWidth * heightRatio),
        height: limitedHeight
      }
    
    case 'dimensions':
      // Limiter les dimensions maximales
      const maxWidth = Math.min(options.width, originalWidth * 2)
      const maxHeight = Math.min(options.height, originalHeight * 2)
      
      if (options.cropMode === 'fit') {
        // Mode "fit" : garder les proportions, pas de crop
        const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)
        return {
          width: Math.round(originalWidth * ratio),
          height: Math.round(originalHeight * ratio)
        }
      } else {
        // Mode "fill" : dimensions exactes avec crop
        return {
          width: maxWidth,
          height: maxHeight
        }
      }
    
    default:
      return { width: originalWidth, height: originalHeight }
  }
}

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadAllAsZip = async (images: any[]) => {
  // Importation dynamique pour réduire la taille du bundle
  const JSZip = (await import('jszip')).default
  
  const zip = new JSZip()
  const processedImages = images.filter(img => img.processedDataUrl)
  
  if (processedImages.length === 0) {
    console.warn('Aucune image traitée à télécharger')
    return
  }

  for (const image of processedImages) {
    try {
      // Convertir le data URL en blob
      const response = await fetch(image.processedDataUrl)
      const blob = await response.blob()
      
      // Déterminer l'extension
      const extension = image.file.type.split('/')[1] || 'jpg'
      const originalName = image.file.name.split('.')[0]
      const filename = `picpic_${originalName}.${extension}`
      
      zip.file(filename, blob)
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image au zip:', image.file.name, error)
    }
  }

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const zipUrl = URL.createObjectURL(zipBlob)
    
    const link = document.createElement('a')
    link.download = `picpic_images_${new Date().toISOString().split('T')[0]}.zip`
    link.href = zipUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Nettoyer l'URL
    URL.revokeObjectURL(zipUrl)
  } catch (error) {
    console.error('Erreur lors de la génération du zip:', error)
  }
}

const calculateCropDimensions = (
  imgWidth: number,
  imgHeight: number,
  targetWidth: number,
  targetHeight: number,
  position: string
) => {
  // Calculer le ratio de crop pour remplir exactement les dimensions cibles
  const scaleX = targetWidth / imgWidth
  const scaleY = targetHeight / imgHeight
  const scale = Math.max(scaleX, scaleY)

  // Dimensions de la zone à extraire de l'image source
  const sWidth = targetWidth / scale
  const sHeight = targetHeight / scale

  // Position de départ selon l'ancre choisie
  let sx = 0, sy = 0

  switch (position) {
    case 'center':
      sx = (imgWidth - sWidth) / 2
      sy = (imgHeight - sHeight) / 2
      break
    case 'top':
      sx = (imgWidth - sWidth) / 2
      sy = 0
      break
    case 'bottom':
      sx = (imgWidth - sWidth) / 2
      sy = imgHeight - sHeight
      break
    case 'left':
      sx = 0
      sy = (imgHeight - sHeight) / 2
      break
    case 'right':
      sx = imgWidth - sWidth
      sy = (imgHeight - sHeight) / 2
      break
    case 'top-left':
      sx = 0
      sy = 0
      break
    case 'top-right':
      sx = imgWidth - sWidth
      sy = 0
      break
    case 'bottom-left':
      sx = 0
      sy = imgHeight - sHeight
      break
    case 'bottom-right':
      sx = imgWidth - sWidth
      sy = imgHeight - sHeight
      break
  }

  return { sx, sy, sWidth, sHeight }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}