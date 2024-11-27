document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://api.api-ninjas.com/v1/exercises"; // Replace with your API endpoint
    const apiKey = "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw"; // Replace with your actual API key

    
    const container = document.querySelector(".uk-grid-small");

    try {
        // Use Axios to fetch the exercises
        const response = await axios.get(apiUrl, {
            headers: {
                "X-Api-Key": apiKey
            }
        });

        // Extract the data from the response
        const exercises = response.data;

        // Dynamically create exercise cards
        exercises.forEach((exercise) => {
            const card = `
                <div>
                    <div class="uk-card uk-card-default uk-card-body uk-text-center">
                        <img src="https://via.placeholder.com/150" alt="${exercise.name}" class="uk-border-circle">
                        <h3 class="uk-card-title">${exercise.name}</h3>
                        <p>Muscle: ${exercise.muscle}</p>
                        <p>Type: ${exercise.type}</p>
                        <p>Difficulty: ${exercise.difficulty}</p>
                        <button class="uk-button uk-button-primary">Add to Calendar</button>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error("Error fetching exercises:", error);
        container.innerHTML = `
            <div class="uk-alert-danger" uk-alert>
                <p>Error loading exercises. Please try again later.</p>
            </div>
        `;
    }
});
document.querySelector("#search-button").addEventListener("click", async () => {
    const muscle = document.querySelector("#search-input").value.trim(); // Get user input
    const apiUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`; // Create API URL

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                "X-Api-Key": "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw" // Replace with your API key
            }
        });

        const exercises = response.data;
        const container = document.querySelector(".uk-grid-small"); // Select container
        container.innerHTML = ""; // Clear previous results

        // Generate exercise cards
        exercises.forEach((exercise) => {
            const card = `
                <div>
                    <div class="uk-card uk-card-default uk-card-body uk-text-center">
                        <img src="https://via.placeholder.com/150" alt="${exercise.name}" class="uk-border-circle">
                        <h3 class="uk-card-title">${exercise.name}</h3>
                        <p>Muscle: ${exercise.muscle}</p>
                        <p>Type: ${exercise.type}</p>
                        <p>Difficulty: ${exercise.difficulty}</p>
                        <button class="uk-button uk-button-primary">Add to Calendar</button>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error("Error fetching exercises:", error);
        const container = document.querySelector(".uk-grid-small");
        container.innerHTML = `
            <div class="uk-alert-danger" uk-alert>
                <p>Error loading exercises. Please try again later.</p>
            </div>
        `;
    }
});
