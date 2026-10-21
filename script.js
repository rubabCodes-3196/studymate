






/* =========================
   StudyMate - Main JavaScript
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

    // Navigation Elements
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("pageTitle");

    // Theme Elements
    const themeToggle = document.getElementById("themeToggle");

    // Task Elements
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskPriority = document.getElementById("taskPriority");
    const searchTask = document.getElementById("searchTask");
    const taskFilter = document.getElementById("taskFilter");
    const taskList = document.getElementById("taskList");

    // Timetable Elements
    const sessionForm = document.getElementById("sessionForm");
    const subjectInput = document.getElementById("subjectInput");
    const dayInput = document.getElementById("dayInput");
    const timeInput = document.getElementById("timeInput");
    const timetableList = document.getElementById("timetableList");

    // Dashboard Counters
    const totalTasksElement = document.getElementById("totalTasks");
    const pendingTasksElement = document.getElementById("pendingTasks");
    const completedTasksElement = document.getElementById("completedTasks");
    const totalSessionsElement = document.getElementById("totalSessions");


    // Load Saved Data Safely
    function loadArray(key) {
        try {
            const saved = JSON.parse(localStorage.getItem(key));
            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    let tasks = loadArray("studyTasks").map(function (task) {
        return {
            id: task.id || Date.now() + Math.random(),
            text: String(task.text || ""),
            completed: Boolean(task.completed),
            priority: ["Low", "Medium", "High"].includes(task.priority)
                ? task.priority
                : "Medium"
        };
    });

    let sessions = loadArray("studySessions").map(function (session) {
        return {
            id: session.id || Date.now() + Math.random(),
            subject: String(session.subject || ""),
            day: String(session.day || ""),
            time: String(session.time || "")
        };
    });


    // Save Data
    function saveTasks() {
        localStorage.setItem("studyTasks", JSON.stringify(tasks));
    }

    function saveSessions() {
        localStorage.setItem("studySessions", JSON.stringify(sessions));
    }


    // Navigation
    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {
            event.preventDefault();

            const targetId = link.dataset.section;
            const targetSection = document.getElementById(targetId);

            if (!targetSection) return;

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            sections.forEach(function (section) {
                section.classList.remove("active");
            });

            link.classList.add("active");
            targetSection.classList.add("active");

            const titles = {
                dashboard: "Dashboard",
                tasks: "My Tasks",
                timetable: "Study Timetable"
            };

            if (pageTitle) {
                pageTitle.textContent = titles[targetId] || "StudyMate";
            }
        });

    });


    // Dark Mode and Light Mode
    function applyTheme(theme) {

        const isDark = theme === "dark";

        document.body.classList.toggle("dark-mode", isDark);

        if (themeToggle) {
            themeToggle.textContent = isDark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";
        }
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("studyTheme") || "light";
    } catch (error) {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {

            const nextTheme =
                document.body.classList.contains("dark-mode")
                    ? "light"
                    : "dark";

            applyTheme(nextTheme);
            localStorage.setItem("studyTheme", nextTheme);

        });
    }


    // Update Dashboard Counters
    function updateDashboard() {

        const completedCount = tasks.filter(function (task) {
            return task.completed;
        }).length;

        const pendingCount = tasks.length - completedCount;

        if (totalTasksElement) {
            totalTasksElement.textContent = tasks.length;
        }

        if (pendingTasksElement) {
            pendingTasksElement.textContent = pendingCount;
        }

        if (completedTasksElement) {
            completedTasksElement.textContent = completedCount;
        }

        if (totalSessionsElement) {
            totalSessionsElement.textContent = sessions.length;
        }
    }


    // Render Tasks, Search and Filter
    function renderTasks() {

        if (!taskList) return;

        const searchTerm = searchTask
            ? searchTask.value.trim().toLowerCase()
            : "";

        const filterValue = taskFilter
            ? taskFilter.value
            : "all";

        const filteredTasks = tasks.filter(function (task) {

            const matchesSearch =
                task.text.toLowerCase().includes(searchTerm);

            let matchesFilter = true;

            if (filterValue === "pending") {
                matchesFilter = !task.completed;
            }

            else if (filterValue === "completed") {
                matchesFilter = task.completed;
            }

            else if (filterValue === "high") {
                matchesFilter = task.priority === "High";
            }

            return matchesSearch && matchesFilter;
        });

        taskList.innerHTML = "";

        if (filteredTasks.length === 0) {

            const message = document.createElement("div");
            message.className = "empty-message";

            message.textContent = tasks.length === 0
                ? "No tasks yet. Add your first study task above!"
                : "No tasks match your search or filter.";

            taskList.appendChild(message);
            updateDashboard();
            return;
        }

        filteredTasks.forEach(function (task) {

            const taskItem = document.createElement("article");

            taskItem.className =
                "task-item" + (task.completed ? " completed" : "");

            const itemMain = document.createElement("div");
            itemMain.className = "item-main";

            const title = document.createElement("h3");
            title.textContent = task.text;

            const priorityBadge = document.createElement("span");

            priorityBadge.className =
                "priority-badge priority-" + task.priority.toLowerCase();

            priorityBadge.textContent = task.priority + " Priority";

            const statusBadge = document.createElement("span");

            statusBadge.className = "status-badge " +
                (task.completed
                    ? "status-completed"
                    : "status-pending");

            statusBadge.textContent =
                task.completed ? "Completed" : "Pending";

            itemMain.appendChild(title);
            itemMain.appendChild(priorityBadge);
            itemMain.appendChild(statusBadge);

            const actions = document.createElement("div");
            actions.className = "item-actions";


            // Complete / Undo Button
            const toggleButton = document.createElement("button");

            toggleButton.type = "button";
            toggleButton.className = "secondary-button";
            toggleButton.textContent = task.completed
                ? "Undo"
                : "Complete";

            toggleButton.addEventListener("click", function () {

                task.completed = !task.completed;

                saveTasks();
                renderTasks();

            });


            // Edit Button
            const editButton = document.createElement("button");

            editButton.type = "button";
            editButton.className = "secondary-button";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {

                const updatedText = prompt(
                    "Edit your task:",
                    task.text
                );

                if (updatedText === null) return;

                const cleanText = updatedText.trim();

                if (!cleanText) {
                    alert("Task cannot be empty.");
                    return;
                }

                task.text = cleanText;

                saveTasks();
                renderTasks();

            });


            // Delete Button
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "danger-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {

                const confirmed = confirm(
                    "Are you sure you want to delete this task?"
                );

                if (!confirmed) return;

                tasks = tasks.filter(function (item) {
                    return item.id !== task.id;
                });

                saveTasks();
                renderTasks();

            });


            actions.appendChild(toggleButton);
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            taskItem.appendChild(itemMain);
            taskItem.appendChild(actions);

            taskList.appendChild(taskItem);

        });

        updateDashboard();
    }


    // Add New Task
    if (taskForm) {

        taskForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const text = taskInput.value.trim();

            const priority = taskPriority
                ? taskPriority.value
                : "Medium";

            if (!text) {
                alert("Please enter a task.");
                return;
            }

            tasks.unshift({
                id: Date.now() + Math.random(),
                text: text,
                completed: false,
                priority: ["Low", "Medium", "High"].includes(priority)
                    ? priority
                    : "Medium"
            });

            saveTasks();

            taskForm.reset();

            if (taskPriority) {
                taskPriority.value = "Medium";
            }

            if (searchTask) {
                searchTask.value = "";
            }

            if (taskFilter) {
                taskFilter.value = "all";
            }

            renderTasks();

        });
    }


    // Search Tasks
    if (searchTask) {
        searchTask.addEventListener("input", renderTasks);
    }

    // Filter Tasks
    if (taskFilter) {
        taskFilter.addEventListener("change", renderTasks);
    }


    // Render Study Timetable
    function renderSessions() {

        if (!timetableList) return;

        timetableList.innerHTML = "";

        if (sessions.length === 0) {

            const message = document.createElement("div");

            message.className = "empty-message";

            message.textContent =
                "No study sessions yet. Add a session above!";

            timetableList.appendChild(message);

            updateDashboard();
            return;
        }

        const dayOrder = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

        const sortedSessions = sessions.slice().sort(function (a, b) {

            const dayDifference =
                dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);

            if (dayDifference !== 0) {
                return dayDifference;
            }

            return a.time.localeCompare(b.time);
        });

        sortedSessions.forEach(function (session) {

            const sessionItem = document.createElement("article");
            sessionItem.className = "session-item";

            const itemMain = document.createElement("div");
            itemMain.className = "item-main";

            const title = document.createElement("h3");
            title.textContent = session.subject;

            const details = document.createElement("p");
            details.textContent = session.day + " • " + session.time;

            itemMain.appendChild(title);
            itemMain.appendChild(details);

            const actions = document.createElement("div");
            actions.className = "item-actions";


            // Delete Study Session
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "danger-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {

                const confirmed = confirm(
                    "Delete this study session?"
                );

                if (!confirmed) return;

                sessions = sessions.filter(function (item) {
                    return item.id !== session.id;
                });

                saveSessions();
                renderSessions();

            });

            actions.appendChild(deleteButton);

            sessionItem.appendChild(itemMain);
            sessionItem.appendChild(actions);

            timetableList.appendChild(sessionItem);

        });

        updateDashboard();
    }


    // Add Study Session
    if (sessionForm) {

        sessionForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const subject = subjectInput.value.trim();
            const day = dayInput.value;
            const time = timeInput.value;

            if (!subject || !day || !time) {
                alert("Please complete all study session fields.");
                return;
            }

            sessions.push({
                id: Date.now() + Math.random(),
                subject: subject,
                day: day,
                time: time
            });

            saveSessions();

            sessionForm.reset();

            renderSessions();

        });
    }


    // Initial Page Setup
    saveTasks();
    saveSessions();

    renderTasks();
    renderSessions();

});






