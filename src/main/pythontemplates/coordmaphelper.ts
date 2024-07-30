export const coordmaphelperpy = `# coordmaphelper.py v1.0.1
import board
import pog
from kb import POGKeyboard
from kmk.keys import KC
from kmk.modules.macros import Press, Release, Tap, Macros

class CoordMapKeyboard(POGKeyboard):
    def __init__(self):
        super().__init__(features=['basic', 'macros'])
        print("Running coord_mapping assistant")
        print("Press each key to get its coord_mapping value")

        if not hasattr(pog, 'keyCount') or pog.keyCount == 0:
            raise ValueError("pog.keyCount is not set or is zero")

        N = pog.keyCount * 2
        coord_mapping = list(range(N))
        layer = []
        print(f"coord_mapping = {coord_mapping}")
        print(f"Total keys: {N}")

        for i in range(N):
            c, r = divmod(i, 100)
            d, u = divmod(r, 10)
            print(f"Adding key {i} ({c}{d}{u})")
            try:
                layer.append(
                    KC.MACRO(
                        Tap(getattr(KC, f"N{c}")),
                        Tap(getattr(KC, f"N{d}")),
                        Tap(getattr(KC, f"N{u}")),
                        Tap(KC.SPC),
                    )
                )
            except AttributeError as e:
                print(f"Error creating macro for key {i}: {e}")

        if not layer:
            raise ValueError("No keys were added to the layer")

        print(f"Layer created with {len(layer)} keys")
        self.keymap = [layer]
        self.coord_mapping = coord_mapping
        print(f"Keymap initialized with {len(self.keymap[0])} keys")
`
