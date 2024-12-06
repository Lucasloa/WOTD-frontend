const calendarApp = Vue.createApp({
    data() {
        return {
            days: [],            // Calendar days
            exercises: [],       // Available exercises
            selectedDayIndex: null, // Index of the day to add exercises
            isLoading: false,    // Loading state for the API
            isError: false,      // Error state for API call
            deleteMode: false,
        };
    },
    methods: {
        toggleDeleteMode() {
            this.deleteMode = !this.deleteMode;
        },
        deleteExerciseFromDay(dayIndex, exerciseIndex) {
            this.days[dayIndex].exercises.splice(exerciseIndex, 1); // Remove exercise
            this.saveCalendar(); // Save updated state
            UIkit.notification("Exercise removed successfully!", { status: 'success' });
        },
        generateDays() {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Generate an array of day objects
            const days = [];
            for (let i = 1; i <= daysInMonth; i++) {
                days.push({
                    date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
                    exercises: [],
                });
            }
            return days;
        },
        selectDay(index) {
            this.selectedDayIndex = index;
            UIkit.modal('#exercise-modal').show(); // Show the modal when a day is selected
        },
        addExerciseToDay(exercise) {
            if (this.selectedDayIndex === null) return;
        
            const selectedDay = this.days[this.selectedDayIndex];
        
            // Generate a unique identifier if id is not reliable
            const exerciseIdentifier = exercise.id || exercise.name;
        
            // Avoid duplicates by checking the unique identifier
            const exists = selectedDay.exercises.some(e => (e.id || e.name) === exerciseIdentifier);
        
            if (!exists) {
                selectedDay.exercises.push({ ...exercise, id: exercise.id || exercise.name });
                this.saveCalendar(); // Save updated state
                UIkit.modal('#exercise-modal').hide();
                UIkit.notification(`${exercise.name} added to ${selectedDay.date}!`, { status: 'success' });
            } else {
                UIkit.notification('Exercise already exists for this day!', { status: 'warning' });
            }
        },
            deleteExerciseFromDay(dayIndex, exerciseIndex) {
                // Confirm deletion with the user
                UIkit.modal.confirm("Are you sure you want to delete this exercise?").then(() => {
                    this.days[dayIndex].exercises.splice(exerciseIndex, 1); // Remove the exercise
                    this.saveCalendar(); // Save the updated calendar to localStorage
                    UIkit.notification("Exercise removed successfully!", { status: 'success' });
                }).catch(() => {
                    // If user cancels, no action is taken
                    UIkit.notification("Exercise deletion canceled.", { status: 'warning' });
                });
        },
        saveCalendar() {
            localStorage.setItem('calendarDays', JSON.stringify(this.days));
        },
        loadCalendar() {
            const savedDays = JSON.parse(localStorage.getItem('calendarDays'));
            this.days = savedDays || this.generateDays();
        },
        async fetchExercises() {
            const API_URL = "https://api.api-ninjas.com/v1/exercises";
            const API_KEY = "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw";

            try {
                this.isLoading = true;
                this.isError = false;

                // Fetch exercises from the API
                const response = await axios.get(API_URL, {
                    headers: { "X-Api-Key": API_KEY },
                });

                // Update exercises list with data from the API
                if (response.data.length > 0) {
                    this.exercises = response.data;
                } else {
                    UIkit.notification('No exercises found.', { status: 'warning' });
                }

                this.isLoading = false;
            } catch (error) {
                console.error("Error fetching exercises:", error);
                this.isError = true;
                UIkit.notification('Failed to load exercises. Please try again later.', { status: 'danger' });
                this.isLoading = false;
            }
        },
    },
    mounted() {
        this.loadCalendar();  // Load calendar data from localStorage
        this.fetchExercises(); // Fetch exercises from API when the app is mounted
    },
});

calendarApp.mount('#calendarApp');
