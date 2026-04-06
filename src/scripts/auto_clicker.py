import time
import threading
import random
import argparse
from pynput import mouse, keyboard

clicking_enabled = False
mouse_controller = mouse.Controller()

# 🔥 FLAG SIMPLES (igual burst clicker)
injecting = False

def generate_cps_with_variation(base_cps: float, variation: float) -> float:
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
    global clicking_enabled, injecting

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

                injecting = True
                mouse_controller.click(target_button)
                injecting = False

                delay = 1.0 / current_cps
                next_click_time = now + delay

                if debug:
                    print(f"[START] CPS {current_cps:.2f}")
                continue

            if now >= next_cps_change_time:
                current_cps = generate_cps_with_variation(base_cps, variation)
                block_duration = random.uniform(MIN_BLOCK_DURATION, MAX_BLOCK_DURATION)
                next_cps_change_time = now + block_duration

                if debug:
                    print(f"[NEW CPS] {current_cps:.2f}")

            delay = 1.0 / current_cps

            if now < next_click_time:
                time.sleep(next_click_time - now)

            # 🔥 LÓGICA DO BURST (simples e confiável)
            injecting = True
            mouse_controller.click(target_button)
            injecting = False

            if debug:
                print(f"[Click] {target_button}")

            next_click_time += delay

            if next_click_time < now:
                next_click_time = now

        else:
            if session_active:
                session_active = False
                if debug:
                    print("[STOP]")
            time.sleep(0.01)

def parse_mouse_button(button_str: str):
    key_name = button_str.split('.')[-1].lower()
    try:
        return getattr(mouse.Button, key_name)
    except AttributeError:
        raise ValueError(f"Invalid mouse button: '{key_name}'")

def parse_keyboard_key(key_str):
    try:
        return keyboard.Key[key_str.lower()]
    except KeyError:
        return keyboard.KeyCode.from_char(key_str)

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--cps', type=float, required=True)
    parser.add_argument('--variation', type=float, required=True)
    parser.add_argument('--hotkey', type=str, required=True)
    parser.add_argument('--button', choices=['left', 'right'], required=True)
    parser.add_argument('--hold-to-click', action='store_true')
    parser.add_argument('--debug', action='store_true')

    args = parser.parse_args()

    target_button = mouse.Button.left if args.button == 'left' else mouse.Button.right

    hotkey_is_mouse = args.hotkey.lower().startswith('button')
    activation_hotkey = parse_mouse_button(args.hotkey) if hotkey_is_mouse else parse_keyboard_key(args.hotkey)

    last_toggle_time = 0.0

    def toggle_click(event_source, pressed):
        global clicking_enabled
        nonlocal last_toggle_time

        if event_source != activation_hotkey:
            return

        if args.hold_to_click:
            clicking_enabled = pressed
            print(f"{'ON' if pressed else 'OFF'} (hold)")
        else:
            if pressed:
                now = time.time()
                if (now - last_toggle_time) < 0.3:
                    return
                last_toggle_time = now

                clicking_enabled = not clicking_enabled
                print(f"{'ON' if clicking_enabled else 'OFF'}")

    def on_mouse(x, y, button, pressed):
        global injecting

        # 🔥 IGNORA QUALQUER CLIQUE ARTIFICIAL
        if injecting:
            return

        if hotkey_is_mouse:
            toggle_click(button, pressed)

    def on_keyboard_press(key):
        if not hotkey_is_mouse:
            toggle_click(key, True)

    def on_keyboard_release(key):
        if not hotkey_is_mouse and args.hold_to_click:
            toggle_click(key, False)

    print(f"""
--- AutoClicker ---
CPS: {args.cps} ± {args.variation}
Button: {args.button}
Hotkey: {args.hotkey}
Mode: {'Hold' if args.hold_to_click else 'Toggle'}
-------------------
""")

    thread = threading.Thread(
        target=auto_clicker,
        args=(target_button, args.cps, args.variation, args.debug),
        daemon=True
    )
    thread.start()

    with mouse.Listener(on_click=on_mouse) as ml, \
         keyboard.Listener(on_press=on_keyboard_press, on_release=on_keyboard_release) as kl:
        ml.join()
        kl.join()

if __name__ == "__main__":
    main()