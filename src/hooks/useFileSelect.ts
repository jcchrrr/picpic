import { useCallback } from 'react'
import { useImageStore } from '../store/imageStore'

export const useFileSelect = () => {
  const addImages = useImageStore(state => state.addImages)

  const openFileSelector = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      if (files.length > 0) {
        addImages(files)
      }
    }
    
    input.click()
  }, [addImages])

  return { openFileSelector }
}