<template>
  <div class="tabs tabs-boxed mb-4">
    <a
      class="tab"
      :class="{ 'tab-active': category === 'basic' }"
      @click="category = 'basic'"
      >Basic</a
    >
    <a
      class="tab"
      :class="{ 'tab-active': category === 'layers' }"
      @click="category = 'layers'"
      >Layers</a
    >
    <a
      class="tab"
      :class="{ 'tab-active': category === 'kmk' }"
      @click="category = 'kmk'"
      >KMK</a
    >
    <a
      class="tab"
      :class="{ 'tab-active': category === 'backlight' }"
      @click="category = 'backlight'"
      >Backlight</a
    >
    <a
      class="tab"
      :class="{ 'tab-active': category === 'app' }"
      @click="category = 'app'"
      >App/Media/Mouse</a
    >
  </div>
  <div class="flex key-chooser" v-if="category === 'basic'">
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
    </div>
    <div class="row">
      <div class="key" @click="setKey('KC.GRV')">
        <span>~</span><span>`</span>
      </div>
      <div class="key" @click="setKey('KC.N1')">
        <span>!</span><span>1</span>
      </div>
      <div class="key" @click="setKey('KC.N2')">
        <span>@</span><span>2</span>
      </div>
      <div class="key" @click="setKey('KC.N3')">
        <span>#</span><span>3</span>
      </div>
      <div class="key" @click="setKey('KC.N4')">
        <span>$</span><span>4</span>
      </div>
      <div class="key" @click="setKey('KC.N5')">
        <span>%</span><span>5</span>
      </div>
      <div class="key" @click="setKey('KC.N6')">
        <span>^</span><span>6</span>
      </div>
      <div class="key" @click="setKey('KC.N7')">
        <span>&</span><span>7</span>
      </div>
      <div class="key" @click="setKey('KC.N8')">
        <span>*</span><span>8</span>
      </div>
      <div class="key" @click="setKey('KC.N9')">
        <span>(</span><span>9</span>
      </div>
      <div class="key" @click="setKey('KC.N0')">
        <span>)</span><span>0</span>
      </div>
      <div class="key" @click="setKey('KC.MINS')">
        <span>_</span><span>-</span>
      </div>
      <div class="key" @click="setKey('KC.EQL')">
        <span>+</span><span>=</span>
      </div>
      <div class="key key-2u" @click="setKey('KC.BSPC')">Bksp</div>
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
      <div class="key" @click="setKey('KC.LBRC')">
        <span>{</span><span>[</span>
      </div>
      <div class="key" @click="setKey('KC.RBRC')">
        <span>}</span><span>]</span>
      </div>
      <div class="key key-1-5u" @click="setKey('KC.BSLS')">
        <span>|</span><span>\</span>
      </div>
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
      <div class="key" @click="setKey('KC.SCLN')">
        <span>:</span><span>;</span>
      </div>
      <div class="key" @click="setKey('KC.QUOT')">
        <span>"</span><span>'</span>
      </div>
      <div class="key key-2-25u" @click="setKey('KC.ENT')">Enter</div>
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
      <div class="key" @click="setKey('KC.COMM')">
        <span>&lt;</span><span>,</span>
      </div>
      <div class="key" @click="setKey('KC.DOT')">
        <span>&gt;</span><span>,</span>
      </div>
      <div class="key" @click="setKey('KC.SLSH')">
        <span>?</span><span>/</span>
      </div>
      <div class="key key-2-5u" @click="setKey('KC.RSFT')">RShift</div>
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
    </div>
    <div class="bonus">
      <div class="key" @click="setKey('KC.NO')">Empty</div>
      <div class="key" @click="setKey('KC.TRNS')">▽</div>
      <div class="key" @click="setKey('KC.NUMLOCK')">Num Lock</div>
      <div class="key" @click="setKey('KC.KP_SLASH')">/</div>
      <div class="key" @click="setKey('KC.KP_ASTERISK')">*</div>
      <div class="key" @click="setKey('KC.KP_MINUS')">-</div>
      <div class="key" @click="setKey('KC.KP_PLUS')">+</div>
      <div class="key" @click="setKey('KC.KP_ENTER')">Num Enter</div>
      <div class="key" @click="setKey('KC.KP_1')">1</div>
      <div class="key" @click="setKey('KC.KP_2')">2</div>
      <div class="key" @click="setKey('KC.KP_3')">3</div>
      <div class="key" @click="setKey('KC.KP_4')">4</div>
      <div class="key" @click="setKey('KC.KP_5')">5</div>
      <div class="key" @click="setKey('KC.KP_6')">6</div>
      <div class="key" @click="setKey('KC.KP_7')">7</div>
      <div class="key" @click="setKey('KC.KP_8')">8</div>
      <div class="key" @click="setKey('KC.KP_9')">9</div>
      <div class="key" @click="setKey('KC.KP_0')">0</div>
      <div class="key" @click="setKey('KC.KP_DOT')">.</div>
      <div class="key" @click="setKey('KC.KP_EQUAL')">=</div>
      <div class="key" @click="setKey('KC.KP_COMMA')">,</div>
      <div class="key" @click="setKey('KC.PSCREEN')">Print Screen</div>
      <div class="key" @click="setKey('KC.SCROLLLOCK')">Scroll Lock</div>
      <div class="key" @click="setKey('KC.PAUSE')">Pause</div>
      <div class="key" @click="setKey('KC.INSERT')">Insert</div>
      <div class="key" @click="setKey('KC.HOME')">Home</div>
      <div class="key" @click="setKey('KC.PGUP')">Page Up</div>
      <div class="key" @click="setKey('KC.DEL')">Del</div>
      <div class="key" @click="setKey('KC.END')">End</div>
      <div class="key" @click="setKey('KC.PGDOWN')">Page Down</div>
      <div class="key" @click="setKey('KC.RIGHT')">Right</div>
      <div class="key" @click="setKey('KC.LEFT')">Left</div>
      <div class="key" @click="setKey('KC.DOWN')">Down</div>
      <div class="key" @click="setKey('KC.UP')">Up</div>
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
  <div class="flex key-chooser" v-if="category === 'layers'">
    <div class="bonus">
      <div class="group">
        <div
          class="key"
          @click="setKey(`KC.MO(${index})`)"
          v-for="(layer, index) in keyboardStore.keymap"
        >
          MO({{ index }})
        </div>
      </div>
      <!--      <div class="key" @click="setKey('KC.LM()')">LM(l, mod)</div>-->
      <!--      <div class="key" @click="setKey('KC.LT()')">LT(l, kc)</div>-->
      <div class="group">
        <div
          class="key"
          @click="setKey(`KC.TG(${index})`)"
          v-for="(layer, index) in keyboardStore.keymap"
        >
          TG({{ index }})
        </div>
      </div>
      <div class="group">
        <div
          class="key"
          @click="setKey(`KC.TO(${index})`)"
          v-for="(layer, index) in keyboardStore.keymap"
        >
          TO({{ index }})
        </div>
      </div>
      <div class="group">
        <div
          class="key"
          @click="setKey(`KC.TT(${index})`)"
          v-for="(layer, index) in keyboardStore.keymap"
        >
          TT({{ index }})
        </div>
      </div>
    </div>
    <div class="bonus">
      <div class="key" @click="setKey(index)" v-for="(layer, index) in keyboardStore.keymap">
        Layer {{ index }}
      </div>
    </div>
  </div>

  <div class="flex key-chooser" v-if="category === 'kmk'">
    <div class="bonus">

      <div class="key" @click="setKey('KC.RESET')">Reset</div>
      <div class="key" @click="setKey('KC.RELOAD')">Reload</div>
      <div class="key" @click="setKey('KC.DEBUG')">Debug</div>
      <div class="key" @click="setKey('KC.BKDL')">BKDL</div>
    </div>
  </div>
  <div class="flex key-chooser" v-if="category === 'app'">
    <div class="bonus">
      <div class="key" @click="setKey('KC.MPLY')">Play/Pause</div>
      <div class="key" @click="setKey('KC.MUTE')">Mute</div>
      <div class="key" @click="setKey('KC.VOLD')">Volume Down</div>
      <div class="key" @click="setKey('KC.VOLU')">Volume Up</div>
      <div class="key" @click="setKey('KC.MFFD')">next track (OSX)</div>
      <div class="key" @click="setKey('KC.MRWD')">prev track (OSX)</div>

      <div class="key" @click="setKey('KC.MNXT')">next track (windows)</div>
      <div class="key" @click="setKey('KC.MPRV')">prev track (windows)</div>
      <div class="key" @click="setKey('KC.MSTP')">stop track (windows)</div>

      <div class="key" @click="setKey('KC.BRIU')">brightness up</div>
      <div class="key" @click="setKey('KC.BRID')">brightness down</div>

      <div class="key" @click="setKey('KC.EJCT')">eject (OSX)</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { keyboardStore } from "../store";

const category = ref("basic");
const emit = defineEmits(["setKey"]);

// set the currently selected key to keycode
const setKey = (key: string | number) => {
  emit("setKey", String(key));
};
</script>

<style lang="scss" scoped>
.key-chooser {
  gap: 4px;
  @apply flex flex-col;
  .row {
    @apply flex justify-center w-full;
    gap: 4px;
  }
  .bonus {
    margin-top: 20px;
    gap: 4px;
    @apply flex;
    flex-wrap: wrap;
  }
  .group {
    @apply flex gap-1 mr-2;
  }
  .blocker-half {
    width: 25px;
    height: 54px;
    @apply shrink-0;
  }
  .blocker-full {
    height: 54px;
    width: 54px;
    @apply shrink-0;
  }
  .key {
    width: 54px;
    height: 54px;
    background: #444444;
    @apply rounded flex items-center justify-center shrink-0 flex-col text-center;
    font-size: 12px;
    border: 1px solid #555;
    cursor: pointer;
    &:hover {
      background: #555;
    }
    &-2u {
      width: calc(54px * 2 + 4px);
    }
    &-1-25u {
      width: calc(54px * 1.25 + 2px);
    }
    &-1-5u {
      width: calc(54px * 1.5 + 2px);
    }
    &-1-75u {
      width: calc(54px * 1.75 + 2px);
    }
    &-2-25u {
      width: calc(54px * 2.25 + 6px);
    }
    &-2-5u {
      width: calc(54px * 2.5 + 6px);
    }
    &-6u {
      width: calc(54px * 6.25 + 14px);
    }
  }
}
</style>
