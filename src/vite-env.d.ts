/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DB_MODE: string
  readonly VITE_DATABASE_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
