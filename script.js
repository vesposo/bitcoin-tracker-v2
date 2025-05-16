// Add these functions at the beginning of script.js

// Load issues from localStorage when the page loads
function loadSavedIssues() {
    const savedIssues = localStorage.getItem('btcIssues');
    const savedLastId = localStorage.getItem('btcLastId');
    
    if (savedIssues) {
        issues = JSON.parse(savedIssues);
    }
    
    if (savedLastId) {
        lastId = parseInt(savedLastId);
    }
    
    updateDashboard();
    updateRecentIssues();
}

// Save issues to localStorage
function saveIssues() {
    localStorage.setItem('btcIssues', JSON.stringify(issues));
    localStorage.setItem('btcLastId', lastId.toString());
}

// Modify the addIssue function
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
    saveIssues(); // Save after adding
    updateDashboard();
    updateRecentIssues();
    showNotification(`Issue ${issue.id} added successfully!`);
    copyToClipboard(issue.id);
    clearForm('add-section');
}

// Modify the updateIssue function
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
        
        saveIssues(); // Save after updating
        updateDashboard();
        updateRecentIssues();
        updateRecentIssuesTable();
        showNotification(`Issue ${issueId} updated successfully!`);
        document.getElementById('update-notes').value = '';
    } else {
        showNotification(`Issue ${issueId} not found!`);
    }
}

// Modify the submitNewSample function
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

// Add this at the end of your script.js
// Initialize by loading saved issues
document.addEventListener('DOMContentLoaded', loadSavedIssues);