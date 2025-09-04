import type { IBreakpoint, IMediaQueryResult } from '@/types'
import { dataMediaQueries, slideToggle, slideUp } from '@/utils/helpers'

export default class Spoilers {
  private spoilersArray: HTMLElement[]
  private spoilersRegular: HTMLElement[]
  private mdQueriesArray: IMediaQueryResult[] | null = null
  private outsideClickHandler: ((e: MouseEvent) => void) | null = null

  constructor(selector: string = '[data-spoilers]') {
    this.spoilersArray = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    )

    this.spoilersRegular = this.spoilersArray.filter((item) => {
      return !item.dataset.spoilers?.split(',')[0]
    })

    this.init()
  }

  private init(): void {
    if (!this.spoilersArray.length) {
      return
    }

    if (this.spoilersRegular.length) {
      this.initSpoilers(this.spoilersRegular, false)
    }

    this.mdQueriesArray = dataMediaQueries(
      document.querySelectorAll<HTMLElement>('[data-spoilers]'),
      'spoilers',
    )

    if (this.mdQueriesArray && this.mdQueriesArray.length) {
      this.mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener('change', () => {
          this.initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
        })

        this.initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
      })
    }

    this.initOutsideClickHandler()
  }

  private initSpoilerBody(spoilersBlock: HTMLElement, hideSpoilerBody = true): void {
    const spoilerTitlesNodeList = spoilersBlock.querySelectorAll<HTMLElement>('[data-spoiler]')

    const spoilerTitles = Array.from(spoilerTitlesNodeList).filter((item) => {
      return item.closest('[data-spoilers]') === spoilersBlock
    })

    if (spoilerTitles.length) {
      spoilerTitles.forEach((spoilerTitle) => {
        if (hideSpoilerBody) {
          spoilerTitle.removeAttribute('tabindex')

          if (!spoilerTitle.classList.contains('spoiler-active')) {
            const nextElement = spoilerTitle.nextElementSibling as HTMLElement

            if (nextElement) {
              nextElement.hidden = true
            }
          }
        }
        else {
          spoilerTitle.setAttribute('tabindex', '-1')
          const nextElement = spoilerTitle.nextElementSibling as HTMLElement

          if (nextElement) {
            nextElement.hidden = false
          }
        }
      })
    }
  }

  private hideSpoilersBody(spoilersBlock: HTMLElement): void {
    const spoilerActiveTitle = spoilersBlock.querySelector<HTMLElement>('[data-spoiler].spoiler-active')
    const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? Number.parseInt(spoilersBlock.dataset.spoilersSpeed) : 500

    if (spoilerActiveTitle && !spoilersBlock.querySelectorAll('.slide').length) {
      spoilerActiveTitle.classList.remove('spoiler-active')

      const nextElement = spoilerActiveTitle.nextElementSibling as HTMLElement

      if (nextElement) {
        slideUp(nextElement, spoilerSpeed)
      }
    }
  }

  private setSpoilerAction = (e: Event): void => {
    const el = e.target as HTMLElement
    const spoilerTitle = el.closest('[data-spoiler]') as HTMLElement | null

    if (spoilerTitle) {
      const spoilersBlock = spoilerTitle.closest('[data-spoilers]') as HTMLElement
      const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler')
      const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? Number.parseInt(spoilersBlock.dataset.spoilersSpeed) : 500

      if (!spoilersBlock.querySelectorAll('.slide').length) {
        if (oneSpoiler && !spoilerTitle.classList.contains('spoiler-active')) {
          this.hideSpoilersBody(spoilersBlock)
        }

        spoilerTitle.classList.toggle('spoiler-active')

        const nextElement = spoilerTitle.nextElementSibling as HTMLElement

        if (nextElement) {
          slideToggle(nextElement, spoilerSpeed)
        }
      }
    }
  }

  private initSpoilers(spoilersArray: HTMLElement[], matchMedia: MediaQueryList | false = false): void {
    spoilersArray.forEach((spoilersBlock) => {
      if (matchMedia && 'item' in spoilersBlock) {
        spoilersBlock = (spoilersBlock as unknown as IBreakpoint).item
      }

      if ((matchMedia as MediaQueryList)?.matches || !matchMedia) {
        spoilersBlock.classList.add('spoiler-init')
        this.initSpoilerBody(spoilersBlock)
        spoilersBlock.addEventListener('click', this.setSpoilerAction)
      }
      else {
        spoilersBlock.classList.remove('spoiler-init')
        this.initSpoilerBody(spoilersBlock, false)
        spoilersBlock.removeEventListener('click', this.setSpoilerAction)
      }
    })
  }

  private initOutsideClickHandler(): void {
    const spoilersClose = document.querySelectorAll<HTMLElement>('[data-spoiler-close]')

    if (spoilersClose.length) {
      this.outsideClickHandler = (e: MouseEvent) => {
        const el = e.target as HTMLElement

        if (!el.closest('[data-spoilers]')) {
          spoilersClose.forEach((spoilerClose) => {
            const spoilersBlock = spoilerClose.closest('[data-spoilers]') as HTMLElement | null

            if (spoilersBlock?.classList.contains('spoiler-init')) {
              const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? Number.parseInt(spoilersBlock.dataset.spoilersSpeed) : 500

              spoilerClose.classList.remove('spoiler-active')

              const nextElement = spoilerClose.nextElementSibling as HTMLElement

              if (nextElement) {
                slideUp(nextElement, spoilerSpeed)
              }
            }
          })
        }
      }

      document.addEventListener('click', this.outsideClickHandler)
    }
  }
}
