export const pogpy =`# pog.py Import the pog config
import json
import board
from kmk.keys import KC

config = {}
try:
    with open("/pog.json", "r") as fp:
        x = fp.read()
        # parse x:
        config = json.loads(x)
except OSError as e:
    raise Exception("Could not read pog.json file.")

print("starting keyboard %s (%s)" % (config["name"], config["id"]))


# Pin setup
def renderPin(pin):
    if config["pinPrefix"] == "gp":
        return "board.GP" + pin
    if config["pinPrefix"] == "board":
        return "board." + pin
    if config["pinPrefix"] == "quickpin":
        return "pins[" + pin + "]"


colPinsArray = []
for i, item in enumerate(config["colPins"]):
    colPinsArray.append(renderPin(item))
colPins = ",".join(colPinsArray)

rowPinsArray = []
for i, item in enumerate(config["rowPins"]):
    rowPinsArray.append(renderPin(item))
rowPins = ",".join(rowPinsArray)

pinsArray = []
for i, item in enumerate(config["directPins"]):
    pinsArray.append(renderPin(item))
pins = ",".join(pinsArray)

if config['wiringMethod'] == 'matrix':
    keyCount = len(rowPinsArray) * len(colPinsArray)
else:
    keyCount = len(pinsArray)

# encoders
hasEncoders = len(config['encoders']) != 0

encoderArray = []
for i, item in enumerate(config["encoders"]):
    encoderArray.append([eval(renderPin(item['pad_a'])), eval(renderPin(item['pad_b'])), None])
encoderTupleArray = []
for i, item in enumerate(encoderArray):
    encoderTupleArray.append(tuple(item))
encoders = tuple(encoderTupleArray)


# coord map
coordMappingAssistant = config['coordMapSetup']
def convert_coord_mapping():
    if not config.get("coordMap"):
        return ""
    str = ""
    for row in config["coordMap"]:
        str += "    " + ",".join(val for val in row)+","
    return str.replace("spc,", "    ")


coordMapping = convert_coord_mapping()


directPinScanner = (
    """def __init__(self):
    # create and register the scanner
    self.matrix = KeysScanner(
        # require argument:
        pins=["""
    + pins
    + """],
        # optional arguments with defaults:
        value_when_pressed=False,
        pull=True,
        interval=0.02,  # Debounce time in floating point seconds
        max_events=64
    )"""
)
`
