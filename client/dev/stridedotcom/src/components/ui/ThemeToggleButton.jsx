import { Moon, Sun } from 'lucide-react';

const ThemeToggleButton = ({ isDark, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="relative w-8 h-8"
            aria-label="Toggle Theme"
        >
            {/* Animated wrapper */}
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                style={{ transform: `rotate(${isDark ? 180 : 0}deg)` }}>
                {isDark
                ? <Sun className={`text-yellow-400 w-6 h-6 ${isDark ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} />
                : <Moon className={`text-blue-500 w-6 h-6 ${isDark ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
}
            </span>
        </button>
    );
};

export default ThemeToggleButton;
