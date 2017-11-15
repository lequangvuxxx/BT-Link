if(window.top !== window && parent.length == 1) {
	let as = document.getElementsByTagName('a');
	for(let i = 0; i < as.length; i++) {
		as[i].setAttribute('target', '_blank');
	}
}

