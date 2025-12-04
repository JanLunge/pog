export const kbpy = `# kb.py KB base config - v1.0.0
import board
import pog
import microcontroller

from kmk.kmk_keyboard import KMKKeyboard
from kmk.scanners import DiodeOrientation
from kmk.scanners.keypad import KeysScanner

class POGKeyboard(KMKKeyboard):
    def __init__(self, features=['basic']):
        super().__init__()
        if "basic" in features:
            from kmk.modules.layers import Layers;
            combo_layers = {
            # combolayers can be added here
            # (1, 2): 3,
            }
            self.modules.append(Layers(combo_layers))
            from kmk.extensions.media_keys import MediaKeys; self.extensions.append(MediaKeys())
        if "international" in features:
            from kmk.extensions.international import International
            self.extensions.append(International())
        if "serial" in features:
            from pog_serial import pogSerial; self.modules.append(pogSerial())

        if "oneshot" in features:
            from kmk.modules.sticky_keys import StickyKeys
            sticky_keys = StickyKeys()
            # optional: set a custom release timeout in ms (default: 1000ms)
            # sticky_keys = StickyKeys(release_after=5000)
            self.modules.append(sticky_keys)


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

        # if "macros" in features:
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
                    split_side=side,
                    split_flip=pog.splitFlip)
            elif pog.keyboardType == "splitSerial":
                print("split with 2 pins (UART)")
                self.split = Split(
                    split_side=side,
                    split_target_left=pog.splitTargetLeft,
                    split_type=SplitType.UART,
                    data_pin=pog.splitPinA,
                    data_pin2=pog.splitPinB,
                    use_pio=pog.splitUsePio,
                    split_flip=pog.splitFlip,
                    uart_flip=pog.splitUartFlip)
            else:
                # Nested under pog.split == True => splitOnewire
                print('split with 1 pin')
                self.split = Split(
                    split_side=side,
                    split_target_left=pog.splitTargetLeft,
                    data_pin=pog.splitPinA,
                    use_pio=pog.splitUsePio,
                    split_flip=pog.splitFlip)

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
                pixel_pin=eval(pog.rgbPin),
                num_pixels=pog.rgbNumLeds,
                rgb_order=(1, 0, 2),
                val_limit=40, # Maximum brightness level. Only change if you know what you are doing!
                hue_default=pog.rgbOptions["hueDefault"],
                sat_default=pog.rgbOptions["satDefault"],
                val_default=pog.rgbOptions["valDefault"],
                animation_speed=pog.rgbOptions["animationSpeed"],
                animation_mode=pog.rgbOptions["animationMode"],
                breathe_center=pog.rgbOptions["breatheCenter"],
                knight_effect_length=pog.rgbOptions["knightEffectLength"],
            )
            self.extensions.append(rgb)

        # direct pin wiring
        # Must be set during init to override defaulting to matrix wiring
        if pog.directWiring:
            self.matrix = KeysScanner(
                pins=pog.pins_tuple,
                value_when_pressed=False,
                pull=True,
                interval=0.02,
                max_events=64
            )

        # matrix wiring
        if pog.matrixWiring:
            self.col_pins = pog.col_pins_tuple
            self.row_pins = pog.row_pins_tuple
            self.diode_orientation = DiodeOrientation.ROW2COL if pog.config["diodeDirection"] == "ROW2COL" else DiodeOrientation.COL2ROW

        # coord_mapping
        if len(pog.config["coordMap"]) != 0:
            self.coord_mapping = [int(val) for val in pog.coordMapping.split(",")[:-1]]


`
