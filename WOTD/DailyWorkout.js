const app = Vue.createApp({
    data() {
        return {
            // Workout data
            exercises: [
                {
                    name: "Pushups",
                    muscle: "Chest",
                    img: "./assets/pushup.gif"
                },
                {
                    name: "Dumbbell Bench Press",
                    muscle: "Chest",
                    img: "./assets/dumbbellBenchPress.gif"
                },
                {
                    name: "Close-grip Bench Press",
                    muscle: "Chest",
                    img: "./assets/closeGripBench.gif"
                },
                {
                    name: "Low-cable Cross-over",
                    muscle: "Chest",
                    img: "./assets/lowCableFly.gif"
                }
            ],
            workout: {}, // Holds the Workout of the Day

            // Quote data
            quotes: [
                { text: "The only bad workout is the one that didn’t happen.", author: "Anonymous" },
                { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
                { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
                { text: "Your body can stand almost anything. It’s your mind that you have to convince.", author: "Anonymous" }
            ],
            quote: {} // Holds the Quote of the Day
        };
    },
    created() {
        this.setWorkoutOfTheDay();
        this.setQuoteOfTheDay();
    },
    methods: {
        setWorkoutOfTheDay() {
            // Filter only chest exercises
            const chestExercises = this.exercises.filter(
                (exercise) => exercise.muscle === "Chest"
            );

            // Get today's index
            const today = new Date();
            const index = today.getDate() % chestExercises.length;

            // Set the workout
            this.workout = chestExercises[index];
        },
        setQuoteOfTheDay() {
            // Get today's index
            const today = new Date();
            const index = today.getDate() % this.quotes.length;

            // Set the quote
            this.quote = this.quotes[index];
        }
    }
});

app.mount('#DailyApp');
