import type { IBreakpoint, IMediaQueryResult } from '@/types'
import { dataMediaQueries, SLIDE_DURATION, slideDown, slideUp } from '@/utils/base/helpers'

export default class ShowMoreSimple {
  private showMoreBlocks: HTMLElement[]
  private readonly showMoreBlocksRegular: HTMLElement[]
  private mdQueriesArray: IMediaQueryResult[] | null = null
  private actionsHandler: ((e: Event) => void) | null = null
  private accordionHandler: ((e: Event) => void) | null = null
  private resizeHandler: ((e: Event) => void) | null = null
  private resizeTimeout: number | null = null
  private previousWidth: number = window.innerWidth

  private dataSelectors = {
    root: '[data-showmore-simple]',
    content: '[data-showmore-simple-content]',
    button: '[data-showmore-simple-button]',
  }

  private classSelectors = {
    active: 'showmore-simple-active',
    hidden: 'showmore-simple-hidden',
  }

  constructor() {
    this.showMoreBlocks = Array.from(
      document.querySelectorAll<HTMLElement>(this.dataSelectors.root),
    )

    this.showMoreBlocksRegular = this.showMoreBlocks.filter((item) => {
      return !item.dataset.showmoreSimpleMedia
    })

    this.init()
  }

  private init(): void {
    if (!this.showMoreBlocks.length) {
      return
    }

    if (document.readyState === 'loading') {
      window.addEventListener('load', () => {
        this.initShowMore()
      })
    }
    else {
      this.initShowMore()
    }
  }

  private initShowMore(): void {
    setTimeout(() => {
      if (this.showMoreBlocksRegular.length) {
        this.initItems(this.showMoreBlocksRegular, false)
      }

      this.actionsHandler = this.handleActions.bind(this)
      this.resizeHandler = this.handleResize.bind(this)
      this.accordionHandler = this.handleAccordionChange.bind(this)

      document.addEventListener('click', this.actionsHandler)
      window.addEventListener('resize', this.resizeHandler)
      document.addEventListener('accordion:opened', this.accordionHandler)
      document.addEventListener('accordion:closed', this.accordionHandler)

      this.mdQueriesArray = dataMediaQueries(
        document.querySelectorAll<HTMLElement>(this.dataSelectors.root),
        'showmoreSimpleMedia',
      )

      if (this.mdQueriesArray && this.mdQueriesArray.length) {
        this.mdQueriesArray.forEach((mdQueriesItem) => {
          mdQueriesItem.matchMedia.addEventListener('change', () => {
            this.initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
          })
        })

        this.initItemsMedia(this.mdQueriesArray)
      }
    }, 10)
  }

  private initItemsMedia(mdQueriesArray: IMediaQueryResult[]): void {
    mdQueriesArray.forEach((mdQueriesItem) => {
      this.initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
    })
  }

  private initItems(showMoreBlocks: HTMLElement[], matchMedia: MediaQueryList | false): void {
    showMoreBlocks.forEach((showMoreBlock) => {
      this.initItem(showMoreBlock, matchMedia)
    })
  }

  private initItem(showMoreBlock: HTMLElement, matchMedia: MediaQueryList | false = false): void {
    showMoreBlock = matchMedia && 'item' in showMoreBlock
      ? (showMoreBlock as unknown as IBreakpoint).item
      : showMoreBlock

    if ((matchMedia as MediaQueryList)?.matches || !matchMedia) {
      const showMoreContent = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.content)
      const showMoreButton = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.button)

      if (!showMoreContent || !showMoreButton) {
        return
      }

      const limit = this.getLimit(showMoreContent)
      const isActive = showMoreBlock.classList.contains(this.classSelectors.active)
      const children = Array.from(showMoreContent.children) as HTMLElement[]

      if (children.length > limit) {
        children.forEach((child, index) => {
          if (index >= limit && !isActive) {
            child.classList.add(this.classSelectors.hidden)
            child.hidden = true
          }
        })

        showMoreButton.hidden = false
      }
      else {
        children.forEach((child) => {
          child.classList.remove(this.classSelectors.hidden)
          child.hidden = false
        })

        showMoreButton.hidden = true
      }
    }
    else {
      const showMoreContent = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.content)
      const showMoreButton = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.button)

      if (showMoreContent && showMoreButton) {
        showMoreBlock.classList.remove(this.classSelectors.active)

        const children = Array.from(showMoreContent.children) as HTMLElement[]

        children.forEach((child) => {
          child.classList.remove(this.classSelectors.hidden)
          child.hidden = false
        })

        showMoreButton.hidden = true
      }
    }
  }

  private getLimit(showMoreContent: HTMLElement): number {
    const limitValue = showMoreContent.dataset.showmoreSimpleContent
      ? showMoreContent.dataset.showmoreSimpleContent
      : '3'

    return Math.max(1, Number.parseInt(limitValue))
  }

  private handleActions(e: Event): void {
    const targetEvent = e.target as HTMLElement

    if (targetEvent.closest(this.dataSelectors.button)) {
      const showMoreButton = targetEvent.closest(this.dataSelectors.button) as HTMLElement
      const showMoreBlock = showMoreButton.closest(this.dataSelectors.root) as HTMLElement
      const showMoreContent = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.content)

      if (!showMoreContent) {
        return
      }

      const isActive = showMoreBlock.classList.contains(this.classSelectors.active)
      const limit = this.getLimit(showMoreContent)
      const children = Array.from(showMoreContent.children) as HTMLElement[]

      if (isActive) {
        // Скрываем элементы плавно
        children.forEach((child, index) => {
          if (index >= limit) {
            child.classList.add(this.classSelectors.hidden)
            slideUp(child, SLIDE_DURATION)
          }
        })

        showMoreBlock.classList.remove(this.classSelectors.active)
      }
      else {
        // Показываем элементы плавно
        children.forEach((child, index) => {
          if (index >= limit) {
            child.classList.remove(this.classSelectors.hidden)
            slideDown(child, SLIDE_DURATION)
          }
        })

        showMoreBlock.classList.add(this.classSelectors.active)
      }
    }
  }

  private handleResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }

    this.resizeTimeout = window.setTimeout(() => {
      const currentWidth = window.innerWidth

      if (currentWidth !== this.previousWidth) {
        if (this.showMoreBlocksRegular.length) {
          this.initItems(this.showMoreBlocksRegular, false)
        }

        if (this.mdQueriesArray && this.mdQueriesArray.length) {
          this.initItemsMedia(this.mdQueriesArray)
        }

        this.previousWidth = currentWidth
      }

      this.resizeTimeout = null
    }, 100)
  }

  private handleAccordionChange(e: Event): void {
    const customEvent = e as CustomEvent
    const accordion = customEvent.detail?.accordion as HTMLElement

    if (!accordion) {
      return
    }

    const showMoreBlock = accordion.closest<HTMLElement>(this.dataSelectors.root)

    if (!showMoreBlock) {
      return
    }

    setTimeout(() => {
      this.recalculateVisibility(showMoreBlock)
    }, 50)
  }

  private recalculateVisibility(showMoreBlock: HTMLElement): void {
    const showMoreContent = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.content)

    if (!showMoreContent) {
      return
    }

    const isActive = showMoreBlock.classList.contains(this.classSelectors.active)

    if (!isActive) {
      const limit = this.getLimit(showMoreContent)
      const children = Array.from(showMoreContent.children) as HTMLElement[]

      children.forEach((child, index) => {
        if (index >= limit) {
          child.classList.add(this.classSelectors.hidden)
          if (!child.hidden) {
            slideUp(child, SLIDE_DURATION)
          }
        }
        else {
          child.classList.remove(this.classSelectors.hidden)
          if (child.hidden) {
            slideDown(child, SLIDE_DURATION)
          }
        }
      })
    }
  }
}
