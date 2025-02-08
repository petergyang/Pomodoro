class PomodoroTimer {
    constructor() {
        // Initialize timer state variables
        this.timeLeft = 25 * 60; // Convert 25 minutes to seconds for internal tracking
        this.timerId = null;     // Will store the setInterval ID for stopping/starting timer
        this.isRunning = false;  // Tracks whether timer is currently counting down
        
        // Get references to DOM elements we'll need to interact with
        this.timeDisplay = document.querySelector('.time-display');    // Shows current time
        this.startButton = document.getElementById('start');           // Start/Pause button
        this.resetButton = document.getElementById('reset');           // Reset timer button
        this.modeButtons = document.querySelectorAll('.mode-btn');     // Buttons for different timer durations
        
        // Add after the existing constructor variables
        this.circle = document.querySelector('.progress-ring__circle-progress');
        this.radius = this.circle.r.baseVal.value;
        this.circumference = 2 * Math.PI * this.radius;
        
        // Initialize the circle
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;
        
        // Set up event listeners for user interactions
        this.startButton.addEventListener('click', () => this.toggleTimer());  // Handle start/pause
        this.resetButton.addEventListener('click', () => this.reset());        // Handle reset
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeMode(e));          // Handle mode changes
        });
    }

    // Converts raw seconds into MM:SS display format
    // e.g., 125 seconds becomes "02:05"
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Updates the visible timer display with current time
    updateDisplay() {
        this.timeDisplay.textContent = this.formatTime(this.timeLeft);
        
        // Calculate and update progress
        const activeButton = document.querySelector('.mode-btn.active');
        const totalSeconds = parseInt(activeButton.dataset.time) * 60;
        const progress = (this.timeLeft / totalSeconds) * 100;
        this.setProgress(progress);
        
        // Update the page title
        document.title = `Pomodoro: ${this.formatTime(this.timeLeft)}`;
    }

    // Handles the start/pause button toggle
    toggleTimer() {
        if (this.isRunning) {
            this.pause();
            this.startButton.textContent = 'Start';
        } else {
            this.start();
            this.startButton.textContent = 'Pause';
        }
    }

    // Starts the timer countdown
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            // Create interval that runs every second (1000ms)
            this.timerId = setInterval(() => {
                this.timeLeft--;                  // Decrease remaining time
                this.updateDisplay();             // Update the display
                
                // Check if timer has finished
                if (this.timeLeft === 0) {
                    this.playAlarm();             // Play completion sound/alert
                    this.pause();                 // Stop the timer
                    this.startButton.textContent = 'Start';
                }
            }, 1000);
        }
    }

    // Pauses the timer
    pause() {
        clearInterval(this.timerId);    // Stop the countdown interval
        this.isRunning = false;
    }

    // Resets timer to starting time of current mode
    reset() {
        this.pause();    // Stop any running timer
        // Get currently selected mode's time value
        const activeButton = document.querySelector('.mode-btn.active');
        const minutes = parseInt(activeButton.dataset.time);
        this.timeLeft = minutes * 60;    // Convert minutes to seconds
        this.updateDisplay();
        this.startButton.textContent = 'Start';
    }

    // Handles switching between different timer modes (e.g., work, short break, long break)
    changeMode(e) {
        // Update visual state of mode buttons
        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.pause();    // Stop current timer
        // Get new mode's time value from button's data-time attribute
        const minutes = parseInt(e.target.dataset.time);
        this.timeLeft = minutes * 60;    // Convert to seconds
        this.updateDisplay();
        this.startButton.textContent = 'Start';
    }

    // Triggered when timer reaches zero
    playAlarm() {
        // You can add a sound effect here
        alert('Time is up!');
    }

    // Add this new method
    setProgress(percent) {
        const offset = this.circumference - (percent / 100 * this.circumference);
        this.circle.style.strokeDashoffset = offset;
    }
}

// Create new timer instance when page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
}); 