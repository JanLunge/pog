export const coordmaphelperpy = `
# coordmaphelper.py helper script to get your coord map - v1.0.0
from kmk.keys import KC
from kb import KMKKeyboard as _KMKKeyboard
from kmk.modules.macros import Press, Release, Tap, Macros
import pog
class KMKKeyboard(_KMKKeyboard):
    def __init__(self):
        super().__init__()
        macros = Macros()
        self.modules.append(macros)
        print("running coord_mapping assistant")
        print("press each key to get its coord_mapping value")
        # *2 for split keyboards, which will typically manage twice the number of keys
        # of one side. Having this N too large will have no impact (maybe slower boot..)
        N = pog.keyCount * 2
        coord_mapping = list(range(N))

        layer = []

        for i in range(N):
            c, r = divmod(i, 100)
            d, u = divmod(r, 10)
            layer.append(
                KC.MACRO(
                        Tap(getattr(KC, "N" + str(c))),
                        Tap(getattr(KC, "N" + str(d))),
                        Tap(getattr(KC, "N" + str(u))),
                        Tap(KC.SPC),
                )
            )
        self.keymap = [layer]
        `
