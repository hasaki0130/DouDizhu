window.onload = function(){
	var start = document.getElementById("start");
	var mesgDiv = document.getElementById("mesgDiv");
	var mesg = document.getElementById("mesg");//getElementBysId多一個s
	var send = document.getElementById("send");
	var log = document.getElementById("log");	
	
	var webSocket;//宣告
	
	start.style.display = "block";
	mesgDiv.style.display = "none";
	
	start.addEventListener("click", function(){
		console.log("connect...");	
		connect();//單獨拉方法出來	
	});
	
	send.addEventListener("click", function(){//傳遞訊息走JSON格式 (用物件方式寫，再字串化即可)
		var message = {
			message : mesg.value//發送到伺服器了
		};
		webSocket.send(JSON.stringify(message));
	});
	
	function connect(){
		webSocket = new WebSocket("ws://10.0.104.130:8080/bweb2/myserver");//活在8080湯姆貓下面
		
		webSocket.onerror = function(event){console.log("error")};
		webSocket.onopen = function(event){
			console.log("open ok");
			start.style.display = "none";
			mesgDiv.style.display = "block";			
		}
		
		webSocket.onclose = function(event){
			console.log("close ok");
			start.style.display = "block";
			mesgDiv.style.display = "none";	
		}
		
		//處理訊息傳遞，接收訊息
		webSocket.onmessage = function(event){
			//event.data資料放這邊
			var mesgObj = JSON.parse(event.data);
			log.innerHTML += mesgObj.message + "<br />";
		}
	}
	
}