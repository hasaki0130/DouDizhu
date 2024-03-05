<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ attribute name="x" required="true" %>
<%@ attribute name="y" required="true" %>

<%@ variable name-given="plus" %>
<%@ variable name-given="minu" %>
<%@ variable name-given="mult" %>
<%@ variable name-given="divi" %>

<c:set var="plus" value="${x + y}" />
<c:set var="minu" value="${x - y}" />
<c:set var="mult" value="${x * y}" />
<c:set var="divi" value="${x / y}" />

<jsp:doBody />