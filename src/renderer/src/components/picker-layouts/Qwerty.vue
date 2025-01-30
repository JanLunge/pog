<template>
  <div class="key-chooser flex">
    <div class="row">
      <div class="key" @click="emit('key', 'KC.ESC')">ESC</div>
      <div class="blocker-full"></div>
      <div class="key" @click="emit('key', 'KC.F1')">F1</div>
      <div class="key" @click="emit('key', 'KC.F2')">F2</div>
      <div class="key" @click="emit('key', 'KC.F3')">F3</div>
      <div class="key" @click="emit('key', 'KC.F4')">F4</div>
      <div class="blocker-half"></div>
      <div class="key" @click="emit('key', 'KC.F5')">F5</div>
      <div class="key" @click="emit('key', 'KC.F6')">F6</div>
      <div class="key" @click="emit('key', 'KC.F7')">F7</div>
      <div class="key" @click="emit('key', 'KC.F8')">F8</div>
      <div class="blocker-half"></div>
      <div class="key" @click="emit('key', 'KC.F9')">F9</div>
      <div class="key" @click="emit('key', 'KC.F10')">F10</div>
      <div class="key" @click="emit('key', 'KC.F11')">F11</div>
      <div class="key" @click="emit('key', 'KC.F12')">F12</div>
      <div class="blocker-half"></div>
      <div class="key sm" @click="emit('key', 'KC.PSCREEN')">Print Screen</div>
      <div class="key sm" @click="emit('key', 'KC.SCROLLLOCK')">Scroll Lock</div>
      <div class="key sm" @click="emit('key', 'KC.PAUSE')">Pause</div>
      <div class="blocker-half"></div>
      <div class="blocker-full"></div>
      <div class="blocker-full"></div>
      <div class="blocker-full"></div>
      <div class="blocker-full"></div>
    </div>
    <div class="row">
      <div class="key" @click="emit('key', 'KC.GRV')"><span>~</span><span>`</span></div>
      <div class="key" @click="emit('key', 'KC.N1')"><span>!</span><span>1</span></div>
      <div class="key" @click="emit('key', 'KC.N2')"><span>@</span><span>2</span></div>
      <div class="key" @click="emit('key', 'KC.N3')"><span>#</span><span>3</span></div>
      <div class="key" @click="emit('key', 'KC.N4')"><span>$</span><span>4</span></div>
      <div class="key" @click="emit('key', 'KC.N5')"><span>%</span><span>5</span></div>
      <div class="key" @click="emit('key', 'KC.N6')"><span>^</span><span>6</span></div>
      <div class="key" @click="emit('key', 'KC.N7')"><span>&</span><span>7</span></div>
      <div class="key" @click="emit('key', 'KC.N8')"><span>*</span><span>8</span></div>
      <div class="key" @click="emit('key', 'KC.N9')"><span>(</span><span>9</span></div>
      <div class="key" @click="emit('key', 'KC.N0')"><span>)</span><span>0</span></div>
      <div class="key" @click="emit('key', 'KC.MINS')"><span>_</span><span>-</span></div>
      <div class="key" @click="emit('key', 'KC.EQL')"><span>+</span><span>=</span></div>
      <div class="key key-2u" @click="emit('key', 'KC.BSPC')">Bksp</div>
      <div class="blocker-half"></div>
      <div class="key sm" @click="emit('key', 'KC.INSERT')">Insert</div>
      <div class="key sm" @click="emit('key', 'KC.HOME')">Home</div>
      <div class="key sm" @click="emit('key', 'KC.PGUP')">Page Up</div>
      <div class="blocker-half"></div>
      <div class="key sm" @click="emit('key', 'KC.NUMLOCK')">Num Lock</div>
      <div class="key" @click="emit('key', 'KC.KP_SLASH')">/</div>
      <div class="key" @click="emit('key', 'KC.KP_ASTERISK')">*</div>
      <div class="key" @click="emit('key', 'KC.KP_MINUS')">-</div>
    </div>
    <div class="row">
      <div class="key key-1-5u" @click="emit('key', 'KC.TAB')">Tab</div>
      <div class="key" @click="emit('key', 'KC.Q')">Q</div>
      <div class="key" @click="emit('key', 'KC.W')">W</div>
      <div class="key" @click="emit('key', 'KC.E')">E</div>
      <div class="key" @click="emit('key', 'KC.R')">R</div>
      <div class="key" @click="emit('key', 'KC.T')">T</div>
      <div class="key" @click="emit('key', 'KC.Y')">Y</div>
      <div class="key" @click="emit('key', 'KC.U')">U</div>
      <div class="key" @click="emit('key', 'KC.I')">I</div>
      <div class="key" @click="emit('key', 'KC.O')">O</div>
      <div class="key" @click="emit('key', 'KC.P')">P</div>
      <div class="key" @click="emit('key', 'KC.LBRC')"><span>{</span><span>[</span></div>
      <div class="key" @click="emit('key', 'KC.RBRC')"><span>}</span><span>]</span></div>
      <div class="key key-1-5u" @click="emit('key', 'KC.BSLS')"><span>|</span><span>\</span></div>
      <div class="blocker-half"></div>
      <div class="key" @click="emit('key', 'KC.DEL')">Del</div>
      <div class="key" @click="emit('key', 'KC.END')">End</div>
      <div class="key sm" @click="emit('key', 'KC.PGDOWN')">Page Down</div>
      <div class="blocker-half"></div>
      <div class="key" @click="emit('key', 'KC.KP_7')">7</div>
      <div class="key" @click="emit('key', 'KC.KP_8')">8</div>
      <div class="key" @click="emit('key', 'KC.KP_9')">9</div>
      <div class="key" @click="emit('key', 'KC.KP_PLUS')">+</div>
    </div>
    <div class="row">
      <div class="key key-1-75u" @click="emit('key', 'KC.CAPS')">Caps Lock</div>
      <div class="key" @click="emit('key', 'KC.A')">A</div>
      <div class="key" @click="emit('key', 'KC.S')">S</div>
      <div class="key" @click="emit('key', 'KC.D')">D</div>
      <div class="key" @click="emit('key', 'KC.F')">F</div>
      <div class="key" @click="emit('key', 'KC.G')">G</div>
      <div class="key" @click="emit('key', 'KC.H')">H</div>
      <div class="key" @click="emit('key', 'KC.J')">J</div>
      <div class="key" @click="emit('key', 'KC.K')">K</div>
      <div class="key" @click="emit('key', 'KC.L')">L</div>
      <div class="key" @click="emit('key', 'KC.SCLN')"><span>:</span><span>;</span></div>
      <div class="key" @click="emit('key', 'KC.QUOT')"><span>"</span><span>'</span></div>
      <div class="key key-2-25u" @click="emit('key', 'KC.ENT')">Enter</div>

      <div class="blocker-half"></div>
      <div class="blocker-full"></div>
      <div class="blocker-full"></div>
      <div class="blocker-full"></div>
      <div class="blocker-half"></div>

      <div class="key" @click="emit('key', 'KC.KP_4')">4</div>
      <div class="key" @click="emit('key', 'KC.KP_5')">5</div>
      <div class="key" @click="emit('key', 'KC.KP_6')">6</div>
      <div class="key" @click="emit('key', 'KC.KP_PLUS')">+</div>
    </div>
    <div class="row">
      <div class="key key-2-5u" @click="emit('key', 'KC.LSFT')">LShift</div>
      <div class="key" @click="emit('key', 'KC.Z')">Z</div>
      <div class="key" @click="emit('key', 'KC.X')">X</div>
      <div class="key" @click="emit('key', 'KC.C')">C</div>
      <div class="key" @click="emit('key', 'KC.V')">V</div>
      <div class="key" @click="emit('key', 'KC.B')">B</div>
      <div class="key" @click="emit('key', 'KC.N')">N</div>
      <div class="key" @click="emit('key', 'KC.M')">M</div>
      <div class="key" @click="emit('key', 'KC.COMM')"><span>&lt;</span><span>,</span></div>
      <div class="key" @click="emit('key', 'KC.DOT')"><span>&gt;</span><span>,</span></div>
      <div class="key" @click="emit('key', 'KC.SLSH')"><span>?</span><span>/</span></div>
      <div class="key key-2-5u" @click="emit('key', 'KC.RSFT')">RShift</div>
      <div class="blocker-half"></div>
      <div class="blocker-full"></div>
      <div class="key" @click="emit('key', 'KC.UP')"><i class="mdi mdi-arrow-up"></i></div>
      <div class="blocker-full"></div>
      <div class="blocker-half"></div>
      <div class="key" @click="emit('key', 'KC.KP_1')">1</div>
      <div class="key" @click="emit('key', 'KC.KP_2')">2</div>
      <div class="key" @click="emit('key', 'KC.KP_3')">3</div>
      <div class="key sm" @click="emit('key', 'KC.KP_ENTER')">Num Enter</div>
    </div>
    <div class="row">
      <div class="key key-1-25u" @click="emit('key', 'KC.LCTL')">LCtrl</div>
      <div class="key key-1-25u" @click="emit('key', 'KC.LGUI')">LGui</div>
      <div class="key key-1-25u" @click="emit('key', 'KC.LALT')">LAlt</div>

      <div class="key key-6u" @click="emit('key', 'KC.SPC')">Space</div>

      <div class="key key-1-25u" @click="emit('key', 'KC.RALT')">RAlt</div>
      <div class="key key-1-25u" @click="emit('key', 'KC.RGUI')">RGui</div>
      <div class="key key-1-25u" @click="emit('key', 'KC.APP')">Menu</div>
      <div class="key key-1-25u" @click="emit('key', 'KC.RCTL')">RCTL</div>
      <div class="blocker-half"></div>
      <div class="key" @click="emit('key', 'KC.LEFT')"><i class="mdi mdi-arrow-left"></i></div>
      <div class="key" @click="emit('key', 'KC.DOWN')"><i class="mdi mdi-arrow-down"></i></div>
      <div class="key" @click="emit('key', 'KC.RIGHT')"><i class="mdi mdi-arrow-right"></i></div>
      <div class="blocker-half"></div>
      <div class="key" @click="emit('key', 'KC.KP_0')">0</div>
      <div class="key" @click="emit('key', 'KC.KP_0')">0</div>
      <div class="key" @click="emit('key', 'KC.KP_DOT')">.</div>
      <div class="key sm" @click="emit('key', 'KC.KP_ENTER')">Num Enter</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['key']);
</script>
