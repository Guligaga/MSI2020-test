const getJokeBtn = document.querySelector('#get-joke');
const radioMain = document.querySelectorAll('input[name=radio-main]');
const category = document.querySelectorAll('input[name=radio-category]');
const hearts = document.querySelectorAll('.fa-heart');
const allJokes = [];

document.addEventListener("DOMContentLoaded", () => {
    listenHearts(hearts)
});

async function getRandomJoke() {
    const res = await fetch (
        'https://api.chucknorris.io/jokes/random'
    );
    return await res.json();
}

async function getJokeByCategory(category) {
    category = category.replace(/^category-([a-z]+)$/, '$1');
    const res = await fetch (
        `https://api.chucknorris.io/jokes/random?category=${category}`
    );
    return await res.json();
}

async function getJokeByQuery(query) {
    const res = await fetch (
        `https://api.chucknorris.io/jokes/search?query=${query}`
    );
    // debugger
    const jokes = await res.json();
    const i = Math.floor(Math.random() * jokes.total);
    return jokes.result[i];
}


function showHideRadio(id) {

    const target = document.querySelector(`#${id}`);
    const category = document.querySelector('.categories');
    const queryInput = document.querySelector('.radio-main__query');
    category.classList.toggle('display-none');
    switch (id) {
        case 'radio-random':
            category.classList.add('display-none');
            queryInput.classList.add('display-none');
            break;
        case 'radio-category':
            category.classList.remove('display-none');
            queryInput.classList.add('display-none');
            break;
        case 'radio-query':
            category.classList.add('display-none');
            queryInput.classList.remove('display-none');
            break;
    }
}

function radioSwitcher(el) {
    el.addEventListener('change', e => {
        document.querySelector(`input[name=${el.name}][checked]`)
            .removeAttribute('checked');
        e.target.setAttribute('checked', '');
        if(el.name === 'radio-main') {
            showHideRadio(e.target.id);
        }
    })
}


function listenHearts(hearts) {
    hearts.forEach(heart => {
        heart.addEventListener('click', () => {
            debugger
            let joke;
            const thisID = heart.parentNode.querySelector('a').textContent.trim();
            for (let i = 0; i < allJokes.length; i++) {
                if(allJokes[i].id === thisID) {
                    joke = allJokes[i];
                    break;
                }
            }
            // if(heart.classList.contains('fa-heart')) {
            //
            // }
            heart.classList.toggle('fas');
            if(heart.classList.contains('fas')) {
                renderJoke(joke, '-fav')
            }
            else {

            }
        })
    });
}

function renderJoke(joke, fav = '') {
    const { categories, id, updated_at, url, value} = joke;
    const parseDate = updated_at.replace(/(\.\d*)/g, '');
    let update = Math.floor((Date.now() - Date.parse(parseDate))/3600/1000);
    update = update[update.length - 1] === '1'? `${update} hour` : `${update} hours`;
    const jokeList = document.querySelector(`.joke-list${fav}`);
    const jokeCard = document.createElement('div');
    jokeCard.classList.add('joke-card', `joke-card${fav}`);
    jokeCard.innerHTML = `
    <i class="far fa-heart joke-heart${fav}"></i>
    <div class="joke-content__img joke-message${fav}">
        <img src="./assets/icons/message.svg" alt="message">
    </div>
    <div class="joke-card__main joke-content">
        <div class="joke-content__content">
        <span class="joke-content__link">
            ID:
            <a href="${url}">
                ${id} <i class="fas fa-external-link-alt"></i>
            </a>
        </span>
            <p class="joke-content__text${fav}">
            ${value}
            </p>
        </div>
        <div class="joke-card__footer">
            <h5>Last update: ${update} ago</h5>
            <h5 ${categories[0] ? '':'class="display-none"'}>${categories[0]}</h5>
        </div>
    </div>
    `;
    jokeList.prepend(jokeCard);
    if(fav) {
        localStorage.setItem(id, JSON.stringify(joke));
    }
    else {
        allJokes.push(joke);
    }
    const newHeart = jokeList.querySelector('.fa-heart');
    listenHearts([newHeart]);
}



radioMain.forEach(radio => radioSwitcher(radio));

category.forEach(category => radioSwitcher(category));

getJokeBtn.addEventListener('click', async function() {
    const radioChecked = document.querySelector('input[name=radio-main][checked]');
    const categoryChecked = document.querySelector('input[name=radio-category][checked]');
    const searchQuery = document.querySelector('input[name=search-query]');
    let joke;
    switch (radioChecked.id) {
        case 'radio-random':
            joke = await getRandomJoke();
            break;
        case 'radio-category':
            joke = await getJokeByCategory(categoryChecked.id);
            break;
        case 'radio-query':
            joke = await getJokeByQuery(searchQuery.value);
            break;
    }
    renderJoke(joke);
});

