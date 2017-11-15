function makeContent(title, content, callback) {
    $('.wrapper').empty().append(content);
    $('body').css('width', '350px');
    if(callback) callback();
}
// Will be removed
function makeIframe(url) {
    $('body').css('width', '350px');    
    let i = document.createElement('iframe');
    i.src = url;
    i.style.width = '100%';
    i.style.height = '325px';    
    return i;
}
$(document).ready(() => {    
    

    // Notifications for manga will be in another extension
    chrome.runtime.sendMessage({type:"GetNotification"},(res)=> {
        for(noti in res) 
            if(res[noti] > 0) 
                $('#'+noti).append('<span>'+res[noti]+'</span>')
    })

    $('#CountNotify').click(()=>$('.wrapper').empty().append(makeIframe('http://id.blogtruyen.com/Notify/IframeNotify')))

    $('#CountBookmark').click(()=>$('.wrapper').empty().append(makeIframe('http://id.blogtruyen.com/Notify/IframeBookmark')))
    // So these will be removed

    $('.icons > div > a').click(function(){
        $('.icons > div > a').css("color", "white");
        $(this).css("color", "red");        
    })

    initExBT(makeContent)
});
