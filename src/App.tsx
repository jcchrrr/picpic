import { useTranslation } from 'react-i18next'
import { DropZone } from './components/DropZone'
import { Controls } from './components/Controls'
import { ImageGrid } from './components/ImageGrid'
import { WelcomeCard } from './components/WelcomeCard'
import { LanguageToggle } from './components/LanguageToggle'
import { Button } from '@/components/ui/button'
import { useImageStore } from './store/imageStore'
import { useFileSelect } from './hooks/useFileSelect'
import { Plus, RotateCcw, Github } from 'lucide-react'
import logoPolii from './assets/logo_polii.png'
import logoPicpic from './assets/logo_picpic.png'

function App() {
  const { t } = useTranslation()
  const images = useImageStore(state => state.images)
  const { openFileSelector } = useFileSelect()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="max-w-[1248px] mx-auto px-4 py-8 w-full flex-1 flex flex-col">
        <header className="relative text-center mb-8">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <a
                href="https://github.com/jcchrrr/picpic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <img 
              src={logoPicpic} 
              alt="Picpic" 
              className="h-10 w-auto"
            />
            {t('app.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('app.subtitle')}
          </p>
        </header>

        <main className="flex-1">
          <div className="space-y-8">
            {images.length === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <WelcomeCard />
                </div>
                <div className="lg:col-span-2">
                  <DropZone />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <Controls />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <ImageGrid />
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={openFileSelector}
                        variant="secondary"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {t('images.addImages')}
                      </Button>
                      <Button
                        onClick={() => useImageStore.getState().clearImages()}
                        variant="outline"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        {t('images.processOthers')}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">
              {t('footer.madeBy', { team: '' })}
            </p>
            <img 
              src={logoPolii} 
              alt="Polii" 
              className="h-5 w-auto"
            />
            <span className="text-sm text-muted-foreground font-medium">Polii team</span>
          </div>
        </footer>
        </div>
      </div>
    </div>
  )
}

export default App