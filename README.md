# 🚀 Picpic

A fast, secure, and privacy-focused image resizer and compressor that runs entirely in your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ Features

- **🔒 100% Client-Side Processing** - Your images never leave your device
- **🎯 Smart Resizing** - Percentage, fixed dimensions, or exact size with crop options
- **🗜️ Advanced Compression** - Quality control for JPEG and WebP formats
- **🔄 Format Conversion** - Convert between JPEG, PNG, and WebP
- **📦 Batch Processing** - Handle multiple images at once
- **💾 Flexible Downloads** - Individual files or ZIP archives
- **🌍 Multilingual** - English and French support
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **⚡ Lightning Fast** - Powered by modern web technologies

## 🛡️ Privacy & Security

- **No uploads** - Images are processed locally in your browser
- **No servers** - No data transmission to external services
- **No tracking** - Your privacy is fully protected
- **Open source** - Transparent and auditable code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jcchrrr/picpic.git

# Navigate to the project directory
cd picpic

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🎯 How to Use

1. **Upload Images** - Drag & drop or click to select your images
2. **Configure Resizing** (optional) - Choose your preferred resize method:
   - Percentage scaling
   - Fixed width or height
   - Exact dimensions with crop options
3. **Set Optimization** - Select output format and quality
4. **Process** - Click "Process" to transform your images
5. **Download** - Save individual images or download all as a ZIP

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Internationalization**: react-i18next
- **Image Processing**: HTML5 Canvas API
- **File Handling**: JSZip for batch downloads

## 🌐 Supported Formats

### Input Formats
- JPEG/JPG
- PNG
- WebP
- GIF (static frames)

### Output Formats
- JPEG (with quality control)
- PNG (lossless)
- WebP (with quality control)
- Original format preservation

## 🎨 Customization

### Adding New Languages

1. Create translation files in `src/locales/[locale]/translation.json`
2. Add the new locale to `src/i18n/index.ts`
3. Update the language selector in `src/components/LanguageToggle.tsx`

### Modifying Resize Options

Edit the resize logic in `src/utils/imageProcessor.ts` to add new processing modes or modify existing ones.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- Icons by [Lucide React](https://lucide.dev/)
- Flags by [country-flag-icons](https://github.com/catamphetamine/country-flag-icons)
- Made with ❤️ by the [Polii team](https://github.com/jcchrrr)

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on our [GitHub Issues](https://github.com/jcchrrr/picpic/issues) page.

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔧 Advanced Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: Default language (en_US or fr_FR)
VITE_DEFAULT_LANGUAGE=en_US
```

### Performance Optimization

The application automatically limits image dimensions to 4000px to prevent browser crashes. You can modify this limit in `src/utils/imageProcessor.ts`.

---

<div align="center">
  <img src="src/assets/logo_polii.png" alt="Made by Polii Team" height="32">
  <br>
  <strong>Made with ❤️ by Polii Team</strong>
</div>