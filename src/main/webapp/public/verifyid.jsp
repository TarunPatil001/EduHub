<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.eduhub.model.Student" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ID Verification | EduHub</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <style>
        :root {
            --primary-color: #4285f4;
            --success-color: #0f9d58;
            --error-color: #db4437;
            --bg-color: #f8f9fa;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--bg-color);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .verification-card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            width: 100%;
            max-width: 400px;
            overflow: hidden;
            text-align: center;
            position: relative;
        }

        .status-header {
            padding: 30px 20px;
            color: white;
            position: relative;
        }

        .status-header.valid {
            background: var(--success-color);
        }

        .status-header.invalid {
            background: var(--error-color);
        }

        .status-icon {
            font-size: 3rem;
            margin-bottom: 10px;
            display: block;
        }

        .status-text {
            font-family: 'Google Sans', sans-serif;
            font-size: 1.5rem;
            font-weight: 500;
            margin: 0;
        }

        .student-photo-wrapper {
            margin-top: -50px;
            position: relative;
            display: inline-block;
        }

        .student-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 5px solid white;
            object-fit: cover;
            background: #f1f3f4;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .student-details {
            padding: 20px 30px 40px;
        }

        .student-name {
            font-family: 'Google Sans', sans-serif;
            font-size: 1.5rem;
            color: #202124;
            margin: 15px 0 20px;
            font-weight: 500;
            line-height: 1.3;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0;
            border-bottom: 1px solid #f1f3f4;
            font-size: 0.95rem;
            gap: 15px;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: #5f6368;
            font-weight: 500;
            flex-shrink: 0;
        }

        .detail-value {
            color: #202124;
            font-weight: 500;
            text-align: right;
            word-break: break-word;
        }

        .footer {
            background: #f8f9fa;
            padding: 15px;
            font-size: 0.8rem;
            color: #5f6368;
            border-top: 1px solid #e0e0e0;
        }

        .brand-logo {
            font-family: 'Google Sans', sans-serif;
            font-weight: 700;
            color: #5f6368;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
    </style>
</head>
<body>

    <div class="verification-card">
        <%
            Boolean isValid = (Boolean) request.getAttribute("isValid");
            if (isValid != null && isValid) {
                Student student = (Student) request.getAttribute("student");
        %>
            <!-- Valid Student -->
            <div class="status-header valid">
                <i class="bi bi-patch-check-fill status-icon"></i>
                <h1 class="status-text">Verified Student</h1>
            </div>

            <div class="student-photo-wrapper">
                <% if (student.getProfilePhotoUrl() != null && !student.getProfilePhotoUrl().isEmpty()) { %>
                    <img src="<%= student.getProfilePhotoUrl() %>" alt="Student Photo" class="student-photo" onerror="this.src='https://via.placeholder.com/150?text=No+Photo'">
                <% } else { %>
                    <div class="student-photo d-flex align-items-center justify-content-center">
                        <i class="bi bi-person-fill" style="font-size: 3rem; color: #bdc1c6;"></i>
                    </div>
                <% } %>
            </div>

            <div class="student-details">
                <h2 class="student-name"><%= student.getStudentName() %> <%= student.getSurname() != null ? student.getSurname() : "" %></h2>

                <div class="detail-row">
                    <span class="detail-label">Specialization</span>
                    <span class="detail-value">
                        <%= (student.getSpecialization() != null && !student.getSpecialization().isEmpty()) ? student.getSpecialization() : "Computer Science" %>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Batch Code</span>
                    <span class="detail-value">
                        <%= request.getAttribute("batchCode") != null ? request.getAttribute("batchCode") : "N/A" %>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Batch</span>
                    <span class="detail-value">
                        <%= request.getAttribute("batchName") != null ? request.getAttribute("batchName") : "N/A" %>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Branch</span>
                    <span class="detail-value">
                        <%= request.getAttribute("branchName") != null ? request.getAttribute("branchName") : "N/A" %>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value text-success">
                        <i class="bi bi-check-circle-fill me-1"></i> 
                        <%= (student.getStudentStatus() != null && !student.getStudentStatus().isEmpty()) ? student.getStudentStatus() : "Active" %>
                    </span>
                </div>
            </div>
        <%
            } else {
        %>
            <!-- Invalid Student -->
            <div class="status-header invalid">
                <i class="bi bi-x-circle-fill status-icon"></i>
                <h1 class="status-text">Invalid ID</h1>
            </div>
            
            <div class="student-details pt-5">
                <p class="text-muted mb-4">
                    The student ID provided could not be verified in our system.
                </p>
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    ID not found or expired
                </div>
                <a href="<%= request.getContextPath() %>/" class="btn btn-outline-secondary mt-3">Go to Home</a>
            </div>
        <%
            }
        %>

        <div class="footer">
            Verified by <span class="brand-logo"><i class="bi bi-mortarboard-fill"></i> EduHub</span>
        </div>
    </div>

</body>
</html>
