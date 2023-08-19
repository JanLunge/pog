export const bootpy = `# boot.py - v0.9.5
import usb_cdc
import supervisor
import storage
import microcontroller

# optional
# supervisor.set_next_stack_limit(4096 + 4096)
usb_cdc.enable(console=True, data=True)

# index configs
# 0 - show usb drive | 0 false, 1 true
if microcontroller.nvm[0] == 0:
    storage.disable_usb_drive()
    storage.remount("/", False)
`
