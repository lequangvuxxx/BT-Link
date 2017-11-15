var theseAreLink = ["hentaivn.net"];
function spSplit(s) {
    let strs = s+" ";
    strs = strs.replace(/\n/g, "0☉");
    strs = strs.replace(/\s/g, "1☉");
    return strs.split("☉");
}
String.prototype.withUrl = function() {        
    let strs = spSplit(this);
    let reg  = /(gif|jpg|png|jpeg)+$/
    for (let i = 0; i < strs.length; i++) {

        if(strs[i] == "") continue;

        let t1 = strs[i];                  
        let t2 = t1[t1.length - 1];
        t1 = t1.substring(0, t1.length - 1);
        if(t2 == "0") t2 = "<br>"
            else t2 = " ";

        if(!t1.isUrl())
            for(let j = 0; j < theseAreLink.length; j++) 
                if(t1.indexOf(theseAreLink[j]) != -1) {
                    t1 = "http://" + t1;
                    break;
                }

        if(t1.isUrl()) {         
            if(reg.test(t1)) 
                strs[i] = "<img src='" + t1 + "'>" + t2;
            else 
                strs[i] = "<a href='" + t1 + "' target='_blank'>" + t1 + "</a>"+t2;
        } else             
            strs[i] = t1+t2;
    }    
    return strs.join('');    
}
String.prototype.isUrl = function() {
    let regExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i        
    return regExp.test(this);
}
String.prototype.isHex = function() {
    let s = this.replace(/\s/g,'');
    let regExp = /^[0-9A-Fa-f]+$/
    return regExp.test(s);
}
String.prototype.isBase64 = function() {
    let regExp = /^[\w\+\/\=]+$/
    return regExp.test(this);
}
String.prototype.isMorse = function() {
    let regExp = /^[-.\s]+$/
    return regExp.test(this);
}
String.prototype.isBinary = function() {
    let regExp = /^[01\s]+$/
    return regExp.test(this);
}
var converter = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",    
    morseA: {
        A: ".-",
        B: "-...",
        C: "-.-.",
        D: "-..",
        E: ".",
        F: "..-.",
        G: "--.",
        H: "....",
        I: "..",
        J: ".---",
        K: "-.-",
        L: ".-..",
        M: "--",
        N: "-.",
        O: "---",
        P: ".--.",
        Q: "--.-",
        R: ".-.",
        S: "...",
        T: "-",
        U: "..-",
        V: "...-",
        W: ".--",
        X: "-..-",
        Y: "-.--",
        Z: "--..",
        1: ".----",
        2: "..---",
        3: "...--",
        4: "....-",
        5: ".....",
        6: "-....",
        7: "--...",
        8: "---..",
        9: "----.",
        0: "-----",
        ".": ".-.-.-",
        ",": "--..--",
        ":": "---...",
        "?": "..--..",
        "'": ".----.",
        "-": "-....-",
        "/": "-..-.",
        "(": "-.--.-",
        ")": "-.--.-",
        '"': ".-..-.",
        "@": ".--.-.",
        "=": "-...-",
        " ": "/"
    },
    Morse_decode: function(s) {
        let res = "";
        s = s.split(" ");
        for(let i = 0; i < s.length; i++) {
            for(char in this.morseA) 
                if(s[i] == this.morseA[char]) {                    
                    res += char                                      
                }
        }
        return res.toLowerCase();                    
    },
    Morse_encode: function(s) {
        let res = "";
        for(let i = 0; i < s.length; i++) {
            res+= this.morseA[s[i].toUpperCase()] + " ";
        }
        return res;
    },
    Binary_decode: function(s) {
        let t = s.indexOf(" ") == -1;
        if(!t) s = s.split(" ");
        let str = '';
        for (let i = 0; i < s.length; i+= t?8:1) {            
            str += String.fromCharCode(parseInt(t?s.substr(i, 8):s[i], 2));        
        }            
        return str;
    },
    Binary_encode: function(s) {
        let res = "";
        let bit = "";
        for(let i = 0; i < s.length; i++) {
            bit = s.charCodeAt(i).toString(2);             
            while(bit.length < 8) {bit = "0" + bit}
            res += bit + " ";
        }
        return res;
    },
    _utf8_encode: function(e) {
        e = e.replace(/rn/g, "n");
        let t = "";
        for (let n = 0; n < e.length; n++) {
            let r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        let t = "";
        let n = 0;
        let r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    },
    Hex_encode: function(s) {
        let res = "";
        let hex = "";
        for(let i = 0; i < s.length; i++) {
            hex = s.charCodeAt(i).toString(16);             
            while(hex.length < 2) {hex = "0" + hex;}
            res += hex;
        }
        return res;
    },
    Hex_decode: function(hex) {
        let t = (hex.indexOf(" ") == -1);
        if(!t) hex = hex.split(" ");         
        let str = '';
        for (let i = 0; i < hex.length; i+= t ? 2 : 1) {            
            str += String.fromCharCode(parseInt(t ? hex.substr(i, 2) : hex[i], 16));        
        }            
        return str;
    },
    Base64_encode: function(e) {
        let t = "";
        let n, r, i, s, o, u, a;
        let f = 0;
        e = this._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);            
        }
        return t
    },
    Base64_decode: function(e) {
        let t = "";
        let n, r, i;
        let s, o, u, a;
        let f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = this._utf8_decode(t);
        return t
    }
}