const grid = document.getElementById('file-grid');

// On va chercher le fichier de configuration de l'OS !
fetch('/registry.json')
    .then(response => response.json())
    .then(apps => {
        apps.forEach(app => {
            // On ne veut pas afficher l'explorateur dans l'explorateur (inception !)
            if (app.id === 'explorateur') return;

            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-item';

            // On choisit un emoji selon le type (comme dans l'OS)
            const icon = app.icon === 'computer' ? '💻' : '⚙️';

            fileDiv.innerHTML = `
                <div class="file-icon">${icon}</div>
                <div class="file-name">${app.name}</div>
            `;

            // Effet visuel : sélection au premier clic
            fileDiv.addEventListener('mousedown', () => {
                document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
                fileDiv.classList.add('selected');
            });

            // L'ACTION MAGIQUE : Double clic ouvre l'app dans l'OS parent !
            fileDiv.addEventListener('dblclick', () => {
                window.parent.postMessage({ type: 'OPEN_APP', id: app.id }, '*');
            });

            grid.appendChild(fileDiv);
        });
    })
    .catch(error => console.error("Impossible de lire le registre :", error));