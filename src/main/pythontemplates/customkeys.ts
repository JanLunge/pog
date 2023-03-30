export const customkeyspy = `# These are yous custom keycodes do any needed imports at the top - v0.9.5
# then you can reference them in your keymap with for example customkeys.MyKey

from kmk.keys import KC

MyKey = KC.X

DFUMODE = KC.TRNS.clone()

def next_boot_dfu(key, keyboard, *args):
    print('setting next boot to dfu') #serial feedback
    import microcontroller
    microcontroller.on_next_reset(microcontroller.RunMode.UF2)
    # microcontroller.reset()

DFUMODE.after_press_handler(next_boot_dfu)

SAFEMODE = KC.TRNS.clone()

def next_boot_safe(key, keyboard, *args):
    print('setting next boot to safe') #serial feedback
    import microcontroller
    microcontroller.on_next_reset(microcontroller.RunMode.SAFE_MODE)
    # microcontroller.reset()

SAFEMODE.after_press_handler(next_boot_safe)

ToggleDrive = KC.TRNS.clone()

def toggle_drive(key, keyboard, *args):
    print('toggling usb drive') #serial feedback
    import microcontroller
    if microcontroller.nvm[0] == 0:
        microcontroller.nvm[0] = 1
    else:
        microcontroller.nvm[0] = 0
    # microcontroller.reset()

ToggleDrive.after_press_handler(toggle_drive)
`
