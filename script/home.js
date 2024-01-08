import { getNumberInTotal, getPageData, getPagination, getTimeControl } from "./bottomBarUtil.js";
import {setFavouritesArr,getFavouriteButton,changeFavourite,checkFavArrExists} from "./favouritesExtend.js";
import{getTextInTag,getTextInTagWithAtt,options}from "./general.js"


function loadPage(page=1,dayToggle=true){
    fetch(`https://api.themoviedb.org/3/trending/movie/${dayToggle?'day':'week'}?include_adult=false&page=${page}&language=en-US`, options)
        .then(response => response.json())
        .then(response => {
                if(response.status_code)
                {
                    moviePageElem.innerHTML=`<div class='d-flex align-items-center'><img src='./assets/error_icon.png' style="max-width:50%;">`+
                    `<h1 style="color:red;">${response.status_message}</h1> </div>`
                }
                else
                {
                    changeMoviePage(response,dayToggle)
                }
            })
        .catch(err => console.error(err)); 
    ;
}



function changeMoviePage(responseData,dayToggle){
    moviePageElem.scrollTop=0
    const moviesArr=responseData.results;
    moviePageElem.innerHTML=moviesArr.map((movieObj,movieIndex)=>{
        return movieToHtml(movieObj,getNumberInTotal(responseData.page)+movieIndex+1)
    }).join('')

    createPagination(responseData,dayToggle)
}


function createPagination(data,dayToggle){

    const changePageControls=getPagination(data.page)

    const toggleElem= getTimeControl(dayToggle)
    
    pageScrollElem.innerHTML= getPageData(data.page,data.total_results,data.total_pages)+
    changePageControls+
    toggleElem

    eventsToPagination(data)

    document.getElementById('timeCon').addEventListener('change',switchPageNumberToInput)
    
}
//bottomBar

function eventsToPagination(data){
    document.getElementById('pageInput').addEventListener('change',switchPageNumberToInput)
    if(data.page>=500){
        document.getElementById('pageRight').disabled=true
    }
    else{
        document.getElementById('pageRight').addEventListener('click',()=>{switchPageNumberBy1(true)})
    }
    if(data.page==1){
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
    loadPage(newPageNumber,document.getElementById('timeCon').checked)
}

//<------------------------------------------------------------->

function movieToHtml(movieObj,movieNumber){
    const mainTitleBox =getTextInTagWithAtt('div','class="titleCard"', 
            getTextInTag(movieObj.title.length>20?'h4':'h3',`${movieNumber}.  ${movieObj.title}`)+
            getTextInTag('div', translateGenreArr(movieObj.genre_ids))
    );
    const singlePageButton= getTextInTagWithAtt('button',`onclick=singlePageDirect(${movieObj.id})`,'More Info')
    const favouriteButton=getFavouriteButton(movieObj.id)

    let content= getTextInTagWithAtt('img',`src="${imagePath+movieObj.poster_path}" class='posterImage'`)+
    mainTitleBox+
    getTextInTagWithAtt('div','class="desciptionMovie"',movieObj.overview)
    +singlePageButton
    +favouriteButton;

    return getTextInTagWithAtt('div','class="movieCard"',content)

}


//page redirect(moviePage)
function singlePageDirect(movieId){
    localStorage.movieID=movieId;
    localStorage.enterLastPage=true;
    location.href='./moviePage.html'

}
//genre
function translateGenreArr(genreIdArr){
    const tagAttr= 'type="button" class="btn btn-warning mt-3 btn-sm disabled"'

    return genreIdArr.map((genreId)=>{return getTextInTagWithAtt('button',tagAttr,genreToName(genreId))}).join(" ")
}

function genreToName(genreId){
    const genreName=movieGenresArr.find(genre=>genre.id===genreId)
    return genreName?genreName.name:"error";
}

//run on start
const imagePath='https://image.tmdb.org/t/p/original'
const moviePageElem= document.getElementById('movieDiv')
const pageScrollElem=document.getElementById('pageScroll')


window.changeFavourite = changeFavourite;
window.singlePageDirect=singlePageDirect;

let movieGenresArr=[];

fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(data => data.json())
    .then(data =>{ 
            movieGenresArr=data.genres
        })
    .catch(err => console.error(err));
;
if (!(checkFavArrExists())){
    setFavouritesArr([])
}

setTimeout(loadPage,500)