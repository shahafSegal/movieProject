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



function loadPage(page=1,dayToggle=true){
    fetch(`https://api.themoviedb.org/3/trending/movie/${dayToggle?'day':'week'}?include_adult=false&page=${page}&language=en-US`, options)
        .then(response => response.json())
        .then(response => {
                if(response.page)
                {
                    changeMoviePage(response,dayToggle)
                }
                else
                {
                    moviePageElem.innerHTML=`<div class='d-flex align-items-center'><img src='./assets/error_icon.png' style="max-width:50%;">`+
                    `<h1 style="color:red;">${response.status_message}</h1> </div>`
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

    const pageInputGroup=getTextInTagWithAtt('div','class="form-floating"',
        getTextInTagWithAtt('input',`type="number" class="form-control" id='pageInput' value="${data.page}" onchange="switchPageNumber(Number(this.value))"`)+
        '<label for="pageInput">enter page(1-500)</label>'
    )

    const changePageControls=getTextInTagWithAtt('div','class="input-group align-self-start w-25 "',
        getTextInTagWithAtt('button',`class="bi btn btn-primary bi-chevron-left " ${data.page==1?'disabled':'onclick="switchPageNumberBy1(false)"'} id="pageLeft"`)+
        pageInputGroup+
        getTextInTagWithAtt('button',`class="bi btn btn-primary bi-chevron-right " ${data.page>=500?'disabled':'onclick="switchPageNumberBy1(true)"'} id="pageRight"`)
    )


    const toggleElem=  `<div class="d-flex column-gap-3 align-self-top">
        <label class="form-check-label" >this week</label>
        <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="timeControl" ${dayToggle?`checked`:``}
        onchange='loadPage(pageInput.value,this.checked)'>
        </div>
        <label class="form-check-label">today</label>
    </div>`
    
    pageScrollElem.innerHTML= getTextInTag('p',`results: ${getNumberInTotal(data.page)+1}-${getNumberInTotal(data.page+1)} `)+
    getTextInTag('p',`possible results: ${10000}`)+
    getTextInTag('p',`total pages: ${500}`)+
    changePageControls+
    toggleElem
}
function switchPageNumberBy1(negPosBool){
    switchPageNumber(Number(document.getElementById('pageInput').value)+(negPosBool?1:-1))
}

function switchPageNumber(newPageNumber){
    loadPage(newPageNumber,document.getElementById('timeControl').checked)
}

function getNumberInTotal(numberOfPage){
    return 20*(numberOfPage-1);
}


function movieToHtml(movieObj,movieNumber){
    let mainTitleBox =getTextInTagWithAtt('div','class="titleCard"', 
            getTextInTag('h3',`${movieNumber}.  ${movieObj.title}`)+
            getTextInTag('div', translateGenreArr(movieObj.genre_ids))
        )

    let content= getTextInTagWithAtt('img',`src="${imagePath+movieObj.poster_path}" class='posterImage'`)+
    mainTitleBox+
    getTextInTagWithAtt('div','class="desciptionMovie"',movieObj.overview);

    return getTextInTagWithAtt('div','class="movieCard"',content)

}

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

let movieGenresArr=[];

fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(data => data.json())
    .then(data =>{ 
            movieGenresArr=data.genres
        })
    .catch(err => console.error(err));
;


setTimeout(loadPage,500)