export const codepy = `# Main Keyboard Configuration - v1.0.0
import board
import pog
# check if we just want to run the coord_mappping Assistant
if pog.coordMappingAssistant:
    from coordmaphelper import CoordMapKeyboard
    if __name__ == '__main__':
        CoordMapKeyboard().go()
    print("Exiting Coord Mapping Assistant Because of an error")
else:
    from kb import POGKeyboard
    # set the required features for you keyboard and keymap
    # add custom ones in the kb.py

    keyboard = POGKeyboard(features=pog.kbFeatures)

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
