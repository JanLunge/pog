export const keymappy = `#keymap.py KB base config - v1.0.0
from kmk.keys import KC
from kmk.modules.macros import Macros, Press, Release, Tap, Delay
from kmk.modules.combos import Chord, Sequence
import pog
import customkeys

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

# Combos: Chords (keys pressed together) and Sequences (keys pressed in order)
# Config format: {"type": "chord"|"sequence", "keys": ["KC.A", "KC.B"], "result": "KC.ESC", "timeout": 50}
combos_list = []
if pog.config.get('combos'):
    for combo in pog.config['combos']:
        keys = tuple(eval(k) for k in combo['keys'])
        result = eval(combo['result'])
        timeout = combo.get('timeout')
        match_coord = combo.get('matchCoord', False)
        
        if combo['type'] == 'chord':
            if timeout:
                combos_list.append(Chord(keys, result, timeout=timeout, match_coord=match_coord))
            else:
                combos_list.append(Chord(keys, result, match_coord=match_coord))
        elif combo['type'] == 'sequence':
            per_key_timeout = combo.get('perKeyTimeout', True)
            fast_reset = combo.get('fastReset', True)
            if timeout:
                combos_list.append(Sequence(keys, result, timeout=timeout, per_key_timeout=per_key_timeout, fast_reset=fast_reset))
            else:
                combos_list.append(Sequence(keys, result, per_key_timeout=per_key_timeout, fast_reset=fast_reset))
`
