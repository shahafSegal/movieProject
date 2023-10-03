export function getTextInTag(strTag, strText=""){
    return `<${strTag}>${strText}</${strTag}>`
}
export function getTextInTagWithAtt(strTag, strAtt ,strText=""){
    return `<${strTag} ${strAtt}>${strText}</${strTag}>`
}

export const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OWUwMjZiMGZmZjJhNjA3Y2U1YzA0OGUxNDgzMjIwZiIsInN1YiI6IjY1MTU5ZTFhY2FkYjZiMDJiZTU1MzA3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pLCPrgWg37LKt0nC_uSuPHGVj6-OYUuK2ixkzYegpD4'
    }
};