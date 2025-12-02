<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%@ page import="com.eduhub.dao.interfaces.StaffDAO" %>
<%@ page import="com.eduhub.dao.impl.StaffDAOImpl" %>
<%@ page import="com.eduhub.model.Staff" %>
<%
    String instituteId = (String) session.getAttribute("instituteId");
    if (instituteId == null) {
        response.sendRedirect(request.getContextPath() + "/public/login.jsp");
        return;
    }

    StaffDAO staffDAO = new StaffDAOImpl();

    // Fetch Branch Managers (Department: Management, Role: Branch Manager)
    List<Staff> managers = staffDAO.getStaffByDepartmentAndRole(instituteId, "Management", "Branch Manager");
    StringBuilder managerOptions = new StringBuilder();
    for(Staff manager : managers) {
        String fullName = manager.getFirstName() + " " + manager.getLastName();
        managerOptions.append(manager.getStaffId()).append("|").append(fullName).append(",");
    }
    if(managerOptions.length() > 0) managerOptions.setLength(managerOptions.length() - 1);

    StringBuilder statusOptions = new StringBuilder();
    // Assuming we can reuse BATCH_STATUSES or define new ones. Let's use Active/Inactive for now.
    statusOptions.append("Active|Active,Inactive|Inactive,Under Maintenance|Under Maintenance");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Create Branch - Dashboard - EduHub"/>
        <jsp:param name="description" value="Create new branch in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <!-- Reusing create-course css for consistent styling -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/courses/css/create-course.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="create-branch"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Create Branch"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Create New Branch</h2>
                        <p class="text-muted">Add a new branch location</p>
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
                        <form id="createBranchForm" action="${pageContext.request.contextPath}/api/branches/create" method="POST">
                            
                            <!-- Basic Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Basic Information</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="branchCode"/>
                                        <jsp:param name="name" value="branchCode"/>
                                        <jsp:param name="label" value="Branch Code"/>
                                        <jsp:param name="placeholder" value="e.g., BR-NY-01"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="upc-scan"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="branchName"/>
                                        <jsp:param name="name" value="branchName"/>
                                        <jsp:param name="label" value="Branch Name"/>
                                        <jsp:param name="placeholder" value="e.g., New York Main Campus"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-8"/>
                                        <jsp:param name="icon" value="building"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
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
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="branchStatus"/>
                                        <jsp:param name="name" value="branchStatus"/>
                                        <jsp:param name="label" value="Status"/>
                                        <jsp:param name="placeholder" value="Select Status"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=statusOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="toggle-on"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Contact & Location Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-geo-alt-fill"></i> Location & Contact</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="email"/>
                                        <jsp:param name="id" value="email"/>
                                        <jsp:param name="name" value="email"/>
                                        <jsp:param name="label" value="Email Address"/>
                                        <jsp:param name="placeholder" value="branch@example.com"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="envelope"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="tel"/>
                                        <jsp:param name="id" value="phone"/>
                                        <jsp:param name="name" value="phone"/>
                                        <jsp:param name="label" value="Phone Number"/>
                                        <jsp:param name="placeholder" value="+1 234 567 8900"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="telephone"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="address"/>
                                        <jsp:param name="name" value="address"/>
                                        <jsp:param name="label" value="Address Line"/>
                                        <jsp:param name="placeholder" value="123 Education St"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-12"/>
                                        <jsp:param name="icon" value="geo-alt"/>
                                    </jsp:include>
                                </div>

                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="city"/>
                                        <jsp:param name="name" value="city"/>
                                        <jsp:param name="label" value="City"/>
                                         <jsp:param name="placeholder" value="City"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="building"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="state"/>
                                        <jsp:param name="name" value="state"/>
                                        <jsp:param name="label" value="State/Province"/>
                                         <jsp:param name="placeholder" value="State/Province"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="map"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="zipCode"/>
                                        <jsp:param name="name" value="zipCode"/>
                                        <jsp:param name="label" value="Zip/Postal Code"/>
                                        <jsp:param name="placeholder" value="Zip/Postal Code"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="mailbox"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex gap-3 justify-content-end">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/branches/all-branches.jsp" class="btn btn-outline-secondary px-4" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                                <button type="button" class="btn btn-outline-primary px-4" id="resetBtn">
                                    <i class="bi bi-arrow-clockwise"></i> Reset
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> Create Branch
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Sidebar -->
                    <div class="create-course-sidebar-column">
                        <div class="card-custom mb-3">
                            <h6 class="mb-3">
                                <i class="bi bi-info-circle me-2"></i>Branch Guidelines
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Fill all required fields marked with <span class="required-star">*</span></li>
                                <li class="mb-2">Branch Code must be unique across the institute</li>
                                <li class="mb-2">Provide a valid address for location services</li>
                                <li class="mb-2">Assign a manager if available</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <h6 class="mb-3">
                                <i class="bi bi-lightbulb me-2"></i>Tips
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Use standard naming conventions for branch codes</li>
                                <li class="mb-2">Ensure contact details are accurate</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <div>
                                <h6 class="mb-3">
                                    <i class="bi bi-headset me-2"></i>Need Help?
                                </h6>
                                <p class="small text-muted mb-2">Contact support for assistance</p>
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
        // Reset button handler
        document.getElementById('resetBtn').addEventListener('click', function() {
            if (typeof showConfirmationModal === 'function') {
                showConfirmationModal({
                    title: 'Reset Form',
                    message: 'Are you sure you want to reset the form? All entered data will be lost.',
                    confirmText: 'Reset',
                    cancelText: 'Cancel',
                    confirmClass: 'btn-warning',
                    icon: 'bi-arrow-clockwise text-warning',
                    onConfirm: function() {
                        document.getElementById('createBranchForm').reset();
                        if (typeof toast !== 'undefined') {
                            toast.info('Form has been reset');
                        }
                    }
                });
            } else {
                if(confirm('Are you sure you want to reset the form?')) {
                    document.getElementById('createBranchForm').reset();
                }
            }
        });
    </script>
    
    <%-- Toast Notification Logic --%>
    <%
        String statusParam = request.getParameter("status");
        String messageParam = request.getParameter("message");
        if (statusParam != null && messageParam != null) {
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            <% if ("error".equals(statusParam)) { %>
                if (typeof toast !== 'undefined') toast.error("<%= messageParam %>");
            <% } %>
            
            // Clean URL
            const url = new URL(window.location);
            url.searchParams.delete('status');
            url.searchParams.delete('message');
            window.history.replaceState({}, document.title, url.toString());
        });
    </script>
    <% } %>
</body>
</html>
