(function(){
    var s = prompt("Nhập mã Hex:", "");
    if (s == null || s == "") return;
    var t = s.indexOf(" ") == -1;
        if(!t) s = s.split(" ");
        var str = '';
        for (var i = 0; i<s.length; i+= t ? 2 : 1) {
            str += String.fromCharCode(
            	parseInt(
            		t ? s.substr(i, 2) : s[i], 16
            	)
            )
        }
    alert(str);
})();

//javascript:(function(){var r=prompt("Nhập mã Hex:","");if(null!=r&&""!=r){var t=-1==r.indexOf(" ");t||(r=r.split(" "));for(var n="",a=0;a<r.length;a+=t?2:1)n+=String.fromCharCode(parseInt(t?r.substr(a,2):r[a],16));alert(n)}})();
