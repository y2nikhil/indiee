// Notification Banner
document.addEventListener('DOMContentLoaded', function() {
    // Close notification banner
    const closeBanner = document.querySelector('.close-banner');
    const notificationBanner = document.querySelector('.notification-banner');
    
    if (closeBanner && notificationBanner) {
        closeBanner.addEventListener('click', function() {
            notificationBanner.style.display = 'none';
        });
    }

    // Calendar Toggle
    const calendarToggle = document.getElementById('calendarToggle');
    const calendarSidebar = document.getElementById('calendarSidebar');
    const overlay = document.getElementById('overlay');
    
    if (calendarToggle && calendarSidebar) {
        calendarToggle.addEventListener('click', function() {
            calendarSidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }

    // Close sidebar
    const closeSidebar = document.querySelector('.close-sidebar');
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            calendarSidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // Close sidebar when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            calendarSidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
});

// Function to update countdown (called from exam-page.html)
function updateCountdown(examDate) {
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    document.getElementById('daysLeft').textContent = daysLeft;
}

// Function to add events to calendar (you'll customize this later)
function addCalendarEvent(date, title) {
    const calendarEvents = document.getElementById('calendarEvents');
    if (calendarEvents) {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-date">${date}</div>
            <div class="event-title">${title}</div>
        `;
        calendarEvents.appendChild(eventItem);
    }
}
