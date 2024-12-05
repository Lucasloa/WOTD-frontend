

const exerciseImages = {
    "Pushups": "./assets/pushup.gif",
    "Dumbbell Bench Press": "./assets/dumbbellBenchPress.gif",
    "Close-grip bench press": "./assets/closeGripBench.gif",
    "Dumbbell Flyes": "./assets/dumbbellFlyes.gif",
    "Incline dumbbell bench press": "./assets/inclineDumbbellbenchPress.gif",
    "Low-cable cross-over" : "./assets/lowCableFly.gif",
    "Barbell Bench Press - Medium Grip" : "./assets/barbellBenchPress.gif",
    "Chest dip" : "./assets/chestDip.gif",
    "Decline Dumbbell Flyes" : "./assets/declineFlyes.gif",
    "Bodyweight Flyes" : "./assets/bodyweightFlyes.gif",

};

document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://api.api-ninjas.com/v1/exercises"; // Replace with your API endpoint
    const apiKey = "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw"; // Replace with your actual API key
    const container = document.querySelector(".uk-grid-small");

    try {
        // Fetch the exercises from the API
        const response = await axios.get(apiUrl, {
            headers: { "X-Api-Key": apiKey }
        });
        const exercises = response.data;

        exercises.forEach((exercise) => {
            // Use the mapped image URL or a placeholder if no match
            const imageUrl = exerciseImages[exercise.name] || "https://via.placeholder.com/150";
            const card = `
                <div>
                    <div class="uk-card uk-card-default uk-card-body uk-text-center">
                        <img src="${imageUrl}" alt="${exercise.name}" class="uk-border-circle">
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

// Search functionality for exercises by muscle group
document.querySelector("#search-button").addEventListener("click", async () => {
    const muscle = document.querySelector("#search-input").value.trim();
    const apiUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: { "X-Api-Key": "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw" }
        });
        const exercises = response.data;
        const container = document.querySelector(".uk-grid-small");
        container.innerHTML = ""; // Clear previous results

        exercises.forEach((exercise) => {
            const imageUrl = exerciseImages[exercise.name] || "https://via.placeholder.com/150";
            const card = `
                <div>
                    <div class="uk-card uk-card-default uk-card-body uk-text-center">
                        <img src="${imageUrl}" alt="${exercise.name}" class="uk-border-circle">
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

const app = Vue.createApp({
    data() {
        return {
            muscle: '', // The muscle group entered by the user
            exercises: [], // List of exercises fetched from the API
            loading: false, // Indicates if the API request is in progress
            error: null, // Holds any error messages
        };
    },
    methods: {
        async searchExercises() {
            this.loading = true;
            this.error = null; // Reset any previous errors
            this.exercises = []; // Clear previous results

            const apiUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${this.muscle}`;
            const apiKey = "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw";

            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        "X-Api-Key": apiKey,
                    },
                });
                this.exercises = response.data; // Populate exercises with the API response
            } catch (error) {
                console.error("Error fetching exercises:", error);
                this.error = "Error loading exercises. Please try again later.";
            } finally {
                this.loading = false;
            }
        },
    },
});

app.mount('#app'); // Mount the Vue app to the #app div

