<template>
  <div>
    <div
      v-for="(encoder, eindex) in keyboardStore.encoders"
      class="my-2 grid gap-4 bg-base-300 p-4"
    >
      <div class="flex justify-between gap-4">
        <p class="text-lg font-bold">Encoder {{ eindex }}</p>
        <button class="btn btn-error btn-xs" @click="removeEncoder(eindex)">
          <i class="mdi mdi-delete"></i> remove encoder
        </button>
      </div>
      <p>Prefix: {{ keyboardStore.pinPrefix }} - {{ pinPrefixHint }}</p>
      <div class="mb-2 flex items-center gap-4">
        <label>Pad A</label>
        <input
          v-model="encoder.pad_a"
          type="text"
          class="input input-bordered input-sm"
          placeholder="14"
        />
      </div>
      <div class="flex items-center gap-4">
        <label>Pad B</label>
        <input
          v-model="encoder.pad_b"
          type="text"
          class="input input-bordered input-sm"
          placeholder="14"
        />
      </div>
      <div>
        Keymap
        <EncoderLayer
          v-for="(_layer, lindex) in keyboardStore.keymap"
          :lindex="lindex"
          :eindex="eindex"
        ></EncoderLayer>
      </div>
    </div>
    <div class="btn btn-primary btn-sm mt-2" @click="addEncoder">
      <i class="mdi mdi-plus"></i>add Encoder
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore, pinPrefixHint } from '../store'
import EncoderLayer from './EncoderLayer.vue'

const cleanEncoders = () => {
  if (keyboardStore.encoderKeymap.length !== keyboardStore.keymap.length) {
    // add or remove encoder layers to match the keymap layer count
    while (keyboardStore.encoderKeymap.length <= keyboardStore.keymap.length) {
      // add an empty layer
      keyboardStore.encoderKeymap.push([
        // selectedConfig.value.encoders.map((a) => ["KC.TRNS", "KC.TRNS"]),
      ])
    }
    while (keyboardStore.encoderKeymap.length > keyboardStore.keymap.length) {
      // remove a layer
      keyboardStore.encoderKeymap.pop()
    }
  }
}
cleanEncoders()
const addEncoder = () => {
  const encoder = { pad_a: '', pad_b: '' }
  // TODO: initialize encoder keymap according to layers and encoders
  // check the amount of layers
  // add one encoder to each layer (push)
  // cleanEncoders();

  keyboardStore.encoderKeymap.forEach((layer) => {
    layer.push(['KC.TRNS', 'KC.TRNS'])
  })
  keyboardStore.encoders.push(encoder)
}

const removeEncoder = (index: number) => {
  // remove the encoder

  // cleanEncoders();
  keyboardStore.encoders = keyboardStore.encoders.filter((_e, eindex) => {
    return eindex !== index
  })
  // remove that index from each keymap layer
  keyboardStore.encoderKeymap.forEach((layer, lindex) => {
    keyboardStore.encoderKeymap[lindex] = layer.filter((_l, eindex) => eindex !== index)
  })
}
</script>

<style lang="scss" scoped></style>
