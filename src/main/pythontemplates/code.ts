export const codepy = `# Main Keyboard Configuration
import board
import pog

# import modules & extensions
from kmk.modules.tapdance import TapDance
from kmk.modules.layers import Layers
from kmk.extensions.media_keys import MediaKeys

# check if we just want to run the coord_mappping finder
if pog.coordMappingAssistant:
    print('running coordmap setup')
    from coordmaphelper import KMKKeyboard
else:
    from kb import KMKKeyboard

keyboard = KMKKeyboard()

# Append Modules and Extensions to our Keyboard
keyboard.modules.append(Layers())
keyboard.extensions.append(MediaKeys())

tapdance = TapDance()
tapdance.tap_time = 200
keyboard.modules.append(tapdance)

from kmk.modules.modtap import ModTap; keyboard.modules.append(ModTap())
from kmk.modules.mouse_keys import MouseKeys; keyboard.modules.append(MouseKeys())
from kmk.modules.power import Power; keyboard.modules.append(Power())


# Keymap
if not pog.coordMappingAssistant:
    import keymap
    keyboard.keymap = keymap.keymap
    if pog.hasEncoders:
        from kb import encoder_handler
        encoder_handler.map = keymap.encoderKeymap


if __name__ == '__main__':
    keyboard.go()

`
