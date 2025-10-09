import time
import threading
import random
import argparse
from pynput import mouse, keyboard

clicking_enabled = False
mouse_controller = mouse.Controller()

def generate_cps_with_variation(base_cps: float, variation: float) -> float:
    """Calculates a CPS value with variation, prioritizing values close to the base CPS."""
    if variation <= 0:
        return max(0.1, base_cps)
    min_cps = max(0.1, base_cps - variation)
    max_cps = base_cps + variation
    sigma = variation / 3.0
    if sigma == 0:
        return base_cps
    while True:
        generated_cps = random.gauss(mu=base_cps, sigma=sigma)
        if min_cps <= generated_cps <= max_cps:
            return generated_cps

def auto_clicker(target_button, base_cps, variation, debug=False):
    """Main thread that performs the clicks."""
    global clicking_enabled
    MIN_BLOCK_DURATION = 0.8
    MAX_BLOCK_DURATION = 5.0
    current_cps = base_cps
    next_cps_change_time = 0.0
    next_click_time = 0.0
    session_active = False

    while True:
        if clicking_enabled:
            now = time.perf_counter()
            if not session_active:
                session_active = True
                current_cps = generate_cps_with_variation(base_cps, variation)
                block_duration = random.uniform(MIN_BLOCK_DURATION, MAX_BLOCK_DURATION)
                next_cps_change_time = now + block_duration
                delay = 1.0 / current_cps
                next_click_time = now + delay
                if debug:
                    print("=" * 50, f"\n[SESSION STARTED] First click scheduled.\n[NEW BLOCK] CPS set to {current_cps:.2f} for the next {block_duration:.2f}s.\n", "=" * 50, sep="")
                continue
            
            if now >= next_cps_change_time:
                current_cps = generate_cps_with_variation(base_cps, variation)
                block_duration = random.uniform(MIN_BLOCK_DURATION, MAX_BLOCK_DURATION)
                next_cps_change_time = now + block_duration
                if debug:
                    print("-" * 50, f"\n[NEW BLOCK] CPS set to {current_cps:.2f} for the next {block_duration:.2f}s.\n", "-" * 50, sep="")
            
            delay = 1.0 / current_cps
            if now < next_click_time:
                time.sleep(next_click_time - now)
            mouse_controller.click(target_button)
            if debug:
                print(f"[Click] Target: {current_cps:.2f} CPS | Delay: {delay*1000:.1f}ms")
            next_click_time += delay
            if next_click_time < now:
                next_click_time = now
        else:
            if session_active:
                session_active = False
                if debug:
                    print("[SESSION ENDED]")
            time.sleep(0.01)

def parse_mouse_button(button_str: str):
    """Converts the mouse button name (string) to the corresponding object."""
    key_name = button_str.split('.')[-1].lower()
    try:
        return getattr(mouse.Button, key_name)
    except AttributeError:
        raise ValueError(f"Invalid mouse button: '{key_name}'")

def parse_keyboard_key(key_str):
    """Converts the key name (string) to the corresponding object."""
    try:
        return keyboard.Key[key_str.lower()]
    except KeyError:
        return keyboard.KeyCode.from_char(key_str)

def main():
    """Sets up and runs the auto-clicker."""
    parser = argparse.ArgumentParser(description="Auto-Clicker via command line")
    parser.add_argument('--cps', type=float, required=True, help="Clicks per second (base)")
    parser.add_argument('--variation', type=float, required=True, help="CPS variation (+/-)")
    parser.add_argument('--hotkey', type=str, required=True, help="Activation hotkey (e.g., 'Button4', 'f12')")
    parser.add_argument('--button', choices=['left', 'right'], required=True, help="Mouse button to click")
    parser.add_argument('--hold-to-click', action='store_true', help="Activate by holding the hotkey (instead of toggling)")
    parser.add_argument('--debug', action='store_true', help="Print information for each click and block")

    args = parser.parse_args()
    
    target_button = mouse.Button.left if args.button == 'left' else mouse.Button.right
    hotkey_is_mouse = args.hotkey.lower().startswith('button')
    activation_hotkey = parse_mouse_button(args.hotkey) if hotkey_is_mouse else parse_keyboard_key(args.hotkey)
    last_toggle_time = 0.0

    def toggle_click(event_source, pressed):
        """Toggles the auto-clicker on or off with debounce correction."""
        global clicking_enabled
        nonlocal last_toggle_time 

        if event_source != activation_hotkey:
            return
        
        if args.hold_to_click:
            clicking_enabled = pressed
            if pressed:
                print("Auto-click ENABLED (hold mode)")
            else:
                print("Auto-click DISABLED (hold mode)")
        else:
            if pressed:
                now = time.time()
                if (now - last_toggle_time) < 0.3:
                    return
                last_toggle_time = now
                
                clicking_enabled = not clicking_enabled
                print(f"Auto-click {'ENABLED' if clicking_enabled else 'DISABLED'} (toggle mode)")

    def on_mouse(x, y, button, pressed):
        if hotkey_is_mouse:
            toggle_click(button, pressed)

    def on_keyboard_press(key):
        if not hotkey_is_mouse:
            toggle_click(key, True)

    def on_keyboard_release(key):
        if not hotkey_is_mouse and args.hold_to_click:
            toggle_click(key, False)

    print(f"--- Auto-Clicker ---\nSpeed: {args.cps} CPS ±{args.variation}\nButton: {args.button}\nHotkey: {args.hotkey}\nMode: {'Hold' if args.hold_to_click else 'Toggle'}\n--------------------")

    thread = threading.Thread(target=auto_clicker, args=(target_button, args.cps, args.variation, args.debug), daemon=True)
    thread.start()

    with mouse.Listener(on_click=on_mouse) as ml, \
         keyboard.Listener(on_press=on_keyboard_press, on_release=on_keyboard_release) as kl:
        ml.join()
        kl.join()

if __name__ == "__main__":
    main()