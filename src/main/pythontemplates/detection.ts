export const detectionFirmware = `import board
import digitalio
import time
import supervisor
import usb_cdc
import json

# Initialize empty lists for pins and their IOs
pin_names = []
ios = []

print("Scanning for available GPIO pins...")

# Iterate over all attributes of the board module
for pin_name in dir(board):
    if pin_name.startswith('GP'):  # We are only interested in GPIO pins
        try:
            pin = getattr(board, pin_name)
            # Try to initialize the pin as a digital input
            io = digitalio.DigitalInOut(pin)
            io.switch_to_input(pull=digitalio.Pull.UP)
            pin_names.append(pin_name)  # If successful, add it to the list
            ios.append(io)  # Keep the IO object
        except (AttributeError, ValueError):
            print(f"Skipping {pin_name} (not available)")
            continue

if not pin_names:
    print("No usable GPIO pins found!")
    while True:
        pass

pin_names.sort()  # Sort them for consistent ordering
print(f"Found usable pins: {', '.join(pin_names)}")

# Create pins list with references
pins = list(zip([getattr(board, name) for name in pin_names], pin_names))

# Track connections for each pin
row_connections = {}  # pins that act as rows
col_connections = {}  # pins that act as columns
# Initialize empty sets for each pin
for pin_name in pin_names:
    row_connections[pin_name] = set()
    col_connections[pin_name] = set()

def read_pin_reliable(pin):
    # Read the pin 3 times with a small delay between reads
    readings = []
    for _ in range(3):
        readings.append(not pin.value)  # not pin.value because True means pressed
        # time.sleep(0.001)
    # Return True only if all readings indicate pressed
    return all(readings)

def print_connections(pin_name):
    print(f"Connections for {pin_name}:")
    if row_connections[pin_name]:  # Only print if there are connections
        print(f"As Row -> Columns: {sorted(row_connections[pin_name])}")
    if col_connections[pin_name]:  # Only print if there are connections
        print(f"As Column <- Rows: {sorted(col_connections[pin_name])}")

print("Starting diode direction test")
print("Press any key to exit")
print("Connect switches between pins to test...")

data_serial = usb_cdc.data
if not data_serial:
    supervisor.reload()
try:
    data_serial.write(json.dumps({
                                'type': 'start_detection',
                                'pins': pin_names,
                            }).encode() + b'\\n')
    while True:  # Exit on any key press
        for row_idx in range(len(pins)):
            # Set current pin as row (output low)
            ios[row_idx].switch_to_output(value=False)
            
            # Test all other pins as columns
            for col_idx in range(len(pins)):
                if col_idx != row_idx:
                    ios[col_idx].switch_to_input(pull=digitalio.Pull.UP)
                    time.sleep(0.001)  # Small delay for pin to settle
                    
                    if read_pin_reliable(ios[col_idx]):  # Key is pressed (confirmed by 3 readings)
                        row_pin = pins[row_idx][1]
                        col_pin = pins[col_idx][1]
                        print(f"New key press detected! Direction: ({row_pin}->{col_pin})")
                        print_connections(row_pin)
                        print_connections(col_pin)
                        # Check if this is a new connection
                        if col_pin not in row_connections[row_pin]:
                            data_serial.write(json.dumps({
                                'type': 'new_key_press',
                                'row': row_pin,
                                'col': col_pin,
                            }).encode() + b'\\n')
                            row_connections[row_pin].add(col_pin)
                            col_connections[col_pin].add(row_pin)
                        else:
                            data_serial.write(json.dumps({
                                'type': 'existing_key_press',
                                'row': row_pin,
                                'col': col_pin,
                            }).encode() + b'\\n')
                        data_serial.write(json.dumps({
                            'type': 'used_pins',
                            'rows': sorted(row_connections[row_pin]),
                            'cols': sorted(col_connections[col_pin]),
                        }).encode() + b'\\n')
                           
                    ios[col_idx].switch_to_input(pull=digitalio.Pull.UP)  # Reset column pin
            
            # Reset row pin
            ios[row_idx].switch_to_input(pull=digitalio.Pull.UP)
            # time.sleep(0.001)
        
        # time.sleep(0.01)  # Small delay between full matrix scans

finally:
    # Clean up
    print("Cleaning up...")
    for io in ios:
        io.deinit()
    
    print("Final connection summary:")
    for pin_name in pin_names:
        if row_connections[pin_name] or col_connections[pin_name]:
            print_connections(pin_name)
`
