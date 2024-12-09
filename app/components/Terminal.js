'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Terminal({ isOpen, setIsOpen, onColorChange }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to Lars\'s Terminal! Type "help" for available commands.' }
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const terminalRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
    return false;
  };

  const predefinedColors = {
    blue: { r: 74, g: 144, b: 226 },
    purple: { r: 147, g: 51, b: 234 },
    green: { r: 52, g: 211, b: 153 },
    red: { r: 239, g: 68, b: 68 },
    yellow: { r: 234, g: 179, b: 8 },
    pink: { r: 236, g: 72, b: 153 },
    cyan: { r: 34, g: 211, b: 238 },
    orange: { r: 249, g: 115, b: 22 }
  };

  const commands = {
    help: () => ({
      type: 'system',
      content: `Available commands:
╭────────────────────────────────────╮
│  help     - Show this message      │
│  about    - Learn about me         │
│  skills   - List technical skills  │
│  projects - View my projects       │
│  clear    - Clear terminal         │
│  contact  - Get contact info       │
│  exit     - Close terminal         │
╰────────────────────────────────────╯

Psst... try 'eastereggs' for some fun commands! 🎮`
    }),
    about: () => ({
      type: 'system',
      content: `╭─ About Me ────────────────────────╮
│                                   │
│  Full Stack Developer passionate  │
│  about creating innovative and    │
│  scalable web solutions.          │
│                                   │
│  Based in Belgium                 │
│  Available for opportunities      │
│                                   │
╰────────────────────────────────────╯`
    }),
    skills: () => {
      const scrolled = scrollToSection('skills');
      return {
        type: 'system',
        content: scrolled ? 'Scrolling to Skills section...' : 'Skills section not found.'
      };
    },
    clear: () => {
      setHistory([]);
      return null;
    },
    contact: () => {
      const scrolled = scrollToSection('contact');
      return {
        type: 'system',
        content: scrolled ? 'Scrolling to Contact section...' : 'Contact section not found.'
      };
    },
    projects: () => {
      const scrolled = scrollToSection('projects');
      return {
        type: 'system',
        content: scrolled ? 'Scrolling to Projects section...' : 'Projects section not found.'
      };
    },
    exit: () => {
      setIsOpen(false);
      return null;
    },
    // Easter Egg Commands
    matrix: () => ({
      type: 'system',
      content: `
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⣠⣴⣶⣿⣿⣷⣶⣄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣾⣿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⡟⠁⣰⣿⣿⣿⡿⠿⠻⠿⣿⣿⣿⣿⣧⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⠏⠀⣴⣿⣿⣿⠉⠀⠀⠀⠀⠈⢻⣿⣿⣿⣇⠀⠀⠀
⠀⠀⠀⠀⢀⣠⣼⣿⣿⡏⠀⢠⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⡀⠀
⠀⠀⠀⣰⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡇⠀⠀
⠀⠀⢰⣿⣿⡿⣿⣿⣿⡇⠀⠘⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⢀⣸⣿⣿⣿⠁⠀⠀
⠀⠀⣿⣿⣿⠁⣿⣿⣿⡇⠀⠀⠻⣿⣿⣿⣷⣶⣶⣶⣶⣶⣿⣿⣿⣿⠃⠀⠀⠀
⠀⢰⣿⣿⡇⠀⣿⣿⣿⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀
⠀⢸⣿⣿⡇⠀⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠛⠉⢉⣿⣿⠀⠀⠀⠀⠀⠀
⠀⢸⣿⣿⣇⠀⣿⣿⣿⠀⠀⠀⠀⠀⢀⣤⣤⣤⡀⠀⠀⢸⣿⣿⣿⣷⣦⠀⠀⠀
⠀⠀⢻⣿⣿⣶⣿⣿⣿⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣦⡀⠀⠉⠉⠻⣿⣿⡇⠀⠀
⠀⠀⠀⠛⠿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠈⠹⣿⣿⣇⣀⠀⣠⣾⣿⣿⡇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣦⣤⣤⣤⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⣿⣿⣿⣿⣿⣿⠿⠋⠉⠛⠋⠉⠉⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠁`
    }),
    coffee: () => ({
      type: 'system',
      content: `
Here's your coffee! ☕

      )  (
     (   ) )
      ) ( (
    _______)_
 .-'---------|
( C|/\\/\\/\\/\\/|
 '-./\\/\\/\\/\\/|
   '_________'
    '-------'`
    }),
    weather: () => ({
      type: 'system',
      content: `Current weather in my terminal:
╭───────────────╮
│  🌤️  Partly Cloudy │
│  🌡️  22°C         │
│  💨  5 km/h      │
│  💧  45%         │
╰──────────────────╯`
    }),
    joke: () => {
      const jokes = [
        "Why do programmers prefer dark mode?\nBecause light attracts bugs! 🪲",
        "Why did the developer go broke?\nBecause he used up all his cache! 💰",
        "What's a programmer's favorite hangout spot?\nFoo Bar! 🍺",
        "Why do programmers always mix up Halloween and Christmas?\nBecause Oct 31 == Dec 25! 🎃",
        "Why did the functions stop calling each other?\nBecause they had constant arguments! 🗣️"
      ];
      return {
        type: 'system',
        content: jokes[Math.floor(Math.random() * jokes.length)]
      };
    },
    whoami: () => ({
      type: 'system',
      content: `
User: guest
Permissions: read-only
Status: curious
Location: browser
Mission: exploring
Purpose: undefined`
    }),
    sudo: () => ({
      type: 'error',
      content: "Nice try! But you're not an admin... yet 😉"
    }),
    hack: () => ({
      type: 'system',
      content: `INITIATING HACK SEQUENCE...
[█▒▒▒▒▒▒▒▒▒] 10%
[██▒▒▒▒▒▒▒▒] 20%
[███▒▒▒▒▒▒▒] 30%
[████▒▒▒▒▒] 40%
[█████▒▒▒▒▒] 50%
ACCESS DENIED! 🚫
Just kidding! I'm not that kind of developer 😅`
    }),
    ping: () => ({
      type: 'system',
      content: `PING localhost (127.0.0.1)
64 bytes from 127.0.0.1: time=0.042ms
64 bytes from 127.0.0.1: time=0.043ms
64 bytes from 127.0.0.1: time=0.044ms
64 bytes from 127.0.0.1: time=0.041ms

--- localhost ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
round-trip min/avg/max = 0.041/0.0425/0.044 ms`
    }),
    flip: () => ({
      type: 'system',
      content: `(╯°□°)╯︵ ┻━┻

...

┬─┬ノ(ಠ_ಠノ)
Sorry, I should be more professional.`
    }),
    color: () => {
      const colors = [
        "text-red-400",
        "text-blue-400",
        "text-green-400",
        "text-yellow-400",
        "text-purple-400",
        "text-pink-400",
        "text-cyan-400"
      ];
      return {
        type: 'system',
        content: "🌈 Terminal got style!",
        className: colors[Math.floor(Math.random() * colors.length)]
      };
    },
    eastereggs: () => ({
      type: 'system',
      content: `🎮 Fun Commands & Easter Eggs:
╭────────────────────────────────────╮
│  matrix   - Enter the Matrix       │
│  coffee   - Get virtual coffee     │
│  weather  - Check terminal weather │
│  joke     - Random dev joke        │
│  whoami   - User info             │
│  sudo     - Try to be admin       │
│  hack     - Start hacking         │
│  ping     - Ping localhost        │
│  flip     - Flip a table          │
│  color    - Random color output    │
│  theme    - Change particle color  │
│  snake    - Play snake game       │
│  calc     - Calculator            │
│  banner   - Cool text banner      │
│  rainbow  - Rainbow colors        │
│  neon     - Neon effect          │
│  fire     - Fire effect          │
│  disco    - Disco lights         │
│  vortex   - Create a vortex       │
│  gravity  - Toggle gravity        │
│  chaos    - Chaos mode            │
│  basic    - Reset to normal       │
╰────────────────────────────────────╯`
    }),
    theme: (args) => {
      const colorName = args[0]?.toLowerCase();

      if (!colorName || colorName === 'help') {
        return {
          type: 'system',
          content: `Available themes:
╭────────────────────────────────────╮
│  theme blue    - Default blue      │
│  theme purple  - Royal purple      │
│  theme green   - Emerald green     │
│  theme red     - Ruby red          │
│  theme yellow  - Golden yellow     │
│  theme pink    - Neon pink         │
│  theme cyan    - Electric cyan     │
│  theme orange  - Sunset orange     │
│  theme random  - Random color      │
╰────────────────────────────────────╯`
        };
      }

      if (colorName === 'random') {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        onColorChange(r, g, b);
        return {
          type: 'system',
          content: `🎨 Changed theme to random color (RGB: ${r}, ${g}, ${b})`
        };
      }

      const color = predefinedColors[colorName];
      if (color) {
        onColorChange(color.r, color.g, color.b);
        return {
          type: 'system',
          content: `🎨 Changed theme to ${colorName}`
        };
      }

      return {
        type: 'error',
        content: 'Unknown theme. Type "theme help" to see available themes.'
      };
    },
    snake: () => ({
      type: 'system',
      content: `🐍 Snake Game Controls:
Use WASD to move, X to quit

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛
⬛⬜⬜⬜⬜🟩⬜⬜⬜⬛
⬛⬜⬜🟩🟩🟩⬜⬜⬜⬛
⬜⬜⬜⬜⬜⬜🍎⬜⬛
⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛

Game not implemented yet... but imagine! 🎮`
    }),
    calc: (args) => {
      if (!args.length) {
        return {
          type: 'system',
          content: 'Usage: calc <expression>\nExample: calc 2 + 2'
        };
      }

      try {
        const expression = args.join(' ');
        // Using Function instead of eval for better security
        const result = new Function('return ' + expression)();
        return {
          type: 'system',
          content: `${expression} = ${result}`
        };
      } catch (error) {
        return {
          type: 'error',
          content: 'Invalid expression! Try something like: 2 + 2'
        };
      }
    },
    banner: (args) => {
      if (!args.length) {
        return {
          type: 'system',
          content: 'Usage: banner <text>\nExample: banner hello'
        };
      }

      const text = args.join(' ').toUpperCase();
      const bannerArt = `
╭${'─'.repeat(text.length + 4)}╮
│  ${text}  │
╰${'─'.repeat(text.length + 4)}╯`;

      return {
        type: 'system',
        content: bannerArt
      };
    },
    // Special hidden command
    konami: () => {
      onColorChange(255, 215, 0); // Gold color
      return {
        type: 'system',
        content: `🎮 KONAMI CODE ACTIVATED! 🎮
⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ B A

Unlocked golden particle mode! ✨`
      };
    },
    // New particle commands
    rainbow: () => {
      onColorChange(-1, -1, -1);
      return {
        type: 'system',
        content: `🌈 Rainbow mode activated!
Particles are now cycling through colors.`
      };
    },
    neon: () => {
      onColorChange(-2, -2, -2);
      return {
        type: 'system',
        content: `💫 Neon mode activated!
Particles are glowing with neon colors.`
      };
    },
    fire: () => {
      onColorChange(-3, -3, -3);
      return {
        type: 'system',
        content: `🔥 Fire mode activated!
Particles are burning with fiery colors.`
      };
    },
    disco: () => {
      onColorChange(-4, -4, -4);
      return {
        type: 'system',
        content: `🪩 Disco mode activated!
Particles are pulsing with disco colors.`
      };
    },
    vortex: () => {
      onColorChange(-10, -10, -10, true);
      return {
        type: 'system',
        content: `🌀 Vortex activated!
Particles are being pulled into a spiral...
Use your mouse to control the vortex center!`
      };
    },
    gravity: () => {
      onColorChange(-30, -30, -30, true);
      return {
        type: 'system',
        content: `🌍 Gravity mode activated!
Particles now respond to gravity...
Move your mouse to create gravity wells!`
      };
    },
    chaos: () => {
      onColorChange(-40, -40, -40, true);
      return {
        type: 'system',
        content: `🌪️ Chaos mode activated!
Everything is going crazy!
Move your mouse to create chaos zones!`
      };
    },
    basic: () => {
      onColorChange(74, 144, 226);
      return {
        type: 'system',
        content: `🔄 Reset to default state!
All particles have been restored to default blue color and normal mode.`
      };
    },
  };

  const handleCommand = (cmd) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(' ');
    setHistory(prev => [...prev, { type: 'command', content: `❯ ${cmd}` }]);

    if (commands[command]) {
      const result = commands[command](args);
      if (result) {
        setHistory(prev => [...prev, result]);
      }
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        content: `Command not found: ${cmd}\nType "help" for available commands.`
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, scale: isMinimized ? 0.5 : 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-8 right-8 w-[500px] bg-black/80 backdrop-blur-xl rounded-xl border border-blue-500/20 shadow-2xl shadow-blue-500/5 ${isMinimized ? 'h-12 overflow-hidden' : ''} z-[100]`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
            />
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          </div>
          <div className="text-blue-300/50 text-sm font-mono">terminal@lars-portfolio</div>
          <div className="w-20"></div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className={`h-[400px] overflow-y-auto p-4 font-mono text-sm space-y-2 custom-scrollbar ${isMinimized ? 'hidden' : ''}`}
        >
          {history.map((entry, i) => (
            <div
              key={i}
              className={`${
                entry.type === 'error' ? 'text-red-400' :
                entry.type === 'command' ? 'text-blue-300' :
                entry.className || 'text-green-300'
              } leading-relaxed`}
            >
              <pre className="whitespace-pre-wrap">{entry.content}</pre>
            </div>
          ))}
        </div>

        {/* Terminal Input */}
        <div className={`flex items-center px-4 py-3 border-t border-blue-500/20 bg-black/20 ${isMinimized ? 'hidden' : ''}`}>
          <span className="text-blue-400 mr-2">❯</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent focus:outline-none text-blue-200 font-mono"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Export the setIsOpen function to be used by the button
export const openTerminal = (setIsOpen) => {
  setIsOpen(true);
};
