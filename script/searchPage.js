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



function loadPage(page=1){
    fetch(`https://api.themoviedb.org/3/search/movie?query=${currentSearch}&include_adult=false&language=en-US&page=${page}`, options)
        .then(response => response.json())
        .then(response => {
                if(response.status_code)
                {
                    moviePageElem.innerHTML=`<div class='d-flex align-items-center'><img src='./assets/error_icon.png' style="max-width:50%;">`+
                    `<h1 style="color:red;">${response.status_message}</h1> </div>`
                }
                else
                {
                    changeMoviePage(response)
                }
            })
        .catch(err => console.error(err)); 
    ;
}



function changeMoviePage(responseData){
    moviePageElem.scrollTop=0
    const moviesArr=responseData.results;
    moviePageElem.innerHTML=moviesArr.map((movieObj,movieIndex)=>{
        return movieToHtml(movieObj,getNumberInTotal(responseData.page)+movieIndex+1)
    }).join('')

    createPagination(responseData)
}


function createPagination(data){

    const pageInputGroup=getTextInTagWithAtt('div','class="form-floating"',
        getTextInTagWithAtt('input',`type="number" class="form-control" id='pageInput' value="${data.page}" onchange="switchPageNumber(Number(this.value))"`)+
        `<label for="pageInput">enter page(1-${Math.min(500,data.total_pages)})</label>`
    )

    const changePageControls=getTextInTagWithAtt('div','class="input-group align-self-start w-25 "',
        getTextInTagWithAtt('button',`class="bi btn btn-primary bi-chevron-left " ${data.page==1?'disabled':'onclick="switchPageNumberBy1(false)"'} id="pageLeft"`)+
        pageInputGroup+
        getTextInTagWithAtt('button',`class="bi btn btn-primary bi-chevron-right " ${data.page>=Math.min(500,data.total_pages)?'disabled':'onclick="switchPageNumberBy1(true)"'} id="pageRight"`)
    )


    
    pageScrollElem.innerHTML= getTextInTag('p',`results: ${getNumberInTotal(data.page)+1}-${Math.min(getNumberInTotal(data.page+1),data.total_results)} `)+
    getTextInTag('p',`possible results: ${Math.min(10000,data.total_results)}`)+
    getTextInTag('p',`total pages: ${Math.min(500,data.total_pages)}`)+
    changePageControls
}

function switchPageNumberBy1(negPosBool){
    switchPageNumber(Number(document.getElementById('pageInput').value)+(negPosBool?1:-1))
}

function switchPageNumber(newPageNumber){
    loadPage(newPageNumber)
}

function getNumberInTotal(numberOfPage){
    return 20*(numberOfPage-1);
}


function movieToHtml(movieObj,movieNumber){
    const mainTitleBox =getTextInTagWithAtt('div','class="titleCard"', 
            getTextInTag('h3',`${movieNumber}.  ${movieObj.title}`)+
            getTextInTag('div', translateGenreArr(movieObj.genre_ids))
    );
    const singlePageButton= getTextInTagWithAtt('button',`onclick=singlePageDirect(${movieObj.id})`,'More Info')

    let content= getTextInTagWithAtt('img',`src="${imagePath+movieObj.poster_path}" class='posterImage'`)+
    mainTitleBox+
    getTextInTagWithAtt('div','class="desciptionMovie"',movieObj.overview)
    +singlePageButton;

    return getTextInTagWithAtt('div','class="movieCard"',content)

}

function singlePageDirect(movieId){
    localStorage.movieID=movieId;
    localStorage.enterLastPage=true;
    location.href='../pages/moviePage.html'

}

function translateGenreArr(genreIdArr){
    const tagAttr= 'type="button" class="btn btn-warning mt-3 btn-sm disabled"'

    return genreIdArr.map((genreId)=>{return getTextInTagWithAtt('button',tagAttr,genreToName(genreId))}).join(" ")
}

function genreToName(genreId){
    const genreName=movieGenresArr.find(genre=>genre.id===genreId)
    return genreName?genreName.name:"error";
}

function userSearch(){
    currentSearch=movieInput.value
    loadPage()
}

function initialEnter(){
    moviePageElem.innerHTML=`<article style='text-align:center;'> <h1> welcome movie searching</h1> 
        <h2>search bar at the top left</h2> </article>`
}


//run on start
const imagePath='https://image.tmdb.org/t/p/original'
const moviePageElem= document.getElementById('movieDiv')
const pageScrollElem=document.getElementById('pageScroll')
const movieInput=document.querySelector('#movieSearch')
const searchBtn=document.querySelector('#search-addon')


let movieGenresArr=[];

fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(data => data.json())
    .then(data =>{ 
            movieGenresArr=data.genres
        })
    .catch(err => console.error(err));
;

let currentSearch='';

initialEnter()

searchBtn.addEventListener('click',userSearch)
movieInput.addEventListener('keyup',(eve)=>{ if(eve.keyCode === 13) {userSearch()} })