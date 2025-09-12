export interface IBreakpoint {
  value: string
  type: string
  item: HTMLElement
}

export interface IMediaQueryResult {
  itemsArray: HTMLElement[]
  matchMedia: MediaQueryList
}

export interface IWatcherConfig {
  logging: boolean
}

export interface IWatcherParams {
  root: string | null
  margin: string
  threshold: string | string[]
}

export interface IWatcherElement extends HTMLElement {
  dataset: {
    watchRoot?: string
    watchMargin?: string
    watchThreshold?: string
    watch?: string
  }
}

export interface IParallaxConfig {
  init: boolean
  logging: boolean
}

export interface IParallaxMouseElement extends HTMLElement {
  dataset: {
    prlxCx?: string
    prlxCy?: string
    prlxA?: string
  }
}

export interface IResponsiveAdapterObject {
  element: HTMLElement
  parent: HTMLElement
  destination: HTMLElement
  breakpoint: string
  place: string
  index: number
  nextSibling: Element | null
}

export type TResponsiveAdapterType = 'min' | 'max'

export interface OptimizedImagePaths {
  webp?: string
  webp2x?: string
  avif?: string
  avif2x?: string
  fallback: string
}

declare global {
  interface Window {
    logger: boolean | undefined
  }

  interface ImportMetaEnv {
    readonly VITE_YANDEX_MAPS_API_KEY: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
