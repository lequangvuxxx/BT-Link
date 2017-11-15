function initExBT(callback) {
	$('#ExBTCode').click(()=>{
		callback("Phiên mã - Giải mã",
			'<textarea id="ExBTCodeInp" rows=4></textarea><br>'+
			'<select id="ExBTCodeType" class="ExBTNoSelect">'+
				'<option value="Decode">Giải mã</option>'+		
				'<option value="Hex_encode">Mã hóa Hex</option>'+							
				'<option value="Base64_encode">Mã hóa Base64</option>'+						
				'<option value="Morse_encode">Mã hóa Morse</option>'+
				'<option value="Binary_encode">Mã hóa nhị phân</option>'+
			'</select><br>'+
			'<div id="ExBTCodeOut"></div>',
			()=>{
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
					return x;
				}
				function update() {                					
				    $('#ExBTCodeOut').html(
				    	$('#ExBTCodeType').val() == "Decode" ? 
				    	decode($('#ExBTCodeInp').val()) : 
				        converter[$('#ExBTCodeType').val()](
				            $('#ExBTCodeInp').val()
				        ).withUrl()
				    );
				}
				$('#ExBTCodeType').on('change', update);
			    $('#ExBTCodeInp').on('keyup', update);        
			    $('#ExBTCodeOut').click(() => {        
			        if($('#ExBTCodeType').val() == "Decode") return;
			        if(document.selection) {
			            let range = document.body.createTextRange();
			            range.moveToElementText($('#ExBTCodeOut').get(0));
			            range.select();
			        } else if (window.getSelection) {
			            let range = document.createRange();
			            range.selectNode($('#ExBTCodeOut').get(0));
			            window.getSelection().removeAllRanges();
			            window.getSelection().addRange(range);
			        }
			    })
			}
		)
	})				
	$('#ExBTSetting').click(()=>{
		let a = '<input type="checkbox" value="hidePop" ';
		a+=st.hidePop?'checked':'';
		a+='>Tự động ẩn<br>';
		a+='<input type="checkbox" value="syncPop" ';
		a+=st.syncPop?'checked':'';
		a+='>Lưu vị trí<br>';
		a+='<input type="checkbox" value="autoTry" ';
		a+=st.autoTry?'checked':'';
		a+='>Tự thử mật khẩu<br>'+
			'<textarea spellcheck="false" rows="5" style="width:94%;resize:none" id="ExBTcodes" >'+codes.join(' ')+'</textarea>'
		callback("Cài đặt:", a, ()=>{
			$('#ExBTContent>input[type="checkbox"]').change(function(){cc(this)});	
			$('#ExBTcodes').change(function(){cc(this)});
		});			
	})	
	$('#ExBTAdd').click(()=>{
		callback("Tạo Note mới:", 
			'<button id="ExBTSubmit">Tạo Note</button>'+
			'<input type="text" name="t1" id="ExBTNoteTitle" placeholder="Tiêu đề">'+
			'<input type="text" name="t2" id="ExBTNotePass" value="blogtruyen">'+
			'<br><textarea spellcheck="false" style="margin-top:5px;margin-right:5px;width:95%;resize:none" rows="5" id="ExBTNoteContent" placeholder="Nội dung"></textarea>',				
			() => {										
				$('#ExBTSubmit').click(()=>{
					console.log($('#ExBTNoteContent').val());
					if($('#ExBTNoteContent').val() == "") return;
					callback("Đang tải lên ...");
					chrome.runtime.sendMessage({
						type: "PostNote",
						pass: $('#ExBTNotePass').val(),
						title: $('#ExBTNoteTitle').val(),
						content: $('#ExBTNoteContent').val()
					},
					(request)=>{
						if (request.type == "PostResponse") {
				    		let link = "https://anotepad.com/notes/"+request.noteId;
				    		callback("Đăng note thành công !", "<p class='ExBTNoSelect'>Giờ thì đem share cho ae nào :3</p><a href='"+link+"'' target='_blank'>"+link+"</a>")
				    	}	
				    });				
				})		
			}				
		);
	})
}