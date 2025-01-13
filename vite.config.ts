import {defineConfig} from 'vite'
import path from 'path'
import dtsPlugin from 'vite-plugin-dts'

// Конфигурация Vite для сборки библиотеки
export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@rest': path.resolve(__dirname, 'src/rest'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@internal-types': path.resolve(__dirname, 'src/types'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // Основной файл библиотеки
      name: 'MyLibrary', // Имя глобальной переменной, если используете UMD или IIFE формат
      fileName: (format) => `my-library.${format}.js`, // Название файлов в разных форматах
    },
    target: 'esnext',
    outDir: 'dist', // Папка для выходных файлов
    emptyOutDir: true, // Очищаем папку dist перед сборкой
    rollupOptions: {
      // Параметры Rollup для настройки вывода
      output: {
        // Формат модулей
        format: 'es', // ESModules для библиотеки
        entryFileNames: '[name].[hash].js', // Уникальные имена для файлов
        chunkFileNames: '[name].[hash].js', // Уникальные имена для чанков
        assetFileNames: '[name].[hash][extname]', // Для ассетов (картинок, стилей и т.д.)
      },
    },
  },
  plugins: [
    dtsPlugin({
      // Плагин для генерации .d.ts файлов
      include: ['src'], // Указываем, из какой директории нужно генерировать типы
      exclude: ['node_modules', 'src/tests'], // Исключаем папку node_modules
      staticImport: true, // Для обработки статических импортов
    }),
  ],
})
