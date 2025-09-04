export default class Modal {
  private selectors = {
    trigger: '[data-modal]',
    close: '[data-modal-close]',
    content: '[data-modal-content]',
  }

  private boundHandlers: Map<Element, () => void> = new Map()

  constructor() {
    this.init()
  }

  public open(dialogId: string): void {
    this.closeAll()

    const dialog = document.querySelector<HTMLDialogElement>(`#${this.normalizeId(dialogId)}`)

    if (dialog) {
      dialog.showModal()
      dialog.focus()
    }
  }

  public close(dialogId: string): void {
    const dialog = document.querySelector<HTMLDialogElement>(`#${this.normalizeId(dialogId)}`)

    if (dialog) {
      dialog.setAttribute('closing', '')

      setTimeout(() => {
        dialog.close()
        dialog.removeAttribute('closing')
      }, 300)
    }
  }

  private init(): void {
    this.addTriggerListeners()
    this.addCloseListeners()
  }

  public closeDialog(dialogElement: HTMLDialogElement): void {
    if (dialogElement.id) {
      this.close(dialogElement.id)
    }
  }

  private closeAll(): void {
    const openDialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]')

    openDialogs.forEach((dialog) => {
      if (dialog.id) {
        dialog.setAttribute('closing', '')

        setTimeout(() => {
          dialog.close()
          dialog.removeAttribute('closing')
        }, 300)
      }
    })
  }

  private addTriggerListeners(): void {
    const triggers = document.querySelectorAll<HTMLElement>(this.selectors.trigger)

    triggers.forEach((trigger) => {
      if (this.boundHandlers.has(trigger)) {
        return
      }

      const handleClick = () => {
        const dialogId = trigger.dataset.modal

        if (dialogId) {
          this.open(dialogId)
        }
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()

          const dialogId = trigger.dataset.modal

          if (dialogId) {
            this.open(dialogId)
          }
        }
      }

      trigger.addEventListener('click', handleClick)
      trigger.addEventListener('keydown', handleKeyDown)

      if (!trigger.hasAttribute('tabindex')) {
        trigger.setAttribute('tabindex', '0')
      }

      this.boundHandlers.set(trigger, () => {
        trigger.removeEventListener('click', handleClick)
        trigger.removeEventListener('keydown', handleKeyDown)
      })
    })
  }

  private addCloseListeners(): void {
    const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog')

    dialogs.forEach((dialog) => {
      const closeButton = dialog.querySelector<HTMLElement>(this.selectors.close)

      if (closeButton && !this.boundHandlers.has(closeButton)) {
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

  private normalizeId(dialogId: string): string {
    return dialogId.startsWith('#') ? dialogId.substring(1) : dialogId
  }
}
