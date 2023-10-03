import {getFavouritesArr,setFavouritesArr,getFavouriteButton,changeFavourite,checkFavArrExists} from "./favouritesExtend.js";


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



function loadPage(){
    if (checkFavArrExists()&&getFavouritesArr().length>0){
        moviePageElem.innerHTML='';
        JSON.parse(localStorage.favourites).forEach((movieId)=>{
            
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=en-US'`, options)
                .then(response => response.json())
                .then(response => {
                        if(response.status_code)
                        {
                            moviePageElem.innerHTML+=`<div class='d-flex align-items-center'><img src='../assets/error_icon.png' style="max-width:50%;">`+
                            `<h1 style="color:red;">${response.status_message} </h1> 
                            <h2>on movie id ${movieId}</h2></div>`
                        }
                        else
                        {
                            changeMoviePage(response)
                        }
                    })
                .catch(err => console.error(err)); 
            ;
        })
                
    }
    else{
        setFavouritesArr([])
        moviePageElem.innerHTML=`<article style='text-align:center;'> <h1> welcome to movie Favourites</h1> 
        <h2>add movies to show in here</h2> </article>`
    }
}


function changeMoviePage(responseData){
    moviePageElem.innerHTML+=movieToHtml(responseData);
}

function movieToHtml(movieObj){

    const mainTitleBox =getTextInTagWithAtt('div','class="titleCard"', 
        getTextInTag('h3',`${movieObj.title}`)+
        getTextInTag('div', translateGenreArr(movieObj.genres))
    );

    const singlePageButton= getTextInTagWithAtt('button',`onclick=singlePageDirect(${movieObj.id})`,'More Info');
    const favouriteButton=getFavouriteButton(movieObj.id)

    let content= getTextInTagWithAtt('img',`src="${imagePath+movieObj.poster_path}" class='posterImage'`)+
    mainTitleBox+
    getTextInTagWithAtt('div','class="desciptionMovie"',movieObj.overview)+
    singlePageButton+
    favouriteButton;

    content+=listOfActors(movieObj.credits.cast)

    return getTextInTagWithAtt('div','class="movieCard"',content)

}
//favourite


function singlePageDirect(movieId){
    localStorage.movieID=movieId;
    localStorage.enterLastPage=true;
    location.href='../pages/moviePage.html'

}

function translateGenreArr(genreArr){
    const tagAttr= 'type="button" class="btn btn-warning mt-3 btn-sm disabled"'
    return genreArr.map((genreObj)=>{return getTextInTagWithAtt('button',tagAttr,genreObj.name)}).join(" ")
}


function listOfActors(creditsPart){
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



const imagePath='https://image.tmdb.org/t/p/original'
const moviePageElem= document.getElementById('movieDiv')

window.changeFavourite = changeFavourite;
window.singlePageDirect=singlePageDirect;


loadPage()