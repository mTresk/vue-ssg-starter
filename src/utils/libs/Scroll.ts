import { getHash, logger } from '@/utils/base/helpers'
import Menu from '@/utils/libs/Menu'

class Scroll {
  private menu

  constructor() {
    this.pageNavigationAction = this.pageNavigationAction.bind(this)
    this.menu = new Menu()
  }

  public pageNavigation() {
    document.addEventListener('click', this.pageNavigationAction)
    document.addEventListener('watcherCallback', this.pageNavigationAction)

    if (getHash()) {
      let goToHash: string | null = null

      if (document.querySelector(`#${getHash()}`)) {
        goToHash = `#${getHash()}`
      }
      else if (document.querySelector(`.${getHash()}`)) {
        goToHash = `.${getHash()}`
      }

      if (goToHash) {
        this.gotoBlock(goToHash, true, 20)
      }
    }
  }

  public scrollDirection() {
    const body = document.body
    const scrollUp = 'scroll-up'
    const scrollDown = 'scroll-down'
    let lastScroll = 0

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY

      if (currentScroll <= 0) {
        body.classList.remove(scrollUp)

        return
      }

      if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        body.classList.remove(scrollUp)
        body.classList.add(scrollDown)
      }
      else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
        body.classList.remove(scrollDown)
        body.classList.add(scrollUp)
      }

      lastScroll = currentScroll
    })
  }

  private gotoBlock(targetBlock: string, noHeader: boolean = false, offsetTop: number = 0) {
    const targetBlockElement = document.querySelector<HTMLElement>(targetBlock)

    if (targetBlockElement) {
      let headerItem = ''
      let headerItemHeight = 0

      if (noHeader) {
        headerItem = 'header.header'
        const headerElement = document.querySelector<HTMLElement>(headerItem)

        if (headerElement) {
          if (!headerElement.classList.contains('header-scroll')) {
            headerElement.style.cssText = `transition-duration: 0s;`
            headerElement.classList.add('header-scroll')
            headerItemHeight = headerElement.offsetHeight
            headerElement.classList.remove('header-scroll')

            setTimeout(() => {
              headerElement.style.cssText = ``
            })
          }
          else {
            headerItemHeight = headerElement.offsetHeight
          }
        }
      }

      const isMenuOpen = document.documentElement.classList.contains('menu-open')

      if (isMenuOpen) {
        this.menu.menuClose()
      }

      const performScroll = () => {
        let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY

        targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition
        targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition

        window.scrollTo({
          top: targetBlockElementPosition,
          behavior: 'smooth',
        })

        logger(`[gotoBlock]: Юхуу...едем до ${targetBlock}`)
      }

      if (isMenuOpen) {
        setTimeout(performScroll, 500)
      }
      else {
        performScroll()
      }
    }
  }

  private pageNavigationAction(e: Event) {
    if (e.type === 'click') {
      const targetElement = e.target as HTMLElement

      if (targetElement.closest('[data-goto]')) {
        const gotoLink = targetElement.closest('[data-goto]') as HTMLElement
        const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : ''
        const noHeader = gotoLink.hasAttribute('data-goto-header')
        const offsetTop = gotoLink.dataset.gotoTop ? Number.parseInt(gotoLink.dataset.gotoTop) : 0

        this.gotoBlock(gotoLinkSelector, noHeader, offsetTop)

        e.preventDefault()
      }
    }
    else if (e.type === 'watcherCallback' && 'detail' in e) {
      const entry = (e as CustomEvent).detail.entry
      const targetElement = entry.target as HTMLElement

      if (targetElement.dataset.watch === 'navigator') {
        let navigatorCurrentItem: HTMLElement | null = null

        if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`) as HTMLElement
        }
        else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index]

            if (document.querySelector(`[data-goto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`) as HTMLElement

              break
            }
          }
        }

        if (entry.isIntersecting) {
          if (navigatorCurrentItem) {
            navigatorCurrentItem.classList.add('navigator-active')
          }
        }
        else {
          if (navigatorCurrentItem) {
            navigatorCurrentItem.classList.remove('navigator-active')
          }
        }
      }
    }
  }
}

export default Scroll
