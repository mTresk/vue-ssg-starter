const mapRoot = document.querySelector<HTMLElement>('[data-map]')

function loadYMaps() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`
    script.onload = () => {
    // @ts-expect-error - ymaps3
      resolve(window.ymaps3)
    }
    script.onerror = () => reject(new Error('Failed to load Yandex Maps API'))
    document.body.appendChild(script)
  })
}

async function initMap() {
  if (!mapRoot) {
    return
  }
  const ymaps3: any = await loadYMaps()
  await ymaps3.ready
  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3
  const coordinates = mapRoot!.getAttribute('data-map')
  const center = coordinates!.split(',').reverse()

  const layer = new YMapDefaultSchemeLayer({
    customization: [
      {
        tags: {
          any: ['road'],
        },
        elements: 'geometry',
        stylers: [
          {
            color: '#4E4E4E',
          },
        ],
      },
      {
        tags: {
          any: ['water'],
        },
        elements: 'geometry',
        stylers: [
          {
            color: '#000000',
          },
        ],
      },
      {
        tags: {
          any: ['landscape', 'admin', 'land', 'transit'],
        },
        elements: 'geometry',
        stylers: [
          {
            color: '#212121',
          },
        ],
      },
      {
        tags: {
          any: ['building'],
        },
        elements: 'geometry',
        stylers: [
          {
            color: '#757474',
          },
        ],
      },
    ],
  })

  const map = new YMap(mapRoot, {
    location: {
      center,
      zoom: 17,
    },
    showScaleInCopyrights: false,
  })

  const markerElement = document.createElement('img')
  markerElement.className = 'icon-marker'
  markerElement.src = '/images/pin.svg'
  const marker = new YMapMarker({ coordinates: center }, markerElement)

  map.addChild(new YMapDefaultFeaturesLayer())
  map.addChild(layer)
  map.addChild(marker)
  map.setBehaviors(['drag', 'pinchZoom', 'mouseRotate', 'mouseTilt'])
}

document.addEventListener('DOMContentLoaded', () => {
  initMap()
})
