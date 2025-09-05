import type { IResponsiveAdapterObject, TResponsiveAdapterType } from '@/types'

class ResponsiveAdapter {
  private readonly type: TResponsiveAdapterType
  private objects: IResponsiveAdapterObject[] = []
  private daClassname: string = ''
  private nodes: HTMLElement[] = []
  private mediaQueries: string[] = []
  private selector: string = '[data-da]'

  constructor(type: TResponsiveAdapterType) {
    this.type = type
    this.init()
  }

  init(): void {
    this.objects = []
    this.daClassname = 'responsive-adapter'
    this.nodes = Array.from(document.querySelectorAll(this.selector)) as HTMLElement[]

    this.nodes.forEach((node) => {
      const data = node.dataset.da?.trim() || ''
      const dataArray = data.split(',')
      const destinationSelector = dataArray[0]?.trim()

      if (!destinationSelector) {
        return
      }

      const destination = document.querySelector(destinationSelector) as HTMLElement

      if (!destination) {
        return
      }

      const parent = node.parentNode as HTMLElement
      if (!parent) {
        return
      }

      const object: IResponsiveAdapterObject = {
        element: node,
        parent,
        destination,
        breakpoint: dataArray[1] ? dataArray[1].trim() : '767',
        place: dataArray[2] ? dataArray[2].trim() : 'last',
        index: this.indexInParent(parent, node),
        nextSibling: node.nextElementSibling,
      }

      this.objects.push(object)
    })

    this.arraySort(this.objects)

    this.mediaQueries = this.objects
      .map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
      .filter((item, index, self) => self.indexOf(item) === index)

    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',')
      const mediaQuery = mediaSplit[0]

      if (!mediaQuery) {
        return
      }

      const matchMedia = window.matchMedia(mediaQuery)
      const mediaBreakpoint = mediaSplit[1] || ''
      const objectsFilter = this.objects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)

      matchMedia.addEventListener('change', () => {
        this.mediaHandler(matchMedia, objectsFilter)
      })

      this.mediaHandler(matchMedia, objectsFilter)
    })
  }

  private mediaHandler(matchMedia: MediaQueryList, objects: IResponsiveAdapterObject[]): void {
    if (matchMedia.matches) {
      objects.forEach((object) => {
        if (!object.element.classList.contains(this.daClassname)) {
          this.moveTo(object.place, object.element, object.destination)
        }
      })
    }
    else {
      objects.forEach(({ parent, element, nextSibling }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, nextSibling)
        }
      })
    }
  }

  private moveTo(place: string, element: HTMLElement, destination: HTMLElement): void {
    element.classList.add(this.daClassname)

    if (place === 'last' || place >= destination.children.length.toString()) {
      destination.append(element)

      return
    }

    if (place === 'first') {
      destination.prepend(element)

      return
    }

    const targetChild = destination.children[Number.parseInt(place)]

    if (targetChild) {
      targetChild.before(element)
    }
    else {
      destination.append(element)
    }
  }

  private moveBack(parent: HTMLElement, element: HTMLElement, nextSibling: Element | null): void {
    element.classList.remove(this.daClassname)

    if (nextSibling && nextSibling.parentElement === parent) {
      nextSibling.before(element)
    }
    else {
      parent.append(element)
    }
  }

  private indexInParent(parent: HTMLElement, element: HTMLElement): number {
    return Array.from(parent.children).indexOf(element)
  }

  private arraySort(arr: IResponsiveAdapterObject[]): void {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0
          }

          if (a.place === 'first' || b.place === 'last') {
            return -1
          }

          if (a.place === 'last' || b.place === 'first') {
            return 1
          }

          return 0
        }

        return Number.parseInt(a.breakpoint) - Number.parseInt(b.breakpoint)
      })
    }
    else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0
          }

          if (a.place === 'first' || b.place === 'last') {
            return 1
          }

          if (a.place === 'last' || b.place === 'first') {
            return -1
          }

          return 0
        }
        return Number.parseInt(b.breakpoint) - Number.parseInt(a.breakpoint)
      })
    }
  }
}

export default ResponsiveAdapter
