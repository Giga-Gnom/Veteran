import { pageIndex } from "./pageIndex";

export function getLastUrl() {
    const currentUrl = window.location.pathname;
    const segment = currentUrl.split('/')
    return segment.length>0 ? '/'+segment.pop() : 'фывап';
}

export function getCurrentUrlIndex(){
    const currentUrl = getLastUrl();
    return pageIndex.findIndex(item => item.route===currentUrl);
}

export function handeleBeforPage(){
    console.log("asdfg");
    const currentIndex = getCurrentUrlIndex();
    const beforePage = pageIndex[currentIndex-1];
    window.location.href=beforePage.route;
}

export function handleNextPage(){
    const currentIndex = getCurrentUrlIndex();
    let nextPage
    if(currentIndex===pageIndex.length-1){
        nextPage = pageIndex[0]
    }
    else{
        nextPage=pageIndex[currentIndex+1]
    }
    window.location.href=nextPage.route;
    
}