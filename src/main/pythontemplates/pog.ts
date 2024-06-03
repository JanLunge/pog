export const pogpy = `# pog.py Import the pog config - v0.9.5
import json
import board
from kmk.keys import KC

config = {}
configbuffer = bytearray()
configbufferlen = 0
try:
    with open("/pog.json", "r") as fp:
        x = fp.read()
        # parse x:
        config = json.loads(x)
        configbuffer = json.dumps(config)
        configbufferlen = len(configbuffer)
except OSError as e:
    microcontroller.nvm[0] = 1
    raise Exception("Could not read pog.json file. mounting drive")

print("starting keyboard %s (%s)" % (config["name"], config["id"]))

def pinValid(pin):
    return pin in [f'board.{alias}' for alias in dir(board)]

# Pin setup
def renderPin(pin):
    pinLabel = ''
    if config["pinPrefix"] == "gp":
        pinLabel = "board.GP" + pin
    elif config["pinPrefix"] == "board":
        pinLabel = "board." + pin
    elif config["pinPrefix"] == "quickpin":
        pinLabel = "pins[" + pin + "]"
    else:
        pinLabel = pin
    if pinValid(pinLabel):
        return pinLabel


colPinsArray = []
for i, item in enumerate(config["colPins"]):
    colPinsArray.append(renderPin(item))
# Remove the 'None's from the list of pins
colPinsArray = [pin for pin in colPinsArray if pin is not None]
colPins = ",".join(colPinsArray)
if len(colPinsArray) == 1:
    colPins = colPins + ","

rowPinsArray = []
for i, item in enumerate(config["rowPins"]):
    rowPinsArray.append(renderPin(item))
# Remove the 'None's from the list of pins
rowPinsArray = [pin for pin in rowPinsArray if pin is not None]
rowPins = ",".join(rowPinsArray)
if len(rowPinsArray) == 1:
    rowPins = rowPins + ","

pinsArray = []
for i, item in enumerate(config["directPins"]):
    pinsArray.append(renderPin(item))
# Remove the 'None's from the list of pins
pinsArray = [pin for pin in pinsArray if pin is not None]
pins = ",".join(pinsArray)
if len(pinsArray) == 1:
    pins = pins + ","

rgbPin = config["rgbPin"] if pinValid(config["rgbPin"]) else None
rgbNumLeds = config["rgbNumLeds"]

matrixWiring = False
directWiring = False

if config['wiringMethod'] == 'matrix':
    matrixWiring = True
    keyCount = len(rowPinsArray) * len(colPinsArray)
else:
    directWiring = True
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

keyboardType = None
if config.get('keyboardType'):
    keyboardType = config['keyboardType']

splitSide = None
if config.get('splitSide'):
    splitSide = config['splitSide']

splitPinA = None
splitPinB = None
if config.get('splitPinA'):
    splitPinA = eval(renderPin(config['splitPinA']))
if config.get('splitPinB'):
    splitPinB = eval(renderPin(config['splitPinB']))

vbusPin = None
if config.get('vbusPin') and config.get('splitSide') == 'vbus' and pinValid("board." + config['vbusPin']):
    vbusPin = eval("board." + config['vbusPin'])

# led pin without prefix for now
if config.get('ledPin'):
  ledPin = eval(config.get('ledPin'))
  ledLength = int(config.get('ledLength'))
`
