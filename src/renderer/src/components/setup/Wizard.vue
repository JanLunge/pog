<template>
  <div>
    <p>
      Before you start please check that your controller is using circuit python, if not please
      download the matching firmware and drag it on the usb drive that appears when you enter its
      bootloader mode
    </p>
    <p>
      when you see the circuit python usb drive it is a good time to rename the drive to reflect
      your keyboard name
    </p>
    <p>
      With this done please select the drive so POG can start to flash the firmware, you will be
      able to configure everything after the flashing is done
    </p>
    <button class="btn btn-primary" @click="flashFirmwareToDrive">Select Drive</button>
  </div>
  <div>
    <p>now unplug the keyboard and plug it back in to boot up the pog code</p>
    loading
  </div>
  <div>
    <input type="text" placeholder="name" />
    <MatrixSetup :initial-setup="true" />
    define here how the pins are used
  </div>
  <div v-if="false">
    <p>info prepare controller with circuit python</p>
    <p>plugin controller and select the usb drive</p>
    <p>flash kmk on drive + add pog files and an id in the pog.json</p>
    <p>unplug and replug keyboard to boot pog</p>
    <p>
      listen for serial ports with pog manufacturer then grab its info and compare with created id
    </p>
    <p>open both connections to repl and data for debugging</p>

    <p>name + matrix size + pins[rows,cols,directpins,rgb,encoders] (loadable from qr or link)</p>
    <p>coordmap press each key</p>
    <p>use generated layout or modify (or was loaded from link/qr)</p>
  </div>
</template>

<script lang="ts" setup>
import MatrixSetup from '../MatrixSetup.vue'

const flashFirmwareToDrive = () => {
  console.log('select drive and flash kmk firmware + pog files + id ')
}
</script>

<style lang="scss" scoped></style>
