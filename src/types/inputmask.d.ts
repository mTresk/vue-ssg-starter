declare module 'inputmask' {
  export interface InputmaskOptions {
    showMaskOnHover?: boolean
    [key: string]: unknown
  }

  export default class Inputmask {
    constructor(mask?: string, options?: InputmaskOptions)
    mask(element: HTMLElement): void
  }
}
