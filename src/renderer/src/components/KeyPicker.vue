<template>
  <div class="tabs tabs-boxed my-4">
    <a class="tab" :class="{ 'tab-active': layout === 'qwerty' }" @click="layout = 'qwerty'"
      >QWERTY</a
    >
    <a class="tab" :class="{ 'tab-active': layout === 'colemak' }" @click="layout = 'colemak'"
      >Colemak</a
    >
    <a class="tab" :class="{ 'tab-active': layout === 'colemak-dh' }" @click="layout = 'colemak-dh'"
      >Colemak DH</a
    >
    <a class="tab" :class="{ 'tab-active': layout === 'dvorak' }" @click="layout = 'dvorak'"
      >Dvorak</a
    >
  </div>
  <div id="keyboard-picker" :style="{ transform: `scale(${scale})` }">
    <Qwerty v-if="layout === 'qwerty'" @key="setKey" />
    <Colemak v-if="layout === 'colemak'" @key="setKey" />
    <ColemakDH v-if="layout === 'colemak-dh'" @key="setKey" />
    <Dvorak v-if="layout === 'dvorak'" @key="setKey" />
  </div>
  <div class="secondary mb-4">
    <div class="tabs tabs-boxed mt-4">
      <a class="tab" :class="{ 'tab-active': category === 'basic' }" @click="category = 'basic'"
        >Basic</a
      >
      <a class="tab" :class="{ 'tab-active': category === 'layers' }" @click="category = 'layers'"
        >Layers</a
      >
      <a class="tab" :class="{ 'tab-active': category === 'kmk' }" @click="category = 'kmk'">KMK</a>
      <a class="tab" :class="{ 'tab-active': category === 'app' }" @click="category = 'app'"
        >App/Media/Mouse</a
      >
      <a class="tab" :class="{ 'tab-active': category === 'rgb' }" @click="category = 'rgb'">RGB</a>
      <a class="tab" :class="{ 'tab-active': category === 'advanced' }" @click="category = 'advanced'"
        >Advanced & Help</a
      >
    </div>
    <div class="key-chooser">
      <div v-if="category === 'basic'" class="bonus">
        <div class="key" @click="setKey('KC.NO')">Empty</div>
        <div class="key" @click="setKey('KC.TRNS')">▽</div>

        <div class="key" @click="setKey('KC.KP_EQUAL')">=</div>
        <div class="key" @click="setKey('KC.KP_COMMA')">,</div>

        <div class="key" @click="setKey('KC.TILDE')">~</div>
        <div class="key" @click="setKey('KC.EXLM')">!</div>
        <div class="key" @click="setKey('KC.AT')">@</div>
        <div class="key" @click="setKey('KC.HASH')">#</div>
        <div class="key" @click="setKey('KC.DOLLAR')">$</div>
        <div class="key" @click="setKey('KC.PERCENT')">%</div>
        <div class="key" @click="setKey('KC.CIRCUMFLEX')">^</div>
        <div class="key" @click="setKey('KC.AMPERSAND')">&</div>
        <div class="key" @click="setKey('KC.ASTERISK')">*</div>
        <div class="key" @click="setKey('KC.LEFT_PAREN')">(</div>
        <div class="key" @click="setKey('KC.RIGHT_PAREN')">)</div>
        <div class="key" @click="setKey('KC.UNDERSCORE')">_</div>
        <div class="key" @click="setKey('KC.PLUS')">+</div>
        <div class="key" @click="setKey('KC.LCBR')">{</div>
        <div class="key" @click="setKey('KC.RCBR')">}</div>
        <div class="key" @click="setKey('KC.LABK')">&lt;</div>
        <div class="key" @click="setKey('KC.RABK')">&gt;</div>
        <div class="key" @click="setKey('KC.COLN')">:</div>
        <div class="key" @click="setKey('KC.PIPE')">|</div>
        <div class="key" @click="setKey('KC.QUES')">?</div>
        <div class="key" @click="setKey('KC.DQT')">"</div>
      </div>
    </div>
    <div v-if="category === 'layers'" class="key-chooser flex">
      <div class="bonus">
        <div class="group">
          <div
            v-for="(_layer, index) in keyboardStore.keymap"
            class="key"
            @click="setKey(`KC.MO(${index})`)"
          >
            MO({{ index }})
          </div>
        </div>
        <!--      <div class="key" @click="setKey('KC.LM()')">LM(l, mod)</div>-->
        <!--      <div class="key" @click="setKey('KC.LT()')">LT(l, kc)</div>-->
        <div class="group">
          <div
            v-for="(_layer, index) in keyboardStore.keymap"
            class="key"
            @click="setKey(`KC.TG(${index})`)"
          >
            TG({{ index }})
          </div>
        </div>
        <div class="group">
          <div
            v-for="(_layer, index) in keyboardStore.keymap"
            class="key"
            @click="setKey(`KC.TO(${index})`)"
          >
            TO({{ index }})
          </div>
        </div>
        <div class="group">
          <div
            v-for="(_layer, index) in keyboardStore.keymap"
            class="key"
            @click="setKey(`KC.TT(${index})`)"
          >
            TT({{ index }})
          </div>
        </div>
        <div class="group">
          <div
            v-for="(_layer, index) in keyboardStore.keymap"
            class="key"
            @click="setKey(`KC.LM(${index},KC.LGUI)`)"
          >
            LM({{ index }}, mod)
          </div>
        </div>
      </div>
      <div class="bonus"></div>
    </div>

    <div v-if="category === 'kmk'" class="key-chooser flex">
      <div class="bonus">
        <div class="key" @click="setKey('KC.RESET')">Reset</div>
        <div class="key" @click="setKey('KC.RELOAD')">Reload</div>
        <div class="key" @click="setKey('KC.BKDL')">BKDL</div>
      </div>
    </div>
    <div v-if="category === 'app'" class="key-chooser flex">
      <div class="bonus">
        <div class="key" @click="setKey('KC.MPLY')">Play Pause</div>
        <div class="key" @click="setKey('KC.MUTE')">Mute</div>
        <div class="key" @click="setKey('KC.VOLU')">Vol ↑</div>
        <div class="key" @click="setKey('KC.VOLD')">Vol ↓</div>
        <div class="key" @click="setKey('KC.MFFD')">next track (OSX)</div>
        <div class="key" @click="setKey('KC.MRWD')">prev track (OSX)</div>

        <div class="key" @click="setKey('KC.MNXT')">next track (win)</div>
        <div class="key" @click="setKey('KC.MPRV')">prev track (win)</div>
        <div class="key" @click="setKey('KC.MSTP')">stop track (win)</div>

        <div class="key" @click="setKey('KC.BRIU')">bright up</div>
        <div class="key" @click="setKey('KC.BRID')">bright down</div>

        <div class="key" @click="setKey('KC.EJCT')">eject (OSX)</div>
      </div>
    </div>
    <div v-if="category === 'rgb'" class="key-chooser flex">
      <div class="bonus">
        <div class="key" @click="setKey('KC.RGB_TOG')">RGB Toggle</div>
        <div class="key" @click="setKey('KC.RGB_HUI')">RGB Hue ↑</div>
        <div class="key" @click="setKey('KC.RGB_HUD')">RGB Hue ↓</div>
        <div class="key" @click="setKey('KC.RGB_SAI')">RGB Sat ↑</div>
        <div class="key" @click="setKey('KC.RGB_SAD')">RGB Sat ↓</div>
        <div class="key" @click="setKey('KC.RGB_VAI')">RGB Val ↑</div>
        <div class="key" @click="setKey('KC.RGB_VAD')">RGB Val ↓</div>
      </div>
    </div>
    <div v-if="category === 'advanced'">
      <p>you can build way more advanced things with custom keys here are some resources, for some you might need to edit the kb.py file or enable a keyboard feature. when testing these check the output of the REPL for errors
      </p>
      <ul>
        <li><a class="text-primary" href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/macros.md">Macros</a> KC.MACRO("send a string")</li>
        <li><a class="text-primary" href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/keycodes.md">Keycodes</a> List of all keys</li>
        <li><a class="text-primary" href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/layers.md">Layers</a> How layers work</li>
        <li><a class="text-primary" href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/combos.md">Combos</a> Multiple keys pressed at simultaneously output a different key</li>
        <li><a class="text-primary" href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/holdtap.md">Holdtap</a> Holding a key down for longer than a certain amount of time outputs a different key</li>
        <li><a class="text-primary" href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/combo_layers.md">Combo Layers</a> pressing 2 layer keys at once opens a different layer</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { keyboardStore } from '../store'
import Qwerty from './picker-layouts/Qwerty.vue'
import Colemak from './picker-layouts/Colemak.vue'
import ColemakDH from './picker-layouts/ColemakDH.vue'
import Dvorak from './picker-layouts/Dvorak.vue'

const layout = ref('qwerty')
const category = ref('basic')
const emit = defineEmits(['setKey'])

// set the currently selected key to keycode
const setKey = (key: string | number) => {
  emit('setKey', String(key))
}
const scale = ref(1)
const scaleKeyboard = () => {
  const wrapper = document.querySelector('#keyboard-picker')
  const keyboard = document.querySelector('#keyboard-picker .key-chooser')
  if (!wrapper || !keyboard) return
  const ww = wrapper.getBoundingClientRect().width
  const wk = keyboard.getBoundingClientRect().width
  scale.value = Math.min(ww / wk, 1)
}
onMounted(() => {
  window.addEventListener('resize', () => scaleKeyboard())
  scaleKeyboard()
})
</script>

<style lang="scss">
:root {
  --key-size: 35px;
}
#keyboard-picker {
  @apply flex flex-wrap justify-center;
  transform-origin: center top;
}
.key-chooser {
  gap: 4px;
  @apply flex flex-col flex-wrap;
  .row {
    @apply flex;
    gap: 4px;
  }
  .bonus {
    margin-top: 20px;
    gap: 4px;
    @apply flex;
    flex-wrap: wrap;
    .key {
      width: calc(var(--key-size) * 1.4);
      height: calc(var(--key-size) * 1.4);
    }
  }
  .group {
    @apply mr-2 flex gap-1;
  }
  .blocker-half {
    width: calc(var(--key-size) / 2);
    height: var(--key-size);
    @apply shrink-0;
  }
  .blocker-full {
    height: var(--key-size);
    width: var(--key-size);
    @apply shrink-0;
  }
  .key {
    width: var(--key-size);
    height: var(--key-size);
    background: #444444;
    @apply flex shrink-0 flex-col items-center justify-center rounded text-center transition-all;
    font-size: 14px;
    line-height: 16px;
    border: 1px solid #555;
    cursor: pointer;
    &.sm {
      font-size: 10px;
    }
    i.mdi {
      font-size: 18px;
    }
    &:hover {
      background: #555;
    }
    &-2u {
      width: calc(var(--key-size) * 2 + 8px);
    }
    &-1-25u {
      width: calc(var(--key-size) * 1.25 + 2px);
    }
    &-1-5u {
      width: calc(var(--key-size) * 1.5 + 4px);
    }
    &-1-75u {
      width: calc(var(--key-size) * 1.75 + 4px);
    }
    &-2-25u {
      width: calc(var(--key-size) * 2.25 + 8px);
    }
    &-2-5u {
      width: calc(var(--key-size) * 2.5 + 8px);
    }
    &-6u {
      width: calc(var(--key-size) * 6.25 + 18px);
    }
  }
}
</style>
