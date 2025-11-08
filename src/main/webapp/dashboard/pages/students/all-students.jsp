<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%
// Dummy student data
class Student {
	String id, name, email, phone, course, enrollDate, status, avatar, grade, attendance;

	public Student(String id, String name, String email, String phone, String course, String enrollDate, String status,
	String avatar, String grade, String attendance) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.course = course;
		this.enrollDate = enrollDate;
		this.status = status;
		this.avatar = avatar;
		this.grade = grade;
		this.attendance = attendance;
	}
}

List<Student> students = Arrays.asList(
		new Student("STU001", "Aarav Sharma", "aarav.sharma@email.com", "+91 98765 43210", "Computer Science",
		"2024-01-15", "Active", "AS", "A+", "95%"),
		new Student("STU002", "Diya Patel", "diya.patel@email.com", "+91 98765 43211", "Business Administration",
		"2024-01-20", "Active", "DP", "A", "92%"),
		new Student("STU003", "Arjun Kumar", "arjun.kumar@email.com", "+91 98765 43212", "Engineering", "2024-02-01",
		"Active", "AK", "B+", "88%"),
		new Student("STU004", "Ananya Singh", "ananya.singh@email.com", "+91 98765 43213", "Mathematics", "2024-02-10",
		"Inactive", "AS", "A-", "78%"),
		new Student("STU005", "Vihaan Mehta", "vihaan.mehta@email.com", "+91 98765 43214", "Computer Science",
		"2024-02-15", "Active", "VM", "A", "90%"),
		new Student("STU006", "Aisha Khan", "aisha.khan@email.com", "+91 98765 43215", "Data Science", "2024-03-01",
		"Active", "AK", "A+", "96%"),
		new Student("STU007", "Rohan Verma", "rohan.verma@email.com", "+91 98765 43216", "Physics", "2024-03-05",
		"Active", "RV", "B", "85%"),
		new Student("STU008", "Sara Ali", "sara.ali@email.com", "+91 98765 43217", "Chemistry", "2024-03-10", "Active",
		"SA", "A-", "89%"),
		new Student("STU009", "Kabir Reddy", "kabir.reddy@email.com", "+91 98765 43218", "Business Administration",
		"2024-03-15", "Suspended", "KR", "C+", "65%"),
		new Student("STU010", "Myra Gupta", "myra.gupta@email.com", "+91 98765 43219", "Engineering", "2024-04-01",
		"Active", "MG", "A+", "94%"),
		new Student("STU011", "Advait Joshi", "advait.joshi@email.com", "+91 98765 43220", "Computer Science",
		"2024-04-05", "Active", "AJ", "B+", "87%"),
		new Student("STU012", "Zara Iyer", "zara.iyer@email.com", "+91 98765 43221", "Mathematics", "2024-04-10",
		"Active", "ZI", "A", "91%"));

pageContext.setAttribute("students", students);
%>
<!DOCTYPE html>
<html lang="en">
<head>
<jsp:include page="/public/components/head.jsp">
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
				<div class="page-header mb-4">
					<div
						class="d-flex justify-content-between align-items-center flex-wrap gap-3">
						<div>
							<h2 class="mb-1">All Students</h2>
							<p class="text-muted mb-0">Manage and view all registered
								students</p>
						</div>
					<div class="d-flex gap-2">
						<!-- Bulk Delete Button (hidden by default) -->
						<button class="btn btn-danger" id="bulkDeleteBtn" style="display: none;">
							<i class="bi bi-trash me-2"></i>Delete Selected (<span id="selectedCount">0</span>)
						</button>
						<button class="btn btn-outline-primary" id="exportBtn">
							<i class="bi bi-download me-2"></i>Export
						</button>
						<button class="btn btn-primary" id="addStudentBtn">
							<i class="bi bi-plus-lg me-2"></i>Add Student
						</button>
					</div>
					</div>
				</div>

				<!-- Stats Cards -->
				<div class="row g-3 mb-4">
					<div class="col-md-3 col-sm-6">
						<div class="stats-card stats-primary">
							<div class="stats-icon">
								<i class="bi bi-people-fill"></i>
							</div>
							<div class="stats-content">
								<h3>1,247</h3>
								<p>Total Students</p>
							</div>
						</div>
					</div>
					<div class="col-md-3 col-sm-6">
						<div class="stats-card stats-success">
							<div class="stats-icon">
								<i class="bi bi-check-circle-fill"></i>
							</div>
							<div class="stats-content">
								<h3>1,189</h3>
								<p>Active Students</p>
							</div>
						</div>
					</div>
					<div class="col-md-3 col-sm-6">
						<div class="stats-card stats-warning">
							<div class="stats-icon">
								<i class="bi bi-exclamation-triangle-fill"></i>
							</div>
							<div class="stats-content">
								<h3>45</h3>
								<p>Inactive Students</p>
							</div>
						</div>
					</div>
					<div class="col-md-3 col-sm-6">
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
				</div>

				<!-- Filters and Search -->
				<div class="card shadow-sm mb-4">
					<div class="card-body">
						<div class="row g-3 align-items-end">
							<div class="col-md-4">
								<label class="form-label">Search Students</label>
								<div class="input-group">
									<span class="input-group-text"><i class="bi bi-search"></i></span>
									<input type="text" class="form-control" id="searchInput"
										placeholder="Search by name, email, or ID...">
								</div>
							</div>
							<div class="col-md-2">
								<label class="form-label">Course</label> <select
									class="form-select" id="courseFilter">
									<option value="">All Courses</option>
									<option value="Computer Science">Computer Science</option>
									<option value="Business Administration">Business
										Administration</option>
									<option value="Engineering">Engineering</option>
									<option value="Mathematics">Mathematics</option>
									<option value="Data Science">Data Science</option>
									<option value="Physics">Physics</option>
									<option value="Chemistry">Chemistry</option>
								</select>
							</div>
							<div class="col-md-2">
								<label class="form-label">Status</label> <select
									class="form-select" id="statusFilter">
									<option value="">All Status</option>
									<option value="Active">Active</option>
									<option value="Inactive">Inactive</option>
									<option value="Suspended">Suspended</option>
								</select>
							</div>
							<div class="col-md-2">
								<label class="form-label">Show Entries</label> <select
									class="form-select" id="entriesPerPage">
									<option value="10">10</option>
									<option value="25">25</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
							</div>
							<div class="col-md-2">
								<button class="btn btn-outline-secondary w-100"
									id="resetFilters">
									<i class="bi bi-arrow-clockwise me-2"></i>Reset
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
										<th><input type="checkbox" class="form-check-input"
											id="selectAll"></th>
										<th>Student ID</th>
										<th>Name</th>
										<th>Email</th>
										<th>Phone</th>
										<th>Course</th>
										<th>Grade</th>
										<th>Attendance</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									<%
									for (Student student : students) {
									%>
									<tr data-student-id="<%=student.id%>"
										data-course="<%=student.course%>"
										data-status="<%=student.status%>">
										<td><input type="checkbox"
											class="form-check-input student-checkbox"></td>
										<td><strong><%=student.id%></strong></td>
										<td>
											<div class="d-flex align-items-center">
												<div class="student-avatar"><%=student.avatar%></div>
												<div class="ms-2">
													<div class="student-name"><%=student.name%></div>
													<small class="text-muted">Enrolled: <%=student.enrollDate%></small>
												</div>
											</div>
										</td>
										<td><%=student.email%></td>
										<td><%=student.phone%></td>
										<td><span class="course-badge"><%=student.course%></span></td>
										<td><span
											class="grade-badge grade-<%=student.grade.charAt(0)%>"><%=student.grade%></span>
										</td>
										<td>
											<div class="attendance-progress">
												<div class="progress" style="height: 8px;">
													<div
														class="progress-bar <%=Integer.parseInt(student.attendance.replace("%", "")) >= 90 ? "bg-success"
		: Integer.parseInt(student.attendance.replace("%", "")) >= 75 ? "bg-warning" : "bg-danger"%>"
														style="width: <%=student.attendance%>"></div>
												</div>
												<small><%=student.attendance%></small>
											</div>
										</td>
										<td><span
											class="badge status-<%=student.status.toLowerCase()%>">
												<%=student.status%>
										</span></td>
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
					<div class="card-footer bg-white">
						<div
							class="d-flex justify-content-between align-items-center flex-wrap gap-3">
							<div class="text-muted">
								Showing <span id="showingStart">1</span> to <span
									id="showingEnd">12</span> of <span id="totalEntries">12</span>
								entries
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
		<div class="modal-dialog modal-lg">
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
	<jsp:include page="/dashboard/components/toast-notification.jsp"/>

	<jsp:include page="/public/components/scripts.jsp" />
	<script
		src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
	<script
		src="${pageContext.request.contextPath}/dashboard/pages/students/js/all-students.js"></script>
</body>
</html>
