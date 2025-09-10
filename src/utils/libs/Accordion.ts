import { pxToRem } from '@/utils/base/helpers'

export default class Accordion {
  private selectors = {
    root: '[data-accordion-root]',
    accordion: '[data-accordion]',
    content: '[data-accordion-content]',
  }

  private attributes = {
    single: 'data-accordion-single',
    closeOutside: 'data-accordion-close',
    duration: 'data-accordion-duration',
    active: 'accordion-active',
    open: 'open',
  }

  private roots: NodeListOf<HTMLElement>
  private defaultAnimationDuration = 300

  constructor() {
    this.roots = document.querySelectorAll<HTMLElement>(this.selectors.root)
    this.init()
  }

  private init(): void {
    if (!this.roots.length) {
      return
    }

    this.roots.forEach((root) => {
      this.initAccordionRoot(root)
    })
  }

  private initAccordionRoot(root: HTMLElement): void {
    const accordions = root.querySelectorAll<HTMLDetailsElement>(this.selectors.accordion)

    if (!accordions.length) {
      return
    }

    const isSingleMode = root.hasAttribute(this.attributes.single)
    const closeOutside = root.hasAttribute(this.attributes.closeOutside)

    accordions.forEach((accordion) => {
      this.initAccordionItem(accordion, accordions, isSingleMode)
    })

    if (closeOutside) {
      this.handleClickOutside(root, accordions)
    }
  }

  private initAccordionItem(accordion: HTMLDetailsElement, allAccordions: NodeListOf<HTMLDetailsElement>, isSingleMode: boolean): void {
    const summary = accordion.querySelector<HTMLElement>('summary')
    const content = accordion.querySelector<HTMLElement>(this.selectors.content)

    if (!summary || !content) {
      return
    }

    if (accordion.hasAttribute(this.attributes.open)) {
      accordion.style.setProperty('--max-height', `${pxToRem(content.scrollHeight)}rem`)
    }

    summary.addEventListener('click', (event) => {
      event.preventDefault()
      this.handleAccordionClick(accordion, allAccordions, isSingleMode)
    })
  }

  private handleAccordionClick(accordion: HTMLDetailsElement, allAccordions: NodeListOf<HTMLDetailsElement>, isSingleMode: boolean): void {
    const isCurrentlyOpen = accordion.hasAttribute(this.attributes.open)

    if (isCurrentlyOpen) {
      this.closeAccordion(accordion)
    }
    else {
      if (isSingleMode) {
        allAccordions.forEach((otherAccordion) => {
          if (otherAccordion !== accordion && otherAccordion.hasAttribute(this.attributes.open)) {
            this.closeAccordion(otherAccordion)
          }
        })
      }

      this.openAccordion(accordion)
    }
  }

  private closeAccordion(accordion: HTMLDetailsElement): void {
    const content = accordion.querySelector<HTMLElement>(this.selectors.content)

    if (!content) {
      return
    }

    const root = accordion.closest<HTMLElement>(this.selectors.root)
    const duration = this.getAnimationDuration(root)

    accordion.style.setProperty('--max-height', '0')
    accordion.classList.remove(this.attributes.active)

    setTimeout(() => {
      accordion.removeAttribute(this.attributes.open)
    }, duration)
  }

  private openAccordion(accordion: HTMLDetailsElement): void {
    const content = accordion.querySelector<HTMLElement>(this.selectors.content)

    if (!content) {
      return
    }

    accordion.setAttribute(this.attributes.open, '')
    accordion.classList.add(this.attributes.active)

    requestAnimationFrame(() => {
      accordion.style.setProperty('--max-height', `${pxToRem(content.scrollHeight)}rem`)
    })
  }

  private handleClickOutside(root: HTMLElement, accordions: NodeListOf<HTMLDetailsElement>): void {
    document.addEventListener('click', (event) => {
      const target = event.target as Element

      if (!root.contains(target)) {
        accordions.forEach((accordion) => {
          if (accordion.hasAttribute(this.attributes.open)) {
            this.closeAccordion(accordion)
          }
        })
      }
    })
  }

  private getAnimationDuration(root: HTMLElement | null): number {
    if (!root) {
      return this.defaultAnimationDuration
    }

    const durationAttr = root.getAttribute(this.attributes.duration)

    if (!durationAttr) {
      return this.defaultAnimationDuration
    }

    const duration = Number(durationAttr)

    return Number.isNaN(duration) ? this.defaultAnimationDuration : duration
  }
}
