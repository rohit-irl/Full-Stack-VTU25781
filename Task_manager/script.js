/* ============================================
   TASK MANAGER - JAVASCRIPT FUNCTIONALITY
   DOM Manipulation, Event Handling, and localStorage
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

// Main tasks array to store all task objects
let tasks = [];

// Current filter applied (all, pending, completed)
let currentFilter = 'all';

// ============================================
// DOM ELEMENTS - Cache selectors for performance
// ============================================

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// ============================================
// EVENT LISTENERS - Initialize all events
// ============================================

/**
 * Initialize all event listeners on page load
 */
function initializeEventListeners() {
    // Add task on button click
    addBtn.addEventListener('click', addTask);

    // Add task on Enter key press
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Filter buttons click listeners
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterBtns.forEach((button) => button.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            // Set current filter and re-render
            currentFilter = e.target.dataset.filter;
            filterTasks();
        });
    });
}

// ============================================
// MAIN FUNCTIONS - Core functionality
// ============================================

/**
 * Add a new task
 * - Validates input is not empty
 * - Creates task object
 * - Adds to tasks array
 * - Saves to localStorage
 * - Re-renders the task list
 */
function addTask() {
    // Get trimmed input value
    const taskText = taskInput.value.trim();

    // Validation: Check if input is empty
    if (taskText === '') {
        // Optional: You can add a visual feedback here
        taskInput.focus();
        taskInput.style.borderColor = '#ef4444';
        setTimeout(() => {
            taskInput.style.borderColor = '';
        }, 1000);
        return;
    }

    // Create task object with unique ID (using timestamp)
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
    };

    // Add task to tasks array
    tasks.push(newTask);

    // Clear input field for next task
    taskInput.value = '';
    taskInput.focus();

    // Save to localStorage
    saveToLocalStorage();

    // Update UI
    updateTaskCount();
    renderTasks();
}

/**
 * Delete a task by ID
 * @param {number} taskId - The unique ID of the task to delete
 */
function deleteTask(taskId) {
    // Filter out the task with matching ID
    tasks = tasks.filter((task) => task.id !== taskId);

    // Save updated tasks to localStorage
    saveToLocalStorage();

    // Update UI
    updateTaskCount();
    renderTasks();
}

/**
 * Toggle completed status of a task
 * @param {number} taskId - The unique ID of the task to toggle
 */
function toggleComplete(taskId) {
    // Find task and toggle its completed status
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
    }

    // Save updated state to localStorage
    saveToLocalStorage();

    // Update UI
    updateTaskCount();
    renderTasks();
}

/**
 * Update task count statistics
 * - Calculates total tasks
 * - Calculates completed tasks
 * - Calculates pending tasks
 */
function updateTaskCount() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    // Update display elements with counts
    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

/**
 * Filter and render tasks based on current filter
 * - Filters tasks array based on currentFilter value
 * - Renders filtered tasks
 * - Shows/hides empty state
 */
function filterTasks() {
    let filteredTasks;

    // Apply filter logic
    switch (currentFilter) {
        case 'completed':
            filteredTasks = tasks.filter((task) => task.completed);
            break;
        case 'pending':
            filteredTasks = tasks.filter((task) => !task.completed);
            break;
        case 'all':
        default:
            filteredTasks = tasks;
    }

    // Render the filtered tasks
    renderFilteredTasks(filteredTasks);
}

/**
 * Render filtered tasks in the DOM
 * @param {Array} tasksToRender - Array of task objects to render
 */
function renderFilteredTasks(tasksToRender) {
    // Clear current task list
    taskList.innerHTML = '';

    // Show/hide empty state based on whether there are tasks
    if (tasksToRender.length === 0) {
        emptyState.classList.add('active');
    } else {
        emptyState.classList.remove('active');
    }

    // Create and append each task element
    tasksToRender.forEach((task) => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

/**
 * Render all tasks (initial render and after filter changes)
 */
function renderTasks() {
    filterTasks();
}

/**
 * Create a single task DOM element
 * @param {Object} task - Task object with id, text, and completed fields
 * @returns {HTMLElement} - The created task list item element
 */
function createTaskElement(task) {
    // Create list item
    const li = document.createElement('li');
    li.className = 'task-item';

    // Add completed class if task is completed
    if (task.completed) {
        li.classList.add('completed');
    }

    // Create checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    // Create task text element
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Append elements to task item
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);

    return li;
}

// ============================================
// LOCALSTORAGE FUNCTIONS - Persistence
// ============================================

/**
 * Save tasks array to browser localStorage
 * - Converts tasks array to JSON string
 * - Stores under 'tasks' key
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load tasks array from browser localStorage
 * - Retrieves 'tasks' key from localStorage
 * - Parses JSON string back to array
 * - Handles errors gracefully
 * @returns {Array} - Array of task objects or empty array if none exist
 */
function loadFromLocalStorage() {
    try {
        const storedTasks = localStorage.getItem('tasks');
        // Parse JSON if tasks exist, otherwise return empty array
        return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
}

// ============================================
// INITIALIZATION - Run on page load
// ============================================

/**
 * Initialize the application
 * - Load tasks from localStorage
 * - Set up event listeners
 * - Render initial tasks
 * - Update task counts
 */
function initializeApp() {
    // Load saved tasks from localStorage
    tasks = loadFromLocalStorage();

    // Initialize all event listeners
    initializeEventListeners();

    // Render tasks on page load
    renderTasks();

    // Update task counts
    updateTaskCount();

    // Focus input for better UX
    taskInput.focus();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// ============================================
// ALTERNATIVE: Initialize immediately if DOM is ready
// ============================================
// Fallback for cases where DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
