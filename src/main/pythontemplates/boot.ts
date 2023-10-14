export const bootpy = `# boot.py - v1.0.5
import usb_cdc
import supervisor
import storage
import microcontroller

# optional
# supervisor.set_next_stack_limit(4096 + 4096)
usb_cdc.enable(console=True, data=True)
# used to identify pog compatible keyboards while scanning com ports
supervisor.set_usb_identification("Pog", "Pog Keyboard")

# index configs
# 0 - show usb drive | 0 false, 1 true
if microcontroller.nvm[0] == 0:
    storage.disable_usb_drive()
    storage.remount("/", False)
`
