import { bodyLock, bodyLockStatus, bodyUnlock, logger } from '@/utils/base/helpers'

interface PopupOptions {
  logging?: boolean
  init?: boolean
  attributeOpenButton: string
  attributeCloseButton: string
  fixElementSelector: string
  vkAttribute: string
  vkPlaceAttribute: string
  setAutoplayVk: boolean
  classes: {
    popup: string
    popupContent: string
    popupActive: string
    bodyActive: string
  }
  focusCatch: boolean
  closeEsc: boolean
  bodyLock: boolean
  hashSettings: {
    location: boolean
    goHash: boolean
  }
  on: {
    beforeOpen: (popup: Popup) => void
    afterOpen: (popup: Popup) => void
    beforeClose: (popup: Popup) => void
    afterClose: (popup: Popup) => void
  }
}

interface PopupTarget {
  selector: string | false
  element: HTMLElement | null
}

export default class Popup {
  private vkCode: string | null
  private isOpen: boolean
  private targetOpen: PopupTarget
  private previousOpen: PopupTarget
  private lastClosed: PopupTarget
  private dataValue: string | null
  private hash: boolean
  private reopen: boolean
  private selectorOpen: boolean
  private lastFocusEl: HTMLElement | null
  private previousActiveElement: Element | null
  private focusElement: string[]
  private options: PopupOptions
  private bodyLock: boolean
  private supportsInert: boolean

  constructor(options: Partial<PopupOptions>) {
    const config: PopupOptions = {
      logging: true,
      init: true,
      attributeOpenButton: 'data-popup',
      attributeCloseButton: 'data-close',
      fixElementSelector: '[data-lp]',
      vkAttribute: 'data-popup-vk',
      vkPlaceAttribute: 'data-popup-vk-place',
      setAutoplayVk: true,
      classes: {
        popup: 'popup',
        popupContent: 'popup__content',
        popupActive: 'popup_show',
        bodyActive: 'popup-show',
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        location: true,
        goHash: true,
      },
      on: {
        beforeOpen: () => {},
        afterOpen: () => {},
        beforeClose: () => {},
        afterClose: () => {},
      },
    }
    this.vkCode = null
    this.isOpen = false
    this.targetOpen = {
      selector: false,
      element: null,
    }
    this.previousOpen = {
      selector: false,
      element: null,
    }
    this.lastClosed = {
      selector: false,
      element: null,
    }
    this.dataValue = null
    this.hash = false
    this.reopen = false
    this.selectorOpen = false
    this.lastFocusEl = null
    this.previousActiveElement = null
    this.focusElement = [
      'a[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'area[href]',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ]
    this.supportsInert = 'inert' in HTMLElement.prototype
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes,
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings,
      },
      on: {
        ...config.on,
        ...options?.on,
      },
    }
    this.bodyLock = false

    if (this.options.init) {
      this.initPopups()
    }
  }

  initPopups() {
    this.popupLogging(`Проснулся`)
    this.eventsPopup()
  }

  open(selectorValue: string): void {
    if (bodyLockStatus) {
      this.bodyLock = !!(document.documentElement.classList.contains('lock') && !this.isOpen)

      if (selectorValue && typeof selectorValue === 'string' && selectorValue.trim() !== '') {
        this.targetOpen.selector = selectorValue
        this.selectorOpen = true
      }

      if (this.isOpen) {
        this.reopen = true
        this.close('')
      }

      if (!this.selectorOpen) {
        this.targetOpen.selector = this.lastClosed.selector as string
      }

      if (!this.reopen) {
        this.previousActiveElement = document.activeElement
      }

      const element = document.querySelector(
        this.targetOpen.selector as string,
      )

      if (element) {
        this.targetOpen.element = element as HTMLElement

        if (this.vkCode) {
          const codeVideo = this.vkCode
          const urlVideo = `https://vk.ru/video_ext.php?oid=-${codeVideo}&autoplay=1`
          const iframe = document.createElement('iframe')
          const autoplay = this.options.setAutoplayVk ? 'autoplay;' : ''

          iframe.setAttribute('allowfullscreen', '')
          iframe.setAttribute('allow', `${autoplay}; encrypted-media`)
          iframe.setAttribute('src', urlVideo)

          const vkPlace = this.targetOpen.element.querySelector(`[${this.options.vkPlaceAttribute}]`)

          if (vkPlace) {
            vkPlace.appendChild(iframe)
          }
        }

        this.options.on.beforeOpen(this)

        document.dispatchEvent(new CustomEvent('beforePopupOpen', { detail: { popup: this } }))

        this.targetOpen.element.classList.add(this.options.classes.popupActive)
        document.documentElement.classList.add(this.options.classes.bodyActive)

        if (!this.reopen) {
          if (!this.bodyLock) {
            bodyLock()
          }
        }
        else {
          this.reopen = false
        }

        this.targetOpen.element.removeAttribute('aria-hidden')

        if (this.supportsInert) {
          this.targetOpen.element.removeAttribute('inert')
        }

        this.previousOpen.selector = this.targetOpen.selector
        this.previousOpen.element = this.targetOpen.element
        this.selectorOpen = false
        this.isOpen = true

        setTimeout(() => {
          this.focusTrap()
        }, 50)

        this.options.on.afterOpen(this)

        document.dispatchEvent(
          new CustomEvent('afterPopupOpen', { detail: { popup: this } }),
        )

        this.popupLogging(`Открыл попап`)
      }
      else {
        this.popupLogging(
          `Ой ой, такого попапа нет. Проверьте корректность ввода. `,
        )
      }
    }
  }

  close(selectorValue: string): void {
    if (selectorValue && typeof selectorValue === 'string' && selectorValue.trim() !== '') {
      this.previousOpen.selector = selectorValue
    }

    if (!this.isOpen || !bodyLockStatus) {
      return
    }

    this.options.on.beforeClose(this)

    document.dispatchEvent(
      new CustomEvent('beforePopupClose', { detail: { popup: this } }),
    )

    if (this.vkCode && this.targetOpen.element) {
      const vkPlace = this.targetOpen.element.querySelector(`[${this.options.vkPlaceAttribute}]`)

      if (vkPlace) {
        vkPlace.innerHTML = ''
      }
    }

    if (this.previousOpen.element) {
      const activeElement = document.activeElement as HTMLElement

      if (activeElement && this.previousOpen.element.contains(activeElement)) {
        if (this.lastFocusEl) {
          this.lastFocusEl.focus()
        }
        else {
          document.body.focus()
        }
      }

      this.previousOpen.element.classList.remove(this.options.classes.popupActive)

      if (this.supportsInert) {
        this.previousOpen.element.setAttribute('inert', '')
      }

      this.previousOpen.element.setAttribute('aria-hidden', 'true')
    }

    if (!this.reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive)

      if (!this.bodyLock) {
        bodyUnlock()
      }

      this.isOpen = false
    }

    this.options.on.afterClose(this)

    document.dispatchEvent(
      new CustomEvent('afterPopupClose', { detail: { popup: this } }),
    )

    setTimeout(() => {
      this.focusTrap()
    }, 50)

    this.popupLogging(`Закрыл попап`)
  }

  private eventsPopup() {
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const buttonOpen = target?.closest(`[${this.options.attributeOpenButton}]`)

      if (buttonOpen) {
        e.preventDefault()

        this.dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton)
          ? buttonOpen.getAttribute(this.options.attributeOpenButton)
          : 'error'
        this.vkCode = buttonOpen.getAttribute(this.options.vkAttribute)
          ? buttonOpen.getAttribute(this.options.vkAttribute)
          : null

        if (this.dataValue !== 'error') {
          if (!this.isOpen) {
            this.lastFocusEl = buttonOpen as HTMLElement
          }

          this.targetOpen.selector = `${this.dataValue}`
          this.selectorOpen = true
          this.open('')

          return
        }

        this.popupLogging(`Ой, не заполнен атрибут у ${buttonOpen.classList}`)

        return
      }

      const buttonClose = target?.closest(`[${this.options.attributeCloseButton}]`)

      if (buttonClose || (!target?.closest(`.${this.options.classes.popupContent}`) && this.isOpen)) {
        e.preventDefault()
        this.close('')
      }
    })

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.options.closeEsc && e.key === 'Escape' && this.isOpen) {
        e.preventDefault()
        this.close('')

        return
      }
      if (this.options.focusCatch && e.key === 'Tab' && this.isOpen) {
        this.focusCatch(e)
      }
    })
  }

  private focusCatch(e: KeyboardEvent): void {
    if (this.targetOpen.element) {
      const focusable = this.targetOpen.element.querySelectorAll<HTMLElement>(this.focusElement.join(','))
      const focusArray = Array.from(focusable)
      const focusedIndex = focusArray.indexOf(document.activeElement as HTMLElement)

      if (e.shiftKey && focusedIndex === 0) {
        const lastElement = focusArray[focusArray.length - 1]

        if (lastElement) {
          lastElement.focus()
        }

        e.preventDefault()
      }

      if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
        const firstElement = focusArray[0]

        if (firstElement) {
          firstElement.focus()
        }

        e.preventDefault()
      }
    }
  }

  private focusTrap(): void {
    if (this.previousOpen.element) {
      const focusable = this.previousOpen.element.querySelectorAll<HTMLElement>(this.focusElement.join(','))

      if (!this.isOpen && this.lastFocusEl) {
        this.lastFocusEl.focus()
      }

      else if (focusable.length > 0 && this.isOpen) {
        const firstElement = focusable[0]
        const popupElement = this.previousOpen.element

        if (firstElement && !popupElement.hasAttribute('inert')) {
          firstElement.focus()
        }
      }
    }
  }

  popupLogging(message: string): void {
    if (this.options.logging) {
      logger(`[Попап]: ${message}`)
    }
  }
}
