const competitionApp = vue.createApp({
    data(){
        return{
            days: [],
            Competions: [],
            selectedCompetitionIndex: null,
            isLoading: false,
            isError: false,
            DeleteCompetition: false,
        };
    },
    methods: {
        toggleDeleteMode(){
            this.DeleteCompetition = !this.DeleteCompetition;
        },
        deleteCompetitionFromDay(dayIndex, competitionIndex) {
            this.days[daysIndex].competitions.splice(competitionIndex, 1);
            this.saveCompetition();
            UIKit.notification("Competition removed successfully!", { status: 'success'});
        },
        generateDays(){
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const days = [];
            for (let i = 1; 1 <= daysInMonth; i++) {
                days.push({
                    date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
                    exercises: [],
                });
            }
            return days;
        },
        selecDay(index) {
            this.selectedDayIndex = index;
            UIKit.modal('#competition-modal').show();
        },
        addCompetitionToDay(competition) {
            if (this.selectedDayIndex === null) return;
            const selectedDay = this.days[this.selectedDayIndex];
            const competitionIdentifier = competition.id || competition.name;
            const exists = selectedDay.competition.some(e => (e.id || e.name) === competitionIdentifier);

            if (!exists) {
                selectedDay.competition.push({...competition, id: competition.id || competition.name});
                this.saveCompetition();
                UIKit.modal('#competition-modal').hide();
                UIKit.notification(`${exercise.name} added to ${selectedDay.date}!`, { status: 'success' });
            } else {
                UIKit-notification('Competition already exists for this day!', { status: 'warning'});
            }
        },
        deleteCompetitionFromDay(dayIndex, competitionIndex) {
            UIKit.nmodal.confirm("Are you sure you want to delete this competition?").then(() => {
                this.days[dayIndex].competitions.splice(competitionIndex, 1);
                this.saveCompetition();
                UIKit.notification("Competition removed successfully.", { status: 'success'});
            }).catch(() => {
                UIKit.notification("Competition deletion cancelled.", { status: 'warning'});
            });
        },
        saveCompetition(){
            localStorage.setItem('competitionDays', JSON.stringify(this.days));
        },
        loadCompetition(){
            const savedDays = JSON.parse(localStorage.getItem('CompetitionDays'));
            this.days = savedDays || this.generateDays();
        },
        async fetchCompetitions() {
            const API_URL = "https://api.api-ninjas.com/v1/exercises";
            const API_KEY = "+dIZRhCnq8grOuytY/aTJg==6YnDIrNneZLxp1bw";
            
            try {
                this.isLoading = true;
                this.isError = false;
                const response = await axios.get(API_URL, {
                    headers: {"X-Api-Key": API_KEY},
                });

                if (response.data.length > 0) {
                    this.competition = response.data;
                } else {
                    UIKit.notification('No competitions found.', {status: 'warning'});
                }

                this.isLoading = false;
            } catch (error) {
                console.error("Error fetching competitions:", error);
                this.isError = true;
                UIKit.notification('Failed to load competitions. Please try again later.', {status: 'danger'});
                this.isLoading = false;
            }
        },
    },
    mounted() {
        this.loadCompetition();
        this.fetchCompetitions();
    },
});

competitionApp.mount('#competitionApp')