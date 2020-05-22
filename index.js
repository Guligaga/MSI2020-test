async function getRandomJoke() {
    const res = await fetch ('https://api.chucknorris.io/jokes/random');
    const joke = await res.json();
    console.log(joke);
}

async function getJokeByCategory(category) {
    const res = await fetch (`https://api.chucknorris.io/jokes/random?category=${category}`);
    const joke = await res.json();
    console.log(joke);
}

async function getJokeByQuery(query) {
    const res = await fetch (`https://api.chucknorris.io/jokes/search?query=${query}`);
    const jokes = await res.json();
    console.log(jokes);
}


// getRandomJoke();


const categories = [
    "animal",
    "career",
    "celebrity",
    "dev",
];


const index = Math.floor(Math.random() * categories.length);

// getJokeByCategory(categories[index]);
getJokeByQuery('hell');
