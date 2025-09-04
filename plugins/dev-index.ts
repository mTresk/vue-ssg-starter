import type { Plugin } from 'vite'

export default function devIndex(): Plugin {
  return {
    name: 'dev-index',
    configureServer(server) {
      server.middlewares.use('/', (req, res, next) => {
        if (req.url === '/' || req.url === '/index.html' || (req.url?.startsWith('/') && !req.url.includes('.') && !req.url.startsWith('/@'))) {
          req.url = '/index-dev.html'
        }
        next()
      })
    },
  }
}
