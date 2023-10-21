//general
import { getNumberInTotal, getPageData, getPagination } from "./bottomBarUtil.js";
import {setFavouritesArr,getFavouriteButton,changeFavourite,checkFavArrExists} from "./favouritesExtend.js";
import{getTextInTag,getTextInTagWithAtt,options}from "./general.js"



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

    const changePageControls= getPagination(data.page,data.total_pages)

    
    pageScrollElem.innerHTML=getPageData(data.page,data.total_results,data.total_pages) +
    changePageControls

    eventsToPagination()
}



function eventsToPagination(currPage){
    document.getElementById('pageInput').addEventListener('change',switchPageNumberToInput)
    if(currPage>=500){
        document.getElementById('pageRight').disabled=true
    }
    else{
        document.getElementById('pageRight').addEventListener('click',()=>{switchPageNumberBy1(true)})
    }
    if(currPage==1){
        document.getElementById('pageLeft').disabled=true
    }
    else{
        document.getElementById('pageLeft').addEventListener('click',()=>{switchPageNumberBy1(false)})
    }
}

function switchPageNumberBy1(negPosBool){
    switchPageNumber(Number(document.getElementById('pageInput').value)+(negPosBool?1:-1))
}
function switchPageNumberToInput(){
    switchPageNumber(document.getElementById('pageInput').value)
}

function switchPageNumber(newPageNumber){
    loadPage(newPageNumber)
}


function movieToHtml(movieObj,movieNumber){
    const mainTitleBox =getTextInTagWithAtt('div','class="titleCard"', 
            getTextInTag('h3',`${movieNumber}.  ${movieObj.title}`)+
            getTextInTag('div', translateGenreArr(movieObj.genre_ids))
    );
    const singlePageButton= getTextInTagWithAtt('button',`onclick=singlePageDirect(${movieObj.id})`,'More Info')
    const favouriteButton=getFavouriteButton(movieObj.id)

    let content= getTextInTagWithAtt('img',`src="${imagePath+movieObj.poster_path}" class='posterImage'`)+
    mainTitleBox+
    getTextInTagWithAtt('div','class="desciptionMovie"',movieObj.overview)
    +singlePageButton+
    favouriteButton;

    return getTextInTagWithAtt('div','class="movieCard"',content)

}




function singlePageDirect(movieId){
    localStorage.movieID=movieId;
    localStorage.enterLastPage=true;
    location.href='./moviePage.html'

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

window.changeFavourite = changeFavourite;
window.singlePageDirect=singlePageDirect;

if (!(checkFavArrExists())){
    setFavouritesArr([])
}

initialEnter()

searchBtn.addEventListener('click',userSearch)
movieInput.addEventListener('keyup',(eve)=>{ if(eve.keyCode === 13) {userSearch()} })
