export const coordmaphelperpy = `# coordmaphelper.py helper script to get your coord map - v0.9.5
from kmk.modules.macros import Macros
from kmk.keys import KC
from kb import KMKKeyboard as _KMKKeyboard
import pog
class KMKKeyboard(_KMKKeyboard):
    def __init__(self):
        super().__init__()
        print("running coord_mapping assistant")
        print("press each key to get its coord_mapping value")
    # *2 for split keyboards, which will typically manage twice the number of keys
    # of one side. Having this N too large will have no impact (maybe slower boot..)
        N = pog.keyCount * 2
        self.coord_mapping = list(range(N))
        self.modules.append(Macros())

        layer = []

        for i in range(N):
            c, r = divmod(i, 100)
            d, u = divmod(r, 10)
            layer.append(
     			KC.MACRO(
    	        	"test"
        		)
   			)
        self.keymap = [layer]`
