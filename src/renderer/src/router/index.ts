import { createRouter, createWebHashHistory } from 'vue-router'
import LaunchScreen from '../screens/LaunchScreen.vue'
import AddKeyboard from '../screens/AddKeyboard.vue'
import KeyboardConfigurator from '../screens/KeyboardConfigurator.vue'
import KmkInstaller from '../components/KmkInstaller.vue'
import SetupWizard from "../screens/SetupWizard.vue";

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
          path: 'firmware',
          component: KmkInstaller
        }
      ]
    }
  ]
})

export default router
