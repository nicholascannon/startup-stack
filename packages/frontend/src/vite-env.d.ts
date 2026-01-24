/// <reference types="vite/client" />

// biome-ignore lint/complexity/noBannedTypes: TODO
type ImportMetaEnv = {
  // TODO: add environment variables
};

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
