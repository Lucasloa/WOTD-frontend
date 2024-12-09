const calendarApp = Vue.createApp({
    data() {
        return {
            days: [],               // Calendar days (for current month)
            exercises: [],          // Available exercises
            selectedDayIndex: null,  // Index of the day to add exercises
            isLoading: false,       // Loading state for the API
            isError: false,         // Error state for API call
            deleteMode: false,      // Delete mode state
            currentMonth: new Date().getMonth(), // Current month (0-11)
            currentYear: new Date().getFullYear(), // Current year
        };
    },
    methods: {
        // Toggle Delete Mode
        toggleDeleteMode() {
            this.deleteMode = !this.deleteMode;
        },

        // Go to the previous month
        goToPreviousMonth() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
            this.generateDays(); // Regenerate the days for the previous month
        },

        // Go to the next month
        goToNextMonth() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
            this.generateDays(); // Regenerate the days for the next month
        },

        // Generate the days for the selected month and year
        generateDays() {
            // Get saved calendar data from localStorage
            const savedDays = JSON.parse(localStorage.getItem('calendarDays')) || [];
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const newDays = [];

            // Generate an array of day objects for the current month
            for (let i = 1; i <= daysInMonth; i++) {
                const date = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                
                // Find saved day data from localStorage
                const existingDay = savedDays.find(day => day.date === date);
                
                // If the day exists in savedDays, merge its exercises, otherwise initialize with no exercises
                newDays.push({
                    date,
                    exercises: existingDay ? existingDay.exercises : [],
                });
            }

            // Update the calendar with the new days (preserving existing exercises)
            this.days = newDays;
        },

        // Select a day to add exercises
        selectDay(index) {
            this.selectedDayIndex = index;
            UIkit.modal('#exercise-modal').show();
        },

        // Add exercise to the selected day
        addExerciseToDay(exercise) {
            if (this.selectedDayIndex === null) return;

            const selectedDay = this.days[this.selectedDayIndex];
            const exerciseIdentifier = exercise.id || exercise.name;

            const exists = selectedDay.exercises.some(e => (e.id || e.name) === exerciseIdentifier);

            if (!exists) {
                selectedDay.exercises.push({ ...exercise, id: exercise.id || exercise.name });
                this.saveCalendar();
                UIkit.modal('#exercise-modal').hide();
                UIkit.notification(`${exercise.name} added to ${selectedDay.date}!`, { status: 'success' });
            } else {
                UIkit.notification('Exercise already exists for this day!', { status: 'warning' });
            }
        },

        // Delete exercise from a day
        deleteExerciseFromDay(dayIndex, exerciseIndex) {
            UIkit.modal.confirm("Are you sure you want to delete this exercise?").then(() => {
                this.days[dayIndex].exercises.splice(exerciseIndex, 1);
                this.saveCalendar();
                UIkit.notification("Exercise removed successfully!", { status: 'success' });
            }).catch(() => {
                UIkit.notification("Exercise deletion canceled.", { status: 'warning' });
            });
        },

        // Clear all exercises from the calendar
        clearAllExercises() {
            UIkit.modal.confirm("Are you sure you want to clear all exercises?").then(() => {
                this.days.forEach(day => day.exercises = []); // Clear exercises for all days
                this.saveCalendar();
                UIkit.notification("All exercises cleared!", { status: 'success' });
            }).catch(() => {
                UIkit.notification("Clear all exercises canceled.", { status: 'warning' });
            });
        },

        // Save the calendar data to localStorage
        saveCalendar() {
            // Save the full calendar state, including exercises for all days
            localStorage.setItem('calendarDays', JSON.stringify(this.days));
        },

        // Load the calendar data from localStorage
        loadCalendar() {
            // Load saved days from localStorage (if any)
            const savedDays = JSON.parse(localStorage.getItem('calendarDays'));
            this.days = savedDays || [];
        },

        // Fetch exercises from API
        async fetchExercises() {
            const API_URL = "https://api.api-ninjas.com/v1/exercises";
            const API_KEY = "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw";

            try {
                this.isLoading = true;
                this.isError = false;

                const response = await axios.get(API_URL, {
                    headers: { "X-Api-Key": API_KEY },
                });

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
        this.generateDays(); // Generate the days when the app starts
    },
});

calendarApp.mount('#calendarApp');
