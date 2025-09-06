import type { IBreakpoint, IMediaQueryResult } from '@/types'

export function getHash(): string | undefined {
  if (location.hash) {
    return location.hash.replace('#', '')
  }

  return undefined
}

export function setHash(hash: string): void {
  const newHash = hash ? `#${hash}` : window.location.href.split('#')[0]
  history.pushState('', '', newHash)
}

export function slideUp(target: HTMLElement, duration: number = 500, showmore: number = 0): void {
  if (!target.classList.contains('slide')) {
    target.classList.add('slide')
    target.style.transitionProperty = 'height, margin, padding'
    target.style.transitionDuration = `${duration}ms`
    target.style.height = `${target.offsetHeight}px`
    void target.offsetHeight
    target.style.overflow = 'hidden'
    target.style.height = showmore ? `${showmore}px` : '0'
    target.style.paddingTop = '0'
    target.style.paddingBottom = '0'
    target.style.marginTop = '0'
    target.style.marginBottom = '0'
    window.setTimeout(() => {
      target.hidden = !showmore
      if (!showmore) {
        target.style.removeProperty('height')
        target.style.removeProperty('overflow')
      }
      target.style.removeProperty('padding-top')
      target.style.removeProperty('padding-bottom')
      target.style.removeProperty('margin-top')
      target.style.removeProperty('margin-bottom')
      target.style.removeProperty('transition-duration')
      target.style.removeProperty('transition-property')
      target.classList.remove('slide')

      document.dispatchEvent(
        new CustomEvent('slideUpDone', {
          detail: {
            target,
          },
        }),
      )
    }, duration)
  }
}

export function slideDown(target: HTMLElement, duration: number = 500, showmore: number = 0): void {
  if (!target.classList.contains('slide')) {
    target.classList.add('slide')
    target.hidden = false
    if (showmore) {
      target.style.removeProperty('height')
    }
    const height = target.offsetHeight
    target.style.overflow = 'hidden'
    target.style.height = showmore ? `${showmore}px` : '0'
    target.style.paddingTop = '0'
    target.style.paddingBottom = '0'
    target.style.marginTop = '0'
    target.style.marginBottom = '0'
    void target.offsetHeight
    target.style.transitionProperty = 'height, margin, padding'
    target.style.transitionDuration = `${duration}ms`
    target.style.height = `${height}px`
    target.style.removeProperty('padding-top')
    target.style.removeProperty('padding-bottom')
    target.style.removeProperty('margin-top')
    target.style.removeProperty('margin-bottom')
    window.setTimeout(() => {
      target.style.removeProperty('height')
      target.style.removeProperty('overflow')
      target.style.removeProperty('transition-duration')
      target.style.removeProperty('transition-property')
      target.classList.remove('slide')
      // Создаем событие
      document.dispatchEvent(
        new CustomEvent('slideDownDone', {
          detail: {
            target,
          },
        }),
      )
    }, duration)
  }
}

export function slideToggle(target: HTMLElement, duration: number = 500): void {
  if (target.hidden) {
    return slideDown(target, duration)
  }

  return slideUp(target, duration)
}

// eslint-disable-next-line import/no-mutable-exports
export let bodyLockStatus = true

let scrollPosition = 0

export function bodyUnlock(delay: number = 500) {
  const body = document.querySelector<HTMLBodyElement>('body')!

  if (bodyLockStatus) {
    const lockPadding = document.querySelectorAll<HTMLElement>('[data-lp]')

    setTimeout(() => {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index]

        if (el) {
          el.style.paddingRight = '0'
        }
      }

      body.style.paddingRight = '0'
      body.style.position = ''
      body.style.top = ''
      document.documentElement.classList.remove('lock')

      window.scrollTo({ top: scrollPosition, behavior: 'instant' })
    }, delay)

    bodyLockStatus = false

    setTimeout(() => {
      bodyLockStatus = true
    }, delay)
  }
}

export function bodyLock(delay: number = 500) {
  const body = document.querySelector<HTMLBodyElement>('body')

  if (bodyLockStatus) {
    const lockPadding = document.querySelectorAll<HTMLElement>('[data-lp]')

    scrollPosition = window.pageYOffset || document.documentElement.scrollTop

    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index]

      if (el) {
        el.style.paddingRight = `${window.innerWidth - document.querySelector<HTMLElement>('.wrapper')!.offsetWidth}px`
      }
    }

    body!.style.paddingRight = `${window.innerWidth - document.querySelector<HTMLElement>('.wrapper')!.offsetWidth}px`
    body!.style.position = 'fixed'
    body!.style.top = `-${scrollPosition}px`
    body!.style.width = '100%'
    document.documentElement.classList.add('lock')

    bodyLockStatus = false

    setTimeout(() => {
      bodyLockStatus = true
    }, delay)
  }
}

export function bodyLockToggle(delay: number = 500) {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay)
  }
  else {
    bodyLock(delay)
  }
}

export function dataMediaQueries(array: NodeListOf<HTMLElement>, dataSetValue: string): IMediaQueryResult[] {
  const media = Array.from(array).filter((item) => {
    const dataset = item.dataset[dataSetValue]

    return dataset ? dataset.split(',')[0] : false
  })

  if (media.length) {
    const breakpointsArray: IBreakpoint[] = []

    media.forEach((item) => {
      const params = item.dataset[dataSetValue]

      if (!params) {
        return
      }

      const paramsArray = params.split(',')
      const value = paramsArray[0]

      if (!value) {
        return
      }

      breakpointsArray.push({
        value,
        type: paramsArray[1] ? paramsArray[1].trim() : 'max',
        item,
      })
    })

    const mdQueries = uniqArray(
      breakpointsArray.map((item) => {
        return `(${item.type}-width: ${item.value}px),${item.value},${item.type}`
      }),
    )

    return mdQueries.map((breakpoint): IMediaQueryResult => {
      const [query, value, type] = breakpoint.split(',')

      if (!query || !value || !type) {
        throw new Error('Invalid breakpoint format')
      }

      const matchMedia = window.matchMedia(query)
      const itemsArray = breakpointsArray.filter((item) => {
        return item.value === value && item.type === type
      }).map((item) => {
        return item.item
      })

      return {
        itemsArray,
        matchMedia,
      }
    })
  }

  return []
}

export function logger(message: unknown): void {
  setTimeout(() => {
    if (window.logger) {
      console.warn(message)
    }
  })
}

export function uniqArray<T>(array: T[]): T[] {
  return array.filter((item, index, self) => {
    return self.indexOf(item) === index
  })
}

export function indexInParent(parent: Element, element: Element): number {
  const array = Array.prototype.slice.call(parent.children)

  return Array.prototype.indexOf.call(array, element)
}

export function pxToRem(pixels: number) {
  const htmlElementFontSize = Number.parseInt(
    getComputedStyle(document.documentElement).fontSize,
  )

  return pixels / htmlElementFontSize
}
