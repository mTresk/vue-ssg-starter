import Contacts from '@/pages/Contacts.vue'
import Home from '@/pages/Home.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      hasDarkHeader: true,
    },
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts,
  },
]
