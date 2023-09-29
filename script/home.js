//general
function getTextInTag(strTag, strText=""){
    return `<${strTag}>${strText}</${strTag}>`
}
function getTextInTagWithAtt(strTag, strAtt ,strText=""){
    return `<${strTag} ${strAtt}>${strText}</${strTag}>`
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OWUwMjZiMGZmZjJhNjA3Y2U1YzA0OGUxNDgzMjIwZiIsInN1YiI6IjY1MTU5ZTFhY2FkYjZiMDJiZTU1MzA3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pLCPrgWg37LKt0nC_uSuPHGVj6-OYUuK2ixkzYegpD4'
    }
};

const imagePath='https://image.tmdb.org/t/p/original'

//movie page

let movieGenresArr=[];

fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(data => data.json())
    .then(data =>{ 
            movieGenresArr=data.genres
            console.log(movieGenresArr) 
        })
    .catch(err => console.error(err));
;

const moviePageElem= document.getElementById('moviePageDiv')

loadPage()

function loadPage(page=1){
    fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
        .then(response => response.json())
        .then(response => {
                setTimeout(() => {
                    changeMoviePage(response)
                },1);
                
            })
        .catch(err => console.error(err));  
}



function changeMoviePage(responseData){
    const moviesArr=responseData.results;
    moviePageElem.innerHTML=moviesArr.map((movieObj)=>{
        return movieToHtml(movieObj)
    }).join('')

    
}


function movieToHtml(movieObj){
    let mainTitleBox =getTextInTagWithAtt('div','class="titleCard"', 
            getTextInTag('h2',movieObj.title)+
            getTextInTag('p', translateGenreArr(movieObj.genre_ids))
        )

    let content= getTextInTagWithAtt('img',`src="${imagePath+movieObj.poster_path}" class='posterImage'`)+
    mainTitleBox+
    getTextInTagWithAtt('div','class="desciptionMovie"',movieObj.overview);

    return getTextInTagWithAtt('div','class="movieCard"',content)

}

function translateGenreArr(genreIdArr){
    return genreIdArr.map((genreId)=>{return genreToName(genreId)}).join(" ")
}

function genreToName(genreId){
    const genreName=movieGenresArr.find(genre=>genre.id===genreId)
    return genreName?genreName.name:"error";
}