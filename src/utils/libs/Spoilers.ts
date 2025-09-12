import type { IBreakpoint, IMediaQueryResult } from '@/types'
import { dataMediaQueries, slideToggle, slideUp } from '@/utils/base/helpers'

export default class Spoilers {
  private spoilersArray: HTMLElement[]
  private readonly spoilersRegular: HTMLElement[]
  private mdQueriesArray: IMediaQueryResult[] | null = null
  private outsideClickHandler: ((e: MouseEvent) => void) | null = null

  private dataSelectors = {
    root: '[data-spoilers]',
    spoiler: '[data-spoiler]',
    spoilerClose: '[data-spoiler-close]',
    oneSpoiler: 'data-one-spoiler',
  }

  private classSelectors = {
    spoilerActive: 'spoiler-active',
    slide: 'slide',
    spoilerInit: 'spoiler-init',
  }

  constructor() {
    this.spoilersArray = Array.from(
      document.querySelectorAll<HTMLElement>(this.dataSelectors.root),
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
      document.querySelectorAll<HTMLElement>(this.dataSelectors.root),
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
    const spoilerTitlesNodeList = spoilersBlock.querySelectorAll<HTMLElement>(this.dataSelectors.spoiler)

    const spoilerTitles = Array.from(spoilerTitlesNodeList).filter((item) => {
      return item.closest(this.dataSelectors.root) === spoilersBlock
    })

    if (spoilerTitles.length) {
      spoilerTitles.forEach((spoilerTitle) => {
        if (hideSpoilerBody) {
          spoilerTitle.removeAttribute('tabindex')

          if (!spoilerTitle.classList.contains(this.classSelectors.spoilerActive)) {
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
    const spoilerActiveTitle = spoilersBlock.querySelector<HTMLElement>(`${this.dataSelectors.spoiler}.${this.classSelectors.spoilerActive}`)
    const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? Number.parseInt(spoilersBlock.dataset.spoilersSpeed) : 500

    if (spoilerActiveTitle && !spoilersBlock.querySelectorAll(`.${this.classSelectors.slide}`).length) {
      spoilerActiveTitle.classList.remove(this.classSelectors.spoilerActive)

      const nextElement = spoilerActiveTitle.nextElementSibling as HTMLElement

      if (nextElement) {
        slideUp(nextElement, spoilerSpeed)
      }
    }
  }

  private setSpoilerAction = (e: Event): void => {
    const el = e.target as HTMLElement
    const spoilerTitle = el.closest(this.dataSelectors.spoiler) as HTMLElement | null

    if (spoilerTitle) {
      const spoilersBlock = spoilerTitle.closest(this.dataSelectors.root) as HTMLElement
      const oneSpoiler = spoilersBlock.hasAttribute(this.dataSelectors.oneSpoiler)
      const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? Number.parseInt(spoilersBlock.dataset.spoilersSpeed) : 500

      if (!spoilersBlock.querySelectorAll(`.${this.classSelectors.slide}`).length) {
        if (oneSpoiler && !spoilerTitle.classList.contains(this.classSelectors.spoilerActive)) {
          this.hideSpoilersBody(spoilersBlock)
        }

        spoilerTitle.classList.toggle(this.classSelectors.spoilerActive)

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
        spoilersBlock.classList.add(this.classSelectors.spoilerInit)
        this.initSpoilerBody(spoilersBlock)
        spoilersBlock.addEventListener('click', this.setSpoilerAction)
      }
      else {
        spoilersBlock.classList.remove(this.classSelectors.spoilerInit)
        this.initSpoilerBody(spoilersBlock, false)
        spoilersBlock.removeEventListener('click', this.setSpoilerAction)
      }
    })
  }

  private initOutsideClickHandler(): void {
    const spoilersClose = document.querySelectorAll<HTMLElement>(this.dataSelectors.spoilerClose)

    if (spoilersClose.length) {
      this.outsideClickHandler = (e: MouseEvent) => {
        const el = e.target as HTMLElement

        if (!el.closest(this.dataSelectors.root)) {
          spoilersClose.forEach((spoilerClose) => {
            const spoilersBlock = spoilerClose.closest(this.dataSelectors.root) as HTMLElement | null

            if (spoilersBlock?.classList.contains(this.classSelectors.spoilerInit)) {
              const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? Number.parseInt(spoilersBlock.dataset.spoilersSpeed) : 500

              spoilerClose.classList.remove(this.classSelectors.spoilerActive)

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
