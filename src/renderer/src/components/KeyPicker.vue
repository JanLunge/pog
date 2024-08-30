<template>
  <div id="keyboard-picker" :style="{ transform: `scale(${scale})` }">
    <div class="key-chooser flex">
      <div class="row">
        <div class="key" @click="setKey('KC.ESC')">ESC</div>
        <div class="blocker-full"></div>
        <div class="key" @click="setKey('KC.F1')">F1</div>
        <div class="key" @click="setKey('KC.F2')">F2</div>
        <div class="key" @click="setKey('KC.F3')">F3</div>
        <div class="key" @click="setKey('KC.F4')">F4</div>
        <div class="blocker-half"></div>
        <div class="key" @click="setKey('KC.F5')">F5</div>
        <div class="key" @click="setKey('KC.F6')">F6</div>
        <div class="key" @click="setKey('KC.F7')">F7</div>
        <div class="key" @click="setKey('KC.F8')">F8</div>
        <div class="blocker-half"></div>
        <div class="key" @click="setKey('KC.F9')">F9</div>
        <div class="key" @click="setKey('KC.F10')">F10</div>
        <div class="key" @click="setKey('KC.F11')">F11</div>
        <div class="key" @click="setKey('KC.F12')">F12</div>
        <div class="blocker-half"></div>
        <div class="key sm" @click="setKey('KC.PSCREEN')">Print Screen</div>
        <div class="key sm" @click="setKey('KC.SCROLLLOCK')">Scroll Lock</div>
        <div class="key sm" @click="setKey('KC.PAUSE')">Pause</div>
        <div class="blocker-half"></div>
        <div class="blocker-full"></div>
        <div class="blocker-full"></div>
        <div class="blocker-full"></div>
        <div class="blocker-full"></div>
      </div>
      <div class="row">
        <div class="key" @click="setKey('KC.GRV')"><span>~</span><span>`</span></div>
        <div class="key" @click="setKey('KC.N1')"><span>!</span><span>1</span></div>
        <div class="key" @click="setKey('KC.N2')"><span>@</span><span>2</span></div>
        <div class="key" @click="setKey('KC.N3')"><span>#</span><span>3</span></div>
        <div class="key" @click="setKey('KC.N4')"><span>$</span><span>4</span></div>
        <div class="key" @click="setKey('KC.N5')"><span>%</span><span>5</span></div>
        <div class="key" @click="setKey('KC.N6')"><span>^</span><span>6</span></div>
        <div class="key" @click="setKey('KC.N7')"><span>&</span><span>7</span></div>
        <div class="key" @click="setKey('KC.N8')"><span>*</span><span>8</span></div>
        <div class="key" @click="setKey('KC.N9')"><span>(</span><span>9</span></div>
        <div class="key" @click="setKey('KC.N0')"><span>)</span><span>0</span></div>
        <div class="key" @click="setKey('KC.MINS')"><span>_</span><span>-</span></div>
        <div class="key" @click="setKey('KC.EQL')"><span>+</span><span>=</span></div>
        <div class="key key-2u" @click="setKey('KC.BSPC')">Bksp</div>
        <div class="blocker-half"></div>
        <div class="key sm" @click="setKey('KC.INSERT')">Insert</div>
        <div class="key sm" @click="setKey('KC.HOME')">Home</div>
        <div class="key sm" @click="setKey('KC.PGUP')">Page Up</div>
        <div class="blocker-half"></div>
        <div class="key sm" @click="setKey('KC.NUMLOCK')">Num Lock</div>
        <div class="key" @click="setKey('KC.KP_SLASH')">/</div>
        <div class="key" @click="setKey('KC.KP_ASTERISK')">*</div>
        <div class="key" @click="setKey('KC.KP_MINUS')">-</div>
      </div>
      <div class="row">
        <div class="key key-1-5u" @click="setKey('KC.TAB')">Tab</div>
        <div class="key" @click="setKey('KC.Q')">Q</div>
        <div class="key" @click="setKey('KC.W')">W</div>
        <div class="key" @click="setKey('KC.E')">E</div>
        <div class="key" @click="setKey('KC.R')">R</div>
        <div class="key" @click="setKey('KC.T')">T</div>
        <div class="key" @click="setKey('KC.Y')">Y</div>
        <div class="key" @click="setKey('KC.U')">U</div>
        <div class="key" @click="setKey('KC.I')">I</div>
        <div class="key" @click="setKey('KC.O')">O</div>
        <div class="key" @click="setKey('KC.P')">P</div>
        <div class="key" @click="setKey('KC.LBRC')"><span>{</span><span>[</span></div>
        <div class="key" @click="setKey('KC.RBRC')"><span>}</span><span>]</span></div>
        <div class="key key-1-5u" @click="setKey('KC.BSLS')"><span>|</span><span>\</span></div>
        <div class="blocker-half"></div>
        <div class="key" @click="setKey('KC.DEL')">Del</div>
        <div class="key" @click="setKey('KC.END')">End</div>
        <div class="key sm" @click="setKey('KC.PGDOWN')">Page Down</div>
        <div class="blocker-half"></div>
        <div class="key" @click="setKey('KC.KP_7')">7</div>
        <div class="key" @click="setKey('KC.KP_8')">8</div>
        <div class="key" @click="setKey('KC.KP_9')">9</div>
        <div class="key" @click="setKey('KC.KP_PLUS')">+</div>
      </div>
      <div class="row">
        <div class="key key-1-75u" @click="setKey('KC.CAPS')">Caps Lock</div>
        <div class="key" @click="setKey('KC.A')">A</div>
        <div class="key" @click="setKey('KC.S')">S</div>
        <div class="key" @click="setKey('KC.D')">D</div>
        <div class="key" @click="setKey('KC.F')">F</div>
        <div class="key" @click="setKey('KC.G')">G</div>
        <div class="key" @click="setKey('KC.H')">H</div>
        <div class="key" @click="setKey('KC.J')">J</div>
        <div class="key" @click="setKey('KC.K')">K</div>
        <div class="key" @click="setKey('KC.L')">L</div>
        <div class="key" @click="setKey('KC.SCLN')"><span>:</span><span>;</span></div>
        <div class="key" @click="setKey('KC.QUOT')"><span>"</span><span>'</span></div>
        <div class="key key-2-25u" @click="setKey('KC.ENT')">Enter</div>

        <div class="blocker-half"></div>
        <div class="blocker-full"></div>
        <div class="blocker-full"></div>
        <div class="blocker-full"></div>
        <div class="blocker-half"></div>

        <div class="key" @click="setKey('KC.KP_4')">4</div>
        <div class="key" @click="setKey('KC.KP_5')">5</div>
        <div class="key" @click="setKey('KC.KP_6')">6</div>
        <div class="key" @click="setKey('KC.KP_PLUS')">+</div>
      </div>
      <div class="row">
        <div class="key key-2-5u" @click="setKey('KC.LSFT')">LShift</div>
        <div class="key" @click="setKey('KC.Z')">Z</div>
        <div class="key" @click="setKey('KC.X')">X</div>
        <div class="key" @click="setKey('KC.C')">C</div>
        <div class="key" @click="setKey('KC.V')">V</div>
        <div class="key" @click="setKey('KC.B')">B</div>
        <div class="key" @click="setKey('KC.N')">N</div>
        <div class="key" @click="setKey('KC.M')">M</div>
        <div class="key" @click="setKey('KC.COMM')"><span>&lt;</span><span>,</span></div>
        <div class="key" @click="setKey('KC.DOT')"><span>&gt;</span><span>,</span></div>
        <div class="key" @click="setKey('KC.SLSH')"><span>?</span><span>/</span></div>
        <div class="key key-2-5u" @click="setKey('KC.RSFT')">RShift</div>
        <div class="blocker-half"></div>
        <div class="blocker-full"></div>
        <div class="key" @click="setKey('KC.UP')"><i class="mdi mdi-arrow-up"></i></div>
        <div class="blocker-full"></div>
        <div class="blocker-half"></div>
        <div class="key" @click="setKey('KC.KP_1')">1</div>
        <div class="key" @click="setKey('KC.KP_2')">2</div>
        <div class="key" @click="setKey('KC.KP_3')">3</div>
        <div class="key sm" @click="setKey('KC.KP_ENTER')">Num Enter</div>
      </div>
      <div class="row">
        <div class="key key-1-25u" @click="setKey('KC.LCTL')">LCtrl</div>
        <div class="key key-1-25u" @click="setKey('KC.LGUI')">LGui</div>
        <div class="key key-1-25u" @click="setKey('KC.LALT')">LAlt</div>

        <div class="key key-6u" @click="setKey('KC.SPC')">Space</div>

        <div class="key key-1-25u" @click="setKey('KC.RALT')">RAlt</div>
        <div class="key key-1-25u" @click="setKey('KC.RGUI')">RGui</div>
        <div class="key key-1-25u" @click="setKey('KC.APP')">Menu</div>
        <div class="key key-1-25u" @click="setKey('KC.RCTL')">RCTL</div>
        <div class="blocker-half"></div>
        <div class="key" @click="setKey('KC.LEFT')"><i class="mdi mdi-arrow-left"></i></div>
        <div class="key" @click="setKey('KC.DOWN')"><i class="mdi mdi-arrow-down"></i></div>
        <div class="key" @click="setKey('KC.RIGHT')"><i class="mdi mdi-arrow-right"></i></div>
        <div class="blocker-half"></div>
        <div class="key" @click="setKey('KC.KP_0')">0</div>
        <div class="key" @click="setKey('KC.KP_0')">0</div>
        <div class="key" @click="setKey('KC.KP_DOT')">.</div>
        <div class="key sm" @click="setKey('KC.KP_ENTER')">Num Enter</div>
      </div>
    </div>
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
        <div class="key" @click="setKey('KC.DEBUG')">Debug</div>
        <div class="key" @click="setKey('KC.BKDL')">BKDL</div>
      </div>
    </div>
    <div v-if="category === 'app'" class="key-chooser flex">
      <div class="bonus">
        <div class="key" @click="setKey('KC.MPLY')">Play Pause</div>
        <div class="key" @click="setKey('KC.MUTE')">Mute</div>
        <div class="key" @click="setKey('KC.VOLD')">Vol Down</div>
        <div class="key" @click="setKey('KC.VOLU')">Vol Up</div>
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
        <div class="key" @click="setKey('KC.RGB_HUI')">RGB Hue increase</div>
        <div class="key" @click="setKey('KC.RGB_HUD')">RGB Hue decrease</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { keyboardStore } from '../store'

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
