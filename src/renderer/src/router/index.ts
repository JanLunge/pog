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
import Community from "../components/Community.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
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
      path: '/setup-wizard',
      name: 'Setup Wizard',
      component: SetupWizard
    },
    {
      path: '/configurator',
      name: 'Configurator',
      component: KeyboardConfigurator,
      children: [
        {
          path: '',
          redirect: '/configurator/keymap'
        },
        {
          path: 'firmware',
          component: KmkInstaller,
          name: 'Firmware'
        },
        {
          path: 'layout-editor',
          component: LayoutEditor,
          name: 'Layout Editor'
        },
        {
          path: 'keymap',
          component: KeymapEditor,
          name: 'Keymap Editor'
        },
        {
          path: 'encoder',
          component: EncoderSetup,
          name: 'Rotary Encoders'
        },
        {
          path: 'matrix',
          component: MatrixSetup,
          name: 'Matrix Setup'
        },
        {
          path: 'pins',
          component: PinSetup,
          name: 'Pin Setup'
        },
        {
          path: 'raw-keymap',
          component: RawKeymapEditor,
          name: 'Raw Keymap'
        },
        {
          path: 'info',
          component: KeyboardName,
          name: 'info'
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
        }
      ]
    }
  ]
})

export default router
