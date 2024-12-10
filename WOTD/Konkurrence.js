competitions.forEach((competitions) => {
    const card = `
        <div>
            <div class="uk-card uk-card-default uk-card-body uk-text-center">
                <img src="${imageUrl}" alt="${competition.name}" class="uk-border-circle">
                <h3 class="uk-card-title">${competition.name}</h3>
                <p>Muscle: ${competition.description}</p>
                <p>Type: ${competition.type}</p>
                <p>Difficulty: ${competition.difficulty}</p>
                <button class="uk-button uk-button-primary">Add to Calendar</button>
            </div>
        </div>
    `;
    container.innerHTML += card;
});