import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'out/**',
      '*.min.js',
      'coverage/**',
      '.nyc_output/**',
      'payload-types.ts'
    ],
  },
  ...compat.extends('next/core-web-vitals'),
]

export default eslintConfig