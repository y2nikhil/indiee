// DOM Elements
const calendarToggle = document.getElementById('calendarToggle');
const calendarSidebar = document.getElementById('calendarSidebar');
const closeSidebar = document.querySelector('.close-sidebar');
const calendarGrid = document.getElementById('calendarGrid');
const upcomingExams = document.getElementById('upcomingExams');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const currentMonthEl = document.querySelector('.current-month');
const examModal = document.getElementById('examModal');
const prepareBtn = document.getElementById('prepareBtn');
const detailsBtn = document.getElementById('detailsBtn');
const daysCounter = document.getElementById('daysCounter');
const daysRemaining = document.getElementById('daysRemaining');
const targetExam = document.getElementById('targetExam');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const authFlipBtn = document.getElementById('authFlipBtn');
const notificationBanner = document.querySelector('.notification-banner');
const closeBanner = document.querySelector('.close-banner');

// Calendar Data
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedExam = null;

// Exam Data (Would normally come from a database)
const examData = [
    {
        id: 'ssc-cgl-2023',
        name: 'SSC CGL Tier-I',
        date: new Date(2023, 10, 15), // Nov 15, 2023
        deadline: '2023-09-30',
        description: 'Staff Selection Commission Combined Graduate Level Examination',
        color: '#4361ee'
    },
    {
        id: 'ibps-po-2023',
        name: 'IBPS PO Prelims',
        date: new Date(2023, 10, 20), // Nov 20, 2023
        deadline: '2023-09-15',
        description: 'Institute of Banking Personnel Selection Probationary Officer',
        color: '#3f37c9'
    },
    {
        id: 'cat-2023',
        name: 'CAT 2023',
        date: new Date(2023, 10, 26), // Nov 26, 2023
        deadline: '2023-09-15',
        description: 'Common Admission Test for IIMs',
        color: '#4895ef'
    },
    // Add more exams as needed
];

// Initialize the app
function init() {
    renderCalendar();
    renderUpcomingExams();
    setupEventListeners();
    checkForTargetExam();
}

// Set up event listeners
function setupEventListeners() {
    // Calendar toggle
    calendarToggle.addEventListener('click', () => {
        calendarSidebar.classList.add('open');
    });
    
    closeSidebar.addEventListener('click', () => {
        calendarSidebar.classList.remove('open');
    });
    
    // Month navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Exam modal buttons
    prepareBtn.addEventListener('click', setTargetExam);
    detailsBtn.addEventListener('click', viewExamDetails);
    
    // Hamburger menu
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Auth flip button
    authFlipBtn.addEventListener('click', () => {
        authFlipBtn.classList.toggle('flipped');
    });
    
    // Close notification banner
    closeBanner.addEventListener('click', () => {
        notificationBanner.style.display = 'none';
    });
}

// Render the calendar
function renderCalendar() {
    // Set current month text
    currentMonthEl.textContent = new Date(currentYear, currentMonth).toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const calendarDay = document.createElement('div');
        calendarDay.className = 'calendar-day';
        
        // Check if today
        const today = new Date();
        if (date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear()) {
            calendarDay.classList.add('today');
        }
        
        // Check if has exam
        const hasExam = examData.some(exam => 
            exam.date.getDate() === day && 
            exam.date.getMonth() === currentMonth && 
            exam.date.getFullYear() === currentYear
        );
        
        if (hasExam) {
            calendarDay.classList.add('has-exam');
        }
        
        calendarDay.innerHTML = `<div class="date">${day}</div>`;
        
        // Add click event to show exam modal if day has exam
        if (hasExam) {
            calendarDay.addEventListener('click', () => {
                const exam = examData.find(exam => 
                    exam.date.getDate() === day && 
                    exam.date.getMonth() === currentMonth && 
                    exam.date.getFullYear() === currentYear
                );
                showExamModal(exam);
            });
        }
        
        calendarGrid.appendChild(calendarDay);
    }
}

// Render upcoming exams list
function renderUpcomingExams() {
    upcomingExams.innerHTML = '';
    
    // Sort exams by date
    const sortedExams = [...examData].sort((a, b) => a.date - b.date);
    
    // Filter upcoming exams (next 3 months)
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    
    const upcoming = sortedExams.filter(exam => exam.date > now && exam.date <= threeMonthsLater);
    
    if (upcoming.length === 0) {
        upcomingExams.innerHTML = '<p>No upcoming exams in the next 3 months</p>';
        return;
    }
    
    upcoming.forEach(exam => {
        const examItem = document.createElement('div');
        examItem.className = 'exam-item';
        examItem.innerHTML = `
            <div class="exam-date">${exam.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div class="exam-name">${exam.name}</div>
            <div class="exam-desc">${exam.description}</div>
        `;
        
        examItem.addEventListener('click', () => showExamModal(exam));
        upcomingExams.appendChild(examItem);
    });
}

// Show exam modal
function showExamModal(exam) {
    selectedExam = exam;
    
    document.getElementById('modalExamTitle').textContent = exam.name;
    document.getElementById('modalExamDate').textContent = exam.date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    document.getElementById('modalExamDeadline').textContent = exam.deadline;
    
    examModal.style.display = 'flex';
}

// Close exam modal
function closeExamModal() {
    examModal.style.display = 'none';
}

// Set target exam (Start Preparing)
function setTargetExam() {
    if (!selectedExam) return;
    
    localStorage.setItem('targetExam', JSON.stringify(selectedExam));
    updateDaysCounter();
    closeExamModal();
    calendarSidebar.classList.remove('open');
}

// View exam details
function viewExamDetails() {
    if (!selectedExam) return;
    
    localStorage.setItem('selectedExam', JSON.stringify(selectedExam));
    window.location.href = `exam-details.html?id=${selectedExam.id}`;
}

// Check for target exam in localStorage
function checkForTargetExam() {
    const savedExam = localStorage.getItem('targetExam');
    if (savedExam) {
        selectedExam = JSON.parse(savedExam);
        updateDaysCounter();
    } else {
        daysCounter.style.display = 'none';
    }
}

// Update days counter
function updateDaysCounter() {
    if (!selectedExam) return;
    
    const today = new Date();
    const examDate = new Date(selectedExam.date);
    const timeDiff = examDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    daysRemaining.textContent = daysDiff;
    targetExam.textContent = selectedExam.name;
    daysCounter.style.display = 'block';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
