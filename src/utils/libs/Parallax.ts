import type { IParallaxConfig, IParallaxMouseElement } from '@/types'
import { logger } from '@/utils/base/helpers'

export default class Parallax {
  private config: IParallaxConfig

  constructor(props: Partial<IParallaxConfig>) {
    const defaultConfig: IParallaxConfig = {
      init: true,
      logging: true,
    }

    this.config = Object.assign(defaultConfig, props)

    if (this.config.init) {
      const parallaxMouse: NodeListOf<IParallaxMouseElement> = document.querySelectorAll('[data-prlx-mouse]')

      if (parallaxMouse.length) {
        this.parallaxMouseInit(parallaxMouse)
        this.setLogging(`Проснулся, слежу за объектами: (${parallaxMouse.length})`)
      }
      else {
        this.setLogging('Нет ни одного объекта. Сплю...zzZZZzZZz...')
      }
    }
  }

  private parallaxMouseInit(parallaxMouse: NodeListOf<IParallaxMouseElement>): void {
    parallaxMouse.forEach((el: IParallaxMouseElement) => {
      const parallaxMouseWrapper: Element | null = el.closest('[data-prlx-mouse-wrapper]')
      const paramCoefficientX: number = el.dataset.prlxCx ? +el.dataset.prlxCx : 100
      const paramCoefficientY: number = el.dataset.prlxCy ? +el.dataset.prlxCy : 100
      const directionX: number = el.hasAttribute('data-prlx-dxr') ? -1 : 1
      const directionY: number = el.hasAttribute('data-prlx-dyr') ? -1 : 1
      const paramAnimation: number = el.dataset.prlxA ? +el.dataset.prlxA : 50

      let positionX: number = 0
      let positionY: number = 0
      let coordinatesXPercent: number = 0
      let coordinatesYPercent: number = 0

      setMouseParallaxStyle()

      if (parallaxMouseWrapper) {
        mouseMoveParallax(parallaxMouseWrapper)
      }
      else {
        mouseMoveParallax()
      }

      function setMouseParallaxStyle(): void {
        const distX: number = coordinatesXPercent - positionX
        const distY: number = coordinatesYPercent - positionY

        positionX = positionX + (distX * paramAnimation) / 1000
        positionY = positionY + (distY * paramAnimation) / 1000
        el.style.cssText = `transform: translate3D(${(directionX * positionX) / (paramCoefficientX / 10)}%,${(directionY * positionY) / (paramCoefficientY / 10)}%,0);`

        requestAnimationFrame(setMouseParallaxStyle)
      }

      function mouseMoveParallax(wrapper: Element | Window = window): void {
        wrapper.addEventListener('mousemove', (e: Event) => {
          const mouseEvent = e as MouseEvent
          const offsetTop: number = el.getBoundingClientRect().top + window.scrollY

          if (offsetTop >= window.scrollY || offsetTop + el.offsetHeight >= window.scrollY) {
            const parallaxWidth: number = window.innerWidth
            const parallaxHeight: number = window.innerHeight
            const coordinatesX: number = mouseEvent.clientX - parallaxWidth / 2
            const coordinatesY: number = mouseEvent.clientY - parallaxHeight / 2

            coordinatesXPercent = (coordinatesX / parallaxWidth) * 100
            coordinatesYPercent = (coordinatesY / parallaxHeight) * 100
          }
        })
      }
    })
  }

  private setLogging(message: string): void {
    if (this.config.logging) {
      logger(`[Parallax Mouse]: ${message}`)
    }
  }
}
