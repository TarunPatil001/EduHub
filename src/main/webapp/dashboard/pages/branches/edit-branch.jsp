<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.eduhub.model.Branch" %>
<%@ page import="com.eduhub.service.interfaces.BranchService" %>
<%@ page import="com.eduhub.service.impl.BranchServiceImpl" %>
<%@ page import="com.eduhub.dao.interfaces.StaffDAO" %>
<%@ page import="com.eduhub.dao.impl.StaffDAOImpl" %>
<%@ page import="com.eduhub.model.Staff" %>
<%
    String branchId = request.getParameter("id");
    String instituteId = (String) session.getAttribute("instituteId");
    Branch branch = null;
    
    if (branchId != null && !branchId.trim().isEmpty() && instituteId != null) {
        BranchService branchService = new BranchServiceImpl();
        branch = branchService.getBranchById(branchId, instituteId);
    }

    // Redirect if branch not found
    if (branch == null) {
        response.sendRedirect(request.getContextPath() + "/dashboard/pages/branches/all-branches.jsp?error=true&message=Branch not found");
        return;
    }

    // Fetch Branch Managers
    StaffDAO staffDAO = new StaffDAOImpl();
    List<Staff> managers = staffDAO.getStaffByRoleLike(instituteId, "%Manager");
    StringBuilder managerOptions = new StringBuilder();
    for(Staff manager : managers) {
        String fullName = manager.getFirstName() + " " + manager.getLastName();
        managerOptions.append(manager.getStaffId()).append("|").append(fullName).append(" (").append(manager.getRole()).append(")").append(",");
    }
    if(managerOptions.length() > 0) managerOptions.setLength(managerOptions.length() - 1);

    List<String> statusOptions = new ArrayList<>();
    statusOptions.add("Active");
    statusOptions.add("Inactive");
    statusOptions.add("Under Maintenance");
    
    // Build status options string
    StringBuilder statusOptionsStr = new StringBuilder();
    for(String status : statusOptions) {
        statusOptionsStr.append(status).append("|").append(status).append(",");
    }
    if(statusOptionsStr.length() > 0) statusOptionsStr.setLength(statusOptionsStr.length() - 1);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Edit Branch - Dashboard - EduHub"/>
        <jsp:param name="description" value="Edit branch details in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/branches/css/create-branch.css">
    <script>
        var contextPath = '${pageContext.request.contextPath}';
    </script>
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="all-branches"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Edit Branch"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Edit Branch</h2>
                        <p class="text-muted">Update the branch details below</p>
                    </div>
                    
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/branches/all-branches.jsp"/>
                            <jsp:param name="text" value="Back to Branches"/>
                        </jsp:include>
                    </div>
                </div>
                
                <div class="create-course-layout">
                    <div class="create-course-form-column">
                        <form id="editBranchForm" action="${pageContext.request.contextPath}/api/branches/update" method="POST">
                            <input type="hidden" name="branchId" id="branchId" value="<%= branch.getBranchId() != null ? branch.getBranchId() : "" %>">
                            
                            <!-- Basic Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Basic Information</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="branchCode"/>
                                        <jsp:param name="name" value="branchCode"/>
                                        <jsp:param name="label" value="Branch Code"/>
                                        <jsp:param name="placeholder" value="e.g., BR-001"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="upc-scan"/>
                                        <jsp:param name="value" value="<%= branch.getBranchCode() %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="branchName"/>
                                        <jsp:param name="name" value="branchName"/>
                                        <jsp:param name="label" value="Branch Name"/>
                                        <jsp:param name="placeholder" value="e.g., Main Branch"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="building"/>
                                        <jsp:param name="value" value="<%= branch.getBranchName() %>"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="branchStatus"/>
                                        <jsp:param name="name" value="branchStatus"/>
                                        <jsp:param name="label" value="Status"/>
                                        <jsp:param name="placeholder" value="Select Status"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=statusOptionsStr.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="toggle-on"/>
                                        <jsp:param name="value" value="<%= branch.getStatus() %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="branchManagerId"/>
                                        <jsp:param name="name" value="branchManagerId"/>
                                        <jsp:param name="label" value="Branch Manager"/>
                                        <jsp:param name="placeholder" value="Select Manager..."/>
                                        <jsp:param name="required" value="false"/>
                                        <jsp:param name="options" value="<%=managerOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="person-badge"/>
                                        <jsp:param name="value" value="<%= branch.getBranchManagerId() != null ? branch.getBranchManagerId() : \"\" %>"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Contact Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-telephone-fill"></i> Contact Information</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="email"/>
                                        <jsp:param name="id" value="email"/>
                                        <jsp:param name="name" value="email"/>
                                        <jsp:param name="label" value="Email"/>
                                        <jsp:param name="placeholder" value="branch@example.com"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="envelope"/>
                                        <jsp:param name="value" value="<%= branch.getEmail() %>"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="tel"/>
                                        <jsp:param name="id" value="phone"/>
                                        <jsp:param name="name" value="phone"/>
                                        <jsp:param name="label" value="Phone"/>
                                        <jsp:param name="placeholder" value="Enter phone number"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="telephone"/>
                                        <jsp:param name="value" value="<%= branch.getPhone() %>"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Address Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-geo-alt-fill"></i> Address Information</h5>
                                
                                <div class="mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="textarea"/>
                                        <jsp:param name="id" value="address"/>
                                        <jsp:param name="name" value="address"/>
                                        <jsp:param name="label" value="Address"/>
                                        <jsp:param name="placeholder" value="Street address"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="rows" value="3"/>
                                        <jsp:param name="icon" value="map"/>
                                        <jsp:param name="value" value="<%= branch.getAddress() %>"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="city"/>
                                        <jsp:param name="name" value="city"/>
                                        <jsp:param name="label" value="City"/>
                                        <jsp:param name="placeholder" value="Enter city"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="building"/>
                                        <jsp:param name="value" value="<%= branch.getCity() %>"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="state"/>
                                        <jsp:param name="name" value="state"/>
                                        <jsp:param name="label" value="State"/>
                                        <jsp:param name="placeholder" value="Enter state"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="map"/>
                                        <jsp:param name="value" value="<%= branch.getState() %>"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="zipCode"/>
                                        <jsp:param name="name" value="zipCode"/>
                                        <jsp:param name="label" value="ZIP Code"/>
                                        <jsp:param name="placeholder" value="Enter ZIP code"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="mailbox"/>
                                        <jsp:param name="value" value="<%= branch.getZipCode() %>"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex gap-3 justify-content-end">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/branches/all-branches.jsp" class="btn btn-outline-secondary px-4" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> Update Branch
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Sidebar -->
                    <div class="create-course-sidebar-column">
                        <div class="card-custom mb-3">
                            <h6 class="mb-3">
                                <i class="bi bi-info-circle me-2"></i>Editing Guidelines
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Update only necessary fields</li>
                                <li class="mb-2">Branch Code should remain unique</li>
                                <li class="mb-2">Changing status may affect branch operations</li>
                                <li class="mb-2">Ensure contact details are valid</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <div>
                                <h6 class="mb-3">
                                    <i class="bi bi-headset me-2"></i>Need Help?
                                </h6>
                                <p class="small text-muted mb-2">Contact support for assistance with branch management</p>
                                <a href="#" class="btn btn-sm btn-outline-primary w-100">
                                    <i class="bi bi-envelope me-2"></i>Contact Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Use existing dashboard components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // Debug: Verify branchId on page load
        document.addEventListener('DOMContentLoaded', function() {
            const branchIdInput = document.getElementById('branchId');
            console.log('Branch ID field value:', branchIdInput ? branchIdInput.value : 'Field not found');
            if (branchIdInput && !branchIdInput.value) {
                console.error('WARNING: branchId hidden field is empty!');
            }
        });
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/branches/js/edit-branch.js"></script>
    
    <%-- Toast Notification Logic --%>
    <%
        String errorParam = request.getParameter("error");
        String statusParam = request.getParameter("status");
        String messageParam = request.getParameter("message");
        if (messageParam != null && (errorParam != null || statusParam != null)) {
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            <% if ("true".equals(errorParam) || "error".equals(statusParam)) { %>
                if (typeof toast !== 'undefined') toast.error("<%= messageParam %>");
            <% } %>
            
            // Clean URL
            const url = new URL(window.location);
            url.searchParams.delete('error');
            url.searchParams.delete('status');
            url.searchParams.delete('message');
            window.history.replaceState({}, document.title, url.toString());
        });
    </script>
    <% } %>
</body>
</html>
</body>
</html>
