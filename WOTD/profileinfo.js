const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
const personId = loggedInUser.id;
console.log('Person ID:', personId);

fetch(`https://wotdcontroller.azurewebsites.net/wotd/${personId}`)
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data);
        const profileDetails = document.getElementById('profileDetails');
        profileDetails.innerHTML = `
            <p><strong>Name:</strong> ${data.FName}</p>
            <p><strong>Gender:</strong> ${data.Gender}</p>
            <p><strong>Age:</strong> ${data.Age}</p>
            <p><strong>Average Pulse:</strong> ${data.AvgPulse}</p>
            <p><strong>Weight:</strong> ${data.Weight} kg</p>
            <p><strong>Height:</strong> ${data.Height} cm</p>
            <p><strong>Username:</strong> ${data.Username}</p>
            <p><strong>Measurements:</strong> ${data.measurements.map(m => `Date: ${m.date}, Value: ${m.pulse}`).join('<br>')}</p>
        `;
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
        document.getElementById('profileDetails').innerHTML = 'Failed to load profile.';
    });
