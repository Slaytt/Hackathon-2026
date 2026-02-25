const grid = document.getElementById('file-grid');

// On va chercher le fichier de configuration de l'OS !
fetch('/registry.json')
    .then(response => response.json())
    .then(apps => {
        apps.forEach(app => {
            if (app.id === 'explorateur') return;

            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-item';

            const icon = app.icon === 'computer' ? '💻' : '⚙️';

            fileDiv.innerHTML = `
                <div class="file-icon">${icon}</div>
                <div class="file-name">${app.name}</div>
            `;

            fileDiv.addEventListener('mousedown', () => {
                document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
                fileDiv.classList.add('selected');
            });
            fileDiv.addEventListener('dblclick', () => {
                window.parent.postMessage({ type: 'OPEN_APP', id: app.id }, '*');
            });

            grid.appendChild(fileDiv);
        });
    })
    .catch(error => console.error("Impossible de lire le registre :", error));