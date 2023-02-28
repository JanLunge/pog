# boot.py
import usb_cdc
import supervisor
supervisor.set_next_stack_limit(4096 + 4096)
usb_cdc.enable(console=True, data=True)
