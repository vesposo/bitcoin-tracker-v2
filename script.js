// Sample data storage with localStorage
let issues = [];
let lastId = 0;

// Load issues from localStorage when the page loads
function loadSavedIssues() {
    try {
        const savedIssues = localStorage.getItem('btcIssues');
        const savedLastId = localStorage.getItem('btcLastId');
        
        if (savedIssues) {
            issues = JSON.parse(savedIssues);
            console.log('Loaded issues:', issues); // Debug log
        }
        
        if (savedLastId) {
            lastId = parseInt(savedLastId);
            console.log('Loaded lastId:', lastId); // Debug log
        }
        
        updateDashboard();
        updateRecentIssues();
    } catch (error) {
        console.error('Error loading saved issues:', error);
    }
}

// Save issues to localStorage
function saveIssues() {
    try {
        localStorage.setItem('btcIssues', JSON.stringify(issues));
        localStorage.setItem('btcLastId', lastId.toString());
        console.log('Saved issues:', issues); // Debug log
    } catch (error) {
        console.error('Error saving issues:', error);
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Issue ID copied to clipboard!');
    });
}

function updateDashboard() {
    document.getElementById('total-issues').textContent = issues.length;
    document.getElementById('active-issues').textContent = issues.filter(i => i.status === 'Active').length;
    document.getElementById('latest-id').textContent = lastId > 0 ? `BTC-${String(lastId).padStart(3, '0')}` : '-';
}

function updateRecentIssues() {
    const tbody = document.getElementById('recent-issues-list');
    tbody.innerHTML = '';

    const recentIssues = [...issues].reverse().slice(0, 10);
    
    recentIssues.forEach(issue => {
        const row = document.createElement('tr');
        row.className = `status-row-${issue.status.toLowerCase()}`;
        
        row.innerHTML = `
            <td>
                <span class="issue-id">${issue.id}</span>
                <button class="copy-button" onclick="copyToClipboard('${issue.id}')">Copy</button>
            </td>
            <td>${issue.date}</td>
            <td>${issue.cToken}</td>
            <td>${issue.topic}</td>
            <td>${issue.subcategory}</td>
            <td><span class="status-badge status-${issue.status.toLowerCase()}">${issue.status}</span></td>
            <td>
                <button onclick="loadIssueById('${issue.id}')" style="padding: 4px 8px; font-size: 12px;">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateRecentIssuesTable() {
    const tbody = document.getElementById('update-recent-issues');
    if (!tbody) return;

    tbody.innerHTML = '';
    const recentIssues = [...issues].reverse().slice(0, 5);

    recentIssues.forEach(issue => {
        const row = document.createElement('tr');
        row.className = `status-row-${issue.status.toLowerCase()}`;
        
        row.innerHTML = `
            <td><span class="issue-id">${issue.id}</span></td>
            <td>${issue.date}</td>
            <td>${issue.cToken}</td>
            <td>${issue.topic}</td>
            <td>${issue.subcategory}</td>
            <td><span class="status-badge status-${issue.status.toLowerCase()}">${issue.status}</span></td>
            <td><button onclick="loadIssueById('${issue.id}')" style="padding: 4px 8px; font-size: 12px;">Select</button></td>
        `;
        tbody.appendChild(row);
    });
}

function addIssue() {
    const issue = {
        id: `BTC-${String(++lastId).padStart(3, '0')}`,
        cToken: document.getElementById('c-token').value,
        caseNumber: document.getElementById('case-number').value,
        advocate: document.getElementById('advocate').value,
        topic: document.getElementById('topic').value,
        subcategory: document.getElementById('subcategory').value,
        misinfoDetails: document.getElementById('misinfo-details').value,
        notes: document.getElementById('notes').value,
        status: 'Active',
        date: new Date().toISOString().split('T')[0],
        samples: []
    };
    
    issues.push(issue);
    saveIssues();
    updateDashboard();
    updateRecentIssues();
    showNotification(`Issue ${issue.id} added successfully!`);
    copyToClipboard(issue.id);
    clearForm('add-section');
}

function loadIssueById(issueId) {
    document.getElementById('update-issue-id').value = issueId;
    loadIssueDetails();
    showSection('update');
}

function loadIssueDetails() {
    const issueId = document.getElementById('update-issue-id').value;
    const issue = issues.find(i => i.id === issueId);
    
    if (issue) {
        document.getElementById('issue-details-section').style.display = 'block';
        
        document.getElementById('update-c-token').value = issue.cToken || '';
        document.getElementById('update-case-number').value = issue.caseNumber || '';
        document.getElementById('update-advocate').value = issue.advocate || '';
        document.getElementById('update-topic').value = issue.topic || '';
        document.getElementById('update-subcategory').value = issue.subcategory || '';
        document.getElementById('update-description').value = issue.misinfoDetails || '';
        document.getElementById('update-status').value = issue.status || 'Active';
        document.getElementById('update-resolution').value = issue.resolution || '';
        document.getElementById('update-notes').value = '';  // Clear notes field for new notes

        showExistingSamples(issue);
    } else {
        showNotification(`Issue ${issueId} not found!`);
        document.getElementById('issue-details-section').style.display = 'none';
    }
}

function updateIssue() {
    const issueId = document.getElementById('update-issue-id').value;
    const issue = issues.find(i => i.id === issueId);
    
    if (issue) {
        issue.cToken = document.getElementById('update-c-token').value;
        issue.caseNumber = document.getElementById('update-case-number').value;
        issue.advocate = document.getElementById('update-advocate').value;
        issue.topic = document.getElementById('update-topic').value;
        issue.subcategory = document.getElementById('update-subcategory').value;
        issue.misinfoDetails = document.getElementById('update-description').value;
        issue.status = document.getElementById('update-status').value;
        issue.resolution = document.getElementById('update-resolution').value;
        
        const newNote = document.getElementById('update-notes').value;
        if (newNote) {
            const timestamp = new Date().toISOString().split('T')[0];
            issue.notes = issue.notes 
                ? `${issue.notes}\n[${timestamp}] ${newNote}`
                : `[${timestamp}] ${newNote}`;
        }
        
        saveIssues();
        updateDashboard();
        updateRecentIssues();
        updateRecentIssuesTable();
        showNotification(`Issue ${issueId} updated successfully!`);
        document.getElementById('update-notes').value = '';  // Clear notes field
    } else {
        showNotification(`Issue ${issueId} not found!`);
    }
}

function addNewSample() {
    document.getElementById('new-sample-form').style.display = 'block';
}

function submitNewSample() {
    const issueId = document.getElementById('update-issue-id').value;
    const issue = issues.find(i => i.id === issueId);
    
    if (issue) {
        if (!issue.samples) {
            issue.samples = [];
        }

        const sample = {
            id: issue.samples.length + 1,
            date: new Date().toISOString().split('T')[0],
            cToken: document.getElementById('new-sample-c-token').value,
            caseNumber: document.getElementById('new-sample-case-number').value,
            advocate: document.getElementById('new-sample-advocate').value,
            topic: document.getElementById('new-sample-topic').value,
            subcategory: document.getElementById('new-sample-subcategory').value,
            description: document.getElementById('new-sample-description').value,
            notes: document.getElementById('new-sample-notes').value
        };

        issue.samples.push(sample);
        saveIssues(); // Save after adding sample
        showExistingSamples(issue);
        
        clearSampleForm();
        document.getElementById('new-sample-form').style.display = 'none';
        showNotification('New sample added successfully!');
    }
}

function clearSampleForm() {
    const fields = [
        'new-sample-c-token',
        'new-sample-case-number',
        'new-sample-advocate',
        'new-sample-topic',
        'new-sample-subcategory',
        'new-sample-description',
        'new-sample-notes'
    ];
    
    fields.forEach(field => {
        document.getElementById(field).value = '';
    });
}

function showExistingSamples(issue) {
    const samplesDiv = document.getElementById('existing-samples');
    if (!issue.samples || issue.samples.length === 0) {
        samplesDiv.innerHTML = '<p>No samples added yet</p>';
        return;
    }

    const samplesHtml = issue.samples.map(sample => `
        <div class="sample-card">
            <div class="sample-header">
                <span class="sample-number">Sample ${sample.id}</span>
                <span class="sample-date">${sample.date}</span>
            </div>
            <div class="sample-content">
                <div class="sample-label">C-Token:</div>
                <div>${sample.cToken}</div>
            </div>
            <div class="sample-content">
                <div class="sample-label">Case #:</div>
                <div>${sample.caseNumber}</div>
            </div>
            <div class="sample-content">
                <div class="sample-label">Advocate:</div>
                <div>${sample.advocate}</div>
            </div>
            <div class="sample-content">
                <div class="sample-label">Topic:</div>
                <div>${sample.topic}</div>
            </div>
            <div class="sample-content">
                <div class="sample-label">Issue:</div>
                <div>${sample.subcategory}</div>
            </div>
            <div class="sample-content">
                <div class="sample-label">Description:</div>
                <div>${sample.description}</div>
            </div>
            <div class="sample-content">
                <div class="sample-label">Notes:</div>
                <div>${sample.notes}</div>
            </div>
        </div>
    `).join('');

    samplesDiv.innerHTML = samplesHtml;
}

function clearForm(sectionId) {
    document.querySelectorAll(`#${sectionId} input, #${sectionId} textarea, #${sectionId} select`).forEach(input => {
        input.value = '';
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId + '-section').classList.add('active');
    
    if (sectionId === 'update') {
        updateRecentIssuesTable();
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', loadSavedIssues);