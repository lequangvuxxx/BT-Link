var codes, autoTry, lastestUpload;
chrome.runtime.onInstalled.addListener((dt) => {
	if(dt.reason == "install") {		
		chrome.storage.local.get((d)=>{
			if(!d.hasOwnProperty('codes')) {
				chrome.storage.local.set({
					"codes": ["blogtruyen", "bt","Blogtruyen", "Blogtruyen18", "blogtruyen18"],
					"autoTry": true,
					"syncPop": true,
					"hidePop": false
				});
			}
		})
	}  	
})
chrome.contextMenus.create({
  		title: "Link BT", 
  		contexts:["all"],
  		id: "Link_BT"  		
});  
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if(info.hasOwnProperty('linkUrl')) {
		let url = info.linkUrl;		
		url = url.toLowerCase();					
		if(url.startsWith("https://anotepad.com")) {
			url = url.split("/");
		} else {
			url = url.substring(url.indexOf("?u=") + 3, url.indexOf("&h="));					
			url = url.split("%2f");		
		}	
		if(url.indexOf("anotepad.com") != -1) {
			url = url[url.length - 1];				
			ec(tab.id, url);	
		}		
	} else if(info.hasOwnProperty('selectionText')) {
		message(tab.id, {type: "text", value: info.selectionText})
	} else {
		message(tab.id, {type: "info", title: "Éc :V", value: "Bấm bấm CC"})
	}	
})
chrome.storage.local.get("codes", (d) => {
	codes = (d.codes instanceof Array) ? d.codes : ["blogtruyen", "bt","Blogtruyen", "Blogtruyen18", "blogtruyen18"];		
})		
chrome.storage.local.get("autoTry", (d) => {
	autoTry = (d.autoTry == true);
})
chrome.storage.onChanged.addListener((changes, namespace) => {
	for (key in changes) {
		if(key == "codes") {
			codes = changes[key].newValue;	  	
		} else if (key == "autoTry")  {
			autoTry = (changes[key].newValue == true);
		}
	}
})
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if(request.type) {    	
    	if(request.type == "TryPass") {
    		
    		ec(sender.tab.id, request.noteId, request.pass);
    	}
    	else if(request.type == "PostNote") {
    		let form = {
    			notetype: "PlainText",
    			noteaccess: 3,
    			notepassword: request.pass,
    			notequickedit: false,
    			notetitle: request.title,
    			notecontent: request.content
    		}
    		$.post("https://anotepad.com/note/create", form)
    			.done((d)=>{
    				lastestUpload = d.notenumber;
    				response({
    					type: "PostResponse",
    					noteId: d.notenumber
    				});
    			})
    			.fail((d)=>{
    				response({type: 'info', title: 'Lỗi !', content: 'Lỗi gì thì vào console của background mà xem ...'});
    				console.log(d);
    			})
    		return true;
    	} else if(request.type == "GetNotification") {
    		response(bt_notifications);
    		return true;
    	} else if(request.type == "GetNote" && lastestUpload) {
    		response(lastestUpload);
    		return true;
    	}
    } 
});
function ec(tabId, noteId, pass) {		
	function sHandler(d, s) {
		message(tabId, {type: "note", value: d, title: s + ' ('+noteId+')', noteId: noteId});
	}
	function fHandler(d) {
		message(tabId, {type: 'info', title: 'Lỗi !', content: 'Lỗi gì thì vào console của background mà xem ...'});
    	console.log(d);
	}
	if(pass) {

		tryPass(
			noteId,
			sHandler,
			fHandler,    			
			pass,
			tabId
		)
	}
	else {
		message(tabId, {type: 'info', title: noteId, value: 'Mò xem thử có mật khẩu không đã...'});
		getNote(
			noteId, 
			sHandler,
			fHandler,
    		tabId
		)
	}					
}
function message(tabId, obj, callback) {
    chrome.tabs.sendMessage(tabId, obj, (res)=>{
    	if(callback) callback(res);	
    });
}
function _ct(d) {
	let t = $(d).find('#note_content');		
	if(t.length == 0) {
		t = $(d).find('#edit_textarea');
	}
	return t;
}
function tryPass(noteId, callback, err, i, tabId) {	
	let pass, loop = false;	
	if(i === parseInt(i, 10)) {
		pass = codes[i];
		loop = true;
	} else {
		pass = i;
	}
	message(tabId, {type: 'info', title: noteId, value: 'Thử xem mật khẩu '+pass+' có đúng k ...'});
	$.post("https://anotepad.com/note/access/"+noteId, {accesscode: pass, postback:true})
		.done((data) => {
			if(_ct(data).length == 0) {
				if(!loop || codes.length - 1 <= i) {
					callback("NEEDPASSWORD", "Nhập Mật Khẩu");					
				} else if(loop) {		
					tryPass(noteId, callback, err, ++i, tabId);
				}
			} else {
				// FIX THIS ------------------------------------------------------------- \/
				callback($(_ct(data).get(0)).html(), $(data).find('#note_title').get(0).innerText);
				return;
			} 			
		})
		.fail((e) => {
			err(e);
		});
}
function getNote(noteId, callback, err, tabId) {	
	$.get("https://anotepad.com/notes/"+noteId)
		.done((data) => {
			if(!autoTry) {
				callback("NEEDPASSWORD", "Nhập Mật Khẩu");
				return;
			}
			if(_ct(data).length == 0) {
				tryPass(noteId, callback, err, 0, tabId);
			} else {
				// FIX THIS ------------------------------------------------------------- \/
				callback($(_ct(data).get(0)).html(), $(data).find('#note_title').get(0).innerText);
			}
		})
		.fail((e) => {
			err(e);
		})	
}
// =================== WILL BE REMOVED ======================
let bt_notifications = {};
getNotifications();
function getNotifications() {

	$.post('http://id.blogtruyen.com/Notify/GetCountNotify')
		.done((data)=>{
			t = 0;		
			bt_notifications = data;	
			for(let nt in data) {							
				t += parseInt(data[nt]);
			}
			if(t > 0) {
				t+="";
				chrome.browserAction.setBadgeBackgroundColor({color: "#4080ff"});
				chrome.browserAction.setBadgeText({text:t});
			} else {
				chrome.browserAction.setBadgeText({text:""});
			}
		})
		.fail(()=>{
			chrome.browserAction.setBadgeText({text:""});
		})
	setTimeout(getNotifications, 1000*60);
}