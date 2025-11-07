<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Dashboard Stats Card Component
  
  Purpose: 
    - Reusable card for displaying statistics
  
  Parameters:
    - title: Card title
    - value: Statistic value
    - icon: Bootstrap icon class
    - color: Card color theme (primary, success, warning, danger, info)
    - change (optional): Percentage change
--%>

<div class="stats-card stats-card-${param.color != null ? param.color : 'primary'}">
    <div class="stats-card-icon">
        <i class="bi ${param.icon != null ? param.icon : 'bi-graph-up'}"></i>
    </div>
    <div class="stats-card-content">
        <h6 class="stats-card-title">${param.title != null ? param.title : 'Statistic'}</h6>
        <h3 class="stats-card-value">${param.value != null ? param.value : '0'}</h3>
        <c:if test="${param.change != null}">
            <p class="stats-card-change">
                <i class="bi bi-arrow-up"></i> ${param.change}% from last month
            </p>
        </c:if>
    </div>
</div>
