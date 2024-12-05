const quoteApp = Vue.createApp({
    data() {
        return {
            quotes: [
                { text: "No Pain, No Gain!", author: "Jane Fonda" },
                { text: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not a champion.", author: "Arnold Schwarzenegger" },
                { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
                { text: "What hurts today makes you stronger tomorrow.", author: "Jay Cutler" }
            ],
            quote: {} // Holds the Quote of the Day
        };
    },
    created() {
        this.setQuoteOfTheDay();
    },
    methods: {
        setQuoteOfTheDay() {
            const today = new Date();
            const index = today.getDate() % this.quotes.length;
            this.quote = this.quotes[index];
        }
    }
});

quoteApp.mount('#QuoteApp');
