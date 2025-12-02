<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.eduhub.util.DropdownData"%>
<%@ page import="com.eduhub.dao.interfaces.StaffDAO"%>
<%@ page import="com.eduhub.dao.impl.StaffDAOImpl"%>
<%@ page import="com.eduhub.dao.interfaces.BranchDAO"%>
<%@ page import="com.eduhub.dao.impl.BranchDAOImpl"%>
<%@ page import="com.eduhub.model.Staff"%>
<%@ page import="com.eduhub.model.Branch"%>
<%@ page import="com.eduhub.model.StaffCertification"%>
<%@ page import="com.eduhub.model.StaffDocument"%>
<%@ page import="java.time.LocalDate"%>
<%@ page import="java.time.format.DateTimeFormatter"%>
<%!
// Helper method to format date to DD-MM-YYYY
public String formatDate(LocalDate date) {
    try {
        if (date != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return date.format(formatter);
        }
    } catch (Exception e) {
        // Return empty if parsing fails
    }
    return "";
}

// Helper to get initials
public String getInitials(String firstName, String lastName) {
    String initials = "";
    if (firstName != null && !firstName.isEmpty()) {
        initials += firstName.charAt(0);
    }
    if (lastName != null && !lastName.isEmpty()) {
        initials += lastName.charAt(0);
    }
    return initials.toUpperCase();
}
%>
<%
    // Fetch staff data from database
    StaffDAO staffDAO = new StaffDAOImpl();
    BranchDAO branchDAO = new BranchDAOImpl();
    String instituteId = (String) session.getAttribute("instituteId");
    List<Staff> staffList = new ArrayList<>();
    Map<String, String> branchMap = new HashMap<>();
    
    // Pagination and Filter Parameters
    String searchQuery = request.getParameter("search");
    String roleFilter = request.getParameter("role");
    String statusFilter = request.getParameter("status");
    
    int currentPage = 1;
    int limit = 10;
    
    try {
        if (request.getParameter("page") != null) {
            currentPage = Integer.parseInt(request.getParameter("page"));
        }
        if (request.getParameter("limit") != null) {
            limit = Integer.parseInt(request.getParameter("limit"));
        }
    } catch (NumberFormatException e) {
        // Default values
    }
    
    int offset = (currentPage - 1) * limit;
    int totalFilteredStaff = 0;
    
    // Stats variables
    int totalStaff = 0;
    int activeStaff = 0;
    int technicalTrainers = 0;
    int supportStaff = 0;
    
    // Get distinct roles from database
    List<String> availableRoles = new ArrayList<>();

    if (instituteId != null) {
        try {
            // Get filtered list
            staffList = staffDAO.getStaffList(instituteId, searchQuery, roleFilter, statusFilter, offset, limit);
            totalFilteredStaff = staffDAO.getStaffCount(instituteId, searchQuery, roleFilter, statusFilter);
            
            // Get real-time stats from database
            totalStaff = staffDAO.getStaffCount(instituteId, null, null, null);
            activeStaff = staffDAO.getStaffCount(instituteId, null, null, "Active");
            
            // Get distinct roles from database
            availableRoles = staffDAO.getDistinctRoles(instituteId);
            
            // Get role-specific counts (only active staff)
            technicalTrainers = staffDAO.getStaffCountByRoleAndStatus(instituteId, "Technical Trainer", "Active");
            supportStaff = staffDAO.getStaffCountByRoleAndStatus(instituteId, "Support Staff", "Active");
            
            // Fetch branches for mapping
            List<Branch> branches = branchDAO.getAllBranches(instituteId);
            for (Branch branch : branches) {
                branchMap.put(branch.getBranchId(), branch.getBranchName());
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    boolean hasStaff = totalFilteredStaff > 0;
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="All Staff - Dashboard - EduHub"/>
        <jsp:param name="description" value="View all staff members in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/staff/css/all-staff.css">
    <script>
        var contextPath = '${pageContext.request.contextPath}';
    </script>
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="all-staff"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="All Staff"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>All Staff Members</h2>
                        <p class="text-muted">Manage and view all staff members</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex gap-2">
                            <button id="bulkDeleteBtn" class="btn btn-danger shadow-sm" style="display: none;">
                                <i class="bi bi-trash"></i> Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/staff/add-staff.jsp" class="btn btn-primary shadow-sm">
                                <i class="bi bi-plus-circle"></i> Add New Staff
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="bi bi-people-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalStaff"><%= totalStaff %></h4>
                            <p>Total Staff</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="activeStaff"><%= activeStaff %></h4>
                            <p>Active Staff</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon teachers">
                            <i class="bi bi-person-badge-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="technicalTrainers"><%= technicalTrainers %></h4>
                            <p>Technical Trainers</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon support">
                            <i class="bi bi-person-gear"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="supportStaff"><%= supportStaff %></h4>
                            <p>Support Staff</p>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter Section -->
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-4">
                                <label class="form-label">Search Staff</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="searchInput"
                                        placeholder="Search by name, email, or ID..."
                                        value="<%= searchQuery != null ? searchQuery : "" %>">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Role</label>
                                <select class="form-select" id="roleFilter">
                                    <option value="">All Roles</option>
                                    <% for(String role : availableRoles) { %>
                                        <option value="<%= role %>" <%= role.equals(roleFilter) ? "selected" : "" %>><%= role %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="">All Status</option>
                                    <% for(String status : DropdownData.STAFF_STATUSES) { %>
                                        <option value="<%= status %>" <%= status.equals(statusFilter) ? "selected" : "" %>><%= status %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
                                    id="resetFilters" type="button" aria-label="Reset filters">
                                    <i class="bi bi-arrow-clockwise me-2"></i>
                                    <span>Reset Filters</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Staff Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <!-- Empty State - Show when no data -->
                        <div id="emptyState" class="empty-state-container" style="<%= hasStaff ? "display: none;" : "" %>">
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <i class="bi bi-people"></i>
                                </div>
                                <h4 class="empty-state-title">No Staff Yet</h4>
                                <p class="empty-state-text">Get started by adding your first staff member to the system</p>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/staff/add-staff.jsp" class="btn btn-primary mt-3">
                                    <i class="bi bi-plus-circle"></i> Add First Staff Member
                                </a>
                            </div>
                        </div>
                        
                        <!-- Table - Show when data exists -->
                        <div class="table-responsive" id="staffTableContainer" style="<%= !hasStaff ? "display: none;" : "" %>">
                            <table class="table table-hover mb-0" id="staffTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAllStaff" class="form-check-input">
                                            </div>
                                        </th>
                                        <th>Staff ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Role</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Gender</th>
                                        <th>DOB</th>
                                        <th>Nationality</th>
                                        <th>Marital Status</th>
                                        <th>Work Shift</th>
                                        <th>Reporting Manager</th>
                                        <th>Qualification</th>
                                        <th>Specialization</th>
                                        <th>Certifications</th>
                                        <th>Documents</th>
                                        <th>Experience</th>
                                        <th>Employment Type</th>
                                        <th>Join Date</th>
                                        <th>Salary</th>
                                        <th>Address</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Postal Code</th>
                                        <th>Emergency Contact</th>
                                        <th>Emergency Phone</th>
                                        <th>Relation</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="staffTableBody">
                                    <%
                                    if (hasStaff) {
                                        for (Staff staff : staffList) {
                                            String fullName = staff.getFirstName() + " " + staff.getLastName();
                                            String initials = getInitials(staff.getFirstName(), staff.getLastName());
                                            String avatarContent = initials;
                                            
                                            if (staff.getProfilePhotoUrl() != null && !staff.getProfilePhotoUrl().isEmpty()) {
                                                avatarContent = "<img src='" + staff.getProfilePhotoUrl() + "' alt='" + fullName + "' style='width:100%;height:100%;object-fit:cover;border-radius:50%;'>";
                                            }
                                            
                                            List<StaffCertification> certifications = staffDAO.getCertificationsByStaffId(staff.getStaffId());
                                            List<StaffDocument> documents = staffDAO.getDocumentsByStaffId(staff.getStaffId());
                                            String branchName = branchMap.getOrDefault(staff.getBranchId(), "-");
                                    %>
                                    <tr data-staff-id="<%= staff.getStaffId() %>" data-role="<%= staff.getRole() %>" 
                                        data-status="<%= staff.getStatus() %>" data-branch="<%= branchName %>">
                                        <td>
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input staff-checkbox" value="<%= staff.getStaffId() %>">
                                            </div>
                                        </td>
                                        <td><span class="staff-id-badge"><%= staff.getEmployeeId() %></span></td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="staff-avatar">
                                                    <%= avatarContent %>
                                                </div>
                                                <div>
                                                    <div class="staff-name"><%= fullName %></div>
                                                    <small class="text-muted">Joined: <%= formatDate(staff.getJoiningDate()) %></small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><%= staff.getDepartment() != null ? staff.getDepartment() : "-" %></td>
                                        <td><span class="role-badge"><%= staff.getRole() %></span></td>
                                        <td><%= staff.getEmail() %></td>
                                        <td><%= staff.getPhone() %></td>
                                        <td><%= staff.getGender() != null ? staff.getGender() : "-" %></td>
                                        <td><%= formatDate(staff.getDateOfBirth()) %></td>
                                        <td><%= staff.getNationality() != null ? staff.getNationality() : "-" %></td>
                                        <td><%= staff.getMaritalStatus() != null ? staff.getMaritalStatus() : "-" %></td>
                                        <td><%= staff.getWorkShift() != null ? staff.getWorkShift() : "-" %></td>
                                        <td><%= staff.getReportingManager() != null ? staff.getReportingManager() : "-" %></td>
                                        <td><%= staff.getHighestQualification() %></td>
                                        <td><%= staff.getSpecialization() != null ? staff.getSpecialization() : "-" %></td>
                                        <td>
                                            <% for(StaffCertification cert : certifications) { %>
                                                <a href="<%= cert.getCertificateFileUrl() %>" target="_blank" class="badge bg-info text-decoration-none mb-1">
                                                    <%= cert.getName() %>
                                                </a>
                                            <% } %>
                                            <% if(certifications.isEmpty()) { %> - <% } %>
                                        </td>
                                        <td>
                                            <% for(StaffDocument doc : documents) { %>
                                                <a href="<%= doc.getDocumentUrl() %>" target="_blank" class="badge bg-secondary text-decoration-none mb-1">
                                                    <%= doc.getDocumentType() %>
                                                </a>
                                            <% } %>
                                            <% if(documents.isEmpty()) { %> - <% } %>
                                        </td>
                                        <td><%= staff.getExperience() %> years</td>
                                        <td>
                                            <% if ("Full-Time".equalsIgnoreCase(staff.getEmploymentType())) { %>
                                                <span class="badge bg-success"><%= staff.getEmploymentType() %></span>
                                            <% } else { %>
                                                <span class="badge bg-warning text-dark"><%= staff.getEmploymentType() %></span>
                                            <% } %>
                                        </td>
                                        <td><%= formatDate(staff.getJoiningDate()) %></td>
                                        <td><strong><%= staff.getSalary() %></strong></td>
                                        <td><%= staff.getAddress() != null ? staff.getAddress() : "-" %></td>
                                        <td><%= staff.getCity() != null ? staff.getCity() : "-" %></td>
                                        <td><%= staff.getState() != null ? staff.getState() : "-" %></td>
                                        <td><%= staff.getPostalCode() != null ? staff.getPostalCode() : "-" %></td>
                                        <td><%= staff.getEmergencyContactName() != null ? staff.getEmergencyContactName() : "-" %></td>
                                        <td><%= staff.getEmergencyContactPhone() != null ? staff.getEmergencyContactPhone() : "-" %></td>
                                        <td><%= staff.getEmergencyContactRelation() != null ? staff.getEmergencyContactRelation() : "-" %></td>
                                        <td>
                                            <% if ("Active".equalsIgnoreCase(staff.getStatus())) { %>
                                                <span class="badge status-active"><%= staff.getStatus() %></span>
                                            <% } else if ("On Leave".equalsIgnoreCase(staff.getStatus())) { %>
                                                <span class="badge status-onleave"><%= staff.getStatus() %></span>
                                            <% } else { %>
                                                <span class="badge status-inactive"><%= staff.getStatus() %></span>
                                            <% } %>
                                        </td>
                                        <td>
                                            <div class="btn-group" role="group">
                                                <button type="button" class="btn btn-sm view-btn" 
                                                        data-staff-id="<%= staff.getStaffId() %>" title="View Details">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm btn-outline-success edit-btn" 
                                                        data-staff-id="<%= staff.getStaffId() %>" title="Edit">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm btn-outline-danger delete-btn" 
                                                        data-staff-id="<%= staff.getStaffId() %>" title="Delete">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <%
                                        }
                                    }
                                    %>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Pagination Footer - Show only when data exists -->
                    <div class="card-footer py-3 bg-white" id="paginationFooter" style="<%= !hasStaff ? "display: none;" : "" %>">
                        <div class="row align-items-center gy-3">
                            <div class="col-sm-12 col-md-5">
                                <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 text-muted small">
                                    <span>Show</span>
                                    <select class="form-select form-select-sm w-auto border-light bg-light" id="itemsPerPage" style="min-width: 70px;">
                                        <option value="10" <%= limit == 10 ? "selected" : "" %>>10</option>
                                        <option value="25" <%= limit == 25 ? "selected" : "" %>>25</option>
                                        <option value="50" <%= limit == 50 ? "selected" : "" %>>50</option>
                                        <option value="100" <%= limit == 100 ? "selected" : "" %>>100</option>
                                    </select>
                                    <span>entries</span>
                                    <div class="vr mx-2"></div>
                                    <span class="entries-info">
                                        Showing <span id="showingStart" class="fw-bold text-dark"><%= totalFilteredStaff > 0 ? offset + 1 : 0 %></span> - <span id="showingEnd" class="fw-bold text-dark"><%= Math.min(offset + limit, totalFilteredStaff) %></span> of <span id="totalEntries" class="fw-bold text-dark"><%= totalFilteredStaff %></span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-7">
                                <div id="paginationContainer" class="d-flex justify-content-center justify-content-md-end">
                                    <!-- Pagination buttons will be generated by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- View Staff Details Modal -->
    <div class="modal fade" id="viewStaffModal" tabindex="-1" aria-labelledby="viewStaffModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="viewStaffModalLabel">Staff Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="staffDetailsContent">
                    <!-- Staff details will be loaded here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Include Reusable Modal Component -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    
    <!-- Include Toast Notification Component -->
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/staff/js/all-staff.js?v=<%=System.currentTimeMillis()%>"></script>
    <script>
        // Server-side pagination data
        var serverPagination = {
            currentPage: <%= currentPage %>,
            itemsPerPage: <%= limit %>,
            totalItems: <%= totalFilteredStaff %>,
            totalPages: <%= (int) Math.ceil((double) totalFilteredStaff / limit) %>
        };
    </script>
    
    <%-- Toast Notification Logic --%>
    <%
        String successMessage = (String) session.getAttribute("successMessage");
        if (successMessage != null) {
            session.removeAttribute("successMessage");
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof toast !== 'undefined') toast.success("<%= successMessage %>");
        });
    </script>
    <% } %>
    
    <%
        String errorMessage = (String) session.getAttribute("errorMessage");
        if (errorMessage != null) {
            session.removeAttribute("errorMessage");
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof toast !== 'undefined') toast.error("<%= errorMessage %>");
        });
    </script>
    <% } %>
</body>
</html>
