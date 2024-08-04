export const kbpy = `# kb.py KB base config - v0.9.5
import board
import pog

from kmk.kmk_keyboard import KMKKeyboard
from kmk.scanners import DiodeOrientation
from kmk.scanners.keypad import KeysScanner

class POGKeyboard(KMKKeyboard):
    def __init__(self, features=['basic']):
        if "basic" in features:
            from kmk.modules.layers import Layers;
            combo_layers = {
            # combolayers can be added here
            # (1, 2): 3,
            }
            self.modules.append(Layers(combo_layers))
            from kmk.extensions.media_keys import MediaKeys; self.extensions.append(MediaKeys())

        if "serial" in features:
            from pog_serial import pogSerial; self.modules.append(pogSerial())

        if "oneshot" in features:
            from kmk.modules.oneshot import OneShot
            self.oneshot = OneShot()
            self.modules.append(self.oneshot)

        if "tapdance" in features:
            from kmk.modules.tapdance import TapDance
            self.tapdance = TapDance()
            self.modules.append(self.tapdance)

        if "holdtap" in features:
            from kmk.modules.holdtap import HoldTap; self.modules.append(HoldTap())

        if "mousekeys" in features:
            from kmk.modules.mouse_keys import MouseKeys; self.modules.append(MouseKeys())

        if "combos" in features:
            from kmk.modules.combos import Combos, Chord, Sequence
            self.combos = Combos()
            self.modules.append(self.combos)

        if "macros" in features:
            from kmk.modules.macros import Macros
            self.macros = Macros()
            self.modules.append(self.macros)

        # TODO: not tested yet
        if "capsword" in features:
            from kmk.modules.capsword import CapsWord
            self.capsword = CapsWord()
            self.modules.append(self.capsword)

        if pog.config['split']:
            from kmk.modules.split import Split, SplitSide, SplitType

            # Split Side Detection
            if pog.splitSide == "label":
                from storage import getmount
                side = SplitSide.RIGHT if str(getmount('/').label)[-1] == 'R' else SplitSide.LEFT
            if pog.splitSide == "vbus":
                import digitalio

                vbus = digitalio.DigitalInOut(pog.vbusPin)
                vbus.direction = digitalio.Direction.INPUT
                side = SplitSide.RIGHT if vbus.value == False else SplitSide.LEFT
            if pog.splitSide == "left" or pog.splitSide == "right":
                side = SplitSide.RIGHT if pog.splitSide == "right" else SplitSide.LEFT

            # Split Type Configuration
            if pog.keyboardType == "splitBLE":
                print("split with 2 pins")
                self.split = Split(
                    split_type=SplitType.BLE,
                    split_side=side)
            elif pog.keyboardType == "splitSerial":
                print("split with 2 pins (UART)")
                self.split = Split(
                    split_side=side,
                    split_type=SplitType.UART,
                    split_flip=False,
                    data_pin=pog.splitPinA,
                    data_pin2=pog.splitPinB,
                    use_pio=True)
            else:
                # Nested under pog.split == True => splitOnewire
                print('split with 1 pin')
                self.split = Split(
                    split_side=side,
                    data_pin=pog.splitPinA,
                    use_pio=True)

            self.modules.append(self.split)

        # Add your own modules and extensions here
        # or sort them into the correct spot to have the correct import order


        # Encoders
        if pog.hasEncoders:
            from kmk.modules.encoder import EncoderHandler
            self.encoder_handler = EncoderHandler()
            self.encoder_handler.pins = pog.encoders
            self.modules.append(self.encoder_handler)

        if "rgb" in features:
            from kmk.extensions.RGB import RGB
            rgb = RGB(
                pixel_pin=eval(pog.rgb["pin"]),
                num_pixels=pog.rgb["numLeds"],
                rgb_order=(1, 0, 2),
                val_limit=40, # Maximum brightness level. Only change if you know what you are doing!
                hue_default=pog.rgb["hueDefault"],
                sat_default=pog.rgb["satDefault"],
                val_default=pog.rgb["valDefault"],
                animation_speed=pog.rgb["animationSpeed"],
                animation_mode=pog.rgb["animationMode"],
            )
            self.extensions.append(rgb)

        # direct pin wiring
        # Must be set during init to override defaulting to matrix wiring
        if pog.directWiring:
            self.matrix = KeysScanner(
                pins=eval(pog.pins),
                value_when_pressed=False,
                pull=True,
                interval=0.02,
                max_events=64
            )

    # matrix wiring
    if pog.matrixWiring:
        exec("col_pins = (" + pog.colPins + ")")
        exec("row_pins = (" + pog.rowPins + ")")
        exec("diode_orientation = DiodeOrientation." + pog.config["diodeDirection"])

    # coord_mapping
    if len(pog.config["coordMap"]) != 0:
        exec("coord_mapping = [ " + pog.coordMapping + " ]")


`
