import { createRouter, createWebHashHistory } from 'vue-router'
import LaunchScreen from '../screens/LaunchScreen.vue'
import AddKeyboard from '../screens/AddKeyboard.vue'
import KeyboardConfigurator from '../screens/KeyboardConfigurator.vue'
import KmkInstaller from '../components/KmkInstaller.vue'
import SetupWizard from '../screens/SetupWizard.vue'
import LayoutEditor from '../components/LayoutEditor.vue'
import KeymapEditor from '../components/KeymapEditor.vue'
import EncoderSetup from '../components/EncoderSetup.vue'
import MatrixSetup from '../components/MatrixSetup.vue'
import PinSetup from '../components/PinSetup.vue'
import RawKeymapEditor from '../components/RawKeymapEditor.vue'
import KeyboardName from '../components/KeyboardName.vue'
import CoordMap from '../components/CoordMap.vue'
import RgbSetup from '../components/RgbSetup.vue'
import Community from '../components/Community.vue'
// import Debug from '../components/debug.vue'

import KeyboardSelector from '../screens/KeyboardSelector.vue'
import CircuitPythonSetup from '../components/CircuitPythonSetup.vue'
import SetupMethodSelector from '../components/SetupMethodSelector.vue'
import AutomaticSetup from '../components/AutomaticSetup.vue'
// import KeyboardSetup from '../screens/KeyboardSetup.vue'
import InstallPogFirmware from '../components/installPogFirmware.vue'

const routes = [
  {
    path: '/',
    name: 'Launch',
    component: LaunchScreen
  },
  {
    path: '/add-keyboard',
    name: 'Add Keyboard',
    component: AddKeyboard
  },
  {
    // manual setup
    path: '/setup-wizard',
    name: 'Setup Wizard',
    component: SetupWizard
  },
  {
    path: '/keyboard-selector',
    name: 'Keyboard Selector',
    component: KeyboardSelector
  },
  {
    path: '/automatic-setup',
    name: 'Automatic Setup',
    children: [
      {
        path: 'circuit-python',
        name: 'CircuitPython Setup',
        component: CircuitPythonSetup
      },
      {
        path: 'method',
        name: 'Setup Method',
        component: SetupMethodSelector
      },
      {
        path: 'mapping',
        name: 'Automatic Setup',
        component: AutomaticSetup
      },
      {
        path: 'firmware',
        name: 'Pog Firmware',
        component: InstallPogFirmware
      }
    ]
  },
  {
    path: '/configurator',
    name: 'Configurator',
    component: KeyboardConfigurator,
    children: [
      {
        path: 'keymap',
        name: 'Keymap',
        component: KeymapEditor
      },
      {
        path: 'layout-editor',
        name: 'Layout Editor',
        component: LayoutEditor
      },
      {
        path: 'encoder',
        name: 'Encoder',
        component: EncoderSetup
      },
      {
        path: 'info',
        name: 'Info',
        component: KeyboardName
      },
      {
        path: 'matrix',
        name: 'Matrix',
        component: MatrixSetup
      },
      {
        path: 'pins',
        name: 'Pins',
        component: PinSetup
      },
      {
        path: 'coordmap',
        name: 'CoordMap',
        component: CoordMap
      },
      {
        path: 'raw-keymap',
        name: 'Raw Keymap',
        component: RawKeymapEditor
      },
      {
        path: 'firmware',
        name: 'Firmware',
        component: KmkInstaller
      },
      {
        path: 'coordmap',
        component: CoordMap,
        name: 'CoordMap'
      },
      {
        path: 'community',
        component: Community,
        name: 'Community'
      },
      {
        path: 'rgb',
        name: 'RGB',
        component: RgbSetup
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
