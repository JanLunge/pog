export const coordmaphelperpy = `# coordmaphelper.py helper script to get your coord map
from kmk.handlers.sequences import simple_key_sequence
from kmk.keys import KC
from kb import KMKKeyboard as _KMKKeyboard
import pog
class KMKKeyboard(_KMKKeyboard):
    def __init__(self):
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
            simple_key_sequence(
                (
                    getattr(KC, "N" + str(c)),
                    getattr(KC, "N" + str(d)),
                    getattr(KC, "N" + str(u)),
                    KC.SPC,
                )
            )
        )
    keymap = [layer]`
