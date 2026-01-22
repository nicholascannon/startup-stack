/// <reference types="vite/client" />

// biome-ignore lint/complexity/noBannedTypes: TODO
type ImportMetaEnv = {
  // TODO: add environment variables
};

// biome-ignore lint/correctness/noUnusedVariables: type override
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
