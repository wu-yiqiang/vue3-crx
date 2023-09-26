import pkg from '../package.json'

const manifest: chrome.runtime.Manifest = {
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  host_permissions: ['*://*/*'],
//  icons: {
//    "16" : "/assets/logo.png",
//    "48" : "/assets/logo.png",
//    "128" : "/assets/logo.png"
//  },
  background: {
    service_worker: 'src/entries/background/main.ts',
  },
  action: {
    default_popup: 'src/entries/popup/index.html',
//    default_icon: {
//      "16" : "/assets/logo.png",
//      "48" : "/assets/logo.png",
//      "128" : "/assets/logo.png"
//    }
  },
  options_ui: {
    page: 'src/entries/options/index.html',
    open_in_tab: false,
  },
}

export default manifest
