export const customkeyspy = `# These are yous custom keycodes do any needed imports at the top - v1.0.0
# then you can reference them in your keymap with for example customkeys.MyKey

from kmk.keys import KC
from kmk.modules.macros import Tap, Release, Press
import microcontroller

# Here you can define your custom keys
# MyKey = KC.X

# Builtin macros for use in pog
def next_boot_dfu(keyboard):
    print('setting next boot to dfu') #serial feedback
    microcontroller.on_next_reset(microcontroller.RunMode.UF2)

DFUMODE = KC.MACRO(next_boot_dfu)

def next_boot_safe(keyboard):
    print('setting next boot to safe') #serial feedback
    microcontroller.on_next_reset(microcontroller.RunMode.SAFE_MODE)
SAFEMODE = KC.MACRO(next_boot_safe)

def toggle_drive(keyboard):
    print('toggling usb drive') #serial feedback
    if microcontroller.nvm[0] == 0:
        microcontroller.nvm[0] = 1
    else:
        microcontroller.nvm[0] = 0

ToggleDrive = KC.MACRO(toggle_drive)`
