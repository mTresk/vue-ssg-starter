import type { LightGallery } from 'lightgallery/lightgallery'
import lightGallery from 'lightgallery'

export default class Gallery {
  private galleries: LightGallery[] = []

  constructor() {
    this.init()
  }

  private init() {
    const galleryElements = document.querySelectorAll<HTMLElement>('[data-gallery]:not([data-gallery-initialized])')

    galleryElements.forEach((element) => {
      element.setAttribute('data-gallery-initialized', 'true')

      const gallery = lightGallery(element, {
        licenseKey: import.meta.env.VITE_LIGHT_GALLERY_KEY,
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
