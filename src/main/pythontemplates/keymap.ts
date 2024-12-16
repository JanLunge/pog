export const keymappy = `#keymap.py KB base config - v1.0.0
from kmk.keys import KC
from kmk.modules.macros import Macros, Press, Release, Tap, Delay
import pog
import customkey
from kmk.modules.combos import Chord, Sequence
from kb import combos

keymap = []
for l, layer in enumerate(pog.config['keymap']):
    layerKeymap = []
    for k, key in enumerate(layer):
        layerKeymap.append(eval(key))
    keymap.append(tuple(layerKeymap))

encoderKeymap = []
for l, layer in enumerate(pog.config['encoderKeymap']):
    layerEncoders = []
    for e, encoder in enumerate(layer):
        layerEncoders.append(tuple(map(eval, encoder)))
    encoderKeymap.append(tuple(layerEncoders))
`
