import lightGallery from 'lightgallery'

export default class Gallery {
  private selector: string = '[data-gallery]'
  private licenseKey: string = import.meta.env.VITE_LIGHT_GALLERY_KEY

  constructor() {
    this.init()
  }

  private init() {
    const galleryElements = document.querySelectorAll<HTMLElement>(this.selector)

    galleryElements.forEach((element) => {
      lightGallery(element, {
        licenseKey: this.licenseKey,
        speed: 500,
        mobileSettings: {
          controls: true,
          showCloseIcon: true,
          download: false,
        },
      })
    })
  }
}
