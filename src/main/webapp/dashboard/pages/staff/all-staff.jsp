<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.eduhub.util.DropdownData"%>
<%@ page import="java.time.LocalDate"%>
<%@ page import="java.time.format.DateTimeFormatter"%>
<%!
// Helper method to format date to DD-MM-YYYY
public String formatDate(String dateStr) {
    try {
        if (dateStr != null && !dateStr.isEmpty()) {
            LocalDate date = LocalDate.parse(dateStr);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return date.format(formatter);
        }
    } catch (Exception e) {
        // Return original if parsing fails
    }
    return dateStr;
}
%>
<%
// Dummy staff data
class Staff {
    String id, name, email, phone, role, department, qualification, joinDate, status, avatar;
    String dateOfBirth, gender, bloodGroup, address, emergencyContact, salary, employmentType;
    String specialization, experience, linkedin, aadharNumber, panNumber;

    public Staff(String id, String name, String email, String phone, String role, String department, 
    String qualification, String joinDate, String status, String avatar, String dateOfBirth, String gender,
    String bloodGroup, String address, String emergencyContact, String salary, String employmentType,
    String specialization, String experience, String linkedin, String aadharNumber, String panNumber) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.department = department;
        this.qualification = qualification;
        this.joinDate = joinDate;
        this.status = status;
        this.avatar = avatar;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.salary = salary;
        this.employmentType = employmentType;
        this.specialization = specialization;
        this.experience = experience;
        this.linkedin = linkedin;
        this.aadharNumber = aadharNumber;
        this.panNumber = panNumber;
    }
}

List<Staff> staffList = Arrays.asList(
    new Staff("STF001", "Dr. Rajesh Kumar", "rajesh.kumar@eduhub.com", "+91 98765 11111", "Teacher", "Computer Science",
        "Ph.D. in Computer Science", "2020-01-15", "Active", "RK", "1985-03-20", "Male", "A+", 
        "123 Tech Street, Bangalore", "+91 98765 99001", "₹75,000", "Full-time", "Machine Learning, AI", "10 years", 
        "rajesh-kumar-prof", "1234-5678-9012", "ABCDE1234F"),
    new Staff("STF002", "Dr. Priya Sharma", "priya.sharma@eduhub.com", "+91 98765 11112", "Teacher", "Mathematics",
        "M.Sc. in Mathematics", "2019-07-10", "Active", "PS", "1988-06-15", "Female", "B+",
        "456 Education Lane, Mumbai", "+91 98765 99002", "₹65,000", "Full-time", "Statistics, Calculus", "8 years",
        "priya-sharma-prof", "2345-6789-0123", "BCDEF2345G"),
    new Staff("STF003", "Amit Patel", "amit.patel@eduhub.com", "+91 98765 11113", "Admin", "Administration",
        "MBA in Management", "2021-03-01", "Active", "AP", "1990-09-25", "Male", "O+",
        "789 Admin Road, Delhi", "+91 98765 99003", "₹55,000", "Part-time", "Operations Management", "6 years",
        "amit-patel-admin", "3456-7890-1234", "CDEFG3456H"),
    new Staff("STF004", "Sneha Gupta", "sneha.gupta@eduhub.com", "+91 98765 11114", "Teacher", "Physics",
        "M.Sc. in Physics", "2020-08-20", "Active", "SG", "1987-11-30", "Female", "AB+",
        "321 Science Park, Chennai", "+91 98765 99004", "₹60,000", "Full-time", "Quantum Mechanics", "7 years",
        "sneha-gupta-prof", "4567-8901-2345", "DEFGH4567I"),
    new Staff("STF005", "Vikram Singh", "vikram.singh@eduhub.com", "+91 98765 11115", "IT Support", "IT Department",
        "B.Tech in IT", "2022-01-10", "Active", "VS", "1992-04-12", "Male", "A-",
        "654 Tech Tower, Pune", "+91 98765 99005", "₹45,000", "Full-time", "Network Administration", "5 years",
        "vikram-singh-it", "5678-9012-3456", "EFGHI5678J"),
    new Staff("STF006", "Meera Reddy", "meera.reddy@eduhub.com", "+91 98765 11116", "Teacher", "Chemistry",
        "Ph.D. in Chemistry", "2018-06-15", "Active", "MR", "1986-02-18", "Female", "B-",
        "987 Research Avenue, Hyderabad", "+91 98765 99006", "₹70,000", "Full-time", "Organic Chemistry", "12 years",
        "meera-reddy-prof", "6789-0123-4567", "FGHIJ6789K"),
    new Staff("STF007", "Arjun Verma", "arjun.verma@eduhub.com", "+91 98765 11117", "Librarian", "Library",
        "M.Lib.Sc.", "2021-09-01", "Active", "AV", "1989-07-22", "Male", "O-",
        "147 Book Street, Kolkata", "+91 98765 99007", "₹40,000", "Full-time", "Library Management", "4 years",
        "arjun-verma-lib", "7890-1234-5678", "GHIJK7890L"),
    new Staff("STF008", "Kavya Nair", "kavya.nair@eduhub.com", "+91 98765 11118", "Teacher", "Biology",
        "M.Sc. in Biotechnology", "2020-02-20", "Active", "KN", "1991-05-10", "Female", "A+",
        "258 Bio Park, Kochi", "+91 98765 99008", "₹58,000", "Full-time", "Genetics, Microbiology", "6 years",
        "kavya-nair-prof", "8901-2345-6789", "HIJKL8901M"),
    new Staff("STF009", "Rohit Desai", "rohit.desai@eduhub.com", "+91 98765 11119", "Accountant", "Finance",
        "CA (Chartered Accountant)", "2019-11-15", "Active", "RD", "1988-12-05", "Male", "B+",
        "369 Finance Tower, Ahmedabad", "+91 98765 99009", "₹62,000", "Full-time", "Financial Accounting", "9 years",
        "rohit-desai-ca", "9012-3456-7890", "IJKLM9012N"),
    new Staff("STF010", "Anjali Iyer", "anjali.iyer@eduhub.com", "+91 98765 11120", "Teacher", "English",
        "M.A. in English Literature", "2021-07-01", "Active", "AI", "1990-08-28", "Female", "AB-",
        "741 Literature Lane, Bangalore", "+91 98765 99010", "₹52,000", "Full-time", "Literature, Creative Writing", "5 years",
        "anjali-iyer-prof", "0123-4567-8901", "JKLMN0123O"),
    new Staff("STF011", "Kunal Mehta", "kunal.mehta@eduhub.com", "+91 98765 11121", "HR Manager", "Human Resources",
        "MBA in HR", "2020-05-10", "Active", "KM", "1987-10-15", "Male", "A-",
        "852 HR Plaza, Mumbai", "+91 98765 99011", "₹68,000", "Full-time", "Recruitment, Training", "8 years",
        "kunal-mehta-hr", "1234-5678-9013", "KLMNO1234P"),
    new Staff("STF012", "Divya Joshi", "divya.joshi@eduhub.com", "+91 98765 11122", "Counselor", "Student Services",
        "M.A. in Psychology", "2022-03-15", "Active", "DJ", "1993-01-20", "Female", "O+",
        "963 Counseling Center, Delhi", "+91 98765 99012", "₹48,000", "Full-time", "Career Counseling", "3 years",
        "divya-joshi-counselor", "2345-6789-0124", "LMNOP2345Q"),
    new Staff("STF013", "Sanjay Kumar", "sanjay.kumar@eduhub.com", "+91 98765 11123", "Teacher", "Economics",
        "Ph.D. in Economics", "2019-04-01", "On Leave", "SK", "1984-11-08", "Male", "B-",
        "147 Economy Street, Chennai", "+91 98765 99013", "₹72,000", "Full-time", "Macroeconomics", "11 years",
        "sanjay-kumar-prof", "3456-7890-1235", "MNOPQ3456R"),
    new Staff("STF014", "Pooja Rao", "pooja.rao@eduhub.com", "+91 98765 11124", "Lab Assistant", "Science Lab",
        "B.Sc. in Chemistry", "2023-01-20", "Active", "PR", "1995-03-12", "Female", "A+",
        "258 Lab Complex, Bangalore", "+91 98765 99014", "₹35,000", "Part-time", "Lab Management", "2 years",
        "pooja-rao-lab", "4567-8901-2346", "NOPQR4567S"),
    new Staff("STF015", "Rahul Khanna", "rahul.khanna@eduhub.com", "+91 98765 11125", "Sports Coordinator", "Sports Department",
        "B.P.Ed.", "2021-06-01", "Active", "RK", "1991-07-25", "Male", "O+",
        "369 Sports Complex, Pune", "+91 98765 99015", "₹42,000", "Full-time", "Sports Management", "4 years",
        "rahul-khanna-sports", "5678-9012-3457", "OPQRS5678T")
);

pageContext.setAttribute("staffList", staffList);
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
                        <h2 class="mb-1">All Staff Members</h2>
                        <p class="text-muted mb-0">Manage and view all staff members</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex align-items-center gap-2 flex-wrap">
                            <!-- Bulk Delete Button (hidden by default) -->
                            <button class="btn btn-danger" id="bulkDeleteBtn" style="display: none;">
                                <i class="bi bi-trash me-2"></i>Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <button class="btn btn-outline-primary" id="exportBtn">
                                <i class="bi bi-download me-2"></i>Export
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/staff/add-staff.jsp" class="btn btn-primary">
                                <i class="bi bi-plus-circle"></i> Add New Staff
                            </a>
                        </div>
                    </div>
                </div>

            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stats-card stats-primary">
                    <div class="stats-icon">
                        <i class="bi bi-people-fill"></i>
                    </div>
                    <div class="stats-content">
                        <h3 id="totalStaff">15</h3>
                        <p>Total Staff</p>
                    </div>
                </div>
                <div class="stats-card stats-success">
                    <div class="stats-icon">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <div class="stats-content">
                        <h3 id="activeStaff">14</h3>
                        <p>Active Staff</p>
                    </div>
                </div>
                <div class="stats-card stats-warning">
                    <div class="stats-icon">
                        <i class="bi bi-mortarboard-fill"></i>
                    </div>
                    <div class="stats-content">
                        <h3 id="totalTeachers">8</h3>
                        <p>Teachers</p>
                    </div>
                </div>
                <div class="stats-card stats-info">
                    <div class="stats-icon">
                        <i class="bi bi-person-gear"></i>
                    </div>
                    <div class="stats-content">
                        <h3 id="supportStaff">7</h3>
                        <p>Support Staff</p>
                    </div>
                </div>
            </div>

                <!-- Filters and Search -->
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-4">
                                <label class="form-label">Search Staff</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="searchInput"
                                        placeholder="Search by name, email, or ID...">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Role</label>
                                <select class="form-select" id="roleFilter">
                                    <option value="">All Roles</option>
                                    <% for(String role : DropdownData.ROLES) { %>
                                        <option value="<%= role %>"><%= role %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="">All Status</option>
                                    <% for(String status : DropdownData.STAFF_STATUSES) { %>
                                        <option value="<%= status %>"><%= status %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
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
                        <div class="table-responsive">
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
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Qualification</th>
                                        <th>Experience</th>
                                        <th>Employment Type</th>
                                        <th>Join Date</th>
                                        <th>Salary</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="staffTableBody">
                                    <%
                                    if (staffList.isEmpty()) {
                                    %>
                                    <tr class="empty-state-row">
                                        <td colspan="13" class="text-center py-5">
                                            <div class="empty-state">
                                                <div class="empty-state-icon">
                                                    <i class="bi bi-people"></i>
                                                </div>
                                                <h5 class="empty-state-title">No Staff Members Found</h5>
                                                <p class="empty-state-text text-muted">Get started by adding your first staff member to the system.</p>
                                                <a href="${pageContext.request.contextPath}/dashboard/pages/staff/add-staff.jsp" class="btn btn-primary mt-3">
                                                    <i class="bi bi-plus-circle"></i> Add Staff Member
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <%
                                    } else {
                                        for (Staff staff : staffList) {
                                    %>
                                    <tr data-staff-id="<%= staff.id %>" data-role="<%= staff.role %>" 
                                        data-status="<%= staff.status %>">
                                        <td>
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input staff-checkbox" value="<%= staff.id %>">
                                            </div>
                                        </td>
                                        <td><strong><%= staff.id %></strong></td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="staff-avatar">
                                                    <%= staff.avatar %>
                                                </div>
                                                <div>
                                                    <div class="staff-name"><%= staff.name %></div>
                                                    <small class="text-muted">Joined: <%= formatDate(staff.joinDate) %></small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><%= staff.email %></td>
                                        <td><%= staff.phone %></td>
                                        <td><span class="role-badge"><%= staff.role %></span></td>
                                        <td><%= staff.qualification %></td>
                                        <td><%= staff.experience %></td>
                                        <td>
                                            <% if ("Full-time".equals(staff.employmentType)) { %>
                                                <span class="badge bg-success"><%= staff.employmentType %></span>
                                            <% } else { %>
                                                <span class="badge bg-warning text-dark"><%= staff.employmentType %></span>
                                            <% } %>
                                        </td>
                                        <td><%= formatDate(staff.joinDate) %></td>
                                        <td><strong><%= staff.salary %></strong></td>
                                        <td>
                                            <% if ("Active".equals(staff.status)) { %>
                                                <span class="badge status-active"><%= staff.status %></span>
                                            <% } else if ("On Leave".equals(staff.status)) { %>
                                                <span class="badge status-onleave"><%= staff.status %></span>
                                            <% } else { %>
                                                <span class="badge status-inactive"><%= staff.status %></span>
                                            <% } %>
                                        </td>
                                        <td>
                                            <div class="action-buttons">
                                                <button type="button" class="btn btn-sm btn-outline-primary view-btn" 
                                                        data-staff-id="<%= staff.id %>" title="View Details">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm btn-outline-success edit-btn" 
                                                        data-staff-id="<%= staff.id %>" title="Edit">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm btn-outline-danger delete-btn" 
                                                        data-staff-id="<%= staff.id %>" title="Delete">
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
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-3">
                                <div class="entries-info">
                                    Showing <span id="showingStart">1</span> to <span id="showingEnd">15</span> of <span id="totalEntries">15</span> entries
                                </div>
                                <div class="entries-selector-wrapper">
                                    <label for="entriesPerPage">Show</label>
                                    <select id="entriesPerPage" class="form-select form-select-sm">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <div class="pagination-wrapper">
                                <nav aria-label="Staff pagination">
                                    <ul class="pagination mb-0" id="pagination">
                                        <li class="page-item disabled">
                                            <a class="page-link" href="#" tabindex="-1"><i class="bi bi-chevron-left"></i></a>
                                        </li>
                                        <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item disabled">
                                            <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
                                        </li>
                                    </ul>
                                </nav>
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
    <script src="${pageContext.request.contextPath}/dashboard/pages/staff/js/all-staff.js"></script>
</body>
</html>
