<script setup lang="ts">
interface MapMarker {
  coordinates: string
}

interface IProps {
  coordinates?: string
  center?: string
  zoom?: number | string
  markers?: MapMarker[]
  showZoomOverlay?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  coordinates: undefined,
  center: undefined,
  zoom: 17,
  markers: () => [],
  showZoomOverlay: true,
})

const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY

const centerValue = computed(() => {
  return props.center || props.coordinates || props.markers[0]?.coordinates
})

const markersValue = computed(() => {
  if (props.markers.length > 0) {
    return props.markers.map(marker => marker.coordinates)
  }

  if (props.coordinates) {
    return [props.coordinates]
  }

  return []
})

const markersJson = computed(() => JSON.stringify(markersValue.value))
</script>

<template>
  <div
    class="map"
    :data-map="coordinates"
    :data-map-center="centerValue"
    :data-map-zoom="zoom"
    :data-map-markers="markersJson"
    :data-map-key="apiKey"
  >
    <div
      class="map__canvas"
      data-map-canvas
    />
    <div
      v-if="showZoomOverlay"
      class="map__zoom-overlay"
      data-map-zoom-overlay
      hidden
    >
      Чтобы изменить масштаб, прокручивайте карту удерживая клавишу CTRL
    </div>
  </div>
</template>

<style lang="scss">
.map {
  position: relative;
  z-index: 0;
  height: rem(600);
  overflow: hidden;
  background-color: #212121;
  isolation: isolate;

  &--ready {
    background-color: transparent;
  }

  &__canvas {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  &__marker {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
    transform: translate(-50%, -100%);

    svg {
      width: rem(40);
      height: rem(40);
    }
  }

  &__zoom-overlay {
    position: absolute;
    inset: auto 0 0;
    z-index: 10;
    width: 100%;
    padding: rem(16);
    font-size: rem(14);
    line-height: 1.4;
    color: var(--color-white);
    text-align: center;
    pointer-events: none;
    background: linear-gradient(transparent, rgb(0 0 0 / 75%));
    opacity: 0;
    transition: opacity 0.3s ease;

    &--active {
      opacity: 1;
    }
  }
}
</style>
