import ResponsiveAdapter from '@/utils/libs/ResponsiveAdapter'
import Gallery from '@/utils/libs/Gallery'
import Parallax from '@/utils/libs/Parallax'
import Popup from '@/utils/libs/Popup'
import ScrollWatcher from '@/utils/libs/ScrollWatcher'
import ShowMore from '@/utils/libs/ShowMore'
import Spoilers from '@/utils/libs/Spoilers'
import Tabs from '@/utils/libs/Tabs'
import Scroll from '@/utils/libs/Scroll'
import Menu from '@/utils/libs/Menu'
import Quantity from '@/utils/libs/Quantity'
import Map from '@/utils/libs/Map'
import Accordion from '@/utils/libs/Accordion'

// import '@/utils/script'
// import '@/utils/forms/datepicker'
// import '@/utils/forms/range'
// import '@/utils/forms/inputmask'
// import '@/utils/forms/select'
// import '@/utils/base/agreement'
// import '@/utils/base/sliders'
// import '@/utils/base/scrollbar'
// import '@/utils/base/tippy'

export function initializeApp() {
  // new Accordion()
  // new Gallery()
  // new Map()
  // new Menu()
  // new Parallax({})
  // new Popup()
  // new ResponsiveAdapter('max')
  // new ScrollWatcher({})
  // new ShowMore()
  // new Spoilers()
  // new Tabs()
  // new Quantity()
  // const scroll = new Scroll()

  // scroll.pageNavigation()
  // scroll.scrollDirection()

  if (import.meta.env.MODE === 'development') {
    window.logger = true
  }
}
