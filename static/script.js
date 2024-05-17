document.addEventListener('DOMContentLoaded', () => {
    let movements = [];

    document.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        const timestamp = Date.now();
        movements.push([x, y, timestamp]);

        if (movements.length >= 100) {
            sendMouseData(movements);
            movements = [];
        }
    });

    function sendMouseData(data) {
        fetch('/mouse_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movements: data })
        })
        .then(response => response.json())
        .then(data => {
            const anxietyDiv = document.getElementById('anxiety-level');
            let anxietyText = '';
            anxietyDiv.classList.remove('level-calm', 'level-alert', 'level-super-anxious');
            if (data.anxiety_level === 3) {
                anxietyText = 'Super-Anxious';
                anxietyDiv.classList.add('level-super-anxious');
            } else if (data.anxiety_level === 2) {
                anxietyText = 'Alert';
                anxietyDiv.classList.add('level-alert');
            } else {
                anxietyText = 'Calm';
                anxietyDiv.classList.add('level-calm');
            }
            anxietyDiv.innerText = 'Anxiety Level: ' + anxietyText;
        })
        .catch(error => console.error('Error:', error));
    }
});
