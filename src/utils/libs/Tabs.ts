import type { IMediaQueryResult } from '@/types'
import { dataMediaQueries, getHash, setHash, slideDown, slideUp } from '@/utils/base/helpers'

export default class Tabs {
  private tabs: HTMLElement[]
  private tabsActiveHash: string[] = []
  private mdQueriesArray: IMediaQueryResult[] | null = null
  private currentTabsBlock: HTMLElement | null = null

  private dataSelectors = {
    root: '[data-tabs]',
    titles: '[data-tabs-titles]',
    title: '[data-tabs-title]',
    body: '[data-tabs-body]',
    item: '[data-tabs-item]',
    animate: 'data-tabs-animate',
    hash: 'data-tabs-hash',
    tabs: 'data-tabs',
  }

  private classSelectors = {
    slide: 'slide',
    active: 'tab-active',
    init: 'tab-init',
    spoiler: 'tab-spoiler',
    popup: 'popup',
  }

  constructor() {
    this.tabs = Array.from(document.querySelectorAll<HTMLElement>(this.dataSelectors.root))
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
      if (tabsBlock.getAttribute(this.dataSelectors.tabs) === 'hover') {
        tabsBlock.addEventListener('mouseover', this.setTabsAction.bind(this))
      }
      else {
        tabsBlock.addEventListener('click', this.setTabsAction.bind(this))
      }

      tabsBlock.addEventListener('keydown', this.onKeyDown)
      tabsBlock.addEventListener('focusin', this.handleTabFocus)
      tabsBlock.classList.add(this.classSelectors.init)
      tabsBlock.setAttribute('data-tabs-index', String(index))
      this.initTabs(tabsBlock)
    })

    this.mdQueriesArray = dataMediaQueries(
      document.querySelectorAll<HTMLElement>(this.dataSelectors.root),
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
      const tabsTitles = tabsMediaItem.querySelector<HTMLElement>(this.dataSelectors.titles)
      const tabsTitleItemsNodeList = tabsMediaItem.querySelectorAll<HTMLElement>(this.dataSelectors.title)
      const tabsContent = tabsMediaItem.querySelector<HTMLElement>(this.dataSelectors.body)
      const tabsContentItemsNodeList = tabsMediaItem.querySelectorAll<HTMLElement>(this.dataSelectors.item)

      if (!tabsTitles || !tabsContent) {
        return
      }

      const tabsTitleItems = Array.from(tabsTitleItemsNodeList).filter((item) => {
        return item.closest(this.dataSelectors.root) === tabsMediaItem
      })

      const tabsContentItems = Array.from(tabsContentItemsNodeList).filter((item) => {
        return item.closest(this.dataSelectors.root) === tabsMediaItem
      })

      tabsContentItems.forEach((tabsContentItem, index) => {
        const titleItem = tabsTitleItems[index]

        if (!titleItem) {
          return
        }

        if (matchMedia.matches) {
          tabsContent.append(titleItem)
          tabsContent.append(tabsContentItem)
          tabsMediaItem.classList.add(this.classSelectors.spoiler)
        }
        else {
          tabsTitles.append(titleItem)
          tabsMediaItem.classList.remove(this.classSelectors.spoiler)
        }
      })
    })
  }

  private initTabs(tabsBlock: HTMLElement): void {
    const tabsTitlesNodeList = tabsBlock.querySelectorAll<HTMLElement>(`${this.dataSelectors.titles}>*`)
    const tabsContentNodeList = tabsBlock.querySelectorAll<HTMLElement>(`${this.dataSelectors.body}>*`)
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex
    const tabsActiveHashBlock = this.tabsActiveHash[0] === tabsBlockIndex

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector<HTMLElement>(`${this.dataSelectors.titles}>.${this.classSelectors.active}`)

      if (tabsActiveTitle) {
        tabsActiveTitle.classList.remove(this.classSelectors.active)
      }
    }

    if (tabsContentNodeList.length) {
      const tabsContent = Array.from(tabsContentNodeList).filter((item) => {
        return item.closest(this.dataSelectors.root) === tabsBlock
      })

      const tabsTitles = Array.from(tabsTitlesNodeList).filter((item) => {
        return item.closest(this.dataSelectors.root) === tabsBlock
      })

      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index]) {
          tabsTitles[index].setAttribute('data-tabs-title', '')
          tabsContentItem.setAttribute('data-tabs-item', '')

          const isActive = tabsTitles[index].classList.contains(this.classSelectors.active)

          tabsTitles[index].setAttribute('tabindex', isActive ? '0' : '-1')

          if (tabsActiveHashBlock && this.tabsActiveHash[1] && index === Number.parseInt(this.tabsActiveHash[1])) {
            tabsTitles[index].classList.add(this.classSelectors.active)
            tabsTitles[index].setAttribute('tabindex', '0')
          }

          tabsContentItem.hidden = !tabsTitles[index].classList.contains(this.classSelectors.active)
        }
      })
    }
  }

  private isTabsAnimate(tabsBlock: HTMLElement): number | false {
    if (tabsBlock.hasAttribute(this.dataSelectors.animate)) {
      return tabsBlock.dataset.tabsAnimate ? Number.parseInt(tabsBlock.dataset.tabsAnimate) : 500
    }

    return false
  }

  private setTabsStatus(tabsBlock: HTMLElement): void {
    const tabsTitles = Array.from(tabsBlock.querySelectorAll<HTMLElement>(this.dataSelectors.title))
    const tabsContent = Array.from(tabsBlock.querySelectorAll<HTMLElement>(this.dataSelectors.item))
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex
    const tabsBlockAnimate = this.isTabsAnimate(tabsBlock)

    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute(this.dataSelectors.hash)

      tabsContent.forEach((tabsContentItem, index) => {
        const tabTitle = tabsTitles[index]

        if (!tabTitle) {
          return
        }

        if (tabTitle.classList.contains(this.classSelectors.active)) {
          if (tabsBlockAnimate) {
            slideDown(tabsContentItem, tabsBlockAnimate)
          }
          else {
            tabsContentItem.hidden = false
          }

          if (isHash && !tabsContentItem.closest(`.${this.classSelectors.popup}`)) {
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
    const tabTitle = el.closest(this.dataSelectors.title) as HTMLElement | null

    if (tabTitle) {
      const tabsBlock = tabTitle.closest(this.dataSelectors.root) as HTMLElement | null

      if (tabsBlock && !tabTitle.classList.contains(this.classSelectors.active) && !tabsBlock.querySelector(`.${this.classSelectors.slide}`)) {
        const tabActiveTitle = tabsBlock.querySelector<HTMLElement>(`${this.dataSelectors.title}.${this.classSelectors.active}`)

        if (tabActiveTitle) {
          tabActiveTitle.classList.remove(this.classSelectors.active)
        }

        tabTitle.classList.add(this.classSelectors.active)
        this.setTabsStatus(tabsBlock)
      }

      e.preventDefault()
    }
  }

  private getCurrentTabsData(tabsBlock: HTMLElement) {
    const tabsTitles = Array.from(tabsBlock.querySelectorAll<HTMLElement>(this.dataSelectors.title))
    const activeIndex = tabsTitles.findIndex(title => title.classList.contains(this.classSelectors.active))

    return {
      tabsTitles,
      activeIndex,
    }
  }

  private activateTabByIndex(tabsBlock: HTMLElement, newIndex: number): void {
    const { tabsTitles } = this.getCurrentTabsData(tabsBlock)
    const newTab = tabsTitles[newIndex]

    if (newTab && !newTab.classList.contains(this.classSelectors.active)) {
      tabsTitles.forEach((tab) => {
        tab.classList.remove(this.classSelectors.active)
        tab.setAttribute('tabindex', '-1')
      })

      newTab.classList.add(this.classSelectors.active)
      newTab.setAttribute('tabindex', '0')
      newTab.focus()
      this.setTabsStatus(tabsBlock)
    }
  }

  private previousTab = (): void => {
    if (!this.currentTabsBlock) {
      return
    }

    const { tabsTitles, activeIndex } = this.getCurrentTabsData(this.currentTabsBlock)
    const newIndex = activeIndex === 0 ? tabsTitles.length - 1 : activeIndex - 1

    this.activateTabByIndex(this.currentTabsBlock, newIndex)
  }

  private nextTab = (): void => {
    if (!this.currentTabsBlock) {
      return
    }

    const { tabsTitles, activeIndex } = this.getCurrentTabsData(this.currentTabsBlock)
    const newIndex = activeIndex === tabsTitles.length - 1 ? 0 : activeIndex + 1

    this.activateTabByIndex(this.currentTabsBlock, newIndex)
  }

  private firstTab = (): void => {
    if (!this.currentTabsBlock) {
      return
    }

    this.activateTabByIndex(this.currentTabsBlock, 0)
  }

  private lastTab = (): void => {
    if (!this.currentTabsBlock) {
      return
    }

    const { tabsTitles } = this.getCurrentTabsData(this.currentTabsBlock)

    this.activateTabByIndex(this.currentTabsBlock, tabsTitles.length - 1)
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const { code, metaKey } = event

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code]

    const isMacHomeKey = metaKey && code === 'ArrowLeft'

    if (isMacHomeKey) {
      this.firstTab()

      return
    }

    const isMacEndKey = metaKey && code === 'ArrowRight'

    if (isMacEndKey) {
      this.lastTab()

      return
    }

    if (action) {
      action()
      event.preventDefault()
    }
  }

  private handleTabFocus = (event: FocusEvent): void => {
    const target = event.target as HTMLElement
    const tabTitle = target.closest(this.dataSelectors.title)

    if (tabTitle) {
      const tabsBlock = tabTitle.closest(this.dataSelectors.root) as HTMLElement

      this.currentTabsBlock = tabsBlock
    }
  }
}
