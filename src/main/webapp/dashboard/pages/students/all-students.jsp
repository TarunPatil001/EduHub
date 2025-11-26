<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
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
// Dummy student data
class Student {
	String id, name, fatherName, surname, email, phone, whatsappNumber, parentMobile;
	String course, enrollDate, status, avatar, grade, attendance;
	String dateOfBirth, gender, bloodGroup, instagramId, linkedinId;
	String permanentAddress, currentAddress, collegeName, educationQualification, passingYear;
	String batchPreference, medicalHistory;
	int attendanceDays, totalDays;

	public Student(String id, String name, String fatherName, String surname, String email, String phone, 
	String whatsappNumber, String parentMobile, String course, String enrollDate, String status,
	String avatar, String grade, String attendance, String dateOfBirth, String gender, String bloodGroup,
	String instagramId, String linkedinId, String permanentAddress, String currentAddress, 
	String collegeName, String educationQualification, String passingYear, String batchPreference, String medicalHistory,
	int attendanceDays, int totalDays) {
		this.id = id;
		this.name = name;
		this.fatherName = fatherName;
		this.surname = surname;
		this.email = email;
		this.phone = phone;
		this.whatsappNumber = whatsappNumber;
		this.parentMobile = parentMobile;
		this.course = course;
		this.enrollDate = enrollDate;
		this.status = status;
		this.avatar = avatar;
		this.grade = grade;
		this.attendance = attendance;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.bloodGroup = bloodGroup;
		this.instagramId = instagramId;
		this.linkedinId = linkedinId;
		this.permanentAddress = permanentAddress;
		this.currentAddress = currentAddress;
		this.collegeName = collegeName;
		this.educationQualification = educationQualification;
		this.passingYear = passingYear;
		this.batchPreference = batchPreference;
		this.medicalHistory = medicalHistory;
		this.attendanceDays = attendanceDays;
		this.totalDays = totalDays;
	}
}

List<Student> students = Arrays.asList(
		new Student("STU001", "Aarav", "Rajesh", "Sharma", "aarav.sharma@email.com", "+91 98765 43210", "+91 98765 43210", "+91 98765 00001", "Computer Science",
				"2024-01-15", "Active", "AS", "A+", "95%", "2002-05-15", "Male", "A+", "@aarav_sharma", "aarav-sharma", "123 MG Road, Mumbai", "123 MG Road, Mumbai", 
				"Mumbai University", "B.Tech", "2023", "Online", "None", 95, 100),
			new Student("STU002", "Diya", "Ashok", "Patel", "diya.patel@email.com", "+91 98765 43211", "+91 98765 43211", "+91 98765 00002", "Business Administration",
				"2024-01-20", "Active", "DP", "A", "92%", "2003-08-22", "Female", "B+", "@diya_patel", "diya-patel", "456 Park Street, Delhi", "456 Park Street, Delhi",
				"Delhi University", "MBA", "2024", "Offline", "None", 92, 100),
			new Student("STU003", "Arjun", "Vijay", "Kumar", "arjun.kumar@email.com", "+91 98765 43212", "+91 98765 43212", "+91 98765 00003", "Engineering", "2024-02-01",
				"Active", "AK", "B+", "88%", "2001-12-10", "Male", "O+", "@arjun_kumar", "arjun-kumar", "789 Linking Road, Bangalore", "789 Linking Road, Bangalore",
				"Bangalore Institute", "B.E", "2023", "Hybrid", "Asthma", 88, 100),
			new Student("STU004", "Ananya", "Suresh", "Singh", "ananya.singh@email.com", "+91 98765 43213", "+91 98765 43213", "+91 98765 00004", "Mathematics", "2024-02-10",
				"Inactive", "AS", "A-", "78%", "2002-03-18", "Female", "AB+", "@ananya_singh", "ananya-singh", "321 Brigade Road, Chennai", "321 Brigade Road, Chennai",
				"Chennai College", "M.Sc", "2024", "Online", "None", 78, 100),
			new Student("STU005", "Vihaan", "Ramesh", "Mehta", "vihaan.mehta@email.com", "+91 98765 43214", "+91 98765 43214", "+91 98765 00005", "Computer Science",
				"2024-02-15", "Active", "VM", "A", "90%", "2003-01-25", "Male", "A-", "@vihaan_mehta", "vihaan-mehta", "654 FC Road, Pune", "654 FC Road, Pune",
				"Pune University", "B.Tech", "2023", "Offline", "None", 90, 100),
			new Student("STU006", "Aisha", "Imran", "Khan", "aisha.khan@email.com", "+91 98765 43215", "+91 98765 43215", "+91 98765 00006", "Data Science", "2024-03-01",
				"Active", "AK", "A+", "96%", "2002-07-30", "Female", "B-", "@aisha_khan", "aisha-khan", "987 Nehru Place, Hyderabad", "987 Nehru Place, Hyderabad",
				"Hyderabad Institute", "B.Sc", "2023", "Online", "None", 96, 100),
			new Student("STU007", "Rohan", "Prakash", "Verma", "rohan.verma@email.com", "+91 98765 43216", "+91 98765 43216", "+91 98765 00007", "Physics", "2024-03-05",
				"Active", "RV", "B", "85%", "2001-11-14", "Male", "O-", "@rohan_verma", "rohan-verma", "147 Anna Salai, Chennai", "147 Anna Salai, Chennai",
				"Chennai Tech", "B.Sc", "2022", "Hybrid", "Diabetes", 85, 100),
			new Student("STU008", "Sara", "Mohammed", "Ali", "sara.ali@email.com", "+91 98765 43217", "+91 98765 43217", "+91 98765 00008", "Chemistry", "2024-03-10", "Active",
				"SA", "A-", "89%", "2003-04-05", "Female", "A+", "@sara_ali", "sara-ali", "258 MG Road, Kolkata", "258 MG Road, Kolkata",
				"Kolkata University", "M.Sc", "2024", "Online", "None", 89, 100),
			new Student("STU009", "Kabir", "Srinivas", "Reddy", "kabir.reddy@email.com", "+91 98765 43218", "+91 98765 43218", "+91 98765 00009", "Business Administration",
				"2024-03-15", "Suspended", "KR", "C+", "65%", "2002-09-20", "Male", "AB-", "@kabir_reddy", "kabir-reddy", "369 Commercial Street, Bangalore", "369 Commercial Street, Bangalore",
				"Bangalore Business School", "BBA", "2023", "Offline", "None", 65, 100),
			new Student("STU010", "Myra", "Anil", "Gupta", "myra.gupta@email.com", "+91 98765 43219", "+91 98765 43219", "+91 98765 00010", "Engineering", "2024-04-01",
				"Active", "MG", "A+", "94%", "2002-06-12", "Female", "B+", "@myra_gupta", "myra-gupta", "741 Sector 18, Noida", "741 Sector 18, Noida",
				"Noida Engineering College", "B.E", "2023", "Hybrid", "None", 94, 100),
			new Student("STU011", "Advait", "Mohan", "Joshi", "advait.joshi@email.com", "+91 98765 43220", "+91 98765 43220", "+91 98765 00011", "Computer Science",
				"2024-04-05", "Active", "AJ", "B+", "87%", "2003-02-28", "Male", "O+", "@advait_joshi", "advait-joshi", "852 Shivaji Nagar, Pune", "852 Shivaji Nagar, Pune",
				"Pune IT Institute", "B.Tech", "2024", "Online", "None", 87, 100),
			new Student("STU012", "Zara", "Ganesh", "Iyer", "zara.iyer@email.com", "+91 98765 43221", "+91 98765 43221", "+91 98765 00012", "Mathematics", "2024-04-10",
				"Active", "ZI", "A", "91%", "2002-10-08", "Female", "A-", "@zara_iyer", "zara-iyer", "963 T Nagar, Chennai", "963 T Nagar, Chennai",
				"Chennai Math Institute", "M.Sc", "2023", "Offline", "None", 91, 100),
			new Student("STU013", "Priya", "Sunil", "Desai", "priya.desai@email.com", "+91 98765 43222", "+91 98765 43222", "+91 98765 00013", "Data Science", "2024-11-08",
				"Active", "PD", null, null, "2003-06-15", "Female", "O+", "@priya_desai", "priya-desai", "147 MG Road, Pune", "147 MG Road, Pune",
				"Pune College of Engineering", "B.Tech", "2024", "Hybrid", "None", 0, 0)
);
		

pageContext.setAttribute("students", students);
%>
<!DOCTYPE html>
<html lang="en">
<head>
<jsp:include page="/dashboard/components/head.jsp">
	<jsp:param name="title" value="All Students - Dashboard - EduHub" />
	<jsp:param name="description" value="View all students in EduHub" />
</jsp:include>
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/dashboard/pages/students/css/all-students.css">
</head>
<body>
	<div class="dashboard-container">
		<jsp:include page="/dashboard/components/sidebar.jsp">
			<jsp:param name="activePage" value="all-students" />
		</jsp:include>

		<div class="dashboard-main">
			<jsp:include page="/dashboard/components/header.jsp">
				<jsp:param name="pageTitle" value="All Students" />
			</jsp:include>

			<div class="dashboard-content">
				<!-- Page Header -->
				<div class="page-header-wrapper mb-4">
					<!-- Page Heading -->
					<div class="page-title-container">
						<h2 class="mb-1">All Students</h2>
						<p class="text-muted mb-0">Manage and view all registered students</p>
					</div>
					
					<!-- Action Buttons -->
					<div class="back-button-container">
						<div class="d-flex gap-2 flex-wrap">
							<!-- Bulk Delete Button (hidden by default) -->
							<button class="btn btn-danger" id="bulkDeleteBtn" style="display: none;">
								<i class="bi bi-trash me-2"></i>Delete Selected (<span id="selectedCount">0</span>)
							</button>
							<button class="btn btn-outline-primary" id="exportBtn">
								<i class="bi bi-download me-2"></i>Export
							</button>
						<button class="btn btn-primary" id="addStudentBtn">
							<i class="bi bi-plus-circle"></i> Add Student
						</button>
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
						<h3>1,247</h3>
						<p>Total Students</p>
					</div>
				</div>
				<div class="stats-card stats-success">
					<div class="stats-icon">
						<i class="bi bi-check-circle-fill"></i>
					</div>
					<div class="stats-content">
						<h3>1,189</h3>
						<p>Active Students</p>
					</div>
				</div>
				<div class="stats-card stats-warning">
					<div class="stats-icon">
						<i class="bi bi-exclamation-triangle-fill"></i>
					</div>
					<div class="stats-content">
						<h3>45</h3>
						<p>Inactive Students</p>
					</div>
				</div>
				<div class="stats-card stats-danger">
					<div class="stats-icon">
						<i class="bi bi-ban"></i>
					</div>
					<div class="stats-content">
						<h3>13</h3>
						<p>Suspended</p>
					</div>
				</div>
			</div>

			<!-- Filters and Search -->
			<div class="card shadow-sm mb-3">
				<div class="card-body">
					<div class="row g-3 align-items-end">
						<div class="col-lg-4 col-md-6">
							<label for="searchInput" class="form-label fw-semibold">Search Students</label>
							<div class="input-group">
								<span class="input-group-text bg-light border-end-0">
									<i class="bi bi-search text-muted"></i>
								</span>
								<input type="text" class="form-control border-start-0 ps-0" id="searchInput"
									placeholder="Search by name, email, or ID..." aria-label="Search students">
							</div>
						</div>
						<div class="col-lg-3 col-md-6">
							<label for="courseFilter" class="form-label fw-semibold">Course</label>
							<select class="form-select" id="courseFilter" aria-label="Filter by course">
								<option value="">All Courses</option>
								<option value="Computer Science">Computer Science</option>
								<option value="Business Administration">Business Administration</option>
								<option value="Engineering">Engineering</option>
								<option value="Mathematics">Mathematics</option>
								<option value="Data Science">Data Science</option>
								<option value="Physics">Physics</option>
								<option value="Chemistry">Chemistry</option>
							</select>
						</div>
						<div class="col-lg-2 col-md-6">
							<label for="statusFilter" class="form-label fw-semibold">Status</label>
							<select class="form-select" id="statusFilter" aria-label="Filter by status">
								<option value="">All Status</option>
								<option value="Active">Active</option>
								<option value="Inactive">Inactive</option>
								<option value="Suspended">Suspended</option>
							</select>
						</div>
						<div class="col-lg-3 col-md-6">
							<button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
								id="resetFilters" type="button" aria-label="Reset filters">
								<i class="bi bi-arrow-clockwise me-2"></i>
								<span>Reset Filters</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Students Table -->
			<div class="card shadow-sm">
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-hover mb-0" id="studentsTable">
							<thead class="table-light">
								<tr>
									<th style="width: 40px;">
											<div class="form-check">
												<input type="checkbox" class="form-check-input" id="selectAll">
											</div>
										</th>
										<th>Student ID</th>
										<th>Name</th>
										<th>Father's Name</th>
										<th>Surname</th>
										<th>DOB</th>
										<th>Gender</th>
										<th>Blood Group</th>
										<th>Email</th>
										<th>Phone</th>
										<th>WhatsApp</th>
										<th>Parent Mobile</th>
										<th>Instagram</th>
										<th>LinkedIn</th>
										<th>Course</th>
										<th>Batch Mode</th>
										<th>College</th>
										<th>Qualification</th>
										<th>Passing Year</th>
										<th>Grade</th>
										<th>Attendance</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody id="studentsTableBody">
									<%
									for (Student student : students) {
									%>
									<tr data-student-id="<%=student.id%>"
										data-course="<%=student.course%>"
										data-status="<%=student.status%>">
										<td>
											<div class="form-check">
												<input type="checkbox" class="form-check-input student-checkbox" value="<%=student.id%>">
											</div>
										</td>
										<td><strong><%=student.id%></strong></td>
										<td>
											<div class="d-flex align-items-center">
												<div class="student-avatar"><%=student.avatar%></div>
												<div class="ms-2">
													<div class="student-name"><%=student.name%></div>
													<small class="text-muted">Enrolled: <%=formatDate(student.enrollDate)%></small>
												</div>
											</div>
										</td>
										<td><%=student.fatherName%></td>
										<td><%=student.surname%></td>
										<td><%=formatDate(student.dateOfBirth)%></td>
										<td><%=student.gender%></td>
										<td><%=student.bloodGroup%></td>
										<td><%=student.email%></td>
										<td><%=student.phone%></td>
										<td><%=student.whatsappNumber%></td>
										<td><%=student.parentMobile%></td>
										<td><%=student.instagramId%></td>
										<td><%=student.linkedinId%></td>
										<td><span class="course-badge"><%=student.course%></span></td>
										<td><span class="badge bg-info"><%=student.batchPreference%></span></td>
										<td><%=student.collegeName%></td>
										<td><%=student.educationQualification%></td>
										<td><%=student.passingYear%></td>
										<td>
											<%
											if (student.grade == null || student.grade.isEmpty() || "null".equals(student.grade)) {
											%>
												<span class="badge bg-secondary"><i class="bi bi-dash-circle"></i> Not Assigned</span>
											<%
											} else {
											%>
												<span class="grade-badge grade-<%=student.grade.charAt(0)%>"><%=student.grade%></span>
											<%
											}
											%>
										</td>
										<td>
											<%
											if (student.totalDays == 0 || student.attendance == null || student.attendance.isEmpty() || "null".equals(student.attendance)) {
											%>
												<div class="attendance-detail">
													<span class="badge bg-secondary">
														<i class="bi bi-dash-circle me-1"></i>Not Tracked
													</span>
												</div>
											<%
											} else {
												int attendancePercent = (student.attendanceDays * 100) / student.totalDays;
												// Determine trend based on percentage
												String trend = attendancePercent >= 85 ? "up" : attendancePercent >= 70 ? "stable" : "down";
												String trendIcon = trend.equals("up") ? "bi-arrow-up-circle-fill text-success" : 
																	trend.equals("down") ? "bi-arrow-down-circle-fill text-danger" : 
																	"bi-dash-circle-fill text-warning";
											%>
												<div class="attendance-detail">
													<div class="d-flex align-items-center justify-content-between mb-2">
														<strong class="attendance-percent <%=attendancePercent >= 90 ? "text-success" : attendancePercent >= 75 ? "text-warning" : "text-danger"%>">
															<%=student.attendanceDays%>/<%=student.totalDays%> days
														</strong>
														<i class="bi <%=trendIcon%>" style="font-size: 1rem;" title="Attendance trend"></i>
													</div>
													<div class="progress" style="height: 6px;">
														<div class="progress-bar <%=attendancePercent >= 90 ? "bg-success" : attendancePercent >= 75 ? "bg-warning" : "bg-danger"%>"
															style="width: <%=attendancePercent%>%" role="progressbar" 
															aria-valuenow="<%=attendancePercent%>" aria-valuemin="0" aria-valuemax="100"></div>
													</div>
													<small class="text-muted"><%=attendancePercent%>%</small>
												</div>
											<%
											}
											%>
										</td>
										<td><span class="badge status-<%=student.status.toLowerCase()%>"><%=student.status%></span></td>
										<td>
											<div class="btn-group" role="group">
												<button class="btn btn-sm btn-outline-primary view-btn"
													data-student-id="<%=student.id%>" title="View Details">
													<i class="bi bi-eye"></i>
												</button>
												<button class="btn btn-sm btn-outline-success edit-btn"
													data-student-id="<%=student.id%>" title="Edit">
													<i class="bi bi-pencil"></i>
												</button>
												<button class="btn btn-sm btn-outline-danger delete-btn"
													data-student-id="<%=student.id%>" title="Delete">
													<i class="bi bi-trash"></i>
												</button>
											</div>
										</td>
									</tr>
									<%
									}
									%>
								</tbody>
							</table>
						</div>
					</div>
					<div class="card-footer">
						<div
							class="d-flex justify-content-between align-items-center flex-wrap gap-3">
							<div class="d-flex align-items-center gap-3 flex-wrap">
								<div class="entries-info">
									Showing <span id="showingStart">1</span> to <span
										id="showingEnd">12</span> of <span id="totalEntries">12</span>
									entries
								</div>
								<div class="entries-selector-wrapper">
									<label for="entriesPerPage">Show:</label>
									<select class="form-select form-select-sm" id="entriesPerPage">
										<option value="10">10</option>
										<option value="25">25</option>
										<option value="50">50</option>
										<option value="100">100</option>
									</select>
								</div>
							</div>
							<nav>
								<ul class="pagination mb-0" id="pagination">
									<li class="page-item disabled"><a class="page-link"
										href="#"><i class="bi bi-chevron-left"></i></a></li>
									<li class="page-item active"><a class="page-link" href="#">1</a></li>
									<li class="page-item"><a class="page-link" href="#">2</a></li>
									<li class="page-item"><a class="page-link" href="#">3</a></li>
									<li class="page-item"><a class="page-link" href="#"><i
											class="bi bi-chevron-right"></i></a></li>
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Student Details Modal -->
	<div class="modal fade" id="studentDetailsModal" tabindex="-1">
		<div class="modal-dialog modal-xl modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Student Details</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body" id="studentDetailsContent">
					<!-- Content will be loaded dynamically -->
				</div>
			</div>
		</div>
	</div>
	
	<!-- Include Reusable Modal Component -->
	<jsp:include page="/dashboard/components/modal.jsp"/>
	
	<!-- Include Toast Notification Component -->
	<jsp:include page="/components/toast-dependencies.jsp"/>

	<jsp:include page="/dashboard/components/scripts.jsp" />
	<script
		src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
	<script
		src="${pageContext.request.contextPath}/dashboard/pages/students/js/all-students.js"></script>
</body>
</html>
