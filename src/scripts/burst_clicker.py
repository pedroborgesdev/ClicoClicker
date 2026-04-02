import time
import threading
import argparse
from pynput import mouse

mouse_controller = mouse.Controller()

injecting = False

def parse_mouse_button(button_str: str):
    key = button_str.lower()
    if key == "left":
        return mouse.Button.left
    elif key == "right":
        return mouse.Button.right
    else:
        raise ValueError("Button must be 'left' or 'right'")

def burst_click(target_button, extra_clicks, delay, debug=False):
    global injecting
    injecting = True

    for i in range(extra_clicks):
        mouse_controller.click(target_button)
        if debug:
            print(f"[Artificial Click {i+1}] {target_button}")
        time.sleep(delay)

    injecting = False

def main():
    parser = argparse.ArgumentParser(description="Burst Clicker")

    parser.add_argument('--clicks', type=int, required=True, help="Extra clicks per real click")
    parser.add_argument('--delay', type=float, default=0.01, help="Delay between artificial clicks")
    parser.add_argument('--button', choices=['left', 'right'], default='left', help="Mouse button to listen/click")
    parser.add_argument('--debug', action='store_true', help="Enable debug logs")

    args = parser.parse_args()

    target_button = parse_mouse_button(args.button)

    def on_click(x, y, button, pressed):
        global injecting

        if injecting:
            return

        if button == target_button and pressed:
            threading.Thread(
                target=burst_click,
                args=(target_button, args.clicks, args.delay, args.debug),
                daemon=True
            ).start()

    print(f"""
--- Burst Clicker ---
Button: {args.button}
Extra Clicks: {args.clicks}
Delay: {args.delay}s
---------------------
""")

    with mouse.Listener(on_click=on_click) as listener:
        listener.join()

if __name__ == "__main__":
    main()