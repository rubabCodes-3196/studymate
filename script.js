





"use strict";

// ===== Get HTML Elements =====
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const sessionForm = document.getElementById("sessionForm");
const subjectInput = document.getElementById("subjectInput");
const studyTime = document.getElementById("studyTime");
const topicInput = document.getElementById("topicInput");
const timetableList = document.getElementById("timetableList");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

const navLinks = document.querySelectorAll(".nav-link");

// ===== Load Saved Data =====
function loadData(key) {
    try {
        const savedData = JSON.parse(localStorage.getItem(key));
        return Array.isArray(savedData) ? savedData : [];
    } catch (error) {
        return [];
    }
}

let tasks = loadData("studyTasks");
let sessions = loadData("studySessions");

// ===== Save Data =====
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function saveSessions() {
    localStorage.setItem("studySessions", JSON.stringify(sessions));
}

// ===== Dashboard Counters =====
function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

// ===== Create Empty State Message =====
function showEmptyMessage(container, message) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = message;
    container.appendChild(emptyMessage);
}

// ===== Display Tasks =====
function renderTasks() {
    taskList.replaceChildren();

    if (tasks.length === 0) {
        showEmptyMessage(taskList, "No tasks yet. Add your first task above!");
    }

    tasks.forEach((item, index) => {
        const task = document.createElement("div");
        task.className = "task";

        const taskName = document.createElement("span");
        taskName.className = "task-name";
        taskName.textContent = item.text;

        if (item.completed) {
            taskName.classList.add("completed");
        }

        const statusButton = document.createElement("button");
        statusButton.type = "button";
        statusButton.className = "status";

        if (item.completed) {
            statusButton.classList.add("is-completed");
            statusButton.textContent = "✓ Completed";
        } else {
            statusButton.textContent = "Pending";
        }

        statusButton.setAttribute(
            "aria-label",
            "Change task status: " + item.text
        );

        statusButton.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        task.appendChild(taskName);
        task.appendChild(statusButton);
        task.appendChild(deleteButton);

        taskList.appendChild(task);
    });

    updateSummary();
}

// ===== Add Task =====
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskForm.reset();
    taskInput.focus();
});

// ===== Display Timetable Sessions =====
function renderSessions() {
    timetableList.replaceChildren();

    if (sessions.length === 0) {
        showEmptyMessage(
            timetableList,
            "No study sessions yet. Create your first session above!"
        );
        return;
    }

    sessions.forEach((session, index) => {
        const card = document.createElement("div");
        card.className = "session-card";

        const details = document.createElement("div");
        details.className = "session-details";

        const subject = document.createElement("h3");
        subject.textContent = "📚 " + session.subject;

        const time = document.createElement("p");
        time.textContent = "Time: " + session.time;

        const topic = document.createElement("p");
        topic.textContent = "Topic: " + session.topic;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            sessions.splice(index, 1);
            saveSessions();
            renderSessions();
        });

        details.appendChild(subject);
        details.appendChild(time);
        details.appendChild(topic);

        card.appendChild(details);
        card.appendChild(deleteButton);

        timetableList.appendChild(card);
    });
}

// ===== Add Study Session =====
sessionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const subject = subjectInput.value.trim();
    const time = studyTime.value;
    const topic = topicInput.value.trim();

    if (!subject || !time || !topic) {
        alert("Please fill in the subject, time, and topic!");
        return;
    }

    sessions.push({
        subject: subject,
        time: time,
        topic: topic
    });

    saveSessions();
    renderSessions();

    sessionForm.reset();
});

// ===== Dark Mode =====
function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

const savedTheme = localStorage.getItem("studyTheme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", function () {
    const isDark = document.body.classList.contains("dark-mode");
    const newTheme = isDark ? "light" : "dark";

    localStorage.setItem("studyTheme", newTheme);
    applyTheme(newTheme);
});

// ===== Sidebar Navigation =====
function setActiveLink(sectionId) {
    navLinks.forEach(link => {
        const isActive = link.getAttribute("href") === "#" + sectionId;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        const sectionId = link.getAttribute("href").slice(1);
        setActiveLink(sectionId);
    });
});

// Update active sidebar item when the URL hash changes
window.addEventListener("hashchange", function () {
    const sectionId = window.location.hash.slice(1);
    if (sectionId) {
        setActiveLink(sectionId);
    }
});

// ===== Initial Display =====
renderTasks();
renderSessions();

const initialSection = window.location.hash.slice(1);
if (initialSection) {
    setActiveLink(initialSection);
} else {
    setActiveLink("dashboard");
}





