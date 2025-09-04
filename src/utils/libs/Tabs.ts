import type { IMediaQueryResult } from '@/types'
import { dataMediaQueries, getHash, setHash, slideDown, slideUp } from '@/utils/base/helpers'

export default class Tabs {
  private tabs: HTMLElement[]
  private tabsActiveHash: string[] = []
  private mdQueriesArray: IMediaQueryResult[] | null = null

  constructor(selector: string = '[data-tabs]') {
    this.tabs = Array.from(document.querySelectorAll<HTMLElement>(selector))
    this.init()
  }

  private init(): void {
    if (!this.tabs.length) {
      return
    }

    const hash = getHash()

    if (hash && hash.startsWith('tab-')) {
      this.tabsActiveHash = hash.replace('tab-', '').split('-')
    }

    this.tabs.forEach((tabsBlock, index) => {
      if (tabsBlock.getAttribute('data-tabs') === 'hover') {
        tabsBlock.addEventListener('mouseover', this.setTabsAction.bind(this))
      }
      else {
        tabsBlock.addEventListener('click', this.setTabsAction.bind(this))
      }

      tabsBlock.classList.add('tab-init')
      tabsBlock.setAttribute('data-tabs-index', String(index))
      this.initTabs(tabsBlock)
    })

    this.mdQueriesArray = dataMediaQueries(
      document.querySelectorAll<HTMLElement>('[data-tabs]'),
      'tabs',
    )

    if (this.mdQueriesArray && this.mdQueriesArray.length) {
      this.mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener('change', () => {
          this.setTitlePosition(
            mdQueriesItem.itemsArray,
            mdQueriesItem.matchMedia,
          )
        })

        this.setTitlePosition(
          mdQueriesItem.itemsArray,
          mdQueriesItem.matchMedia,
        )
      })
    }
  }

  private setTitlePosition(tabsMediaArray: HTMLElement[], matchMedia: MediaQueryList): void {
    tabsMediaArray.forEach((tabsMediaItem) => {
      const tabsTitles = tabsMediaItem.querySelector<HTMLElement>('[data-tabs-titles]')
      const tabsTitleItemsNodeList = tabsMediaItem.querySelectorAll<HTMLElement>('[data-tabs-title]')
      const tabsContent = tabsMediaItem.querySelector<HTMLElement>('[data-tabs-body]')
      const tabsContentItemsNodeList = tabsMediaItem.querySelectorAll<HTMLElement>('[data-tabs-item]')

      if (!tabsTitles || !tabsContent) {
        return
      }

      const tabsTitleItems = Array.from(tabsTitleItemsNodeList).filter((item) => {
        return item.closest('[data-tabs]') === tabsMediaItem
      },
      )

      const tabsContentItems = Array.from(tabsContentItemsNodeList).filter((item) => {
        return item.closest('[data-tabs]') === tabsMediaItem
      },
      )

      tabsContentItems.forEach((tabsContentItem, index) => {
        const titleItem = tabsTitleItems[index]

        if (!titleItem) {
          return
        }

        if (matchMedia.matches) {
          tabsContent.append(titleItem)
          tabsContent.append(tabsContentItem)
          tabsMediaItem.classList.add('tab-spoiler')
        }
        else {
          tabsTitles.append(titleItem)
          tabsMediaItem.classList.remove('tab-spoiler')
        }
      })
    })
  }

  private initTabs(tabsBlock: HTMLElement): void {
    const tabsTitlesNodeList = tabsBlock.querySelectorAll<HTMLElement>('[data-tabs-titles]>*')
    const tabsContentNodeList = tabsBlock.querySelectorAll<HTMLElement>('[data-tabs-body]>*')
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex
    const tabsActiveHashBlock = this.tabsActiveHash[0] === tabsBlockIndex

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector<HTMLElement>('[data-tabs-titles]>.tab-active')

      if (tabsActiveTitle) {
        tabsActiveTitle.classList.remove('tab-active')
      }
    }

    if (tabsContentNodeList.length) {
      const tabsContent = Array.from(tabsContentNodeList).filter((item) => {
        return item.closest('[data-tabs]') === tabsBlock
      })

      const tabsTitles = Array.from(tabsTitlesNodeList).filter((item) => {
        return item.closest('[data-tabs]') === tabsBlock
      })

      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index]) {
          tabsTitles[index].setAttribute('data-tabs-title', '')
          tabsContentItem.setAttribute('data-tabs-item', '')

          if (tabsActiveHashBlock && this.tabsActiveHash[1] && index === Number.parseInt(this.tabsActiveHash[1])) {
            tabsTitles[index].classList.add('tab-active')
          }

          tabsContentItem.hidden = !tabsTitles[index].classList.contains('tab-active')
        }
      })
    }
  }

  private isTabsAnimate(tabsBlock: HTMLElement): number | false {
    if (tabsBlock.hasAttribute('data-tabs-animate')) {
      return tabsBlock.dataset.tabsAnimate ? Number.parseInt(tabsBlock.dataset.tabsAnimate) : 500
    }

    return false
  }

  private setTabsStatus(tabsBlock: HTMLElement): void {
    const tabsTitles = Array.from(tabsBlock.querySelectorAll<HTMLElement>('[data-tabs-title]'))
    const tabsContent = Array.from(tabsBlock.querySelectorAll<HTMLElement>('[data-tabs-item]'))
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex
    const tabsBlockAnimate = this.isTabsAnimate(tabsBlock)

    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash')

      tabsContent.forEach((tabsContentItem, index) => {
        const tabTitle = tabsTitles[index]

        if (!tabTitle) {
          return
        }

        if (tabTitle.classList.contains('tab-active')) {
          if (tabsBlockAnimate) {
            slideDown(tabsContentItem, tabsBlockAnimate)
          }
          else {
            tabsContentItem.hidden = false
          }

          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`)
          }
        }
        else {
          if (tabsBlockAnimate) {
            slideUp(tabsContentItem, tabsBlockAnimate)
          }
          else {
            tabsContentItem.hidden = true
          }
        }
      })
    }
  }

  private setTabsAction = (e: Event): void => {
    const el = e.target as HTMLElement
    const tabTitle = el.closest('[data-tabs-title]') as HTMLElement | null

    if (tabTitle) {
      const tabsBlock = tabTitle.closest('[data-tabs]') as HTMLElement | null

      if (tabsBlock && !tabTitle.classList.contains('tab-active') && !tabsBlock.querySelector('.slide')) {
        const tabActiveTitle = tabsBlock.querySelector<HTMLElement>('[data-tabs-title].tab-active')

        if (tabActiveTitle) {
          tabActiveTitle.classList.remove('tab-active')
        }

        tabTitle.classList.add('tab-active')
        this.setTabsStatus(tabsBlock)
      }

      e.preventDefault()
    }
  }
}
