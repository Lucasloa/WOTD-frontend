const calendarApp = Vue.createApp({
    data() {
        return {
            days: [],            // Calendar days
            exercises: [],       // Available exercises
            selectedDayIndex: null, // Index of the day to add exercises
            isLoading: false,    // Loading state for the API
            isError: false,      // Error state for API call
        };
    },
    methods: {
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

            // Avoid duplicates
            const exists = selectedDay.exercises.some(e => e.id === exercise.id);
            if (!exists) {
                selectedDay.exercises.push(exercise);
                this.saveCalendar(); // Save updated state
                UIkit.modal('#exercise-modal').hide();
                UIkit.notification(`${exercise.name} added to ${selectedDay.date}!`, { status: 'success' });
            } else {
                UIkit.notification('Exercise already exists for this day!', { status: 'warning' });
            }
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
