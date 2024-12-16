const app = Vue.createApp({
    data() {
        return {
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
            workout: {},

            quotes: [
                { text: "The only bad workout is the one that didn’t happen.", author: "Anonymous" },
                { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
                { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
                { text: "Your body can stand almost anything. It’s your mind that you have to convince.", author: "Anonymous" }
            ],
            quote: {}
        };
    },
    created() {
        this.setWorkoutOfTheDay();
        this.setQuoteOfTheDay();
    },
    methods: {
        setWorkoutOfTheDay() {
            const chestExercises = this.exercises.filter(
                (exercise) => exercise.muscle === "Chest"
            );

            const today = new Date();
            const index = today.getDate() % chestExercises.length;

            this.workout = chestExercises[index];
        },
        setQuoteOfTheDay() {
            const today = new Date();
            const index = today.getDate() % this.quotes.length;

            this.quote = this.quotes[index];
        }
    }
});
function completeWorkout() {
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('completed-message').style.display = 'block';
}
app.mount('#DailyApp');
