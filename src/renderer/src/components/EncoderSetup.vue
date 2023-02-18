<template>
  <div>
    <p>Encoder setup is currently WIP</p>
    <div
      v-for="(encoder, eindex) in keyboardStore.encoders"
      class="my-2 p-4 bg-base-300 grid gap-4"
    >
      <div class="flex gap-4 justify-between">
        <p>Encoder {{ eindex }}</p>
        <button class="btn btn-xs btn-error" @click="removeEncoder(eindex)">
          remove encoder
        </button>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label>Pad A</label>
        <input
          type="text"
          class="input input-bordered"
          v-model="encoder.pad_a"
          placeholder="14"
        />
      </div>
      <div class="flex items-center gap-4">
        <label>Pad B</label>
        <input
          type="text"
          class="input input-bordered"
          v-model="encoder.pad_b"
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
    <div class="btn btn-sm btn-primary mt-2" @click="addEncoder">
      add Encoder
    </div>
  </div>
</template>

<script lang="ts" setup>
import {keyboardStore} from "../store";
import EncoderLayer from "./EncoderLayer.vue";

const cleanEncoders = () => {
  if (
    keyboardStore.encoderKeymap.length !==
    keyboardStore.keymap.length
  ) {
    // add or remove encoder layers to match the keymap layer count
    while (
      keyboardStore.encoderKeymap.length <=
      keyboardStore.keymap.length
    ) {
      // add an empty layer
      keyboardStore.encoderKeymap.push([
        // selectedConfig.value.encoders.map((a) => ["KC.TRNS", "KC.TRNS"]),
      ]);
    }
    while (
      keyboardStore.encoderKeymap.length >
      keyboardStore.keymap.length
    ) {
      // remove a layer
      keyboardStore.encoderKeymap.pop();
    }
  }
};
cleanEncoders()
const addEncoder = () => {
  let encoder = { pad_a: "", pad_b: "" };
  // TODO: initialize encoder keymap according to layers and encoders
  // check the amount of layers
  // add one encoder to each layer (push)
  // cleanEncoders();

  keyboardStore.encoderKeymap.forEach((layer) => {
    layer.push(["KC.TRNS", "KC.TRNS"]);
  });
  keyboardStore.encoders.push(encoder);
};

const removeEncoder = (index: number) => {
  // remove the encoder

  // cleanEncoders();
  keyboardStore.encoders = keyboardStore.encoders.filter(
    (_e, eindex) => {
      return eindex !== index;
    }
  );
  // remove that index from each keymap layer
  keyboardStore.encoderKeymap.forEach((layer, lindex) => {
    keyboardStore.encoderKeymap[lindex] = layer.filter(
      (_l, eindex) => eindex !== index
    );
  });
};
</script>

<style lang="scss" scoped></style>
