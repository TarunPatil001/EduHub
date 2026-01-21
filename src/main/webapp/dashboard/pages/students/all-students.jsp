<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.eduhub.util.DropdownData"%>
<%@ page import="com.eduhub.dao.interfaces.StudentDAO"%>
<%@ page import="com.eduhub.dao.impl.StudentDAOImpl"%>
<%@ page import="com.eduhub.dao.interfaces.CourseDAO"%>
<%@ page import="com.eduhub.dao.impl.CourseDAOImpl"%>
<%@ page import="com.eduhub.dao.interfaces.BranchDAO"%>
<%@ page import="com.eduhub.dao.impl.BranchDAOImpl"%>
<%@ page import="com.eduhub.dao.interfaces.BatchDAO"%>
<%@ page import="com.eduhub.dao.impl.BatchDAOImpl"%>
<%@ page import="com.eduhub.model.Student"%>
<%@ page import="com.eduhub.model.Course"%>
<%@ page import="com.eduhub.model.Branch"%>
<%@ page import="com.eduhub.model.Batch"%>
<%@ page import="com.eduhub.model.StudentDocument"%>
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
    // Fetch student data from database
    StudentDAO studentDAO = new StudentDAOImpl();
    CourseDAO courseDAO = new CourseDAOImpl();
    BranchDAO branchDAO = new BranchDAOImpl();
    BatchDAO batchDAO = new BatchDAOImpl();
    String instituteId = (String) session.getAttribute("instituteId");
    List<Student> studentList = new ArrayList<>();
    Map<String, String> courseMap = new HashMap<>();
    Map<String, String> branchMap = new HashMap<>();
    Map<String, Batch> batchMap = new HashMap<>();
    
    // Pagination and Filter Parameters
    String searchQuery = request.getParameter("search");
    String courseFilter = request.getParameter("course");
    String branchFilter = request.getParameter("branch");
    String batchFilter = request.getParameter("batch");
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
    int totalFilteredStudents = 0;
    
    // Stats variables
    int totalStudents = 0;
    int activeStudents = 0;
    int pendingStudents = 0;
    int graduatedStudents = 0;
    
    List<Course> availableCourses = new ArrayList<>();

    if (instituteId != null) {
        try {
            // Get filtered list
            studentList = studentDAO.getStudentsByFilters(instituteId, courseFilter, branchFilter, batchFilter, statusFilter, searchQuery, currentPage, limit);
            totalFilteredStudents = studentDAO.getStudentCountByFilters(instituteId, courseFilter, branchFilter, batchFilter, statusFilter, searchQuery);
            
            // Get real-time stats from database
            totalStudents = studentDAO.getStudentCountByFilters(instituteId, null, null, null, null, null);
            activeStudents = studentDAO.getStudentCountByFilters(instituteId, null, null, null, "Active", null);
            pendingStudents = studentDAO.getStudentCountByFilters(instituteId, null, null, null, "Pending", null);
            graduatedStudents = studentDAO.getStudentCountByFilters(instituteId, null, null, null, "Graduated", null);
            
            // Get available courses (only those used by students)
            availableCourses = studentDAO.getDistinctCourses(instituteId);
            for (Course course : availableCourses) {
                courseMap.put(course.getCourseId(), course.getCourseName());
            }
            
            // Fetch branches for mapping (only those used by students)
            List<Branch> branches = studentDAO.getDistinctBranches(instituteId);
            for (Branch branch : branches) {
                branchMap.put(branch.getBranchId(), branch.getBranchName());
            }
            
            // Fetch batches for mapping (only those used by students)
            List<Batch> batches = studentDAO.getDistinctBatches(instituteId);
            for (Batch batch : batches) {
                batchMap.put(batch.getBatchId(), batch);
            }
            
            // Fetch distinct statuses
            List<String> availableStatuses = studentDAO.getDistinctStatuses(instituteId);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    boolean hasStudents = totalFilteredStudents > 0;
    
    // Fallback for statuses if DB returns empty (e.g. no students yet)
    List<String> statusList = new ArrayList<>();
    if (instituteId != null) {
        try {
             statusList = studentDAO.getDistinctStatuses(instituteId);
        } catch(Exception e) {}
    }
    if (statusList.isEmpty()) {
        for(String s : DropdownData.STUDENT_STATUSES) statusList.add(s);
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="All Students - Dashboard - EduHub"/>
        <jsp:param name="description" value="View all students in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/all-students.css">
    <script>
        var contextPath = '${pageContext.request.contextPath}';
    </script>
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="all-students"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="All Students"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>All Students</h2>
                        <p class="text-muted">Manage and view all registered students</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex gap-2">
                            <button id="bulkDeleteBtn" class="btn btn-danger shadow-sm" style="display: none;">
                                <i class="bi bi-trash"></i> Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/students/add-student.jsp" class="btn btn-primary shadow-sm">
                                <i class="bi bi-plus-circle"></i> Add New Student
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
                            <h4 id="totalStudents"><%= totalStudents %></h4>
                            <p>Total Students</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="activeStudents"><%= activeStudents %></h4>
                            <p>Active Students</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="bi bi-hourglass-split"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="pendingStudents"><%= pendingStudents %></h4>
                            <p>Pending Approval</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon placed">
                            <i class="bi bi-mortarboard-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="graduatedStudents"><%= graduatedStudents %></h4>
                            <p>Graduated</p>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter Section -->
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-3">
                                <label class="form-label">Search Students</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="searchInput"
                                        placeholder="Search..."
                                        value="<%= searchQuery != null ? searchQuery : "" %>">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Course</label>
                                <select class="form-select" id="courseFilter">
                                    <option value="">All Courses</option>
                                    <% for(Course course : availableCourses) { %>
                                        <option value="<%= course.getCourseId() %>" <%= course.getCourseId().equals(courseFilter) ? "selected" : "" %>><%= course.getCourseName() %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Branch</label>
                                <select class="form-select" id="branchFilter">
                                    <option value="">All Branches</option>
                                    <% for(Map.Entry<String, String> entry : branchMap.entrySet()) { %>
                                        <option value="<%= entry.getKey() %>" <%= entry.getKey().equals(branchFilter) ? "selected" : "" %>><%= entry.getValue() %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Batch</label>
                                <select class="form-select" id="batchFilter">
                                    <option value="">All Batches</option>
                                    <% for(Batch batch : batchMap.values()) { %>
                                        <option value="<%= batch.getBatchId() %>" <%= batch.getBatchId().equals(batchFilter) ? "selected" : "" %>><%= batch.getBatchName() %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="">All Status</option>
                                    <% for(String status : statusList) { %>
                                        <option value="<%= status %>" <%= status.equals(statusFilter) ? "selected" : "" %>><%= status %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-1">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
                                    id="resetFilters" type="button" aria-label="Reset filters" title="Reset Filters">
                                    <i class="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Student Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <!-- Empty State - Show when no data -->
                        <div id="emptyState" class="empty-state-container" style="<%= hasStudents ? "display: none;" : "" %>">
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <i class="bi bi-people"></i>
                                </div>
                                <h4 class="empty-state-title">No Students Yet</h4>
                                <p class="empty-state-text">Get started by adding your first student to the system</p>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/students/add-student.jsp" class="btn btn-primary mt-3">
                                    <i class="bi bi-plus-circle"></i> Add First Student
                                </a>
                            </div>
                        </div>
                        
                        <!-- Table - Show when data exists -->
                        <div class="table-responsive" id="studentTableContainer" style="<%= !hasStudents ? "display: none;" : "" %>">
                            <table class="table table-hover mb-0" id="studentTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAllStudents" class="form-check-input">
                                            </div>
                                        </th>
                                        <th>Name</th>
                                        <th>Batch Code</th>
                                        <th>Batch Name</th>
                                        <th>Branch</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>WhatsApp</th>
                                        <th>Parent Mobile</th>
                                        <th>Gender</th>
                                        <th>Blood Group</th>
                                        <th>DOB</th>
                                        <th>Qualification</th>
                                        <th>Specialization</th>
                                        <th>College</th>
                                        <th>Passing Year</th>
                                        <th>Instagram</th>
                                        <th>LinkedIn</th>
                                        <th>Permanent Address</th>
                                        <th>Current Address</th>
                                        <th>Medical History</th>
                                        <th>Declaration</th>
                                        <th>Documents</th>
                                        <th>Fees Allowed</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="studentTableBody">
                                    <%
                                    if (hasStudents) {
                                        for (Student student : studentList) {
                                            String fullName = student.getStudentName() + " " + student.getSurname();
                                            String initials = getInitials(student.getStudentName(), student.getSurname());
                                            String avatarContent = initials;
                                            
                                            if (student.getProfilePhotoUrl() != null && !student.getProfilePhotoUrl().isEmpty()) {
                                                avatarContent = "<img src='" + student.getProfilePhotoUrl() + "' alt='" + fullName + "' style='width:100%;height:100%;object-fit:cover;border-radius:50%;'>";
                                            }
                                            
                                            List<StudentDocument> documents = studentDAO.getDocumentsByStudentId(student.getStudentId());
                                            
                                            Batch batch = batchMap.get(student.getBatchId());
                                            String courseName = "-";
                                            String branchName = "-";
                                            String batchCode = "-";
                                            String batchName = "-";
                                            
                                            if (batch != null) {
                                                courseName = courseMap.getOrDefault(batch.getCourseId(), "-");
                                                branchName = branchMap.getOrDefault(batch.getBranchId(), "-");
                                                batchCode = batch.getBatchCode();
                                                batchName = batch.getBatchName();
                                            }
                                    %>
                                    <tr data-student-id="<%= student.getStudentId() %>" data-course="<%= courseName %>" 
                                        data-status="<%= student.getStudentStatus() %>" data-branch="<%= branchName %>">
                                        <td>
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input student-checkbox" value="<%= student.getStudentId() %>">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="student-avatar">
                                                    <%= avatarContent %>
                                                </div>
                                                <div>
                                                    <div class="student-name"><%= fullName %></div>
                                                    <small class="text-muted">Father: <%= student.getFatherName() %></small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><%= batchCode %></td>
                                        <td><span class="course-badge"><%= batchName %></span></td>
                                        <td><%= branchName %></td>
                                        <td><%= student.getEmailId() %></td>
                                        <td><%= student.getMobileNumber() %></td>
                                        <td><%= student.getWhatsappNumber() != null ? student.getWhatsappNumber() : "-" %></td>
                                        <td><%= student.getParentMobile() != null ? student.getParentMobile() : "-" %></td>
                                        <td><%= student.getGender() != null ? student.getGender() : "-" %></td>
                                        <td><%= student.getBloodGroup() != null ? student.getBloodGroup() : "-" %></td>
                                        <td><%= student.getDateOfBirth() != null ? formatDate(student.getDateOfBirth().toLocalDate()) : "-" %></td>
                                        <td><%= student.getEducationQualification() %></td>
                                        <td><%= student.getSpecialization() != null ? student.getSpecialization() : "-" %></td>
                                        <td><%= student.getCollegeName() != null ? student.getCollegeName() : "-" %></td>
                                        <td><%= student.getPassingYear() != null ? student.getPassingYear() : "-" %></td>
                                        <td><%= student.getInstagramId() != null ? student.getInstagramId() : "-" %></td>
                                        <td><%= student.getLinkedinId() != null ? student.getLinkedinId() : "-" %></td>
                                        <td title="<%= student.getPermanentAddress() %>"><%= student.getPermanentAddress() != null && student.getPermanentAddress().length() > 20 ? student.getPermanentAddress().substring(0, 20) + "..." : (student.getPermanentAddress() != null ? student.getPermanentAddress() : "-") %></td>
                                        <td title="<%= student.getCurrentAddress() %>"><%= student.getCurrentAddress() != null && student.getCurrentAddress().length() > 20 ? student.getCurrentAddress().substring(0, 20) + "..." : (student.getCurrentAddress() != null ? student.getCurrentAddress() : "-") %></td>
                                        <td><%= student.isMedicalHistory() ? "Yes" : "No" %></td>
                                        <td>
                                            <% if (student.isStudentDeclaration()) { %>
                                                <span class="badge bg-success bg-opacity-10 text-success">Signed</span>
                                            <% } else { %>
                                                <span class="badge bg-warning bg-opacity-10 text-warning">Pending</span>
                                            <% } %>
                                        </td>
                                        <td>
                                            <% for(StudentDocument doc : documents) { %>
                                                <a href="<%= doc.getDocumentUrl() %>" target="_blank" class="badge bg-secondary text-decoration-none mb-1">
                                                    <%= doc.getDocumentType() %>
                                                </a>
                                            <% } %>
                                            <% if(documents.isEmpty()) { %> - <% } %>
                                        </td>
                                        <td>
                                            <% if ("YES".equalsIgnoreCase(student.getFeesAllowed())) { %>
                                                <span class="badge bg-success bg-opacity-10 text-success">Yes</span>
                                            <% } else { %>
                                                <span class="badge bg-danger bg-opacity-10 text-danger">No</span>
                                            <% } %>
                                        </td>
                                        <td>
                                            <% if ("Active".equalsIgnoreCase(student.getStudentStatus())) { %>
                                                <span class="badge status-active"><%= student.getStudentStatus() %></span>
                                            <% } else if ("Pending".equalsIgnoreCase(student.getStudentStatus())) { %>
                                                <span class="badge status-pending"><%= student.getStudentStatus() %></span>
                                            <% } else if ("Graduated".equalsIgnoreCase(student.getStudentStatus())) { %>
                                                <span class="badge status-graduated"><%= student.getStudentStatus() %></span>
                                            <% } else { %>
                                                <span class="badge status-inactive"><%= student.getStudentStatus() %></span>
                                            <% } %>
                                        </td>
                                        <td>
                                            <div class="btn-group" role="group">
                                                <button type="button" class="btn btn-sm view-btn" 
                                                        data-student-id="<%= student.getStudentId() %>" title="View Details">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm btn-outline-success edit-btn" 
                                                        data-student-id="<%= student.getStudentId() %>" title="Edit">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm btn-outline-danger delete-btn" 
                                                        data-student-id="<%= student.getStudentId() %>" title="Delete">
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
                    <div class="card-footer py-3 bg-white" id="paginationFooter" style="<%= !hasStudents ? "display: none;" : "" %>">
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
                                        Showing <span id="showingStart" class="fw-bold text-dark"><%= totalFilteredStudents > 0 ? offset + 1 : 0 %></span> - <span id="showingEnd" class="fw-bold text-dark"><%= Math.min(offset + limit, totalFilteredStudents) %></span> of <span id="totalEntries" class="fw-bold text-dark"><%= totalFilteredStudents %></span>
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

    <!-- View Student Details Modal -->
    <div class="modal fade" id="viewStudentModal" tabindex="-1" aria-labelledby="viewStudentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="viewStudentModalLabel">Student Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="studentDetailsContent">
                    <!-- Student details will be loaded here -->
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
    <script>
        // Inject maps for JS usage
        var courseMap = {
            <% for(Map.Entry<String, String> entry : courseMap.entrySet()) { %>
            "<%= entry.getKey() %>": "<%= entry.getValue().replace("\"", "\\\"") %>",
            <% } %>
        };
        var branchMap = {
            <% for(Map.Entry<String, String> entry : branchMap.entrySet()) { %>
            "<%= entry.getKey() %>": "<%= entry.getValue().replace("\"", "\\\"") %>",
            <% } %>
        };
        var batchMap = {
            <% for(Map.Entry<String, Batch> entry : batchMap.entrySet()) { 
               Batch b = entry.getValue(); %>
               "<%= entry.getKey() %>": {
                   "name": "<%= b.getBatchName().replace("\"", "\\\"") %>",
                   "code": "<%= b.getBatchCode().replace("\"", "\\\"") %>",
                   "courseId": "<%= b.getCourseId() %>",
                   "branchId": "<%= b.getBranchId() %>"
               },
            <% } %>
        };
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/all-students.js?v=<%=System.currentTimeMillis()%>"></script>
    <script>
        // Server-side pagination data
        var serverPagination = {
            currentPage: <%= currentPage %>,
            itemsPerPage: <%= limit %>,
            totalItems: <%= totalFilteredStudents %>,
            totalPages: <%= (int) Math.ceil((double) totalFilteredStudents / limit) %>
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
