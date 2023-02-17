import { createRouter, createWebHashHistory } from 'vue-router'
import LaunchScreen from '../screens/LaunchScreen.vue'
import AddKeyboard from '../screens/AddKeyboard.vue'
import KeyboardConfigurator from '../screens/KeyboardConfigurator.vue'
import KmkInstaller from '../components/KmkInstaller.vue'
import SetupWizard from "../screens/SetupWizard.vue";
import LayoutEditor from "../components/LayoutEditor.vue";
import KeymapEditor from "../components/KeymapEditor.vue";
import EncoderSetup from "../components/EncoderSetup.vue";
import MatrixSetup from "../components/MatrixSetup.vue";
import PinSetup from "../components/PinSetup.vue";
import RawKeymapEditor from "../components/RawKeymapEditor.vue";

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
          component: KmkInstaller
        },
        {
          path: 'layout-editor',
          component: LayoutEditor
        },
        {
          path: 'keymap',
          component: KeymapEditor
        },
        {
          path: 'encoder',
          component: EncoderSetup
        },
        {
          path: 'matrix',
          component: MatrixSetup
        },
        {
          path: 'pins',
          component: PinSetup
        },
        {
          path: 'raw-keymap',
          component: RawKeymapEditor
        }
      ]
    }
  ]
})

export default router
