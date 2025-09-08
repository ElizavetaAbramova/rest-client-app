import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setupTests.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/__tests__/**',
        'src/app/**',
        'src/lib/firebase.ts',
        'src/widgets/ProfileCard.tsx',
        'src/app/globals.css',
        '.next/**',
        '**/*.d.ts',
      ],
      thresholds: { statements: 80, branches: 50, functions: 50, lines: 50 },
    },
  },
})
