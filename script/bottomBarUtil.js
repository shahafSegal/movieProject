function getTextInTagWithAtt(strTag, strAtt ,strText=""){
    return `<${strTag} ${strAtt}>${strText}</${strTag}>`
}
function getTextInTag(strTag, strText=""){
    return `<${strTag}>${strText}</${strTag}>`
}


export function getPagination(currentPage,totalPages){
    const pageInputGroup=getTextInTagWithAtt('input',`type="number" class="form-control h-100 p-0" id='pageInput' value="${currentPage}" `)

    const changePageControls=getTextInTagWithAtt('div','id="changePageDiv" class="input-group align-self-start h-50 "',
        getTextInTagWithAtt('button',`class="bi btn btn-primary bi-chevron-left h-100"  id="pageLeft"`)+
        pageInputGroup+
        getTextInTagWithAtt('button',`class="bi btn btn-primary bi-chevron-right h-100"  id="pageRight"`)
    )
    return changePageControls
}

export function getTimeControl(dayToggle){
    return `<div id='timeControlDiv' class="d-flex column-gap-3 justify-content-center">
        <label class="form-check-label" >this week</label>
        <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="timeControl" ${dayToggle?`checked`:``}>
        </div>
        <label class="form-check-label">today</label>
    </div>`
}
export function getNumberInTotal(numberOfPage){
    return 20*(numberOfPage-1);
}

export function getPageData(currPage,totalResults,totalPages){
    return getTextInTag('p',`results: ${getNumberInTotal(currPage)+1}-${Math.min(getNumberInTotal(currPage+1),totalResults)} `)+
    getTextInTag('p',`possible results: ${Math.min(10000,totalResults)}`)+
    getTextInTag('p',`total pages: ${Math.min(500,totalPages)}`)

}