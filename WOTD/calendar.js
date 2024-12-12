const calendarApp = Vue.createApp({
    data() {
        return {
            days: [],
            exercises: [],
            selectedDayIndex: null,
            isLoading: false,
            isError: false,
            deleteMode: false,
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
        };
    },
    methods: {
        toggleDeleteMode() {
            this.deleteMode = !this.deleteMode;
        },

        goToPreviousMonth() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
            this.generateDays();
        },

        goToNextMonth() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
            this.generateDays();
        },

        generateDays() {
            const savedDays = JSON.parse(localStorage.getItem('calendarDays')) || [];
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const newDays = [];

            for (let i = 1; i <= daysInMonth; i++) {
                const date = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                
                const existingDay = savedDays.find(day => day.date === date);
                
                newDays.push({
                    date,
                    exercises: existingDay ? existingDay.exercises : [],
                });
            }

            this.days = newDays;
        },

        selectDay(index) {
            this.selectedDayIndex = index;
            UIkit.modal('#exercise-modal').show();
        },

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

        deleteExerciseFromDay(dayIndex, exerciseIndex) {
            UIkit.modal.confirm("Are you sure you want to delete this exercise?").then(() => {
                this.days[dayIndex].exercises.splice(exerciseIndex, 1);
                this.saveCalendar();
                UIkit.notification("Exercise removed successfully!", { status: 'success' });
            }).catch(() => {
                UIkit.notification("Exercise deletion canceled.", { status: 'warning' });
            });
        },

        clearAllExercises() {
            UIkit.modal.confirm("Are you sure you want to clear all exercises?").then(() => {
                this.days.forEach(day => day.exercises = []);
                this.saveCalendar();
                UIkit.notification("All exercises cleared!", { status: 'success' });
            }).catch(() => {
                UIkit.notification("Clear all exercises canceled.", { status: 'warning' });
            });
        },

        saveCalendar() {
            localStorage.setItem('calendarDays', JSON.stringify(this.days));
        },

        loadCalendar() {
            const savedDays = JSON.parse(localStorage.getItem('calendarDays'));
            this.days = savedDays || [];
        },

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
        this.loadCalendar();
        this.fetchExercises();
        this.generateDays();
    },
});

calendarApp.mount('#calendarApp');
