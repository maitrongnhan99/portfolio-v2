// Ambient image module declarations - mirrors next/image-types/global.d.ts.
// Must live in a file with no top-level import/export so TypeScript treats it
// as an ambient (non-module) file and honours wildcard declare module patterns.
// This is needed because next-env.d.ts is gitignored and absent in CI.
declare module '*.png' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.jpg' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.jpeg' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.webp' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.avif' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.ico' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.bmp' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
