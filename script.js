
const NEW_API_KEY ='08d071dc29dc4272836a93a3032af7ca'   
const API_KEY = "3d6df72152ec4121add22cdd55bebefb";
const url = "https://newsapi.org/v2/everything?q=";

https://newsapi.org/v2/everything?q=bitcoin&apiKey=08d071dc29dc4272836a93a3032af7ca

window.addEventListener('load', () => fetchNews("india"));

function reload() {
    window.location.reload();
}

// async function fetchNews (query){
//     const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
//     const data = await res.json();
//     bindData(data.articles);
// }

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${NEW_API_KEY}`);
        // const res = await fetch(`https://newsapi.org/v2/everything?q=bitcoin&apiKey=08d071dc29dc4272836a93a3032af7ca`);
        // console.log(url,query,API_KEY)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
            bindData(data.articles);
        } else {
            console.error("No articles found or data is undefined");
            bindData([]); // Ensure bindData is called with an empty array to clear previous content
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';

    if (articles.length === 0) {
        cardsContainer.innerHTML = '<p>No news articles found.</p>';
        return;
    }

    articles.forEach((article) => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);

        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone); 
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} ・ ${date}`;

    cardClone.firstElementChild.addEventListener('click', () =>{
        window.open(article.url, "_blank");
    })
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () =>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});