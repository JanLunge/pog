export const codepy = `# Main Keyboard Configuration - v0.9.5
import board
import pog

# check if we just want to run the coord_mappping Assistant
if pog.coordMappingAssistant:
    from coordmaphelper import KMKKeyboard
    if __name__ == '__main__':
        KMKKeyboard().go()
else:
    from kb import KMKKeyboard

# set the required features for you keyboard and keymap
# add custom ones in the kb.py
keyboard = KMKKeyboard(features=['basic', 'serial', 'oneshot', 'tapdance', 'holdtap', 'mousekeys', 'combos'])

# manage settings for our modules and extensions here
keyboard.tapdance.tap_time = 200

# Keymap
import keymap
keyboard.keymap = keymap.keymap

# Encoder Keymap if available
if pog.hasEncoders:
    keyboard.encoder_handler.map = keymap.encoderKeymap

# Execute the keyboard loop
if __name__ == '__main__':
    keyboard.go()
`
