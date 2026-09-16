const CLONE_ATTRIBUTE = 'data-marquee-clone'

export interface MarqueeOptions {
  speed?: number
}

export default class Marquee {
  private readonly selector = '[data-marquee]'
  private readonly instances: MarqueeInstance[] = []

  constructor(defaultSpeed = 50) {
    document.querySelectorAll<HTMLElement>(this.selector).forEach((element) => {
      const speed = Number(element.dataset.marqueeSpeed) || defaultSpeed
      this.instances.push(new MarqueeInstance(element, { speed }))
    })
  }

  destroy() {
    this.instances.forEach(instance => instance.destroy())
    this.instances.length = 0
  }
}

class MarqueeInstance {
  private readonly root: HTMLElement
  private readonly line: HTMLElement
  private readonly speed: number

  private animationId = 0
  private rebuildAnimationId = 0
  private lastFrameTime: number | undefined
  private offset = 0
  private periodWidth = 0
  private isRebuilding = false
  private sourceImages: HTMLImageElement[] = []
  private lastWidth = globalThis.innerWidth
  private resizeTimeout: ReturnType<typeof setTimeout> | undefined

  private readonly intersectionObserver: IntersectionObserver
  private readonly mutationObserver: MutationObserver

  private readonly handleResize = () => {
    const currentWidth = globalThis.innerWidth

    if (currentWidth === this.lastWidth) {
      return
    }

    this.lastWidth = currentWidth
    this.stopAnimation()
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      this.rebuildTrack()
    }, 100)
  }

  private readonly handleImageLoad = () => {
    this.rebuildTrack()
  }

  constructor(root: HTMLElement, options: MarqueeOptions = {}) {
    const track = root.children[0] as HTMLElement | undefined
    const line = track?.children[0] as HTMLElement | undefined

    if (!track || !line) {
      throw new Error('[Marquee] Expected structure: root > track > line > items')
    }

    this.root = root
    this.line = line
    this.speed = options.speed ?? 50

    this.line.style.willChange = 'transform'

    this.intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.startAnimation()
        }
        else {
          this.stopAnimation()
        }
      }
    })

    this.mutationObserver = new MutationObserver((mutations) => {
      if (!this.isRebuilding && mutations.some(mutation => this.isSourceMutation(mutation))) {
        this.scheduleRebuildTrack()
      }
    })

    this.buildTrack()
    this.updateImageListeners()
    this.startAnimation()

    this.intersectionObserver.observe(this.root)
    globalThis.addEventListener('resize', this.handleResize)
    this.mutationObserver.observe(this.line, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  destroy() {
    this.stopAnimation()
    this.mutationObserver.disconnect()
    this.intersectionObserver.disconnect()
    globalThis.removeEventListener('resize', this.handleResize)
    clearTimeout(this.resizeTimeout)

    if (this.rebuildAnimationId) {
      cancelAnimationFrame(this.rebuildAnimationId)
    }

    for (const image of this.sourceImages) {
      image.removeEventListener('load', this.handleImageLoad)
    }

    this.removeClones()
    this.line.style.willChange = ''
    this.line.style.marginLeft = ''
    this.line.style.marginRight = ''
    this.line.style.transform = ''
  }

  private getSourceItems() {
    return [...this.line.children].filter(item => !item.hasAttribute(CLONE_ATTRIBUTE)) as HTMLElement[]
  }

  private isCloneNode(node: Node) {
    return node instanceof HTMLElement
      && (node.hasAttribute(CLONE_ATTRIBUTE) || Boolean(node.closest(`[${CLONE_ATTRIBUTE}]`)))
  }

  private isSourceMutation(mutation: MutationRecord) {
    if (mutation.target === this.line && mutation.attributeName === 'style') {
      return false
    }

    if (this.isCloneNode(mutation.target)) {
      return false
    }

    return (
      [...mutation.addedNodes, ...mutation.removedNodes].some(node => !this.isCloneNode(node))
      || mutation.type !== 'childList'
    )
  }

  private removeClones() {
    const clones = this.line.querySelectorAll<HTMLElement>(`[${CLONE_ATTRIBUTE}]`)

    for (const clone of clones) {
      clone.remove()
    }
  }

  private appendClone(template: HTMLElement) {
    const clone = template.cloneNode(true) as HTMLElement
    clone.setAttribute(CLONE_ATTRIBUTE, 'true')
    clone.setAttribute('aria-hidden', 'true')
    this.line.append(clone)
    return clone
  }

  private buildTrack() {
    this.removeClones()
    this.offset = 0
    this.line.style.marginLeft = '0px'
    this.line.style.marginRight = '0px'
    this.line.style.transform = 'translate3d(0px, 0, 0)'

    const sourceItems = this.getSourceItems()

    if (sourceItems.length === 0) {
      this.periodWidth = 0
      return
    }

    const firstClones: HTMLElement[] = []

    for (const item of sourceItems) {
      firstClones.push(this.appendClone(item))
    }

    const referenceClone = firstClones[0]
    const referenceSource = sourceItems[0]

    if (!referenceClone || !referenceSource) {
      this.periodWidth = 0
      return
    }

    this.periodWidth = referenceClone.offsetLeft - referenceSource.offsetLeft

    if (this.periodWidth <= 0) {
      return
    }

    const marqueeRect = this.root.getBoundingClientRect()
    const viewportWidth = globalThis.innerWidth
    const leftOverflow = Math.max(0, marqueeRect.left)
    const rightOverflow = Math.max(0, viewportWidth - marqueeRect.right)

    this.line.style.marginLeft = `${-leftOverflow}px`

    const minTrackWidth = viewportWidth + rightOverflow + this.periodWidth * 2
    let templateIndex = 0

    while (this.line.scrollWidth < minTrackWidth) {
      const template = sourceItems[templateIndex % sourceItems.length]

      if (!template) {
        break
      }

      this.appendClone(template)
      templateIndex += 1
    }
  }

  private updateImageListeners() {
    for (const image of this.sourceImages) {
      image.removeEventListener('load', this.handleImageLoad)
    }

    this.sourceImages = this.getSourceItems().flatMap(item => [...item.querySelectorAll('img')])

    for (const image of this.sourceImages) {
      if (!image.complete) {
        image.addEventListener('load', this.handleImageLoad)
      }
    }
  }

  private animate = (currentTime: number) => {
    if (this.lastFrameTime === undefined) {
      this.lastFrameTime = currentTime
    }

    const delta = Math.min(currentTime - this.lastFrameTime, 48)
    this.lastFrameTime = currentTime

    if (this.periodWidth > 0) {
      this.offset = (this.offset + (delta / 500) * this.speed) % this.periodWidth
    }

    this.line.style.transform = `translate3d(${-this.offset}px, 0, 0)`
    this.animationId = requestAnimationFrame(this.animate)
  }

  private startAnimation() {
    this.stopAnimation()
    this.lastFrameTime = undefined
    this.animationId = requestAnimationFrame(this.animate)
  }

  private stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = 0
    }
  }

  private rebuildTrack() {
    this.isRebuilding = true
    this.stopAnimation()
    this.buildTrack()
    this.updateImageListeners()
    this.startAnimation()
    this.isRebuilding = false
  }

  private scheduleRebuildTrack() {
    if (this.rebuildAnimationId) {
      return
    }

    this.rebuildAnimationId = requestAnimationFrame(() => {
      this.rebuildAnimationId = 0
      this.rebuildTrack()
    })
  }
}
