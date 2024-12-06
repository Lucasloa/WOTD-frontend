const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
const personId = loggedInUser.id; // This is the ID of the logged-in user
console.log('Person ID:', personId);  // Check if the ID is correct

fetch(`https://wotdcontroller.azurewebsites.net/wotd/${personId}`)
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); // Check the data returned from the API
        // Populate the profile section with the user's data
        const profileDetails = document.getElementById('profileDetails');
        profileDetails.innerHTML = `
            <p><strong>Name:</strong> ${data.FName}</p>
            <p><strong>Gender:</strong> ${data.Gender}</p>
            <p><strong>Age:</strong> ${data.Age}</p>
            <p><strong>Average Pulse:</strong> ${data.AvgPulse}</p>
            <p><strong>Weight:</strong> ${data.Weight} kg</p>
            <p><strong>Height:</strong> ${data.Height} cm</p>
            <p><strong>Username:</strong> ${data.Username}</p>
        `;
    })
    .catch(error => {
        console.error('Error fetching profile:', error); // Log the error for more details
        document.getElementById('profileDetails').innerHTML = 'Failed to load profile.';
    });
