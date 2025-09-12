import type { IBreakpoint, IMediaQueryResult } from '@/types'
import { dataMediaQueries, slideDown, slideUp } from '@/utils/base/helpers'

export default class ShowMore {
  private showMoreBlocks: HTMLElement[]
  private readonly showMoreBlocksRegular: HTMLElement[]
  private mdQueriesArray: IMediaQueryResult[] | null = null
  private actionsHandler: ((e: Event) => void) | null = null
  private resizeHandler: ((e: Event) => void) | null = null
  private resizeTimeout: number | null = null

  private dataSelectors = {
    root: '[data-showmore]',
    content: '[data-showmore-content]',
    button: '[data-showmore-button]',
  }

  private classSelectors = {
    active: 'showmore-active',
    slide: 'slide',
  }

  constructor() {
    this.showMoreBlocks = Array.from(
      document.querySelectorAll<HTMLElement>(this.dataSelectors.root),
    )

    this.showMoreBlocksRegular = this.showMoreBlocks.filter((item) => {
      return !item.dataset.showmoreMedia
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

      document.addEventListener('click', this.actionsHandler)
      window.addEventListener('resize', this.resizeHandler)

      this.mdQueriesArray = dataMediaQueries(
        document.querySelectorAll<HTMLElement>(this.dataSelectors.root),
        'showmoreMedia',
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

      const hiddenHeight = this.getHeight(showMoreBlock, showMoreContent)

      if (hiddenHeight < this.getOriginalHeight(showMoreContent)) {
        slideUp(showMoreContent, 0, hiddenHeight)
        showMoreButton.hidden = false
      }
      else {
        slideDown(showMoreContent, 0, hiddenHeight)
        showMoreButton.hidden = true
      }
    }
    else {
      const showMoreContent = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.content)
      const showMoreButton = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.button)

      if (showMoreContent && showMoreButton) {
        showMoreBlock.classList.remove(this.classSelectors.active)
        showMoreContent.style.removeProperty('height')
        showMoreContent.style.removeProperty('overflow')
        showMoreContent.hidden = false
        showMoreButton.hidden = true
      }
    }
  }

  private getHeight(showMoreBlock: HTMLElement, showMoreContent: HTMLElement): number {
    let hiddenHeight
    const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size'
    const wasHidden = showMoreContent.hidden
    const originalHeight = showMoreContent.style.height
    const originalOverflow = showMoreContent.style.overflow

    showMoreContent.hidden = false
    showMoreContent.style.height = 'auto'
    showMoreContent.style.overflow = 'visible'

    if (showMoreType === 'items') {
      const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3
      const limit = Math.min(Number.parseInt(showMoreTypeValue as string), showMoreContent.children.length)

      if (limit > 0) {
        void showMoreContent.offsetHeight

        const containerStyles = getComputedStyle(showMoreContent)
        const paddingTop = Number.parseFloat(containerStyles.paddingTop) || 0
        const paddingBottom = Number.parseFloat(containerStyles.paddingBottom) || 0
        const children = Array.from(showMoreContent.children).slice(0, limit) as HTMLElement[]

        if (children.length > 0) {
          void showMoreContent.offsetHeight

          let maxBottom = 0
          const containerRect = showMoreContent.getBoundingClientRect()

          children.forEach((child) => {
            void child.offsetHeight

            const childRect = child.getBoundingClientRect()
            const relativeBottom = childRect.bottom - containerRect.top

            if (relativeBottom > maxBottom) {
              maxBottom = relativeBottom
            }
          })

          hiddenHeight = Math.max(0, Math.round(maxBottom + paddingBottom))
        }
        else {
          hiddenHeight = paddingTop + paddingBottom
        }
      }
      else {
        hiddenHeight = 0
      }
    }
    else {
      const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150

      hiddenHeight = Number.parseInt(showMoreTypeValue as string)
    }

    showMoreContent.hidden = wasHidden

    if (originalHeight) {
      showMoreContent.style.height = originalHeight
    }
    else {
      showMoreContent.style.removeProperty('height')
    }

    if (originalOverflow) {
      showMoreContent.style.overflow = originalOverflow
    }
    else {
      showMoreContent.style.removeProperty('overflow')
    }

    return hiddenHeight
  }

  private getOriginalHeight(showMoreContent: HTMLElement): number {
    let parentHidden: HTMLElement | null = null
    const originalHeight = showMoreContent.style.height
    const originalOverflow = showMoreContent.style.overflow
    const wasHidden = showMoreContent.hidden

    showMoreContent.hidden = false
    showMoreContent.style.height = 'auto'
    showMoreContent.style.overflow = 'visible'

    if (showMoreContent.closest(`[hidden]`)) {
      parentHidden = showMoreContent.closest(`[hidden]`) as HTMLElement
      parentHidden.hidden = false
    }

    void showMoreContent.offsetHeight
    const fullHeight = showMoreContent.offsetHeight

    if (parentHidden) {
      parentHidden.hidden = true
    }

    showMoreContent.hidden = wasHidden

    if (originalHeight) {
      showMoreContent.style.height = originalHeight
    }
    else {
      showMoreContent.style.removeProperty('height')
    }

    if (originalOverflow) {
      showMoreContent.style.overflow = originalOverflow
    }
    else {
      showMoreContent.style.removeProperty('overflow')
    }

    return fullHeight
  }

  private getAnimationSpeed(showMoreBlock: HTMLElement): number {
    const showMoreButton = showMoreBlock.querySelector<HTMLElement>(this.dataSelectors.button)

    if (showMoreButton?.dataset.showmoreButton) {
      const buttonValue = showMoreButton.dataset.showmoreButton

      if (buttonValue && !Number.isNaN(Number.parseInt(buttonValue))) {
        return Number.parseInt(buttonValue)
      }
    }

    if (showMoreBlock.dataset.showmoreButton) {
      return Number.parseInt(showMoreBlock.dataset.showmoreButton as string)
    }

    return 500
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

      const showMoreSpeed = this.getAnimationSpeed(showMoreBlock)
      const hiddenHeight = this.getHeight(showMoreBlock, showMoreContent)

      if (!showMoreContent.classList.contains(this.classSelectors.slide)) {
        if (showMoreBlock.classList.contains(this.classSelectors.active)) {
          slideUp(showMoreContent, showMoreSpeed, hiddenHeight)
        }
        else {
          slideDown(showMoreContent, showMoreSpeed, hiddenHeight)
        }

        showMoreBlock.classList.toggle(this.classSelectors.active)
      }
    }
  }

  private handleResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }

    this.resizeTimeout = window.setTimeout(() => {
      if (this.showMoreBlocksRegular.length) {
        this.initItems(this.showMoreBlocksRegular, false)
      }

      if (this.mdQueriesArray && this.mdQueriesArray.length) {
        this.initItemsMedia(this.mdQueriesArray)
      }

      this.resizeTimeout = null
    }, 100)
  }
}
