export const kbpy = `# kb.py KB base config
import board
from kmk.kmk_keyboard import KMKKeyboard as _KMKKeyboard
from kmk.scanners import DiodeOrientation
from kmk.scanners.keypad import KeysScanner
from kmk.modules.encoder import EncoderHandler


import pog

# Modules & Extensions
encoder_handler = EncoderHandler()
_KMKKeyboard.modules.append(encoder_handler)

class KMKKeyboard(_KMKKeyboard):
    # matrix wiring
    if pog.config["wiringMethod"] == "matrix":
        exec("col_pins = (" + pog.colPins + ")")
        exec("row_pins = (" + pog.rowPins + ")")
        exec("diode_orientation = DiodeOrientation." + pog.config["diodeDirection"])

    # direct pin wiring
    if pog.config["wiringMethod"] == "direct":
        exec(pog.directPinScanner)
    if len(pog.config["coordMap"]) != 0:
        exec("coord_mapping = [ " + pog.coordMapping + " ]")

    # Encoders
    if len(pog.config['encoders']) != 0:
        encoder_handler.pins = pog.encoders


`
