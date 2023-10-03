export function getFavouritesArr(){
    return JSON.parse(localStorage.favourites);
}
export function setFavouritesArr(newFavArr){
    localStorage.favourites=JSON.stringify(newFavArr)
}

export function getFavouriteButton(movieId){
    return `<button onclick='changeFavourite(this,${movieId})'>${getFavouriteIcon(movieId)}</button>`
}
export function getFavouriteIcon(movieId){
    return getFavouriteStatus(movieId)?'<i class="bi bi-heart-fill text-danger"></i>':'<i class="bi bi-heart-fill text-secondary"></i>'
}

export function getFavouriteStatus(movieId){
    return getFavouritesArr().includes(movieId)
}

export function changeFavourite(favBtnElem,movieID){
    if (getFavouriteStatus(movieID)){
        setFavouritesArr(getFavouritesArr().filter((favId)=>{return movieID!=favId}))
    }
    else{
        const favArr= getFavouritesArr()
        favArr.push(movieID)
        setFavouritesArr(favArr)
    }
    favBtnElem.innerHTML=getFavouriteIcon(movieID)
}

export function checkFavArrExists(){
    return (localStorage.favourites && Array.isArray(getFavouritesArr()))
}