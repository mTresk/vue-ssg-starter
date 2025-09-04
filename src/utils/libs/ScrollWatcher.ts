import type { IWatcherConfig, IWatcherElement, IWatcherParams } from '@/types'
import { logger, uniqArray } from '@/utils/base/helpers'

export default class ScrollWatcher {
  private config: IWatcherConfig
  private observer: IntersectionObserver | null

  constructor(props: Partial<IWatcherConfig>) {
    const defaultConfig = {
      logging: true,
    }

    this.config = Object.assign(defaultConfig, props)
    this.observer = null

    if (!document.documentElement.classList.contains('watcher')) {
      this.scrollWatcherRun()
    }
  }

  scrollWatcherUpdate(): void {
    this.scrollWatcherRun()
  }

  scrollWatcherRun(): void {
    document.documentElement.classList.add('watcher')

    this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]') as NodeListOf<IWatcherElement>)
  }

  scrollWatcherConstructor(items: NodeListOf<IWatcherElement>): void {
    if (items.length) {
      this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`)

      const uniqParams = uniqArray(
        Array.from(items).map((item) => {
          return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`
        }),
      )

      uniqParams.forEach((uniqParam) => {
        const uniqParamArray = uniqParam.split('|')
        const root = uniqParamArray[0] === 'null' ? null : uniqParamArray[0] || null
        const margin = uniqParamArray[1] || '0px'
        const threshold = uniqParamArray[2] || '0'

        const paramsWatch: IWatcherParams = {
          root,
          margin,
          threshold,
        }

        const groupItems = Array.from(items).filter((item) => {
          const watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null
          const watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px'
          const watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : '0'

          if (String(watchRoot) === String(paramsWatch.root) && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item
          }

          return false
        })

        const configWatcher = this.getScrollWatcherConfig(paramsWatch)

        if (configWatcher) {
          this.scrollWatcherInit(groupItems, configWatcher)
        }
      })
    }
    else {
      this.scrollWatcherLogging('Сплю, нет объектов для слежения. ZzzZZzz')
    }
  }

  getScrollWatcherConfig(paramsWatch: IWatcherParams): IntersectionObserverInit | null {
    const configWatcher: IntersectionObserverInit = {}

    if (paramsWatch.root && paramsWatch.root !== 'null') {
      const rootElement = document.querySelector(paramsWatch.root)

      if (rootElement) {
        configWatcher.root = rootElement
      }
      else {
        this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`)
        return null
      }
    }

    configWatcher.rootMargin = paramsWatch.margin

    if (!paramsWatch.margin.includes('px') && !paramsWatch.margin.includes('%')) {
      this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`)

      return null
    }

    if (paramsWatch.threshold === 'prx') {
      const threshold: number[] = []

      for (let i = 0; i <= 1.0; i += 0.005) {
        threshold.push(i)
      }

      configWatcher.threshold = threshold
    }
    else {
      configWatcher.threshold = Array.isArray(paramsWatch.threshold) ? paramsWatch.threshold.map(Number) : paramsWatch.threshold.split(',').map(Number)
    }

    return configWatcher
  }

  scrollWatcherCreate(configWatcher: IntersectionObserverInit): void {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer)
      })
    }, configWatcher)
  }

  scrollWatcherInit(items: IWatcherElement[], configWatcher: IntersectionObserverInit): void {
    this.scrollWatcherCreate(configWatcher)

    if (this.observer) {
      items.forEach((item) => {
        this.observer?.observe(item)
      })
    }
  }

  scrollWatcherIntersecting(entry: IntersectionObserverEntry, targetElement: IWatcherElement): void {
    if (entry.isIntersecting) {
      if (!targetElement.classList.contains('watcher-view')) {
        targetElement.classList.add('watcher-view')
      }

      this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс watcher-view`)
    }
    else {
      if (targetElement.classList.contains('watcher-view')) {
        targetElement.classList.remove('watcher-view')
      }

      this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс watcher-view`)
    }
  }

  scrollWatcherOff(targetElement: IWatcherElement, observer: IntersectionObserver): void {
    observer.unobserve(targetElement)
  }

  scrollWatcherLogging(message: string): void {
    if (this.config.logging) {
      logger(`[Наблюдатель]: ${message}`)
    }
  }

  scrollWatcherCallback(entry: IntersectionObserverEntry, observer: IntersectionObserver): void {
    const targetElement = entry.target as IWatcherElement

    this.scrollWatcherIntersecting(entry, targetElement)

    if (targetElement.hasAttribute('data-watch-once') && entry.isIntersecting) {
      this.scrollWatcherOff(targetElement, observer)
    }

    document.dispatchEvent(
      new CustomEvent('watcherCallback', { detail: { entry } }),
    )
  }
}
