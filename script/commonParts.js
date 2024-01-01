
let isStylesheet1Active = true;
$(function() {
    //load the header into the document
    $.get('../commonParts/header.html', function(data) {
        $('#common-header').html(data);
        
        var pageTitle = document.title;
        $('#header-paragraph').text(pageTitle);


        // dark/ light mode button
        var switchButton = document.getElementById('themeSwButton');
        if (switchButton){
            
            switchButton.addEventListener('click', () => {
                console.log('here');
                if (isStylesheet1Active) {
                    themeSheet.href = '../css/lightMode.css';
                    switchButton.textContent="switch to dark mode"
                } else {
                    themeSheet.href = '../css/darkMode.css';
                    switchButton.textContent="switch to light mode"
                }
                isStylesheet1Active = !isStylesheet1Active;
            });            
        }

        //activate the navPage you are in
        const anchors = document.getElementsByClassName("navPage");
        const currentPage = window.location.pathname;
        //incase the page has no /index.html
        if(currentPage.endsWith('moviePage.html')){
            if (localStorage.enterLastPage==='true'){
                document.getElementById('lastIdPage').remove()
            }
            else{
                document.getElementById('lastIdPage').addEventListener('click',referLastPage)
            }
            document.getElementById('cleanIdPage').remove()
        }
        else{
            for( var i=0; i < anchors.length; i++ ) {
                if (currentPage.endsWith(anchors[i].getAttribute('href')) ){
                    anchors[i].remove();
                    break;
                }
            
            }
            
            document.getElementById('lastIdPage').addEventListener('click',referLastPage)
            document.getElementById('cleanIdPage').addEventListener('click',referCleanPage)
        }



    });


    // //load the footer into the document
    // $.get('common-parts/footer.html', function(data) {
    //     $('#common-footer').html(data);
    // });
    
});


function referLastPage(){
    localStorage.enterLastPage=true;
    console.log(localStorage.enterLastPage)
    location.href='moviePage.html'
}

function referCleanPage(){
    localStorage.enterLastPage=false;
    console.log(localStorage.enterLastPage)
    location.href='moviePage.html'
}