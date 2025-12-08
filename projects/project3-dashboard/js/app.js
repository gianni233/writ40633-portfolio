// ==========================================
// PROJECT 3: PERSONAL DATA DASHBOARD
// LAB16: fetch() and JSON Basics
// ==========================================

console.log('Dashboard app loaded!');
console.log('LAB16: Learning fetch() API');

// Function to load weather data
function loadWeather() {
    console.log('🌤️ Loading weather data...');

    fetch('./data/weather.json')
        .then(response => {
            console.log('✅ Got response:', response);
            return response.json();
        })
        .then(data => {
            console.log('✅ Weather data loaded:', data);
            displayWeather(data);
        })
        .catch(error => {
            console.error('❌ Error loading weather:', error);
            displayWeatherError();
        });
}


// Function to display weather data in the DOM (updated to include 3-day forecast)
function displayWeather(weather) {
    console.log('📊 Displaying weather data...');

    const weatherDisplay = document.getElementById('weather-display');

    // Build current weather section 
    const icon = weather.icon || '🌤️';
    const temp = (weather.temperature !== undefined) ? `${weather.temperature}°F` : '—';
    const location = weather.location || weather.city || 'Unknown location';
    const condition = weather.condition || '';

    // Additional details
    const humidity = (weather.humidity !== undefined) ? `${weather.humidity}%` : '—';
    const wind = (weather.windSpeed !== undefined) ? `${weather.windSpeed} mph` : '—';
    const feelsLike = (weather.feelsLike !== undefined) ? `${weather.feelsLike}°F` : '—';

    // Current weather HTML (added emojis for details)
    let html = `
        <div class="weather-current">
            <div class="weather-icon">${icon}</div>
            <div class="weather-temp">${temp}</div>
            <div class="weather-location">${location}</div>
            <div class="weather-condition">${condition}</div>
        </div>

        <div class="weather-details" aria-label="current weather details">
            <div class="weather-detail">
                <span>💧 Humidity</span>
                <strong>${humidity}</strong>
            </div>
            <div class="weather-detail">
                <span>🌬️ Wind</span>
                <strong>${wind}</strong>
            </div>
            <div class="weather-detail">
                <span>🌡️ Feels like</span>
                <strong>${feelsLike}</strong>
            </div>
        </div>
    `;

    // Build forecast if available (expecting an array at weather.forecast)
    if (Array.isArray(weather.forecast) && weather.forecast.length > 0) {
        const forecastDays = weather.forecast.slice(0, 3);
        html += `<div class="weather-forecast" aria-label="3 day forecast">`;

        forecastDays.forEach(day => {
            const dateVal = day.date || day.day || day.dt || null;
            const dayLabel = formatForecastDay(dateVal);
            const dayIcon = day.icon || day.weatherIcon || '⛅';
            const high = (day.high !== undefined) ? `${day.high}°H` : (day.tempHigh !== undefined ? `${day.tempHigh}°` : '—');
            const low = (day.low !== undefined) ? `${day.low}°L` : (day.tempLow !== undefined ? `${day.tempLow}°` : '—');
            const cond = day.condition || day.summary || '';

            html += `
                <div class="forecast-day">
                    <div class="forecast-day-label">${dayLabel}</div>
                    <div class="forecast-day-icon">${dayIcon}</div>
                    <div class="forecast-day-temp">
                        <span class="temp-high">${high}</span>
                        <span class="temp-low">${low}</span>
                    </div>
                    <div class="forecast-day-cond">${cond}</div>
                </div>
            `;
        });

        html += `</div>`;
    } else {
        html += `<div class="forecast-empty">3-day forecast not available</div>`;
    }

    weatherDisplay.innerHTML = html;

    console.log('✅ Weather displayed successfully!');
}

// Helper: turns a date string / timestamp / label into a short weekday (Mon, Tue, etc.)
function formatForecastDay(dateVal) {
    if (!dateVal) return 'N/A';
    // If it's already a short label like "Tue", return it
    if (typeof dateVal === 'string' && /^[A-Za-z]{3,}$/.test(dateVal)) return dateVal;
    // If it's a numeric unix timestamp (seconds)
    if (typeof dateVal === 'number') {
        // if looks like seconds (10 digits) vs ms (13 digits)
        const ts = (dateVal < 1e12) ? dateVal * 1000 : dateVal;
        return new Date(ts).toLocaleDateString(undefined, { weekday: 'short' });
    }
    // Try to parse string date
    const parsed = Date.parse(dateVal);
    if (!isNaN(parsed)) {
        return new Date(parsed).toLocaleDateString(undefined, { weekday: 'short' });
    }
    // fallback to the raw value truncated
    return String(dateVal).slice(0, 10);
}

// Function to show error message if weather data fails to load
function displayWeatherError() {
    const weatherDisplay = document.getElementById('weather-display');

    weatherDisplay.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <p>Could not load weather data</p>
            <p class="error-hint">Check console for details</p>
        </div>
    `;
}

// Load weather data when page loads
loadWeather();


// Global variable to store all quotes
let allQuotes = [];
let currentQuoteIndex = -1; // Track current quote to avoid repeats

// Function to load quotes from JSON
function loadQuotes() {
  console.log('Loading quotes...');

  fetch('./data/quotes.json')
    .then(response => {
      console.log('Got quotes response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Quotes data:', data);
      allQuotes = data; // Store quotes in global variable
      displayRandomQuote(); // Show first quote
    })
    .catch(error => {
      console.error('Error loading quotes:', error);
      displayQuotesError();
    });
}

// Function to display a random quote
function displayRandomQuote() {
  // Make sure we have quotes loaded
  if (allQuotes.length === 0) {
    console.error('No quotes available');
    return;
  }

  // Get random index (different from current)
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allQuotes.length);
  } while (randomIndex === currentQuoteIndex && allQuotes.length > 1);

  currentQuoteIndex = randomIndex;
  const quote = allQuotes[randomIndex];

  // Display the quote
  const quotesDisplay = document.getElementById('quotes-display');
  quotesDisplay.innerHTML = `
    <div class="quote-card"> 
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>
  `;

  console.log('Displayed quote:', quote);
}

// Function to show error message
function displayQuotesError() {
  const quotesDisplay = document.getElementById('quotes-display');
  quotesDisplay.innerHTML = `
    <div class="error-message">
      ⚠️ Could not load quotes
    </div>
  `;
}

// Call loadQuotes when page loads
loadQuotes();

// Set up "New Quote" button
function setupQuotesButton() {
  const newQuoteBtn = document.getElementById('new-quote-btn');

  newQuoteBtn.addEventListener('click', () => {
    console.log('New quote button clicked!');
    displayRandomQuote();
  });
}

// Call setupQuotesButton after DOM is loaded
setupQuotesButton();
// ========================================
// TASKS WIDGET (from LAB18)
// ========================================

// Function to load tasks from localStorage
function loadTasks() {
  const tasksJSON = localStorage.getItem('dashboardTasks');

  if (tasksJSON) {
    return JSON.parse(tasksJSON);
  } else {
    return []; // Return empty array if no tasks yet
  }
}

// Function to save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
  console.log('Tasks saved:', tasks);
}
// Function to display all tasks
function displayTasks() {
  const tasks = loadTasks();
  const tasksList = document.getElementById('tasks-list');

  // If no tasks, show message
  if (tasks.length === 0) {
    tasksList.innerHTML = `
      <div class="no-tasks">
        No tasks yet. Add one above! ✨
      </div>
    `;
    updateTaskStats(tasks);
    return;
  }

  // Clear existing tasks
  tasksList.innerHTML = '';

  // Display each task
  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index));

    // Create task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    // Append all elements to task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);

    tasksList.appendChild(taskItem);
  });

  updateTaskStats(tasks);
}
// Function to add a new task
function addTask(taskText) {
  const tasks = loadTasks();

  const newTask = {
    text: taskText,
    completed: false,
    id: Date.now() // Unique ID using timestamp
  };

  tasks.push(newTask);
  saveTasks(tasks);
  displayTasks();

  console.log('Task added:', newTask);
}

// Set up form submission
function setupTaskForm() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload

    const taskText = taskInput.value.trim();

    if (taskText) {
      addTask(taskText);
      taskInput.value = ''; // Clear input
      taskInput.focus(); // Focus back on input
    }
  });
}
// Function to toggle task complete/incomplete
function toggleTask(index) {
  const tasks = loadTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  displayTasks();

  console.log('Task toggled:', tasks[index]);
}
// Function to delete a task
function deleteTask(index) {
  const tasks = loadTasks();
  const taskToDelete = tasks[index];

  // Optional: Confirm before deleting
  if (confirm(`Delete task: "${taskToDelete.text}"?`)) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();

    console.log('Task deleted');
  }
}
// Function to update task statistics
function updateTaskStats(tasks) {
  const statsDiv = document.getElementById('task-stats');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (totalTasks === 0) {
    statsDiv.innerHTML = '';
    return;
  }

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  statsDiv.innerHTML = `
    <div class="stat">Total: <strong>${totalTasks}</strong></div>
    <div class="stat">Completed: <strong>${completedTasks}</strong></div>
    <div class="stat">Pending: <strong>${pendingTasks}</strong></div>
    <div class="stat">Progress: <strong>${completionPercentage}%</strong></div>
  `;
}
// Initialize tasks when page loads
displayTasks();
setupTaskForm(); 

// Theme Management
function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('dashboardTheme');

  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
    updateThemeIcon('dark');
  } else {
    updateThemeIcon('light');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('theme-dark');

  // Save preference
  localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');

  // Update icon
  updateThemeIcon(isDark ? 'dark' : 'light');

  console.log('Theme switched to:', isDark ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');

  if (theme === 'dark') {
    themeIcon.textContent = '☀️'; // Sun for dark mode (to switch to light)
  } else {
    themeIcon.textContent = '🌙'; // Moon for light mode (to switch to dark)
  }
}

function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

// Call these when page loads
initializeTheme();
setupThemeToggle();

// Date / Time display
function updateDateTime() {
  const el = document.getElementById('datetime');
  if (!el) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });

  el.textContent = `${dateStr} • ${timeStr}`;
}

function setupDateTime(intervalMs = 1000) {
  updateDateTime();
  setInterval(updateDateTime, intervalMs);
}

// Call date/time setup when page loads
setupDateTime();