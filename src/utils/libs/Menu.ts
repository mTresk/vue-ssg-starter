import { bodyLock, bodyLockStatus, bodyLockToggle, bodyUnlock } from '@/utils/helpers'

export default class Menu {
  private selectors = {
    menuButton: '[data-menu-button]',
    activeClass: 'menu-open',
  }

  constructor() {
    this.menuInit()
  }

  private menuInit(): void {
    if (document.querySelector<HTMLElement>(this.selectors.menuButton)) {
      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement

        if (bodyLockStatus && target.closest(this.selectors.menuButton)) {
          bodyLockToggle()

          document.documentElement.classList.toggle(this.selectors.activeClass)
        }
      })
    }
  }

  public menuOpen(): void {
    bodyLock()

    document.documentElement.classList.add(this.selectors.activeClass)
  }

  public menuClose(): void {
    bodyUnlock()

    document.documentElement.classList.remove(this.selectors.activeClass)
  }
}
