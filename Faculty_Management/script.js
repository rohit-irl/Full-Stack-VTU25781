// ============================================
// Faculty Management System - JavaScript
// ============================================

// Global State
const appState = {
    isLoggedIn: false,
    currentFaculty: null,
    currentTab: 'dashboard',
    attendanceData: {},
    leaveRequests: []
};

// ============================================
// LOGIN FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Initialize date input with today's date
    const attendanceDate = document.getElementById('attendanceDate');
    if (attendanceDate) {
        attendanceDate.valueAsDate = new Date();
    }

    // Set up menu click handlers
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Leave form date change handler
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    if (fromDate && toDate) {
        fromDate.addEventListener('change', calculateLeaveDays);
        toDate.addEventListener('change', calculateLeaveDays);
    }

    // File input change handler
    const materialFile = document.getElementById('materialFile');
    if (materialFile) {
        materialFile.addEventListener('change', handleFileSelect);
    }

    // Signup toggle & handlers
    const showSignup = document.getElementById('showSignup');
    const cancelSignup = document.getElementById('cancelSignup');
    const signupForm = document.getElementById('signupForm');
    if (showSignup) showSignup.addEventListener('click', function(e){ e.preventDefault(); toggleSignup(true); });
    if (cancelSignup) cancelSignup.addEventListener('click', function(e){ e.preventDefault(); toggleSignup(false); });
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Auto-login if user saved in storage
    autoLoginIfRemembered();
});

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember') && document.getElementById('remember').checked;

    // Basic validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    // Check registered users
    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
        if (found.password !== password) {
            showAlert('Incorrect password', 'error');
            return;
        }

        // Successful login for registered user
        setCurrentUser(found, remember);
        showAlert('Login successful!', 'success');
        switchPage('dashboardPage');
        toggleSignup(false);
        return;
    }

    // Fallback: allow simple email-based login when no registered user exists
    if (email.includes('@')) {
        appState.isLoggedIn = true;
        appState.currentFaculty = {
            id: 'FAC-2024-001',
            name: extractNameFromEmail(email),
            email: email
        };

        // Store as current user if remember checked
        if (remember) {
            const guest = { id: appState.currentFaculty.id, name: appState.currentFaculty.name, email: appState.currentFaculty.email };
            localStorage.setItem('fms_currentUser', JSON.stringify(guest));
        }

        const facultyName = document.getElementById('facultyName');
        if (facultyName) facultyName.textContent = appState.currentFaculty.name;

        switchPage('dashboardPage');
        showAlert('Login successful!', 'success');
    } else {
        showAlert('Invalid email format', 'error');
    }
}

// Toggle visibility between login and signup
function toggleSignup(show) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const signupToggle = document.querySelector('.signup-toggle');
    if (!signupForm || !loginForm) return;
    if (show) {
        signupForm.style.display = '';
        loginForm.style.display = 'none';
        if (signupToggle) signupToggle.style.display = 'none';
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = '';
        if (signupToggle) signupToggle.style.display = '';
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (!name || !email || !password || !confirm) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirm) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showAlert('An account with this email already exists', 'error');
        return;
    }

    const user = {
        id: 'FAC-' + generateId(),
        name: name,
        email: email,
        password: password
    };

    users.push(user);
    saveStoredUsers(users);

    // Auto-login and remember by default after signup
    setCurrentUser(user, true);
    showAlert('Account created and logged in', 'success');
    switchPage('dashboardPage');
    document.getElementById('signupForm').reset();
}

// Persistence helpers
function getStoredUsers() {
    try {
        return JSON.parse(localStorage.getItem('fms_users') || '[]');
    } catch (e) {
        return [];
    }
}

function saveStoredUsers(users) {
    localStorage.setItem('fms_users', JSON.stringify(users));
}

function setCurrentUser(user, remember = false) {
    appState.isLoggedIn = true;
    appState.currentFaculty = { id: user.id, name: user.name, email: user.email };
    const facultyName = document.getElementById('facultyName');
    if (facultyName) facultyName.textContent = user.name;

    const storageUser = { id: user.id, name: user.name, email: user.email };
    if (remember) {
        localStorage.setItem('fms_currentUser', JSON.stringify(storageUser));
        sessionStorage.removeItem('fms_currentUser');
    } else {
        sessionStorage.setItem('fms_currentUser', JSON.stringify(storageUser));
    }
}

function autoLoginIfRemembered() {
    try {
        const saved = JSON.parse(localStorage.getItem('fms_currentUser') || sessionStorage.getItem('fms_currentUser') || 'null');
        if (saved && saved.email) {
            appState.isLoggedIn = true;
            appState.currentFaculty = { id: saved.id || 'FAC-000', name: saved.name || extractNameFromEmail(saved.email), email: saved.email };
            const facultyName = document.getElementById('facultyName');
            if (facultyName) facultyName.textContent = appState.currentFaculty.name;
            switchPage('dashboardPage');
            showAlert('Welcome back, ' + appState.currentFaculty.name, 'success');
        }
    } catch (e) {
        // ignore
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        appState.isLoggedIn = false;
        appState.currentFaculty = null;
        switchPage('loginPage');
        document.getElementById('loginForm').reset();
        showAlert('Logged out successfully', 'success');
    }
}

function extractNameFromEmail(email) {
    const name = email.split('@')[0];
    return name
        .split('.')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ============================================
// PAGE & TAB SWITCHING
// ============================================

function switchPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function switchTab(tabId) {
    event && event.preventDefault();

    // Update active tab in content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        }
    });

    appState.currentTab = tabId;
}

function handleMenuClick(event) {
    event.preventDefault();
    const tabId = this.getAttribute('data-tab');
    switchTab(tabId);
}

// ============================================
// ATTENDANCE FUNCTIONALITY
// ============================================

function loadAttendanceList() {
    const subject = document.getElementById('attendanceSubject').value;
    const date = document.getElementById('attendanceDate').value;

    if (!subject) {
        showAlert('Please select a subject', 'error');
        return;
    }

    if (!date) {
        showAlert('Please select a date', 'error');
        return;
    }

    const attendanceList = document.getElementById('attendanceList');
    attendanceList.style.display = 'block';

    // Update class info
    const subjectName = document.getElementById('attendanceSubject').options[document.getElementById('attendanceSubject').selectedIndex].text;
    const formattedDate = formatDate(new Date(date));
    const classInfo = attendanceList.querySelector('h3');
    classInfo.textContent = `Class: ${subjectName} | Date: ${formattedDate}`;

    showAlert('Student list loaded successfully', 'success');
}

function saveAttendance() {
    const subject = document.getElementById('attendanceSubject').value;
    const date = document.getElementById('attendanceDate').value;

    if (!subject || !date) {
        showAlert('Please load students first', 'error');
        return;
    }

    const rows = document.querySelectorAll('.attendance-table tbody tr');
    const attendanceRecords = [];

    rows.forEach(row => {
        const rollNo = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const statusInput = row.querySelector('input[type="radio"]:checked');
        
        if (statusInput) {
            attendanceRecords.push({
                rollNo: rollNo,
                name: name,
                status: statusInput.value
            });
        }
    });

    if (attendanceRecords.length === 0) {
        showAlert('Please mark attendance for at least one student', 'error');
        return;
    }

    // Store in appState
    const key = `${subject}_${date}`;
    appState.attendanceData[key] = attendanceRecords;

    showAlert(`Attendance saved for ${attendanceRecords.length} students`, 'success');
    resetAttendance();
}

function resetAttendance() {
    const radios = document.querySelectorAll('.attendance-table input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
}

// ============================================
// LEAVE REQUEST FUNCTIONALITY
// ============================================

function calculateLeaveDays() {
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const daysInput = document.getElementById('days');

    if (fromDate.value && toDate.value) {
        const from = new Date(fromDate.value);
        const to = new Date(toDate.value);
        
        if (to >= from) {
            const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
            daysInput.value = days;
        } else {
            showAlert('End date must be after start date', 'error');
            daysInput.value = '';
        }
    }
}

function submitLeaveRequest(event) {
    event.preventDefault();

    const leaveType = document.getElementById('leaveType').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const reason = document.getElementById('reason').value;
    const coverage = document.getElementById('coverage').value;

    if (!leaveType || !fromDate || !toDate || !reason || !coverage) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    const leaveRequest = {
        id: 'LRQ-' + generateId(),
        type: leaveType,
        from: fromDate,
        to: toDate,
        reason: reason,
        coverage: coverage,
        status: 'pending',
        submittedDate: new Date().toLocaleDateString()
    };

    appState.leaveRequests.push(leaveRequest);

    // Add to leave history
    addLeaveToHistory(leaveRequest);

    showAlert('Leave request submitted successfully', 'success');
    document.getElementById('leaveForm').reset();
    document.getElementById('days').value = '';
}

function addLeaveToHistory(leave) {
    const leaveList = document.querySelector('.leave-list');
    
    const leaveItemHTML = `
        <div class="leave-item ${leave.status}">
            <div class="leave-header">
                <h4>${capitalize(leave.type)} Leave</h4>
                <span class="status-badge ${leave.status}">${capitalize(leave.status)}</span>
            </div>
            <p>${formatDate(new Date(leave.from))} to ${formatDate(new Date(leave.to))} (${calculateDays(leave.from, leave.to)} days)</p>
            <p class="reason">${leave.reason}</p>
        </div>
    `;

    leaveList.insertAdjacentHTML('afterbegin', leaveItemHTML);
}

// ============================================
// MATERIALS UPLOAD FUNCTIONALITY
// ============================================

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const fileName = file.name;
        const fileSize = (file.size / 1024).toFixed(2);
        const fileLabel = document.querySelector('.file-label');
        fileLabel.textContent = `✓ ${fileName} (${fileSize} KB)`;
        fileLabel.style.borderColor = 'var(--success-color)';
        fileLabel.style.color = 'var(--success-color)';
    }
}

function handleUpload(event) {
    event.preventDefault();

    const subject = document.getElementById('materialSubject').value;
    const type = document.getElementById('materialType').value;
    const name = document.getElementById('materialName').value;
    const file = document.getElementById('materialFile').files[0];
    const description = document.getElementById('materialDescription').value;

    if (!subject || !type || !name || !file) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    const material = {
        id: 'MAT-' + generateId(),
        subject: subject,
        type: type,
        name: name,
        fileName: file.name,
        description: description,
        uploadedDate: new Date().toLocaleDateString(),
        downloads: Math.floor(Math.random() * 100)
    };

    // Add to materials list
    addMaterialToList(material);

    showAlert('Material uploaded successfully', 'success');
    document.getElementById('uploadForm').reset();
    const fileLabel = document.querySelector('.file-label');
    fileLabel.textContent = 'Choose PDF, Doc, or Presentation';
    fileLabel.style.borderColor = 'var(--border-color)';
    fileLabel.style.color = 'var(--text-light)';
}

function addMaterialToList(material) {
    const materialsList = document.querySelector('.materials-list');
    
    // Get or create group for subject
    let subjectGroup = Array.from(document.querySelectorAll('.materials-group')).find(group => {
        return group.querySelector('.subject-header').textContent.includes(material.subject);
    });

    if (!subjectGroup) {
        const newGroup = document.createElement('div');
        newGroup.className = 'materials-group';
        newGroup.innerHTML = `
            <h4 class="subject-header">${material.subject}</h4>
        `;
        materialsList.appendChild(newGroup);
        subjectGroup = newGroup;
    }

    const materialIcons = {
        'lecture': '📄',
        'assignment': '📋',
        'slides': '📊',
        'video': '🎥',
        'resource': '📚'
    };

    const materialItemHTML = `
        <div class="material-item">
            <div class="material-icon">${materialIcons[material.type] || '📄'}</div>
            <div class="material-info">
                <h5>${material.name}</h5>
                <p>Type: ${capitalize(material.type)} | Uploaded: ${material.uploadedDate}</p>
                <p>Downloaded: ${material.downloads} times</p>
            </div>
            <div class="material-actions">
                <button class="btn-small" onclick="downloadMaterial('${material.id}')">Download</button>
                <button class="btn-small delete" onclick="deleteMaterial('${material.id}')">Delete</button>
            </div>
        </div>
    `;

    subjectGroup.insertAdjacentHTML('beforeend', materialItemHTML);
}

function downloadMaterial(materialId) {
    showAlert('Material download initiated', 'success');
}

function deleteMaterial(materialId) {
    if (confirm('Are you sure you want to delete this material?')) {
        event.target.closest('.material-item').remove();
        showAlert('Material deleted successfully', 'success');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

function calculateDays(fromDate, toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showAlert(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${getAlertColor(type)};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        max-width: 300px;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function getAlertColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    return colors[type] || colors['info'];
}

// ============================================
// ANIMATIONS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// DEMO DATA INITIALIZATION
// ============================================

window.addEventListener('load', function() {
    // Add some demo leave requests on load
    if (appState.leaveRequests.length === 0) {
        appState.leaveRequests = [
            {
                id: 'LRQ-001',
                type: 'casual',
                from: '2026-01-15',
                to: '2026-01-17',
                reason: 'Family function',
                status: 'approved',
                submittedDate: '2026-01-10'
            },
            {
                id: 'LRQ-002',
                type: 'sick',
                from: '2026-01-25',
                to: '2026-01-26',
                reason: 'Medical appointment',
                status: 'pending',
                submittedDate: '2026-01-23'
            },
            {
                id: 'LRQ-003',
                type: 'earned',
                from: '2026-01-10',
                to: '2026-01-14',
                reason: 'Vacation',
                status: 'rejected',
                submittedDate: '2026-01-05'
            }
        ];
    }
});

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ============================================

window.switchTab = switchTab;
window.loadAttendanceList = loadAttendanceList;
window.saveAttendance = saveAttendance;
window.resetAttendance = resetAttendance;
window.submitLeaveRequest = submitLeaveRequest;
window.handleUpload = handleUpload;
window.downloadMaterial = downloadMaterial;
window.deleteMaterial = deleteMaterial;