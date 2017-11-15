chrome.runtime.onMessage.addListener((request) => {    	
    if (request.type == "note") {
    	d = request.value;    	
    	t = request.title;
		if(d !="NEEDPASSWORD") {			
			let a = $(d).siblings('.plaintext');
    		let b = $(d).siblings('.richtext');
    		let content = "";

    		if(a.length > 0)

    			for(let i = 0; i < a.length; i++) 
	    			content += a.get(i).innerText.withUrl();
    			
    		else {

    			$(b).find('a').attr('target', '_blank');
    			content += b.html();

    		}
    		makePop(t, content);
		} else {					
			makePop(t, "<p>Mật khẩu:</p><input type='text' id='accesscode'><button id='ExBTConfirm'>Xác nhận</button>", ()=>{
				$('#ExBTConfirm').click(()=>{					
					chrome.runtime.sendMessage({type: "TryPass",pass: $('#accesscode').val(), noteId: request.noteId});					  
				})
			})
		}		    	
    } else if (request.type == "text") 
    	decode(request.value);
    else if (request.type == "info") 
    	makePop(request.title, request.value);    
})
var _p;
var pop_history = [];
function makePop(title, content, cb) {
	function ec() {
		chrome.storage.local.set({"syncPop": st.syncPop})
		if(st.syncPop && $('#ExBTPop')) {
			let d = {
				height: $('#ExBTPop').css('height'),
				width: $('#ExBTPop').css('width'),
				top: $('#ExBTPop').css('top'),
				left: $('#ExBTPop').css('left')
			}
			chrome.storage.local.set({"popupCSS":d});
		}				
	}
	pop_history.push({title: title, content: content});
	if(pop_history.length > 10) pop_history.shift();
	if(_p) {
		$('#ExBTTitle').empty().append(title);
		if(content) {			
			$('#ExBTContent').empty().append(content);
		}
		$('#ExBTPop').show();
	} else {

		_p = '<div id="ExBTPop">'+
					'<div class="ExBTTitle ExBTNoSelect">'+
						'<span id="ExBTClose" class="ExBTButton">✖</span>'+
						'<span id="ExBTSetting" class="ExBTButton">&#9881;</span>'+
						'<span id="ExBTAdd" class="ExBTButton">N&#x207A;</span>'+		
						'<span id="ExBTCode" class="ExBTButton">&#8652;</span>'+								
						'<span id="ExBTTitle">'+title+'</span>' +
					'</div>'+
					'<div id="ExBTContent">'+content+'</div>'+
				'</div>';		
		$('body').append(_p);
		$('body').prepend("<div id='ExBTOverlay'></div");
		$('#ExBTClose').click(()=>{
			$('#ExBTPop').hide();						
		})			
		$('#ExBTPop')
			.resizable({
				minWidth: 100,
				minHeight: 50,
				handles: 's, e, w, se, sw',
				delay: 150,
				stop: () => ec()						
			})
			.draggable({
				cancel: '#ExBTContent', 
				containment: '#ExBTOverlay', 
				scroll:false,
				stop: () => ec()			
			})			
		if(st.syncPop)	
			chrome.storage.local.get("popupCSS", (d)=>{
				d = d.popupCSS;
				if(d)
					$('#ExBTPop')
					.css("height", d.height)
					.css("width", d.width)
					.css("top", d.top)
					.css("left", d.left)
		})	
		$('body').click((e)=>{			
			if(st.hidePop && $('#ExBTPop').find(e.target).length == 0) {
				$('#ExBTPop').hide();
			}
		})
		initExBT(makePop);
	}
	if(cb) cb();
}
function getSelectedText() {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
window.addEventListener('keydown', (e) => {
	if(e.altKey && e.code == "KeyT") 
		if(getSelectedText()!="") 
			decode(getSelectedText());
		else if(_p) 
			$('#ExBTPop').toggle() 
		else 
			makePop("Éc :V", "Không không mở lên chi ?");
})	
function decode(st){
	st = st.split('\n');
	let x = "";
	for(let i = 0; i < st.length; i++) {
		s = st[i];
		if(s.isBinary()) {
			x += converter.Binary_decode(s).withUrl();
		} else if(s.isMorse()) {
			x += converter.Morse_decode(s).withUrl();
		} else if(s.isHex()) {
			x += converter.Hex_decode(s).withUrl();
		} else if(s.isBase64()) {
			x += converter.Base64_decode(s).withUrl();
		}
		if(x!="")x+='<br>';
	}	
	if(x != "") 
		makePop("Nội dung:", x) 
	else 
		makePop("Lỗi !", "Không giải mã được ~");
}