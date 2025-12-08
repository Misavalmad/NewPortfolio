// --- Sound Effects ---
let isToneStarted = false;
const hoverSynth = new Tone.Synth({ 
    oscillator: { type: 'sine' }, 
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.2 } 
}).toDestination();

const clickSynth = new Tone.MembraneSynth({ 
    pitchDecay: 0.01, 
    octaves: 3, 
    oscillator: { type: 'sine' }, 
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 } 
}).toDestination();

function startAudioContext() {
    if (!isToneStarted) {
        Tone.start();
        isToneStarted = true;
        document.body.removeEventListener('click', startAudioContext);
        document.body.removeEventListener('keydown', startAudioContext);
    }
}

document.body.addEventListener('click', startAudioContext);
document.body.addEventListener('keydown', startAudioContext);

document.querySelectorAll('a, button').forEach(elem => {
    elem.addEventListener('mouseenter', () => { 
        if(isToneStarted) hoverSynth.triggerAttackRelease("C5", "16n"); 
    });
    elem.addEventListener('click', () => { 
        if(isToneStarted) clickSynth.triggerAttackRelease("C3", "8n"); 
    });
});

// --- Glitch Effect ---
const glitchTitle = document.getElementById('glitch-title');
const originalText = glitchTitle.dataset.text;
const chars = "!<>-_\\/[]{}—=+*^?#________";
let intervalId = null;

const startGlitch = () => {
    let iteration = 0;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        glitchTitle.innerText = originalText.split("").map((letter, index) => {
            if (index < iteration) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        if (iteration >= originalText.length) clearInterval(intervalId);
        iteration += 1 / 3;
    }, 30);
};

startGlitch();
glitchTitle.addEventListener('mouseover', startGlitch);

// --- Mobile Menu ---
document.getElementById('mobile-menu-button').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// --- Fade In Animation ---
const sections = document.querySelectorAll('.fade-in-section');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// --- Terminal Logic ---
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const commandHistory = [];
let historyIndex = -1;

const welcomeMessage = "Type 'help' to see the list of available commands.\n";

function typeWriter(text, i = 0) {
    if (i < text.length) {
        terminalOutput.innerHTML += text.charAt(i);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        setTimeout(() => typeWriter(text, i + 1), 15);
    }
}

typeWriter(welcomeMessage);

terminalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const command = this.value.trim().toLowerCase();
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        
        const outputLine = document.createElement('div');
        outputLine.innerHTML = `<span class="terminal-prompt">user@mvalencia:~$ </span>${command}`;
        terminalOutput.appendChild(outputLine);
        
        processCommand(command);
        this.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            this.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
         if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            this.value = commandHistory[historyIndex];
        } else {
            this.value = '';
        }
    }
});

function processCommand(command) {
    const output = document.createElement('div');
    output.classList.add('terminal-output');
    let response = '';

    const commands = {
        'help': `Available commands:\n<span>about</span> - Shows information about me.\n<span>skills</span> - Lists my technical skills.\n<span>projects</span> - Shows my featured projects.\n<span>contact</span> - Shows my contact information.\n<span>social</span> - Links to my social media.\n<span>experience</span> - Shows my professional experience.\n<span>clear</span> - Clears the terminal.`,
        'about': `Full Stack Web Developer with a strong foundation in Computational Technologies Engineering. I specialize in creating modern, responsive web applications using React, JavaScript, and cutting-edge frontend technologies. My passion lies at the intersection of elegant code architecture and user-centric design, always seeking to deliver seamless digital experiences.`,
        'skills': `<span>Frontend:</span> HTML5, CSS3, JavaScript, React, Bootstrap, Tailwind CSS\n<span>Backend & Database:</span> MySQL, SQL\n<span>Tools:</span> Git, GitHub\n<span>Game Development:</span> Unreal Engine, C++`,
        'projects': `1. <span>Weather Dashboard:</span> Interactive weather app with real-time API data.\n2. <span>YouTube MP3 API:</span> Node.js API for converting YouTube videos to MP3.\n3. <span>Portfolio Cyberpunk:</span> This interactive portfolio with terminal features.\n4. <span>Calculator App:</span> Web calculator with clean UI and smooth functionality.\n5. <span>Pensamiento Creativo con IA:</span> AI creative thinking lab project.`,
        'contact': `You can contact me at:\nEmail: <a href="mailto:misavalmad@gmail.com" class="text-secondary-neon">misavalmad@gmail.com</a>\nPhone: Available upon request`,
        'social': `LinkedIn: <a href="https://www.linkedin.com/in/misael-valencia-madrigal-444168248/" target="_blank" class="text-secondary-neon">linkedin.com/in/misael-valencia-madrigal-444168248/</a>\nGitHub: <a href="https://github.com/Misavalmad" target="_blank" class="text-secondary-neon">github.com/Misavalmad</a>`,
        'experience': `<span>Full Stack Developer</span>\nSpecializing in modern web technologies and scalable application development.\n\n<span>Education:</span>\nComputational Technologies Engineering\n\n<span>Focus Areas:</span>\n• Frontend: React, JavaScript, HTML5, CSS3, Bootstrap, Tailwind CSS\n• Backend & Database: MySQL, SQL\n• Tools: Git, GitHub\n• Game Development: Unreal Engine, C++`,
        'clear': () => { terminalOutput.innerHTML = ''; return ''; }
    };

    if(typeof commands[command] === 'function') {
        response = commands[command]();
    } else {
        response = commands[command] || `Command not found: ${command}. Type 'help' to see the list of commands.`;
    }

    output.innerHTML = response.replace(/\n/g, '<br>');
    terminalOutput.appendChild(output);
}
