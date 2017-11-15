var st = {};
var codes;
function ud(a, b) {
	t = {};
	t[a] = b;
	chrome.storage.local.set(t);
}
function cc(a){
	if(a.type == "checkbox") {
		if(st[a.value] != a.checked) {
			st[a.value] = a.checked;
			ud(a.value, a.checked);
		}
	} else if(a.nodeName == "TEXTAREA" && a.id == "ExBTcodes") {
		let b = a.value.split(' ');
		ud("codes", b);
	}
}
$(document).ready(()=>{
	chrome.storage.local.get("syncPop", (d)=>{
		st.syncPop = d ? d.syncPop : true;
	})
	chrome.storage.local.get("hidePop", (d)=>{
		st.hidePop = d ? d.hidePop : true;
	})		
	chrome.storage.local.get("autoTry", (d)=>{
		st.autoTry = d ? d.autoTry : true;
	})		
	chrome.storage.local.get("codes", (d)=>{
		codes = (d && d.codes instanceof Array) ? d.codes : ["blogtruyen", "bt","Blogtruyen", "Blogtruyen18", "blogtruyen18"];		
	})		
})