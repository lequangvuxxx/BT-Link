# Bookmarklet
Biến một bookmark thành công cụ giải mã hex. Hoạt động trên mọi trình duyệt web !
# Cách cài đặt
1. Copy đoạn code này
```javascript
javascript:(function(){var r=prompt("Nhập mã Hex:","");if(null!=r&&""!=r){var t=-1==r.indexOf(" ");t||(r=r.split(" "));for(var n="",a=0;a<r.length;a+=t?2:1)n+=String.fromCharCode(parseInt(t?r.substr(a,2):r[a],16));alert(n)}})();
```
2. Tạo một bookmark bất kì
3. Đặt tên cho nó, kiểu như "Decode Hex"
4. Bấm vào phần edit
5. Ở đoạn URL paste đoạn code đã copy ở trên vào
6. Xong giờ mỗi lần bạn click vào cái bookmark ấy bạn sẽ có một công cụ giải mã Hex
![Hướng dẫn](../images/bookmarklet-guide.png)
