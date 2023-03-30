export const pog_serialpy = `# pog_serial module - v0.9.5
from usb_cdc import data
from kmk.modules import Module
from kmk.utils import Debug
import pog
import json
import gc
import time
import microcontroller
import os
import supervisor
import math
import board

debug = Debug(__name__)

action = ""
chunkindex = 0

def sendConfig():
    def cross_sum(s):
        """
        Returns the cross sum of a string, where each character is mapped to its Unicode code point.
        """
        # Compute the cross sum
        total = 0
        for c in s:
            total += ord(c)

        return total
    global action
    global chunkindex
    print('writing chunk', chunkindex)

    chunksize = 800
    chunk_count = pog.configbufferlen / chunksize
    if chunkindex > chunk_count:
        return
    chunk = (json.dumps({
        'type': 'pogconfig',
        'current_chunk': chunkindex + 1, # start at 1 for the first chunk
        'total_chunks': math.ceil(chunk_count), # only show full chunks
        'data': pog.configbuffer[chunksize*chunkindex:chunksize*chunkindex+chunksize],
        'totalsize': pog.configbufferlen,
        'cross_sum': cross_sum(pog.configbuffer[chunksize*chunkindex:chunksize*chunkindex+chunksize])
    })+"\\n").encode()
    print(chunk)
    wrote = data.write(chunk)
    print('wrote', wrote)

def readConfigChunk(line):
    global action
    global chunkindex
    lasttime = time.monotonic_ns()
    jsondata = json.loads(line)
    print('json loadin chunk', jsondata['current_chunk'] ,jsondata['total_chunks'],time.monotonic_ns() - lasttime)
    lasttime = time.monotonic_ns()

    #tmpConfigFile = open('received_file.json', 'a')
    #tmpConfigFile.write(jsondata['data'])
    # print(jsondata['current_chunk'])
    tmpConfigFile = open('received_file.json', 'a')
    print('open file',time.monotonic_ns() - lasttime)
    lasttime = time.monotonic_ns()
    # print('saving to file', line)
    tmpConfigFile.write(jsondata['data'])
    tmpConfigFile.close()

    print('writing', jsondata['current_chunk'], "of", jsondata['total_chunks'])
    if jsondata['total_chunks'] == jsondata['current_chunk']:
        print('done with reading the pog.config')
        data.write('y\\n'.encode())
        action = ""
        chunkindex = 0
        try:
            jsonfile = open('received_file.json', 'r')
            json.loads(jsonfile.read())
            jsonfile.close()
            print('file close')
            # set as new pog.json
            os.rename('/pog.json','/pog.json.bk')
            os.rename('/received_file.json','/pog.json')
        except ValueError as err:
            print('sent file is not valid json', err)
    else:
        data.write('1\\n'.encode())

def readKeymapChunk(line):
    global action
    jsondata = json.loads(line)
    print('json loadin chunk', jsondata['current_chunk'] ,jsondata['total_chunks'])
    tmpConfigFile = open('received_file.py', 'a')
    print('open file')
    tmpConfigFile.write(jsondata['data'])
    tmpConfigFile.close()
    print('writing', jsondata['current_chunk'], "of", jsondata['total_chunks'])
    if jsondata['total_chunks'] == jsondata['current_chunk']:
        print('done with reading the pog.config')
        data.write('y\\n'.encode())
        action = ""
        os.rename('/keymap.py','/keymap.py.bk')
        os.rename('/received_file.py','/keymap.py')
    else:
        data.write('1\\n'.encode())

class pogSerial(Module):
    buffer = bytearray()

    def during_bootup(self, keyboard):
        try:
            data.timeout = 0
        except AttributeError:
            pass

    def before_matrix_scan(self, keyboard):
        pass

    def after_matrix_scan(self, keyboard):
        pass

    def process_key(self, keyboard, key, is_pressed, int_coord):
        return key

    def before_hid_send(self, keyboard):
        # Serial.data isn't initialized.
        if not data:
            return
        # Nothing to parse.
        if data.in_waiting == 0:
            return
        self.buffer.extend(data.read(64))
        idx = self.buffer.find(b'\\n')
        # No full command yet.
        if idx == -1:
            return

        print('got serial request')

        try:
            line = (self.buffer[:idx]).decode('utf-8')
            self.buffer = self.buffer[idx + 1 :]
            global action
            global chunkindex
            if action == 'readConfig':
                print('data transmit mode: reading config file in chunks')
                readConfigChunk(line)
            elif action == 'readKeymap':
                print('data transmit mode: reading keymap file in chunks')
                readKeymapChunk(line)
            else:
                split = line.split()
                if split[0] == 'info':
                    # print keyboard info
                    action = 'info'
                    chunkindex = 0
                    print('query keyboard info from serial')
                    sendConfig()
                if split[0] == 'info_simple':
                    # print basic keyboard info
                    print('getting basic keyboard info')
                    data.write((json.dumps({"driveMounted": microcontroller.nvm[0]!=0 ,"name": pog.config['name'], "manufacturer": pog.config['manufacturer'], "id": pog.config['id'], "board": dir(board) })+"\\n").encode())
                if split[0] == 'save':
                    # read chunks
                    file_to_delete = open("received_file.json",'w')
                    file_to_delete.close()
                    print('start reading chunks')
                    action = "readConfig"
                    data.write('1\\n'.encode())
                if split[0] == 'saveKeymap':
                    # read chunks
                    file_to_delete = open("received_file.py",'w')
                    file_to_delete.close()
                    print('start reading chunks')
                    action = "readKeymap"
                    data.write('1\\n'.encode())
                if split[0] == 'reset':
                    microcontroller.reset()
                if split[0] == 'drive':
                    if microcontroller.nvm[0] == 0:
                        microcontroller.nvm[0] = 1
                    else:
                        microcontroller.nvm[0] = 0
                    print('toggling Drive to', microcontroller.nvm[0])
                if split[0] == '1' or split[0] == '0':
                    # contine chunk
                    if split[0] == '1':
                        chunkindex += 1
                    if action == 'info':
                        sendConfig()
                if split[0] == 'y':
                    print('resetting action')
                    action = ""
                    chunkindex = 0


        except Exception as err:
            debug(f'error: {err}')

    def after_hid_send(self, keyboard):
        pass

    def on_powersave_enable(self, keyboard):
        pass

    def on_powersave_disable(self, keyboard):
        pass

`
