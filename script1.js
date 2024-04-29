const cardContainer = document.getElementById('cardContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function fetchTMDBData(){
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMDA4OWRjMTQ0ZTRlMjk0ZTcwNzI1MDFlYWRiY2VjMSIsInN1YiI6IjY2MjhkY2QxZTI5NWI0MDE4NzlkZjc4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCj1k2jzScG23jqrYmt0BrF0XOCjy2I9HaqsfMNZ4cg'
        }
    };

    return fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200', options)
        .then(response => response.json())
        .then(data => data.results)
        .catch(err => {
            console.error('Error fetching TMDB data:', err);
            return [];
        });
}

function createCard(title, imageURL, overview, voteAverage) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardTitle = document.createElement('h2');
    cardTitle.textContent = title;

    const cardImg = document.createElement('img');
    cardImg.src = imageURL;

    const cardOverview = document.createElement('p');
    cardOverview.textContent = overview;

    const cardVoteAverage = document.createElement('p');
    cardVoteAverage.textContent = `평점: ${voteAverage}`;

    card.appendChild(cardImg);
    card.appendChild(cardTitle);
    card.appendChild(cardOverview);
    card.appendChild(cardVoteAverage);

    return card;
}

async function displayTMDBData() {
    try {
        const movieList = await fetchTMDBData();

        movieList.forEach(movie => {
            const title = movie.title;
            const posterPath = movie.poster_path;
            const imageURL = `https://image.tmdb.org/t/p/w500${posterPath}`;
            const overview = movie.overview;
            const voteAverage = movie.vote_average;
            const movieId = movie.id;

            const card = createCard(title, imageURL, overview, voteAverage);

            card.querySelector('img').addEventListener('click', () => {
                alert(`영화 id는 ${movieId}입니다!`);
            });

            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error('TMDB 데이터를 표시하는 중 오류가 발생했습니다:', error);
    }
}

async function displayFilteredMovies(searchTerm) {
    try {
        const movieList = await fetchTMDBData();
        const filteredMoviesList = filteredMovies(movieList, searchTerm);

        cardContainer.innerHTML = '';

        filteredMoviesList.forEach(movie => {
            const title = movie.title;
            const posterPath = movie.poster_path;
            const imageURL = `https://image.tmdb.org/t/p/w500${posterPath}`;
            const overview = movie.overview;
            const voteAverage = movie.vote_average;
            const movieId = movie.id;

            const card = createCard(title, imageURL, overview, voteAverage);

            card.querySelector('img').addEventListener('click', () => {
                alert(`영화 id는 ${movieId}입니다!`);
            });

            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error('검색된 영화를 표시하는 중 오류가 발생했습니다:', error);
    }
}

function filteredMovies(movieList, searchTerm) {
    // 검색어가 없는 경우 전체 영화 목록을 반환합니다.
    if (!searchTerm) {
        return movieList;
    }

    // 검색어가 포함된 영화만 필터링하여 반환합니다.
    return movieList.filter(movie => {
        // 영화 제목이나 설명에 검색어가 포함되어 있는지 확인합니다.
        return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
}

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    displayFilteredMovies(searchTerm);
});

searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value;
        displayFilteredMovies(searchTerm);
    }
});

window.addEventListener('load', displayTMDBData);