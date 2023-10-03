import {setFavouritesArr,getFavouriteButton,changeFavourite,checkFavArrExists} from "./favouritesExtend.js";
import{getTextInTag,getTextInTagWithAtt,options}from "./general.js"


function loadPage(movieId){
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=en-US'`, options)
        .then(response => response.json())
        .then(response => {
                if(response.status_code)
                {
                    moviePageElem.innerHTML=`<div class='d-flex align-items-center'><img src='../assets/error_icon.png' style="max-width:50%;">`+
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
    moviePageElem.innerHTML=movieToHtml(responseData);
    localStorage.movieID=responseData.id;
    localStorage.enterLastPage=true


}

function movieToHtml(movieObj){

    let mainTitleBox =getTextInTagWithAtt('div','class="titleCard"', 
            getTextInTag('h3',`${movieObj.title}`)+
            getTextInTag('div', translateGenreArr(movieObj.genres))
    );

    const favouriteButton=getFavouriteButton(movieObj.id)

    let content= getTextInTagWithAtt('img',`src="${imagePath+movieObj.poster_path}" class='posterImage'`)+
    mainTitleBox+
    getTextInTagWithAtt('div','class="desciptionMovie"',movieObj.overview)+
    favouriteButton;

    content+=listOfActors(movieObj.credits.cast)

    return getTextInTagWithAtt('div','class="movieCard"',content)

}


function translateGenreArr(genreArr){
    const tagAttr= 'type="button" class="btn btn-warning mt-3 btn-sm disabled"'
    

    return genreArr.map((genreObj)=>{return getTextInTagWithAtt('button',tagAttr,genreObj.name)}).join(" ")
}


function listOfActors(creditsPart){
    console.log(creditsPart)
    const creditsNoUnknown=creditsPart.filter((anyPerson)=>{return anyPerson.profile_path})
    let content=creditsNoUnknown.map((anyPerson)=>{return getPersonCard(anyPerson) })
    return getTextInTagWithAtt('div','id="creditsScroll"',content)
}

function getPersonCard(singlePerson){
    return getTextInTagWithAtt('div',"class='personCard'",
        getTextInTagWithAtt('img',`src="${imagePath+singlePerson.profile_path}" class='personImage'`)+
        getTextInTag('p',`person: ${singlePerson.name}`)+
        getTextInTag('p',`character: ${getShortened(singlePerson.character,25)}`)
    )

}

function getShortened(anyStr,maxLength){
    if (anyStr.length>25)
    {
        const newStr= anyStr.substr(0, Math.min(maxLength, anyStr.lastIndexOf(" ",maxLength)))
        return `${newStr}...`
    }
    return anyStr
}

function userSearch(){
    loadPage(movieInput.value)
}

function initialEnter(){
    if (localStorage.enterLastPage==='true'){
        loadPage(localStorage.movieID)
    }
    else{
        moviePageElem.innerHTML=`<article style='text-align:center;'> <h1> welcome to single movie search</h1> 
        <h2>search bar at the top left</h2> </article>`
    }
}

const imagePath='https://image.tmdb.org/t/p/original'
const moviePageElem= document.getElementById('movieDiv')
const movieInput=document.querySelector('#movieSearch')
const searchBtn=document.querySelector('#search-addon')


window.changeFavourite = changeFavourite;

if (!(checkFavArrExists())){
    setFavouritesArr([])
}

initialEnter()

searchBtn.addEventListener('click',userSearch)
movieInput.addEventListener('keyup',(eve)=>{ if(eve.keyCode === 13) {userSearch()} })