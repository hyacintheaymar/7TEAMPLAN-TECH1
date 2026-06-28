// === GESTION DU LOCAL STORAGE POUR SAUVEGARDER TOUTES LES DONNÉES ===
function saveToStorage() {
    const startTimeEl = document.getElementById('start-time');
    const endTimeEl = document.getElementById('end-time');
    const data = {
        employees,
        departments,
        teams,
        assignments,
        darkMode: document.body.classList.contains('dark-mode'),
        startTime: startTimeEl ? startTimeEl.value : '08:00',
        endTime: endTimeEl ? endTimeEl.value : '20:00'
    };
    localStorage.setItem('teamplan-data-2025', JSON.stringify(data));
}
function loadFromStorage() {
    const saved = localStorage.getItem('teamplan-data-2025');
    const darkModeEl = document.getElementById('dark-mode');
    const startTimeEl = document.getElementById('start-time');
    const endTimeEl = document.getElementById('end-time');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.employees) employees = data.employees;
        if (data.departments) departments = data.departments;
        if (data.teams) teams = data.teams;
        if (data.assignments) assignments = data.assignments;
        if (data.darkMode === true) {
            document.body.classList.add('dark-mode');
            if (darkModeEl) darkModeEl.checked = true;
        } else if (data.darkMode === false) {
            document.body.classList.remove('dark-mode');
            if (darkModeEl) darkModeEl.checked = false;
        }
        if (data.startTime && startTimeEl) startTimeEl.value = data.startTime;
        if (data.endTime && endTimeEl) endTimeEl.value = data.endTime;
    } else if (darkModeEl && darkModeEl.checked) {
        document.body.classList.add('dark-mode');
    }
    migrateAssignments();
}
function formatDateLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
function migrateAssignments() {
    const week = getWeekRange(currentViewDate);
    assignments.forEach(a => {
        if (!a.date && a.day !== undefined && week[a.day]) {
            a.date = formatDateLocal(week[a.day]);
        }
    });
}
function nextId(items) {
    if (!items.length) return 1;
    return Math.max(...items.map(i => i.id)) + 1;
}
function getCalendarHours() {
    const startInput = document.getElementById('start-time');
    const endInput = document.getElementById('end-time');
    let startHour = 8;
    let endHour = 20;
    if (startInput && startInput.value) {
        startHour = parseInt(startInput.value.split(':')[0], 10);
    }
    if (endInput && endInput.value) {
        endHour = parseInt(endInput.value.split(':')[0], 10);
    }
    if (endHour <= startHour) endHour = startHour + 1;
    return { startHour, endHour };
}
// === GESTION DE LA DATE COURANTE ===
let currentViewDate = new Date();
function getWeekRange(date) {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(d.getFullYear(), d.getMonth(), diff);
    const week = [];
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + i);
        week.push(dayDate);
    }
    return week;
}
function formatDate(date) {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('fr-FR', options);
}
function updateWeekDisplay() {
    const week = getWeekRange(currentViewDate);
    const start = week[0];
    const end = week[6];
    const startMonth = start.toLocaleDateString('fr-FR', { month: 'long' });
    const endMonth = end.toLocaleDateString('fr-FR', { month: 'long' });
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    const isCompact = window.matchMedia('(max-width: 480px)').matches;
    let displayText;
    if (isCompact) {
        if (startYear === endYear) {
            displayText = `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1} ${endYear}`;
        } else {
            displayText = `${start.getDate()}/${start.getMonth() + 1}/${startYear} – ${end.getDate()}/${end.getMonth() + 1}/${endYear}`;
        }
    } else if (startYear !== endYear) {
        displayText = `Semaine du ${start.getDate()} ${startMonth} ${startYear} au ${end.getDate()} ${endMonth} ${endYear}`;
    } else if (startMonth !== endMonth) {
        displayText = `Semaine du ${start.getDate()} ${startMonth} au ${end.getDate()} ${endMonth} ${startYear}`;
    } else {
        displayText = `Semaine du ${start.getDate()} au ${end.getDate()} ${startMonth} ${startYear}`;
    }
    document.getElementById('current-week').textContent = displayText;
    const todayStr = formatDateLocal(new Date());
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const dayNames = isMobile
        ? ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
        : ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    document.querySelectorAll('.day-date').forEach((el, i) => {
        el.textContent = week[i].getDate();
    });
    document.querySelectorAll('.day-name').forEach((el, i) => {
        el.textContent = dayNames[i];
    });
    document.querySelectorAll('.day-header').forEach((el, i) => {
        el.classList.toggle('is-today', formatDateLocal(week[i]) === todayStr);
    });
}
function openPanel() {
    document.getElementById('employee-panel').classList.add('open');
    const overlay = document.getElementById('panel-overlay');
    if (overlay) {
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
    }
}
function closePanel() {
    document.getElementById('employee-panel').classList.remove('open');
    const overlay = document.getElementById('panel-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
    }
}
// Données de l'application
let employees = [
    { id: 1, name: "Jean Dupont", department: "Technique", color: "#4A86E8", initials: "JD" },
    { id: 2, name: "Marie Martin", department: "Marketing", color: "#6AA84F", initials: "MM" },
    { id: 3, name: "Thomas Petit", department: "Technique", color: "#4A86E8", initials: "TP" },
    { id: 4, name: "Sophie Leroy", department: "RH", color: "#C27BA0", initials: "SL" },
    { id: 5, name: "Luc Bernard", department: "Marketing", color: "#6AA84F", initials: "LB" },
    { id: 6, name: "Camille Moreau", department: "RH", color: "#C27BA0", initials: "CM" },
    { id: 7, name: "Antoine Dubois", department: "Technique", color: "#4A86E8", initials: "AD" }
];
let departments = {
    Technique: { color: "#4A86E8" },
    Marketing: { color: "#6AA84F" },
    RH: { color: "#C27BA0" }
};
let teams = [
    { id: 1, name: "Alpha", members: [1, 2, 3], color: "#4A86E8" },
    { id: 2, name: "Bêta", members: [4, 5], color: "#6AA84F" },
    { id: 3, name: "Gamma", members: [6, 7], color: "#C27BA0" }
];
const demoWeek = getWeekRange(currentViewDate);
let assignments = [
    { id: 1, teamId: 1, day: 1, startHour: 9, endHour: 12, date: formatDateLocal(demoWeek[1]) },
    { id: 2, teamId: 2, day: 2, startHour: 11, endHour: 13, date: formatDateLocal(demoWeek[2]) },
    { id: 3, teamId: 3, day: 3, startHour: 14, endHour: 16, date: formatDateLocal(demoWeek[3]) },
    { id: 4, teamId: 1, day: 4, startHour: 10, endHour: 12, date: formatDateLocal(demoWeek[4]) },
    { id: 5, teamId: 2, day: 5, startHour: 15, endHour: 17, date: formatDateLocal(demoWeek[5]) }
];
// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    // Ajouter un fond flou du calendrier en arrière-plan
    const bg = document.createElement('div');
    bg.className = 'calendar-background';
    document.body.appendChild(bg);
    updateWeekDisplay();
    generateCalendar();
    generateEmployeeList();
    generateTeamList();
    setupTeamMembersSelect();
    setupDepartmentForm();
    generateDepartmentList();
    // === CORRECTION : Appeler generateEmployeeDeptSelect ici pour remplir le select ===
    generateEmployeeDeptSelect();
    // ================================================
    setupEventListeners();
    setupDragAndDrop();
    setupDragAndDropForAssignments();
});
// Générer le calendrier
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    const week = getWeekRange(currentViewDate);
    const { startHour: calStart, endHour: calEnd } = getCalendarHours();
    const ROW_HEIGHT = 70; // 64px cell + 6px gap
    for (let hour = calStart; hour <= calEnd; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = `${hour}:00`;
        calendarGrid.appendChild(timeSlot);
        week.forEach((date, dayIndex) => {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.dataset.hour = hour;
            dayCell.dataset.day = dayIndex;
            dayCell.dataset.date = formatDateLocal(date);
            const dateStr = formatDateLocal(date);
            const dayAssignments = assignments.filter(a =>
                a.date === dateStr &&
                hour === a.startHour
            );
            if (dayAssignments.length > 0) {
                const assignment = dayAssignments[0];
                const team = teams.find(t => t.id === assignment.teamId);
                if (team) {
                    const duration = assignment.endHour - assignment.startHour;
                    const assignmentCard = document.createElement('div');
                    assignmentCard.className = 'assignment-card new-item';
                    assignmentCard.style.setProperty('--team-color', team.color);
                    assignmentCard.style.top = '8px';
                    assignmentCard.style.bottom = 'auto';
                    assignmentCard.style.height = `calc(${duration} * ${ROW_HEIGHT}px - 16px)`;
                    assignmentCard.dataset.assignmentId = assignment.id;
                    assignmentCard.draggable = true;
                    assignmentCard.innerHTML = `
                        <div class="team-name">${team.name}</div>
                        <div class="assignment-time">${assignment.startHour}h - ${assignment.endHour}h</div>
                    `;
                    assignmentCard.addEventListener('click', () => {
                        showAssignmentDetails(assignment.id);
                    });
                    dayCell.appendChild(assignmentCard);
                }
            }
            calendarGrid.appendChild(dayCell);
        });
    }
}
// === DRAG & DROP : déplacer une affectation existante ===
function setupDragAndDropForAssignments() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('assignment-card')) {
            const assignmentId = parseInt(e.target.dataset.assignmentId);
            e.dataTransfer.setData('assignmentId', assignmentId);
            e.target.style.opacity = '0.5';
        }
    });
    calendarGrid.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('assignment-card')) {
            e.target.style.opacity = '1';
        }
    });
    calendarGrid.addEventListener('dragover', (e) => {
        if (e.target.classList.contains('day-cell')) {
            e.preventDefault();
            e.target.classList.add('teams-hover');
        }
    });
    calendarGrid.addEventListener('dragleave', (e) => {
        if (e.target.classList.contains('day-cell')) {
            e.target.classList.remove('teams-hover');
        }
    });
    calendarGrid.addEventListener('drop', (e) => {
        e.preventDefault();
        const dayCell = e.target.closest('.day-cell');
        if (!dayCell) return;
        const assignmentId = parseInt(e.dataTransfer.getData('assignmentId'));
        const newDayIndex = parseInt(dayCell.dataset.day);
        const hour = parseInt(dayCell.dataset.hour);
        const newDate = dayCell.dataset.date; // Récupérer la date de la cellule
        if (isNaN(assignmentId) || isNaN(newDayIndex) || isNaN(hour)) return;
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return;
        assignment.day = newDayIndex;
        assignment.startHour = hour;
        assignment.endHour = hour + 2;
        assignment.date = newDate; // Mettre à jour la date de l'affectation
        saveToStorage();
        generateCalendar();
        dayCell.classList.remove('teams-hover');
    });
}
// === GESTION DES DÉPARTEMENTS ===
function setupDepartmentForm() {
    const addDeptBtn = document.getElementById('add-department');
    if (!addDeptBtn) return;
    addDeptBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('dept-name');
        const colorInput = document.getElementById('dept-color');
        const name = nameInput.value.trim();
        const color = colorInput.value;
        if (!name) {
            alert('Veuillez entrer un nom de département.');
            return;
        }
        if (departments[name]) {
            alert(`Le département "${name}" existe déjà.`);
            return;
        }
        departments[name] = { color };
        nameInput.value = ''; // Réinitialiser le champ
        generateDepartmentList();
        generateEmployeeDeptSelect(); // Mettre à jour le select des employés
        saveToStorage();
        alert(`Département "${name}" ajouté avec succès !`);
    });
}
function generateDepartmentList() {
    const list = document.getElementById('department-list');
    if (!list) return;
    list.innerHTML = '';
    Object.keys(departments).forEach(name => {
        const chip = document.createElement('div');
        chip.className = 'dept-chip';
        chip.innerHTML = `
            <span class="color-dot" style="background-color: ${departments[name].color}"></span>
            ${name}
            <button class="delete-btn" data-dept="${name}">×</button>
        `;
        list.appendChild(chip);
    });
    // Suppression
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const deptName = e.target.dataset.dept;
            if (!confirm(`Supprimer le département "${deptName}" ? Les employés seront réaffectés.`)) return;
            delete departments[deptName];
            // Réaffecter les employés concernés au premier département disponible
            const firstDept = Object.keys(departments)[0];
            if (firstDept) {
                employees
                    .filter(emp => emp.department === deptName)
                    .forEach(emp => {
                        emp.department = firstDept;
                        emp.color = departments[firstDept].color;
                    });
            }
            generateDepartmentList();
            generateEmployeeDeptSelect(); // Mettre à jour le select des employés
            generateEmployeeList(); // Pour mettre à jour la couleur
            saveToStorage();
        });
    });
}
function generateEmployeeDeptSelect() {
    const select = document.getElementById('employee-dept');
    if (!select) return;
    select.innerHTML = '';
    Object.keys(departments).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}
// === GESTION DES EMPLOYÉS ===
function generateEmployeeList() {
    const employeeList = document.getElementById('employee-list');
    if (!employeeList) return;
    employeeList.innerHTML = '';
    employees.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'employee-card new-item';
        employeeCard.dataset.id = employee.id;
        employeeCard.draggable = true;
        employeeCard.innerHTML = `
            <div class="employee-avatar" style="background-color: ${employee.color}">
                ${employee.initials}
            </div>
            <div class="employee-info">
                <div class="employee-name">${employee.name}</div>
                <div class="employee-dept">${employee.department}</div>
            </div>
            <div class="employee-actions">
                <button class="edit-employee" data-id="${employee.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-employee" data-id="${employee.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        employeeList.appendChild(employeeCard);
    });
    // Boutons modifier/supprimer
    document.querySelectorAll('.edit-employee').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const employeeId = parseInt(btn.dataset.id);
            editEmployee(employeeId);
        });
    });
    document.querySelectorAll('.delete-employee').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const employeeId = parseInt(btn.dataset.id);
            deleteEmployee(employeeId);
        });
    });
}
function editEmployee(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;
    const newName = prompt('Modifier le nom:', employee.name);
    if (newName && newName.trim() !== '') {
        employee.name = newName.trim();
        employee.initials = getInitials(newName);
        generateEmployeeList();
        saveToStorage();
        alert('Employé modifié avec succès!');
    }
}
function deleteEmployee(employeeId) {
    if (!confirm('Supprimer cet employé ?')) return;
    const index = employees.findIndex(e => e.id === employeeId);
    if (index !== -1) {
        employees.splice(index, 1);
        teams.forEach(team => {
            team.members = team.members.filter(id => id !== employeeId);
        });
        generateEmployeeList();
        generateTeamList();
        setupTeamMembersSelect();
        saveToStorage();
        alert('Employé supprimé avec succès!');
    }
}
// === GESTION DES ÉQUIPES ===
function generateTeamList() {
    const teamList = document.getElementById('team-list');
    if (!teamList) return;
    teamList.innerHTML = '';
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card new-item';
        teamCard.dataset.id = team.id;
        teamCard.innerHTML = `
            <div class="team-header">
                <div class="team-name" style="color: ${team.color}">${team.name}</div>
                <div class="team-members-count">${team.members.length} membre(s)</div>
            </div>
            <div class="team-members-list">
                ${team.members.map(memberId => {
                    const member = employees.find(e => e.id === memberId);
                    return `<div class="team-member">${member ? member.name : 'Inconnu'}</div>`;
                }).join('')}
            </div>
            <div class="team-actions">
                <button class="edit-team" data-id="${team.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-team" data-id="${team.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        teamList.appendChild(teamCard);
    });
    document.querySelectorAll('.edit-team').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const teamId = parseInt(btn.dataset.id);
            editTeam(teamId);
        });
    });
    document.querySelectorAll('.delete-team').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const teamId = parseInt(btn.dataset.id);
            deleteTeam(teamId);
        });
    });
}
function setupTeamMembersSelect() {
    const membersSelect = document.getElementById('team-members-select');
    if (!membersSelect) return;
    membersSelect.innerHTML = '';
    employees.forEach(employee => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-select-item';
        memberItem.innerHTML = `
            <input type="checkbox" id="member-${employee.id}" value="${employee.id}">
            <label for="member-${employee.id}">${employee.name} (${employee.department})</label>
        `;
        membersSelect.appendChild(memberItem);
    });
}
function editTeam(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    const newName = prompt('Modifier le nom:', team.name);
    if (newName && newName.trim() !== '') {
        team.name = newName.trim();
        generateTeamList();
        saveToStorage();
        alert('Équipe modifiée avec succès!');
    }
}
function deleteTeam(teamId) {
    if (!confirm('Supprimer cette équipe ?')) return;
    const index = teams.findIndex(t => t.id === teamId);
    if (index !== -1) {
        teams.splice(index, 1);
        assignments = assignments.filter(a => a.teamId !== teamId);
        generateTeamList();
        generateCalendar();
        saveToStorage();
        alert('Équipe supprimée avec succès!');
    }
}
// === PANNEAU D'AFFECTION ===
function showAssignmentDetails(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    const team = teams.find(t => t.id === assignment.teamId);
    if (!assignment || !team) return;
    const employeePanel = document.getElementById('employee-panel');
    openPanel();
    const employeeList = document.getElementById('employee-panel-list');
    employeeList.innerHTML = '';
    document.getElementById('panel-title').textContent = team.name;
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.style.marginBottom = '24px';
    actions.style.display = 'flex';
    actions.style.gap = '8px';
    actions.innerHTML = `
        <button class="teams-btn" id="edit-assignment" style="flex: 1">
            <i class="fas fa-edit"></i> Modifier
        </button>
        <button class="teams-btn" id="duplicate-assignment" style="flex: 1">
            <i class="fas fa-copy"></i> Dupliquer
        </button>
        <button class="teams-btn" id="delete-assignment" style="background-color: #ff4d4d; flex: 1">
            <i class="fas fa-trash"></i> Supprimer
        </button>
    `;
    employeeList.appendChild(actions);
    const details = document.createElement('div');
    details.className = 'assignment-details';
    details.style.marginBottom = '24px';
    details.style.padding = '16px';
    details.style.backgroundColor = '#f9f9f9';
    details.style.borderRadius = '8px';
    let dateStr;
    if (assignment.date) {
        const [y, m, d] = assignment.date.split('-').map(Number);
        dateStr = formatDate(new Date(y, m - 1, d));
    } else {
        const week = getWeekRange(currentViewDate);
        dateStr = week[assignment.day] ? formatDate(week[assignment.day]) : 'Date inconnue';
    }
    const firstMember = employees.find(e => team.members.includes(e.id));
    const deptName = firstMember ? firstMember.department : 'N/A';
    let dayLabel;
    if (assignment.date) {
        const [y, m, d] = assignment.date.split('-').map(Number);
        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        dayLabel = dayNames[new Date(y, m - 1, d).getDay()];
    } else {
        dayLabel = getDayName(assignment.day);
    }
    details.innerHTML = `
        <div style="margin-bottom: 16px">
            <div style="font-size: 14px; color: #6264A7; margin-bottom: 4px">Date</div>
            <div style="font-weight: 600">${dayLabel} ${dateStr} ${assignment.startHour}h - ${assignment.endHour}h</div>
        </div>
        <div>
            <div style="font-size: 14px; color: #6264A7; margin-bottom: 4px">Département</div>
            <div style="font-weight: 600">${deptName}</div>
        </div>
    `;
    employeeList.appendChild(details);
    const membersTitle = document.createElement('div');
    membersTitle.className = 'panel-title';
    membersTitle.textContent = 'Membres de l\'équipe';
    membersTitle.style.marginBottom = '16px';
    employeeList.appendChild(membersTitle);
    team.members.forEach(memberId => {
        const member = employees.find(e => e.id === memberId);
        if (!member) return;
        const memberCard = document.createElement('div');
        memberCard.className = 'employee-card';
        memberCard.innerHTML = `
            <div class="employee-avatar" style="background-color: ${member.color}">
                ${member.initials}
            </div>
            <div class="employee-info">
                <div class="employee-name">${member.name}</div>
                <div class="employee-dept">${member.department}</div>
            </div>
        `;
        employeeList.appendChild(memberCard);
    });
    document.getElementById('edit-assignment').addEventListener('click', () => {
        const newStart = prompt('Heure de début (ex: 9):', assignment.startHour);
        const newEnd = prompt('Heure de fin (ex: 12):', assignment.endHour);
        if (newStart && newEnd) {
            const start = parseInt(newStart, 10);
            const end = parseInt(newEnd, 10);
            if (!isNaN(start) && !isNaN(end) && end > start) {
                assignment.startHour = start;
                assignment.endHour = end;
                generateCalendar();
                saveToStorage();
                showAssignmentDetails(assignmentId);
                alert('Affectation modifiée avec succès!');
            } else {
                alert('Heures invalides. La fin doit être après le début.');
            }
        }
    });
    document.getElementById('duplicate-assignment').addEventListener('click', () => {
        const week = getWeekRange(currentViewDate);
        const assignmentDate = assignment.date
            ? new Date(assignment.date + 'T12:00:00')
            : week[assignment.day];
        const newEndHour = assignment.endHour + 2;
        const { endHour: calEnd } = getCalendarHours();
        if (newEndHour > calEnd) {
            alert('Impossible de dupliquer : heure de fin hors plage du calendrier.');
            return;
        }
        const newAssignment = {
            id: nextId(assignments),
            teamId: assignment.teamId,
            day: assignment.day,
            startHour: assignment.startHour + 2,
            endHour: newEndHour,
            date: assignment.date || formatDateLocal(assignmentDate)
        };
        assignments.push(newAssignment);
        generateCalendar();
        closePanel();
        saveToStorage();
        alert('Affectation dupliquée avec succès!');
    });
    document.getElementById('delete-assignment').addEventListener('click', () => {
        const index = assignments.findIndex(a => a.id === assignmentId);
        if (index !== -1) {
            assignments.splice(index, 1);
            generateCalendar();
            closePanel();
            saveToStorage();
            alert('Affectation supprimée avec succès!');
        }
    });
}
function getDayName(dayIndex) {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[dayIndex] || '';
}
// === ÉVÉNEMENTS PRINCIPAUX ===
function setupEventListeners() {
    // Navigation entre semaines
    document.getElementById('prev-week').addEventListener('click', () => {
        currentViewDate.setDate(currentViewDate.getDate() - 7);
        updateWeekDisplay();
        generateCalendar();
    });
    document.getElementById('next-week').addEventListener('click', () => {
        currentViewDate.setDate(currentViewDate.getDate() + 7);
        updateWeekDisplay();
        generateCalendar();
    });
    // === MODIFICATION : Remplacement de la fonction d'affectation aléatoire ===
    document.getElementById('add-assignment').addEventListener('click', openManualAssignmentModal);
    // Changer le mode de couleur
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    // Fermer panneau
    document.getElementById('close-panel').addEventListener('click', closePanel);
    const panelOverlay = document.getElementById('panel-overlay');
    if (panelOverlay) {
        panelOverlay.addEventListener('click', closePanel);
    }
    // Navigation entre vues
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const view = btn.dataset.view;
            document.querySelectorAll('.nav-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.view === view);
            });
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
            document.getElementById(`${view}-view`).classList.add('active-view');
            closePanel();
        });
    });
    window.addEventListener('resize', () => updateWeekDisplay());
    // Ajouter employé
    document.getElementById('add-employee').addEventListener('click', () => {
        const name = document.getElementById('employee-name').value;
        const dept = document.getElementById('employee-dept').value;
        if (name) {
            const newEmployee = {
                id: nextId(employees),
                name: name,
                department: dept,
                color: departments[dept].color,
                initials: getInitials(name)
            };
            employees.push(newEmployee);
            generateEmployeeList();
            setupTeamMembersSelect();
            document.getElementById('employee-name').value = '';
            saveToStorage();
            alert('Employé ajouté avec succès!');
        } else {
            alert('Veuillez entrer un nom');
        }
    });
    // Créer équipe
    document.getElementById('create-team').addEventListener('click', () => {
        const name = document.getElementById('team-name').value;
        const selectedMembers = Array.from(document.querySelectorAll('#team-members-select input:checked'))
            .map(input => parseInt(input.value));
        if (name && selectedMembers.length > 0) {
            const newTeam = {
                id: nextId(teams),
                name: name,
                members: selectedMembers,
                color: departments[employees.find(e => e.id === selectedMembers[0]).department].color
            };
            teams.push(newTeam);
            generateTeamList();
            document.getElementById('team-name').value = '';
            document.querySelectorAll('#team-members-select input').forEach(input => input.checked = false);
            saveToStorage();
            alert('Équipe créée avec succès!');
        } else {
            alert('Nom + au moins un membre');
        }
    });
    // Mode sombre
    document.getElementById('dark-mode').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        saveToStorage();
    });
    // Heures du calendrier
    const startTimeEl = document.getElementById('start-time');
    const endTimeEl = document.getElementById('end-time');
    if (startTimeEl) {
        startTimeEl.addEventListener('change', () => {
            generateCalendar();
            saveToStorage();
        });
    }
    if (endTimeEl) {
        endTimeEl.addEventListener('change', () => {
            generateCalendar();
            saveToStorage();
        });
    }
}
// === DRAG & DROP : employés vers calendrier (délégation d'événements) ===
function setupDragAndDrop() {
    const employeeList = document.getElementById('employee-list');
    if (employeeList) {
        employeeList.addEventListener('dragstart', (e) => {
            const card = e.target.closest('.employee-card');
            if (card && card.dataset.id) {
                e.dataTransfer.setData('text/plain', card.dataset.id);
            }
        });
    }
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.addEventListener('dragover', (e) => {
        const cell = e.target.closest('.day-cell');
        if (cell) {
            e.preventDefault();
            cell.classList.add('teams-hover');
        }
    });
    calendarGrid.addEventListener('dragleave', (e) => {
        const cell = e.target.closest('.day-cell');
        if (cell) cell.classList.remove('teams-hover');
    });
    calendarGrid.addEventListener('drop', (e) => {
        const cell = e.target.closest('.day-cell');
        if (!cell) return;
        e.preventDefault();
        cell.classList.remove('teams-hover');
        const assignmentId = e.dataTransfer.getData('assignmentId');
        if (assignmentId) return;
        const employeeId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (isNaN(employeeId)) return;
        const employee = employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        const day = parseInt(cell.dataset.day, 10);
        const hour = parseInt(cell.dataset.hour, 10);
        const date = cell.dataset.date;
        const team = teams.find(t => t.members.includes(employeeId));
        const teamId = team ? team.id : (teams[0] ? teams[0].id : null);
        if (!teamId) {
            alert('Aucune équipe disponible. Créez une équipe d\'abord.');
            return;
        }
        const { endHour: calEnd } = getCalendarHours();
        const endHour = Math.min(hour + 2, calEnd + 1);
        const newAssignment = {
            id: nextId(assignments),
            teamId: teamId,
            day: day,
            startHour: hour,
            endHour: endHour,
            date: date
        };
        assignments.push(newAssignment);
        generateCalendar();
        cell.classList.add('pulse-effect');
        setTimeout(() => cell.classList.remove('pulse-effect'), 500);
        showAssignmentDetails(newAssignment.id);
        saveToStorage();
    });
}
function getInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
}
// === NOUVELLE FONCTION : MODAL D'AFFECTATION MANUELLE ===
function openManualAssignmentModal() {
    // Créer la modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Nouvelle affectation</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group-modal">
                    <label for="assignment-team">Équipe :</label>
                    <select id="assignment-team" class="teams-select">
                        ${teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Jours :</label>
                    <div class="days-select">
                        <label><input type="checkbox" name="day" value="0"> Lundi</label>
                        <label><input type="checkbox" name="day" value="1"> Mardi</label>
                        <label><input type="checkbox" name="day" value="2"> Mercredi</label>
                        <label><input type="checkbox" name="day" value="3"> Jeudi</label>
                        <label><input type="checkbox" name="day" value="4"> Vendredi</label>
                        <label><input type="checkbox" name="day" value="5"> Samedi</label>
                        <label><input type="checkbox" name="day" value="6"> Dimanche</label>
                    </div>
                </div>
                <div class="form-group-modal">
                    <label for="assignment-start-hour">Heure de début :</label>
                    <input type="time" id="assignment-start-hour" class="teams-select" value="09:00">
                </div>
                <div class="form-group-modal">
                    <label for="assignment-end-hour">Heure de fin :</label>
                    <input type="time" id="assignment-end-hour" class="teams-select" value="17:00">
                </div>
                <div class="modal-actions">
                    <button class="teams-btn secondary" id="cancel-assignment-modal">Annuler</button>
                    <button class="teams-btn" id="confirm-assignment">Créer</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // Écouteurs d'événements
    const closeModal = () => modal.remove();
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-assignment-modal').addEventListener('click', closeModal);
    document.getElementById('confirm-assignment').addEventListener('click', () => {
        const teamId = parseInt(document.getElementById('assignment-team').value);
        const selectedDays = Array.from(document.querySelectorAll('input[name="day"]:checked'))
            .map(input => parseInt(input.value));
        const startTime = document.getElementById('assignment-start-hour').value;
        const endTime = document.getElementById('assignment-end-hour').value;
        // Validation
        if (!selectedDays.length) {
            alert('Veuillez sélectionner au moins un jour.');
            return;
        }
        if (!startTime || !endTime) {
            alert('Veuillez entrer une heure de début et une heure de fin.');
            return;
        }
        // Convertir les heures en nombres pour comparaison
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        if (endTotalMinutes <= startTotalMinutes) {
            alert('L\'heure de fin doit être après l\'heure de début.');
            return;
        }
        // Obtenir la date de la semaine actuelle pour chaque jour sélectionné
        const week = getWeekRange(currentViewDate);
        // Créer les affectations pour chaque jour sélectionné
        selectedDays.forEach(day => {
            const newAssignment = {
                id: nextId(assignments),
                teamId: teamId,
                day: day,
                startHour: startHours,
                endHour: endHours,
                date: formatDateLocal(week[day])
            };
            assignments.push(newAssignment);
        });
        generateCalendar();
        saveToStorage();
        closeModal();
        // Effet visuel sur le bouton
        const button = document.getElementById('add-assignment');
        button.classList.add('pulse-effect');
        setTimeout(() => button.classList.remove('pulse-effect'), 500);
    });
}