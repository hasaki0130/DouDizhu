<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>   
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>  
<%@page import="tw.frank.utils.*"%>  
<!DOCTYPE html>
<html>
	<c:if test="${!empty param.account }">
		<c:if test="${pageContext.request.method == 'GET' }">
			<c:redirect url="Main.jsp"></c:redirect>
		</c:if>
		
		<sql:setDataSource
			driver="com.mysql.cj.jdbc.Driver"
			url="jdbc:mysql://localhost/cool"
			user="root"
			password="root"
			/> 	
		
		<sql:update>
			INSERT INTO member (account,cname,passwd) VALUES (?,?,?)
			<sql:param>${param.account }</sql:param>
			<sql:param>${param.cname }</sql:param>
			<sql:param>${BCrypt.hashpw(param.passwd, BCrypt.gensalt()) }</sql:param>
		</sql:update>
		<c:redirect url="Main.jsp"></c:redirect>
	</c:if>
	
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
		<script>
//			function checkAccount(){
//				$("#mesg").load("CheckAccout.jsp?account=" + $("#accout").val());//測試1.有沒有進來 2.呼叫回傳值為多少
//			}//CheckAccout少打一個n 幹!，#accout也少打一個n 幹!!
			function checkAccount(){
				$("#mesg").load("CheckAccount.jsp?account=" + $("#account").val());
			}
		</script>
		<meta charset="UTF-8">
		<title>Insert title here</title>
	</head>
	<body>
		<h1>AddNew</h1>
		<hr />
		<form method="post">
			Account: <input id="account" name="account" onblur="checkAccount()" /><span id="mesg"></span><br />
			Password: <input type="password" name="passwd" /><br />
			Name: <input name="cname" /><br />
			<input type="submit" value="Add" />
		</form>	
	</body>
</html>
<!-- //直接進來 & 按下按鈕最大差別(不是空的) -> 有沒有帶參數 第2層針對post判斷 -->
<!-- 上面檢查完參數然後連線 -->
<!-- //資料庫新增在這邊處理(新增OK回到上一頁就不處理action了) -->
<!-- //檢查帳號是否重複 -> 寫h51讓後端呼應他 Ajax 原生 觀念 (目標按下帳號用Ajax方式檢查) 檔案上傳進度表 set interval跟後端溝通資訊 -->
<!-- 定義抽象方法(onload, onreadystatechange) = JAVA override -->
<!-- 404好事代表對方伺服器活著，是網頁不在 -->

<!-- *taglib c sql* -->
<!-- 標準核心庫 -->
<!-- SQL標籤庫 -->

<!-- websocket servlet 後端 -->


