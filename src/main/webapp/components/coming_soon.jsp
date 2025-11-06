<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String title = request.getParameter("title");
    String message = request.getParameter("message");
    
    // Default values if parameters are not provided
    if (title == null || title.trim().isEmpty()) {
        title = "Coming Soon";
    }
    if (message == null || message.trim().isEmpty()) {
        message = "This page is coming soon. Stay tuned for updates!";
    }
%>
<section class="featured border">
    <div class="container my-2">
        <div class="alert alert-info text-center min-vh-50 d-flex flex-column align-items-center" role="alert">
            <h4 class="alert-heading"><%= title %></h4>
            <p><%= message %></p>
        </div>
    </div>
</section>
