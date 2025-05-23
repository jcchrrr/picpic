import { create } from 'zustand'

export interface ImageItem {
  id: string
  file: File
  originalSize: number
  processedDataUrl?: string
  processedSize?: number
  dimensions: {
    width: number
    height: number
  }
}

export interface ResizeOptions {
  enableResize: boolean
  mode: 'percentage' | 'width' | 'height' | 'dimensions'
  percentage: number
  width: number
  height: number
  quality: number
  format: 'original' | 'jpeg' | 'png' | 'webp'
  cropMode: 'fit' | 'fill'
  cropPosition: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

interface ImageStore {
  images: ImageItem[]
  resizeOptions: ResizeOptions
  isProcessing: boolean
  addImages: (files: File[]) => void
  removeImage: (id: string) => void
  clearImages: () => void
  updateResizeOptions: (options: Partial<ResizeOptions>) => void
  setProcessing: (processing: boolean) => void
  updateProcessedImage: (id: string, dataUrl: string, size: number) => void
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  resizeOptions: {
    enableResize: false,
    mode: 'percentage',
    percentage: 80,
    width: 800,
    height: 600,
    quality: 80,
    format: 'jpeg',
    cropMode: 'fit',
    cropPosition: 'center'
  },
  isProcessing: false,

  addImages: (files: File[]) => {
    const newImages: ImageItem[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      originalSize: file.size,
      dimensions: { width: 0, height: 0 }
    }))
    
    newImages.forEach(async (image) => {
      const img = new Image()
      img.onload = () => {
        set(state => ({
          images: state.images.map(item => 
            item.id === image.id 
              ? { ...item, dimensions: { width: img.width, height: img.height } }
              : item
          )
        }))
      }
      img.src = URL.createObjectURL(image.file)
    })

    set(state => ({ images: [...state.images, ...newImages] }))
  },

  removeImage: (id: string) => {
    set(state => ({ images: state.images.filter(img => img.id !== id) }))
  },

  clearImages: () => {
    set({ images: [] })
  },

  updateResizeOptions: (options: Partial<ResizeOptions>) => {
    set(state => ({ resizeOptions: { ...state.resizeOptions, ...options } }))
  },

  setProcessing: (processing: boolean) => {
    set({ isProcessing: processing })
  },

  updateProcessedImage: (id: string, dataUrl: string, size: number) => {
    set(state => ({
      images: state.images.map(img => 
        img.id === id 
          ? { ...img, processedDataUrl: dataUrl, processedSize: size }
          : img
      )
    }))
  }
}))