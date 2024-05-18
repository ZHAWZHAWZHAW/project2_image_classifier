function displayResults(data) {
    if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('answer').innerHTML = "Keine Ergebnisse gefunden.";
        return;
    }
    let resultsHtml = '<table class="table">';
    resultsHtml += '<thead><tr><th>Klasse</th><th>Wahrscheinlichkeit</th><th></th></tr></thead><tbody>';
    data.forEach(item => {
        const probabilityPercentage = (item.probability * 100).toFixed(2);
        const className = item.className.replace(/n\d{8}\s/, '');  // Entfernt n02123045 und ähnliches
        resultsHtml += `<tr><td>${className}</td><td>${probabilityPercentage}%</td>`;
        resultsHtml += `<td><div class="progress"><div class="progress-bar" role="progressbar" style="width: ${probabilityPercentage}%" aria-valuenow="${probabilityPercentage}" aria-valuemin="0" aria-valuemax="100"></div></div></td></tr>`;
    });
    resultsHtml += '</tbody></table>';
    document.getElementById('answer').innerHTML = resultsHtml;
}

function checkFiles(files) {
    console.log(files);
    if (files.length != 1) {
        alert("Bitte genau eine Datei hochladen.");
        return;
    }
    const fileSize = files[0].size / 1024 / 1024; // in MiB
    if (fileSize > 10) {
        alert("Datei zu groß (max. 10Mb)");
        return;
    }
    document.getElementById('answerPart').style.visibility = 'visible';
    const preview = document.getElementById('preview');
    if (files[0]) {
        preview.src = URL.createObjectURL(files[0]);
    }
    const formData = new FormData();
    formData.append("image", files[0]);
    fetch('/analyze', {
        method: 'POST',
        body: formData
    }).then(response => response.json()) // Ensure that the response is expected and processed as JSON
    .then(data => {
        console.log(data); // For debugging to see the actual response
        displayResults(data); // Function to display results
    }).catch(error => {
        console.error('Error in the request:', error);
        document.getElementById('answer').innerHTML = "Fehler bei der Verarbeitung Ihrer Anfrage.";
    });
}
