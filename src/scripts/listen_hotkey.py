import sys
from pynput import keyboard, mouse

def get_key_name(key):
    if isinstance(key, keyboard.KeyCode):
        return key.char
    else:
        return key.name

def on_press(key):
    try:
        key_name = get_key_name(key)
        if key_name:
            print(key_name, flush=True)
    except Exception:
        pass
    
    return False

def on_click(x, y, button, pressed):
    if pressed:
        print(button, flush=True)
        return False

try:
    with mouse.Listener(on_click=on_click) as mouse_listener, \
         keyboard.Listener(on_press=on_press) as keyboard_listener:
        mouse_listener.join()
        keyboard_listener.join()
except Exception as e:
    print(f"Error starting listener: {e}", file=sys.stderr, flush=True)
