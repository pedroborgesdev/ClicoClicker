# Changelog

## [1.1.0] - 2026-04-06

### Features
- **Burst Clicker Mode** - New mode that multiplies real clicks into extra clicks (1-50 clicks)
- **Burst Configuration** - Configurable settings for number of clicks and delay between clicks
- **Multi-Session** - Support for up to 5 concurrent sessions with independent configurations
- **New Interface** - Implementation of sidebar, toolbar and intro overlay
- **13 Themes** - Added 13 handcrafted themes with complete UI adaptation

### Enhancements
- **Theming** - Enhancement of themes and layouts in the application
- **UI/UX** - Improvements to user experience with new animations and loading
- **Performance** - Optimizations in application loading
- **Structure** - Implementation of a new React component structure
- **Click Engine** - Improvements in click engine with dedicated threads

### Bug Fixes
- **Loading** - Fixed loading time and animations
- **Theming** - Fixed theme issues
- **Python** - Fixes in Python files and embedding
- **IPC** - Fixes in inter-process communication channels

### Performance
- **Loading** - Optimizations in application loading
- **Click Engine** - Performance improvements in click engine
- **Multi-threading** - Implementation of dedicated threads for burst clicks
- **Memory Management** - Better process and memory management

### Development
- **Python Scripts** - Implementation of Python script for click engine:
  - `burst_clicker.py` - Real clicks multiplier into artificial clicks

### Architecture
- **Python Integration** - Integration with Python 3 (pynput) for mouse control and input
- **Process Management** - Python process management with sessionId tracking

### Documentation
- **Updated README** - Complete documentation of new features
- **Architecture** - New architecture with detailed components
- **Tech Stack** - Technology stack updates
- **Usage Guide** - New usage guide with step-by-step instructions

### Security
- **Process Isolation** - Each session runs in its own Python process
- **Thread Safety** - Safe implementation with injection flags to prevent loops
- **Memory Management** - Automatic garbage collection of processes