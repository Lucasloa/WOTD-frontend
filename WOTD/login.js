document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const apiUrl = 'https://wotdcontroller.azurewebsites.net/wotd/login';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        console.log('Response Status:', response.status);
        console.log('Response:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Response:', errorText);
            document.getElementById('loginError').hidden = false;
            document.getElementById('loginError').textContent = errorText || 'Invalid credentials.';
            return;
        }

        const data = await response.json();
        console.log('User Data:', data);

        localStorage.setItem('loggedInUser', JSON.stringify(data));
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Fetch Error:', error);
        document.getElementById('loginError').hidden = false;
        document.getElementById('loginError').textContent = 'An error occurred. Please try again.';
    }
});
