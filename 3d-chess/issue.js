import { takeScreenshot } from './main.js';

// Create the HTML structure for the popup
function createPopup() {
    const popup = document.createElement('div');
    popup.classList.add('issue-popup');

    const popupContent = document.createElement('div');
    popupContent.classList.add('issue-popup-content');
    popupContent.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    popup.appendChild(popupContent);

    const issueHeader = document.createElement('h2');
    issueHeader.textContent = 'Report an Issue';
    issueHeader.style.color = '#f1c453';
    issueHeader.style.marginBottom = '20px';
    popupContent.appendChild(issueHeader);

    const container = document.createElement('div');
    container.id = 'issue-container';
    popupContent.appendChild(container);

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'issueTitle');
    titleLabel.textContent = 'Title:';
    titleLabel.style.color = '#f1c453';
    titleLabel.style.marginBottom = '5px';
    container.appendChild(titleLabel);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'issueTitle';
    titleInput.name = 'title';
    titleInput.style.width = '97%';
    titleInput.style.backgroundColor = '#1c2a3a';
    titleInput.style.color = '#f1c453';
    titleInput.style.border = '1px solid #f1c453';
    titleInput.style.borderRadius = '5px';
    titleInput.style.padding = '8px';
    titleInput.style.marginBottom = '20px';
    titleInput.setAttribute('placeholder', 'Title');
    container.appendChild(titleInput);

    const bodyLabel = document.createElement('label');
    bodyLabel.setAttribute('for', 'body');
    bodyLabel.textContent = 'Issue:';
    bodyLabel.style.color = '#f1c453';
    bodyLabel.style.marginBottom = '5px';
    container.appendChild(bodyLabel);

    const bodyInput = document.createElement('textarea');
    bodyInput.id = 'body';
    bodyInput.name = 'body';
    bodyInput.style.width = '97%';
    bodyInput.style.height = '200px';
    bodyInput.style.backgroundColor = '#1c2a3a';
    bodyInput.style.color = '#f1c453';
    bodyInput.style.border = '1px solid #f1c453';
    bodyInput.style.borderRadius = '5px';
    bodyInput.style.padding = '8px';
    bodyInput.style.resize = 'none';
    bodyInput.setAttribute('placeholder', 'Describe your issue/bug');
    container.appendChild(bodyInput);



    const submitButton = document.createElement('button');
    submitButton.classList.add('issue-popup-submit');
    submitButton.textContent = 'Create Issue';
    submitButton.style.display = 'inline-block';
    submitButton.style.backgroundColor = '#f1c453';
    submitButton.style.color = '#1c2a3a';
    submitButton.style.padding = '0.8rem 2rem';
    submitButton.style.fontSize = '1.2rem';
    submitButton.style.fontWeight = '700';
    submitButton.style.borderRadius = '5px';
    submitButton.style.textDecoration = 'none';
    submitButton.style.cursor = 'pointer';
    submitButton.style.transition = 'background-color 0.3s, box-shadow 0.3s';
    submitButton.addEventListener('mouseover', () => {
        submitButton.style.backgroundColor = '#ffd700';
        submitButton.style.boxShadow = '0 0 10px #f1c453';
    });
    submitButton.addEventListener('mouseout', () => {
        submitButton.style.backgroundColor = '#f1c453';
        submitButton.style.boxShadow = 'none';
    });
    submitButton.addEventListener('mousedown', () => {
        submitButton.style.backgroundColor = '#e6ad32';
        submitButton.style.boxShadow = 'none';
    });
    submitButton.addEventListener('mouseup', () => {
        submitButton.style.backgroundColor = '#f1c453';
        submitButton.style.boxShadow = 'none';
    });
    container.appendChild(submitButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '20px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.color = '#f1c453';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });
    popupContent.appendChild(closeButton);
    document.body.appendChild(popup);

    return popup;
}


// Show the popup when the burger menu option is clicked
function showPopup() {
    const popup = createPopup();
    const closeButton = popup;
    const submitButton = popup.querySelector('.issue-popup-submit');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        const title = document.getElementById('issueTitle').value;
        const text = document.getElementById('body').value;
        const movesLogText = JSON.parse(sessionStorage.getItem('movesLog'));
        const body = text + '\n Moves Log \n' + movesLogText.join('\n');
        const url = 'https://api.github.com/repos/SafwanChowdhury/Chess-Project/issues';
        const headers = { 'Authorization': 'Token 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' };
        const data = { title: title, body: body };

        fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                document.body.removeChild(popup);
                const issueNumber = data.number; // Get the issue number from the response
                sendScreenshot(issueNumber); // Call the new function to send the screenshot with the issue number
            })
            .catch(error => {
                console.error(error);
            });
    });
}

function sendScreenshot(issueNumber) {
    takeScreenshot()
    const screenshotData = sessionStorage.getItem('screenshot');
    if (!screenshotData) {
        console.error('No screenshot data found');
        return;
    }
    const url = `https://api.github.com/repos/SafwanChowdhury/Chess-Project/issues/${issueNumber}/comments`;
    const headers = { 'Authorization': 'Token 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' };
    const data = { body: `${screenshotData}` };

    fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Screenshot uploaded successfully');
        })
        .catch(error => {
            console.error(error);
        });
}


const reportLink = document.querySelector('nav li a#report-issue');
reportLink.addEventListener('click', (event) => {
    event.preventDefault();
    showPopup();
});
