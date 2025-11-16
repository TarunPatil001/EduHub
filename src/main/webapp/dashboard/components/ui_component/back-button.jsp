<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String backUrl = request.getParameter("url");
    String backText = request.getParameter("text");
    String buttonClass = request.getParameter("class");
    
    // Default values
    if (backText == null || backText.trim().isEmpty()) {
        backText = "Back";
    }
    if (buttonClass == null || buttonClass.trim().isEmpty()) {
        buttonClass = "";
    }
%>
<a href="<%= backUrl %>" class="btn btn-outline-secondary <%= buttonClass %>">
    <i class="bi bi-arrow-left me-1"></i><%= backText %>
</a>
