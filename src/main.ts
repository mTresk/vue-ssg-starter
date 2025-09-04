/* eslint-disable perfectionist/sort-imports */
import '@/styles'
import { ViteSSG } from 'vite-ssg'
import { routes } from '@/routes'
import App from './App.vue'

export const createApp = ViteSSG(App, { routes })
