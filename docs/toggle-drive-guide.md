# How to Use the ToggleDrive Keycode

The `customkeys.ToggleDrive` keycode allows you to toggle the visibility of your keyboard's USB drive (CIRCUITPY) directly from a key on your keyboard. This is useful when you want to hide the drive during normal use and only show it when you need to edit files.

## Adding ToggleDrive to Your Keymap

To add the ToggleDrive function to your keyboard, assign the following keycode to any key in your keymap:

```python
customkeys.ToggleDrive
```

For example, in your keymap configuration you might have:

```python
[KC.A, KC.B, customkeys.ToggleDrive, KC.D]
```

## How It Works

ToggleDrive uses your microcontroller's non-volatile memory (NVM) to store the drive visibility state. When you press the key:

1. The keyboard reads the current state from `microcontroller.nvm[0]`
2. It flips the value:
   - `0` (drive hidden) → `1` (drive visible)
   - `1` (drive visible) → `0` (drive hidden)
3. The new value is saved to NVM

The actual toggle logic is defined in `customkeys.py`:

```python
def toggle_drive(keyboard):
    print('toggling usb drive')
    if microcontroller.nvm[0] == 0:
        microcontroller.nvm[0] = 1
    else:
        microcontroller.nvm[0] = 0

ToggleDrive = KC.MACRO(toggle_drive)
```

## Important: Unplug and Replug Required

**The change does not take effect immediately.** You must unplug and replug your keyboard (or reset the controller) for the new drive visibility state to apply.

This is because the drive state is determined during the boot sequence in `boot.py`:

```python
# 0 - show usb drive | 0 false, 1 true
if microcontroller.nvm[0] == 0:
    storage.disable_usb_drive()
    storage.remount("/", False)
```

The boot script runs before the main firmware loads, so changes to the NVM value only affect the next boot cycle.

## REPL Log Output

When you press the ToggleDrive key, you'll see the following message in the serial console (REPL):

```
toggling usb drive
```

This confirms that the key was pressed and the NVM value has been toggled. You can connect to the serial console using the Pog app or any serial terminal to see this output.

## Where the Code Lives

| File | Purpose |
|------|---------|
| `customkeys.py` | Defines the `ToggleDrive` macro and `toggle_drive()` function |
| `boot.py` | Reads NVM state at boot and enables/disables the USB drive |
| `pog_serial.py` | Provides a serial command alternative (`drive`) for toggling |

## Tips

- Assign ToggleDrive to a key you won't press accidentally, as it changes system behavior
- If you accidentally hide the drive and need to access it, you can also toggle it via the serial `drive` command in the Pog app
- The current drive state is shown in the Pog app's launch screen when connected to your keyboard
