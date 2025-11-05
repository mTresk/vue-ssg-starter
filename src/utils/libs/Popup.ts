import { bodyLock, bodyUnlock, LOCK_DURATION } from '@/utils/base/helpers'

export default class Popup {
  private selectors = {
    trigger: '[data-popup]',
    close: '[data-popup-close]',
    content: '[data-popup-content]',
    vkPlace: '[data-popup-vk-place]',
    inlineVideo: 'video',
  }

  private boundHandlers: Map<Element, () => void> = new Map()
  private vkVideos: Map<string, string> = new Map()
  private wasLocked: boolean = false
  private unlockTimer: number | null = null

  constructor() {
    this.init()
  }

  public open(dialogId: string): void {
    const openDialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]')
    const hasOpenPopups = openDialogs.length > 0

    if (!hasOpenPopups) {
      this.wasLocked = document.documentElement.classList.contains('lock')
    }

    this.closeAll()

    const id = this.normalizeId(dialogId)
    const dialog = document.querySelector<HTMLDialogElement>(`#${id}`)

    if (dialog) {
      if (this.unlockTimer !== null) {
        clearTimeout(this.unlockTimer)
        this.unlockTimer = null
      }

      const vkCode = this.vkVideos.get(id)

      if (vkCode) {
        this.createVkVideo(dialog, vkCode)
      }

      dialog.removeAttribute('closing')
      dialog.showModal()
      dialog.focus()

      this.handleInlineVideo(dialog, 'play')

      if (!this.wasLocked) {
        bodyLock()
      }
    }
  }

  public close(dialogId: string): void {
    const id = this.normalizeId(dialogId)
    const dialog = document.querySelector<HTMLDialogElement>(`#${id}`)

    if (dialog && dialog.open && !dialog.hasAttribute('closing')) {
      this.cleanupVkVideo(dialog)
      dialog.setAttribute('closing', '')

      this.handleInlineVideo(dialog, 'pause')

      setTimeout(() => {
        dialog.close()
        dialog.removeAttribute('closing')
      }, LOCK_DURATION)

      if (!this.wasLocked) {
        if (this.unlockTimer !== null) {
          clearTimeout(this.unlockTimer)
        }

        this.unlockTimer = window.setTimeout(() => {
          bodyUnlock(0)
          this.unlockTimer = null
        }, LOCK_DURATION)
      }
    }
  }

  private init(): void {
    this.addTriggerListeners()
    this.addCloseListeners()
  }

  private closeDialog(dialogElement: HTMLDialogElement): void {
    if (dialogElement.id) {
      this.close(dialogElement.id)
    }
  }

  private createVkVideo(dialog: HTMLDialogElement, vkCode: string): void {
    const vkPlace = dialog.querySelector(this.selectors.vkPlace)

    if (vkPlace) {
      vkPlace.innerHTML = ''

      const urlVideo = `https://vk.ru/video_ext.php?oid=-${vkCode}&autoplay=1`
      const iframe = document.createElement('iframe')

      iframe.setAttribute('allowfullscreen', '')
      iframe.setAttribute('allow', 'autoplay; encrypted-media')
      iframe.setAttribute('src', urlVideo)
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = 'none'

      vkPlace.appendChild(iframe)
    }
  }

  private cleanupVkVideo(dialog: HTMLDialogElement): void {
    const vkPlace = dialog.querySelector(this.selectors.vkPlace)

    if (vkPlace) {
      vkPlace.innerHTML = ''
    }
  }

  private closeAll(): void {
    const openDialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]')

    openDialogs.forEach((dialog) => {
      if (dialog.id) {
        this.cleanupVkVideo(dialog)
        this.handleInlineVideo(dialog, 'pause')
        dialog.removeAttribute('closing')
        dialog.close()
      }
    })

    if (this.unlockTimer !== null) {
      clearTimeout(this.unlockTimer)
      this.unlockTimer = null
    }
  }

  private addTriggerListeners(): void {
    const triggers = document.querySelectorAll<HTMLElement>(this.selectors.trigger)

    triggers.forEach((trigger) => {
      if (this.boundHandlers.has(trigger)) {
        return
      }

      const handleClick = () => {
        const dialogId = trigger.dataset.popup
        const vkCode = trigger.dataset.popupVk

        if (dialogId) {
          if (vkCode) {
            this.vkVideos.set(this.normalizeId(dialogId), vkCode)
          }

          this.open(dialogId)
        }
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()

          const dialogId = trigger.dataset.popup
          const vkCode = trigger.dataset.popupVk

          if (dialogId) {
            if (vkCode) {
              this.vkVideos.set(this.normalizeId(dialogId), vkCode)
            }

            this.open(dialogId)
          }
        }
      }

      trigger.addEventListener('click', handleClick)
      trigger.addEventListener('keydown', handleKeyDown)

      this.boundHandlers.set(trigger, () => {
        trigger.removeEventListener('click', handleClick)
        trigger.removeEventListener('keydown', handleKeyDown)
      })
    })
  }

  private addCloseListeners(): void {
    const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog')

    dialogs.forEach((dialog) => {
      const closeButtons = dialog.querySelectorAll<HTMLElement>(this.selectors.close)

      closeButtons.forEach((closeButton) => {
        if (!this.boundHandlers.has(closeButton)) {
          const handleCloseClick = () => {
            this.closeDialog(dialog)
          }

          const handleCloseKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              this.closeDialog(dialog)
            }
          }

          closeButton.addEventListener('click', handleCloseClick)
          closeButton.addEventListener('keydown', handleCloseKeyDown)

          this.boundHandlers.set(closeButton, () => {
            closeButton.removeEventListener('click', handleCloseClick)
            closeButton.removeEventListener('keydown', handleCloseKeyDown)
          })
        }
      })

      if (!this.boundHandlers.has(dialog)) {
        const handleBackdropClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement
          const content = dialog.querySelector(this.selectors.content)

          if (content && !content.contains(target)) {
            this.closeDialog(dialog)
          }
        }

        const handleEscapeKey = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            this.closeDialog(dialog)
          }
        }

        const handleCancel = (event: Event) => {
          event.preventDefault()
          this.closeDialog(dialog)
        }

        dialog.addEventListener('click', handleBackdropClick)
        dialog.addEventListener('keydown', handleEscapeKey)
        dialog.addEventListener('cancel', handleCancel)

        this.boundHandlers.set(dialog, () => {
          dialog.removeEventListener('click', handleBackdropClick)
          dialog.removeEventListener('keydown', handleEscapeKey)
          dialog.removeEventListener('cancel', handleCancel)
        })
      }
    })
  }

  private handleInlineVideo(dialog: HTMLDialogElement, action: 'play' | 'pause'): void {
    const inlineVideo = dialog.querySelector<HTMLVideoElement>(this.selectors.inlineVideo)

    if (!inlineVideo) {
      return
    }

    inlineVideo[action]()
  }

  private normalizeId(dialogId: string): string {
    return dialogId.startsWith('#') ? dialogId.substring(1) : dialogId
  }
}
