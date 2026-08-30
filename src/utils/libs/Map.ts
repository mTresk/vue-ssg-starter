interface YMapsApi {
  ready: Promise<void>
  YMap: new (element: HTMLElement, options: Record<string, unknown>) => YMapInstance
  YMapDefaultSchemeLayer: new (options?: Record<string, unknown>) => unknown
  YMapDefaultFeaturesLayer: new () => unknown
  YMapMarker: new (options: { coordinates: number[] }, element: HTMLElement) => unknown
}

interface YMapInstance {
  addChild: (child: unknown) => void
  setBehaviors: (behaviors: string[]) => void
}

const BASE_BEHAVIORS = ['drag', 'pinchZoom', 'dblClick', 'mouseRotate', 'mouseTilt']
const SCROLL_ZOOM_LEARNED_THRESHOLD = 3
const SCROLL_ZOOM_STORAGE_KEY = 'map-ctrl-scroll-count'
const DEFAULT_ZOOM = 17

let ymapsLoader: Promise<YMapsApi> | null = null

function parseLatLon(value: string): number[] | null {
  const parts = value.split(',').map(part => Number(part.trim()))

  if (parts.length !== 2 || parts.some(part => Number.isNaN(part))) {
    return null
  }

  const [lat, lon] = parts

  return [lon, lat]
}

function getScrollZoomCount() {
  const rawValue = localStorage.getItem(SCROLL_ZOOM_STORAGE_KEY)
  const count = Number(rawValue)

  return Number.isFinite(count) ? count : 0
}

function setScrollZoomCount(count: number) {
  localStorage.setItem(SCROLL_ZOOM_STORAGE_KEY, String(count))
}

function loadYMaps(apiKey: string) {
  if (ymapsLoader) {
    return ymapsLoader
  }

  ymapsLoader = new Promise((resolve, reject) => {
    // @ts-expect-error - ymaps3
    if (window.ymaps3) {
      // @ts-expect-error - ymaps3
      resolve(window.ymaps3)

      return
    }

    const script = document.createElement('script')

    script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`
    // @ts-expect-error - ymaps3
    script.onload = () => resolve(window.ymaps3)
    script.onerror = () => reject(new Error('Failed to load Yandex Maps API'))

    document.body.appendChild(script)
  })

  return ymapsLoader
}

function createMarkerElement() {
  const markerElement = document.createElement('div')

  markerElement.className = 'map__marker'
  markerElement.innerHTML = `
    <svg>
      <use href="/images/icons.svg#pin"></use>
    </svg>
  `

  return markerElement
}

function getSchemeLayerCustomization() {
  return [
    {
      tags: { any: ['road'] },
      elements: 'geometry',
      stylers: [{ color: '#4E4E4E' }],
    },
    {
      tags: { any: ['water'] },
      elements: 'geometry',
      stylers: [{ color: '#000000' }],
    },
    {
      tags: { any: ['landscape', 'admin', 'land', 'transit'] },
      elements: 'geometry',
      stylers: [{ color: '#212121' }],
    },
    {
      tags: { any: ['building'] },
      elements: 'geometry',
      stylers: [{ color: '#757474' }],
    },
  ]
}

export default class Map {
  private readonly selector = '[data-map-key]'

  constructor() {
    document.querySelectorAll<HTMLElement>(this.selector).forEach((mapRoot) => {
      this.observeMap(mapRoot)
    })
  }

  private observeMap(mapRoot: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry?.isIntersecting) {
          return
        }

        observer.disconnect()
        void this.initMap(mapRoot)
      },
      {
        rootMargin: '500px',
      },
    )

    observer.observe(mapRoot)
  }

  private async initMap(mapRoot: HTMLElement) {
    const apiKey = mapRoot.getAttribute('data-map-key')
    const canvas = mapRoot.querySelector<HTMLElement>('[data-map-canvas]') || mapRoot

    if (!apiKey) {
      return
    }

    const markersValue = mapRoot.getAttribute('data-map-markers')
    let centerValue = mapRoot.getAttribute('data-map-center') || mapRoot.getAttribute('data-map')
    const zoomValue = Number(mapRoot.getAttribute('data-map-zoom') || DEFAULT_ZOOM)
    const overlay = mapRoot.querySelector<HTMLElement>('[data-map-zoom-overlay]')

    if (!centerValue && markersValue) {
      try {
        const parsed = JSON.parse(markersValue) as string[]
        centerValue = parsed[0] ?? null
      }
      catch {
        centerValue = null
      }
    }

    if (!centerValue) {
      return
    }

    const center = parseLatLon(centerValue)

    if (!center) {
      return
    }

    const markerCoordinates = this.parseMarkers(markersValue, centerValue)
    const ymaps3 = await loadYMaps(apiKey)

    await ymaps3.ready

    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3
    const map = new YMap(canvas, {
      location: {
        center,
        zoom: Number.isFinite(zoomValue) ? zoomValue : DEFAULT_ZOOM,
      },
      showScaleInCopyrights: false,
      behaviors: BASE_BEHAVIORS,
    })

    map.addChild(new YMapDefaultFeaturesLayer())
    map.addChild(new YMapDefaultSchemeLayer({
      customization: getSchemeLayerCustomization(),
    }))

    for (const coordinates of markerCoordinates) {
      map.addChild(new YMapMarker({ coordinates }, createMarkerElement()))
    }

    this.bindScrollZoom(mapRoot, map, overlay)
    mapRoot.classList.add('map--ready')
  }

  private parseMarkers(markersValue: string | null, fallback: string) {
    if (!markersValue) {
      const coordinates = parseLatLon(fallback)

      return coordinates ? [coordinates] : []
    }

    try {
      const parsed = JSON.parse(markersValue) as string[]

      return parsed
        .map(value => parseLatLon(value))
        .filter((value): value is number[] => value !== null)
    }
    catch {
      const coordinates = parseLatLon(fallback)

      return coordinates ? [coordinates] : []
    }
  }

  private bindScrollZoom(
    mapRoot: HTMLElement,
    map: YMapInstance,
    overlay: HTMLElement | null,
  ) {
    let isCtrlPressed = false
    let overlayTimeout: ReturnType<typeof setTimeout> | undefined
    let scrollCount = getScrollZoomCount()

    const showOverlay = () => {
      if (
        !overlay
        || scrollCount >= SCROLL_ZOOM_LEARNED_THRESHOLD
        || !window.matchMedia('(any-hover: hover) and (pointer: fine)').matches
      ) {
        return
      }

      overlay.hidden = false
      overlay.classList.add('map__zoom-overlay--active')

      clearTimeout(overlayTimeout)
      overlayTimeout = setTimeout(() => {
        overlay.classList.remove('map__zoom-overlay--active')
      }, 3000)
    }

    const hideOverlay = () => {
      overlay?.classList.remove('map__zoom-overlay--active')
    }

    mapRoot.addEventListener('wheel', (event) => {
      if (event.ctrlKey) {
        if (!isCtrlPressed) {
          isCtrlPressed = true
          map.setBehaviors([...BASE_BEHAVIORS, 'scrollZoom'])
        }

        hideOverlay()

        if (scrollCount < SCROLL_ZOOM_LEARNED_THRESHOLD) {
          scrollCount += 1
          setScrollZoomCount(scrollCount)
        }

        return
      }

      event.stopPropagation()

      if (isCtrlPressed) {
        isCtrlPressed = false
        map.setBehaviors(BASE_BEHAVIORS)
      }

      showOverlay()
    }, { capture: true })

    window.addEventListener('keyup', (event) => {
      if (event.key !== 'Control' || !isCtrlPressed) {
        return
      }

      isCtrlPressed = false
      map.setBehaviors(BASE_BEHAVIORS)
    })
  }
}
