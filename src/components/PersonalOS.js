import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { 
  Monitor, 
  Folder, 
  User, 
  Terminal, 
  Calculator,
  Activity,
  Gamepad2,
  Bell,
  Play,
  Pause,
  Volume2,
  Minimize2,
  X,
  ExternalLink
} from 'lucide-react';

const PersonalOS = () => {
  const [isBooted, setIsBooted] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [theme, setTheme] = useState('default');
  const [currentDesktop, setCurrentDesktop] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 3000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const openWindow = (app) => {
    if (!openWindows.find(w => w.id === app.id)) {
      setOpenWindows(prev => [...prev, { ...app, zIndex: prev.length + 1 }]);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ));
  };

  const restoreWindow = (id) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: false } : w
    ));
  };

  const apps = [
    {
      id: 'projects',
      name: 'Projects',
      icon: Folder,
      component: ProjectsApp
    },
    {
      id: 'skills',
      name: 'Terminal',
      icon: Terminal,
      component: SkillsTerminal
    },
    {
      id: 'about',
      name: 'About Me',
      icon: User,
      component: AboutApp
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: Calculator,
      component: CalculatorApp
    },
    {
      id: 'monitor',
      name: 'System Monitor',
      icon: Activity,
      component: SystemMonitor
    },
    {
      id: 'games',
      name: 'Games',
      icon: Gamepad2,
      component: GamesApp
    }
  ];

  const themes = {
    default: 'bg-gradient-to-br from-blue-600 to-purple-700',
    dark: 'bg-gradient-to-br from-gray-900 to-black',
    neon: 'bg-gradient-to-br from-pink-500 to-cyan-500'
  };

  if (!isBooted) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl font-bold mb-4 animate-pulse">CodeBreaker3008 OS</div>
          <div className="text-xl mb-8">Initializing portfolio system...</div>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{
              animation: 'loading 3s ease-in-out forwards'
            }}></div>
          </div>
          <style jsx>{`
            @keyframes loading {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-screen ${themes[theme]} relative overflow-hidden`}>
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-8">
        <div className="grid grid-cols-6 gap-6 h-full">
          {apps.map((app, index) => (
            <div
              key={app.id}
              className="flex flex-col items-center cursor-pointer hover:bg-white/10 rounded-lg p-4 transition-all duration-200 h-fit"
              onClick={() => openWindow(app)}
              onDoubleClick={() => openWindow(app)}
            >
              <app.icon className="w-12 h-12 text-white mb-2" />
              <span className="text-white text-sm text-center">{app.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Open Windows */}
      {openWindows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          theme={theme}
        />
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md flex items-center justify-between px-4">
        {/* Start Menu */}
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors">
            <Monitor className="w-6 h-6 text-white" />
          </button>
          
          {/* Open App Icons */}
          {openWindows.map((window) => (
            <button
              key={window.id}
              className={`p-2 rounded transition-colors ${
                window.minimized ? 'bg-gray-700' : 'bg-blue-600'
              }`}
              onClick={() => window.minimized ? restoreWindow(window.id) : minimizeWindow(window.id)}
            >
              <window.icon className="w-5 h-5 text-white" />
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-4 text-white">
          {/* Music Player */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="hover:bg-white/10 p-1 rounded"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <Volume2 className="w-4 h-4" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-16 accent-blue-500"
            />
          </div>
          
          {/* Notifications */}
          <button onClick={() => addNotification('System notification!')}>
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Desktop Switcher */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((desktop) => (
              <button
                key={desktop}
                className={`w-8 h-4 rounded ${
                  currentDesktop === desktop ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                onClick={() => setCurrentDesktop(desktop)}
              />
            ))}
          </div>
          
          {/* Clock */}
          <div className="text-sm">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="absolute top-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-black/80 text-white p-3 rounded-lg backdrop-blur-md animate-slide-in"
          >
            {notification.message}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const Window = ({ window, onClose, onMinimize, theme }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  if (window.minimized) return null;

  return (
    <div
      className="absolute bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: '800px',
        height: '600px',
        zIndex: window.zIndex
      }}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4 cursor-move"
        onMouseDown={(e) => {
          setIsDragging(true);
          const startX = e.clientX - position.x;
          const startY = e.clientY - position.y;

          const handleMouseMove = (e) => {
            setPosition({
              x: e.clientX - startX,
              y: e.clientY - startY
            });
          };

          const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="flex items-center space-x-2">
          <window.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{window.name}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-auto">
        <window.component />
      </div>
    </div>
  );
};

// App Components
const ProjectsApp = () => {
  const projects = [
    {
      id: 1,
      name: 'DiagnosisSystem',
      description: 'AI-powered medical diagnosis system using deep learning for disease prediction and analysis.',
      github: 'https://github.com/codebreaker3008/DiagnosisSystem',
      technologies: ['Flask', 'TensorFlow', 'Keras', 'Pandas', 'NumPy', 'OpenCV', 'Jinja2']
    },
    {
      id: 2,
      name: 'FoodWise',
      description: 'Smart food scanner app that provides nutritional information and recommendations.',
      github: 'https://github.com/codebreaker3008/FoodWise',
      technologies: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB Atlas', 'QuaggaJS']
    },
    {
      id: 3,
      name: 'MediScope-AI',
      description: 'Advanced medical AI platform for comprehensive healthcare analysis and insights.',
      github: 'https://github.com/codebreaker3008/MediScope-AI',
      technologies: ['Node.js', 'Python 3.10+', 'Docker', 'Ollama', 'Git']
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsTerminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['Welcome to Skills Terminal! Type a skill to learn more...']);

  const handleCommand = (cmd) => {
    const commands = {
      'react': 'React.js - Advanced level. Building complex UIs and state management.',
      'javascript': 'JavaScript - Expert level. ES6+, async/await, functional programming.',
      'python': 'Python - Advanced level. Machine learning, data analysis, web development.',
      'node': 'Node.js - Advanced level. Backend development, API creation, microservices.',
      'mongodb': 'MongoDB - Intermediate level. Database design, aggregation, Atlas cloud.',
      'tensorflow': 'TensorFlow - Intermediate level. Deep learning, neural networks, AI models.',
      'docker': 'Docker - Intermediate level. Containerization, deployment, orchestration.',
      'flask': 'Flask - Advanced level. Python web framework, REST APIs, backend development.',
      'help': 'Available commands: react, javascript, python, node, mongodb, tensorflow, docker, flask, clear, skills, contact me, work',
      'skills': 'My tech stack: React, JavaScript, Python, Node.js, MongoDB, TensorFlow, Docker, Flask, Express',
      'contact me':'kumar.ayushx24@gmail.com',
      'work':'I have worked under an organisation called as Keploy as an intern where I have done a project which was based on multiple tasks such as CI/CD Pipelines, Automated Test Cases Testing using AI etc.',
      'clear': 'CLEAR'
    };

    if (cmd === 'clear') {
      setOutput(['Welcome to Skills Terminal! Type a skill to learn more...']);
    } else {
      const response = commands[cmd.toLowerCase()] || `Command '${cmd}' not found. Type 'help' for available commands.`;
      setOutput(prev => [...prev, `> ${cmd}`, response]);
    }
  };

  return (
    <div className="p-4 bg-black text-green-400 font-mono h-full">
      <div className="mb-4 max-h-96 overflow-y-auto">
        {output.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      <div className="flex">
        <span>$ </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setInput('');
            }
          }}
          className="bg-transparent border-none outline-none flex-1 text-green-400"
          autoFocus
        />
      </div>
    </div>
  );
};

const AboutApp = () => (
  <div className="p-6">
    <div className="flex items-center space-x-6 mb-6">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <User className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Ayush Kumar</h2>
        <p className="text-gray-600">Full Stack Developer & AI Enthusiast</p>
        <p className="text-gray-600">📍 Building the Future with Code</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">About Me</h3>
        <p className="text-gray-700">
          Passionate developer specializing in AI-powered healthcare solutions and full-stack web development. 
          I love creating innovative applications that solve real-world problems using cutting-edge technology.
        </p>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Journey Timeline</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">2024 - Developed MediScope-AI & DiagnosisSystem</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">2023 - Created FoodWise App</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm">2022 - Started Full Stack & AI Development</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [waitingForNew, setWaitingForNew] = useState(false);

  const inputNumber = (num) => {
    if (waitingForNew) {
      setDisplay(String(num));
      setWaitingForNew(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNew(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNew(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setOperation(null);
    setPreviousValue(null);
    setWaitingForNew(false);
  };

  return (
    <div className="p-6">
      <div className="bg-black text-white p-4 rounded-lg mb-4 text-right text-2xl font-mono">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600">
          C
        </button>
        <button onClick={() => inputOperation('/')} className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          /
        </button>
        <button onClick={() => inputOperation('*')} className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          *
        </button>
        <button onClick={() => inputOperation('-')} className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          -
        </button>
        
        {[7,8,9].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(num)}
            className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            {num}
          </button>
        ))}
        <button onClick={() => inputOperation('+')} className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 row-span-2">
          +
        </button>
        
        {[4,5,6].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(num)}
            className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            {num}
          </button>
        ))}
        
        {[1,2,3].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(num)}
            className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            {num}
          </button>
        ))}
        <button onClick={performCalculation} className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 row-span-2">
          =
        </button>
        
        <button onClick={() => inputNumber(0)} className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg col-span-2">
          0
        </button>
        <button onClick={() => setDisplay(display + '.')} className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg">
          .
        </button>
      </div>
    </div>
  );
};

const SystemMonitor = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">System Monitor</h2>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span>Creativity Usage</span>
          <span>99%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{width: '99%'}}></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span>Problem Solving</span>
          <span>95%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: '95%'}}></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span>Coffee Levels</span>
          <span>85%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '85%'}}></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span>AI Model Training</span>
          <span>92%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full" style={{width: '92%'}}></div>
        </div>
      </div>
    </div>
  </div>
);

// Snake Game Component
const SnakeGame = () => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const gameAreaRef = useRef();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowDown':
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
        case 'ArrowLeft':
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowRight':
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];
        
        // Check collision with walls
        if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
          setGameRunning(false);
          return currentSnake;
        }
        
        // Check collision with self
        if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
          setGameRunning(false);
          return currentSnake;
        }
        
        newSnake.unshift(head);
        
        // Check if food is eaten
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore(prev => prev + 10);
          setFood([
            Math.floor(Math.random() * 20),
            Math.floor(Math.random() * 20)
          ]);
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameRunning]);

  const startGame = () => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection([0, 1]);
    setScore(0);
    setGameRunning(true);
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Snake Game</h3>
        <p className="text-sm text-gray-600">Score: {score}</p>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="mx-auto bg-gray-800 border-2 border-gray-600"
        style={{
          width: '400px',
          height: '400px',
          position: 'relative'
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-400' : 'bg-green-300'}`}
            style={{
              left: `${segment[1] * 20}px`,
              top: `${segment[0] * 20}px`,
              width: '20px',
              height: '20px'
            }}
          />
        ))}
        
        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: `${food[1] * 20}px`,
            top: `${food[0] * 20}px`,
            width: '20px',
            height: '20px'
          }}
        />
      </div>
      
      <div className="mt-4">
        {!gameRunning ? (
          <button
            onClick={startGame}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {score > 0 ? 'Play Again' : 'Start Game'}
          </button>
        ) : (
          <p className="text-sm text-gray-600">Use arrow keys to control the snake</p>
        )}
      </div>
    </div>
  );
};

// Tic Tac Toe Game Component
const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    
    if (squares.every(square => square !== null)) {
      return 'tie';
    }
    
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">Tic Tac Toe</h3>
      
      <div className="mb-4">
        {winner ? (
          <p className="text-lg font-semibold">
            {winner === 'tie' ? "It's a tie!" : `Player ${winner} wins!`}
          </p>
        ) : (
          <p className="text-lg">Current player: <span className="font-bold">{currentPlayer}</span></p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 w-48 mx-auto mb-4">
        {board.map((square, index) => (
          <button
            key={index}
            className="w-14 h-14 bg-gray-200 border-2 border-gray-400 text-2xl font-bold hover:bg-gray-300 transition-colors"
            onClick={() => handleClick(index)}
          >
            {square}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        New Game
      </button>
    </div>
  );
};

const GamesApp = () => {
  const [activeGame, setActiveGame] = useState('menu');

  return (
    <div className="p-6">
      {activeGame === 'menu' && (
        <>
          <h2 className="text-2xl font-bold mb-6">Games</h2>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="border rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setActiveGame('snake')}
            >
              <Gamepad2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <span className="font-semibold">Snake Game</span>
              <p className="text-sm text-gray-600 mt-1">Classic snake game</p>
            </div>
            <div 
              className="border rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setActiveGame('tictactoe')}
            >
              <Gamepad2 className="w-12 h-12 mx-auto mb-2 text-blue-500" />
              <span className="font-semibold">Tic Tac Toe</span>
              <p className="text-sm text-gray-600 mt-1">Two player game</p>
            </div>
          </div>
        </>
      )}

      {activeGame === 'snake' && (
        <div>
          <button 
            onClick={() => setActiveGame('menu')}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Back to Games
          </button>
          <SnakeGame />
        </div>
      )}

      {activeGame === 'tictactoe' && (
        <div>
          <button 
            onClick={() => setActiveGame('menu')}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Back to Games
          </button>
          <TicTacToe />
        </div>
      )}
    </div>
  );
};

export default PersonalOS;