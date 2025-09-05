import type { LightGallery } from 'lightgallery/lightgallery'
import lightGallery from 'lightgallery'

export default class Gallery {
  private galleries: LightGallery[] = []
  private selector: string = '[data-gallery]'
  private licenseKey: string = import.meta.env.VITE_LIGHT_GALLERY_KEY

  constructor() {
    this.init()
  }

  private init() {
    const galleryElements = document.querySelectorAll<HTMLElement>(this.selector)

    galleryElements.forEach((element) => {
      const gallery = lightGallery(element, {
        licenseKey: this.licenseKey,
        speed: 500,
        mobileSettings: {
          controls: true,
          showCloseIcon: true,
          download: false,
        },
      })

      this.galleries.push(gallery)
    })
  }
}
