<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.eduhub.model.IdCard" %>
<%@ page import="com.eduhub.model.Student" %>
<%@ page import="java.time.LocalDate" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.temporal.ChronoUnit" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ID Card Verification | EduHub</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <style>
        :root {
            --primary: #1e3a5f;
            --primary-dark: #0f2744;
            --accent: #3b82f6;
            --accent-light: #60a5fa;
            --success: #10b981;
            --success-bg: #ecfdf5;
            --warning: #f59e0b;
            --warning-bg: #fffbeb;
            --error: #ef4444;
            --error-bg: #fef2f2;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --text-muted: #9ca3af;
            --border: #e5e7eb;
            --bg-light: #f9fafb;
            --card-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.06);
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #dddddd;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            margin: 0;
        }

        .verification-container {
            width: 100%;
            max-width: 480px;
        }

        .verification-card {
            background: white;
            border-radius: 24px;
            box-shadow: var(--card-shadow);
            overflow: hidden;
            position: relative;
        }

        /* Verified Badge at Top */
        .verified-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            color: white;
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.3px;
            z-index: 10;
        }

        .verified-badge i {
            font-size: 0.85rem;
        }

        /* Header Section */
        .card-header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            padding: 40px 30px 80px;
            text-align: center;
            position: relative;
        }

        .card-header.expired {
            background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
        }

        .card-header.invalid {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }

        .card-header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 60px;
            background: white;
            border-radius: 30px 30px 0 0;
        }

        .brand-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: rgba(255,255,255,0.9);
            font-size: 0.85rem;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .brand-header i {
            color: var(--accent-light);
        }

        .header-title {
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
            letter-spacing: 0.5px;
        }

        /* Profile Section */
        .profile-section {
            position: relative;
            margin-top: -50px;
            z-index: 5;
            padding: 0 30px;
            text-align: center;
        }

        .profile-photo-wrapper {
            display: inline-block;
            position: relative;
        }

        .profile-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            background: var(--bg-light);
        }

        .profile-photo-placeholder {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4px solid white;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .profile-photo-placeholder i {
            font-size: 2.5rem;
            color: white;
        }

        .verification-icon {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 28px;
            height: 28px;
            background: var(--success);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(16,185,129,0.4);
        }

        .verification-icon.expired {
            background: var(--warning);
            box-shadow: 0 2px 8px rgba(245,158,11,0.4);
        }

        .verification-icon i {
            color: white;
            font-size: 0.7rem;
        }

        .student-name {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 16px 0 4px;
            line-height: 1.3;
        }

        .institute-name {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-weight: 500;
        }

        .institute-name i {
            color: var(--accent);
            font-size: 0.85rem;
        }

        /* Details Section */
        .details-section {
            padding: 24px 30px 20px;
        }

        .details-grid {
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        .detail-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 0;
            border-bottom: 1px solid var(--border);
        }

        .detail-item:last-child {
            border-bottom: none;
        }

        .detail-label {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-secondary);
            font-size: 0.875rem;
            font-weight: 500;
        }

        .detail-label i {
            width: 18px;
            color: var(--primary);
            font-size: 0.95rem;
        }

        .detail-value {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 0.9rem;
            text-align: right;
            max-width: 55%;
            word-break: break-word;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .status-badge.active {
            background: var(--success-bg);
            color: var(--success);
        }

        .status-badge.inactive {
            background: var(--error-bg);
            color: var(--error);
        }

        .status-badge.expired-status {
            background: var(--warning-bg);
            color: var(--warning);
        }

        /* Validity Section */
        .validity-section {
            padding: 0 30px 24px;
        }

        .validity-card {
            background: var(--success-bg);
            border: 1px solid rgba(16,185,129,0.2);
            border-radius: 12px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .validity-card.expired {
            background: var(--warning-bg);
            border-color: rgba(245,158,11,0.2);
        }

        .validity-card i {
            font-size: 1.25rem;
            color: var(--success);
        }

        .validity-card.expired i {
            color: var(--warning);
        }

        .validity-text {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--success);
        }

        .validity-card.expired .validity-text {
            color: var(--warning);
        }

        /* Footer */
        .card-footer {
            background: var(--bg-light);
            border-top: 1px solid var(--border);
            padding: 16px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .security-text {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .security-text i {
            color: var(--success);
        }

        .brand-footer {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 700;
            font-size: 0.85rem;
            color: var(--primary);
            text-decoration: none;
        }

        .brand-footer i {
            color: var(--accent);
        }

        /* Error States */
        .error-section {
            padding: 50px 30px;
            text-align: center;
        }

        .error-icon-wrapper {
            width: 80px;
            height: 80px;
            background: var(--error-bg);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }

        .error-icon-wrapper i {
            font-size: 2.5rem;
            color: var(--error);
        }

        .error-icon-wrapper.warning {
            background: var(--warning-bg);
        }

        .error-icon-wrapper.warning i {
            color: var(--warning);
        }

        .error-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 12px;
        }

        .error-message {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .help-text {
            background: var(--bg-light);
            border-radius: 10px;
            padding: 14px 18px;
            font-size: 0.85rem;
            color: var(--text-secondary);
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .help-text i {
            color: var(--accent);
            font-size: 1rem;
        }

        @media (max-width: 480px) {
            body {
                padding: 16px;
            }
            
            .card-header {
                padding: 30px 20px 70px;
            }
            
            .profile-section, .details-section, .validity-section {
                padding-left: 20px;
                padding-right: 20px;
            }

            .card-footer {
                padding: 14px 20px;
                flex-direction: column;
                gap: 10px;
            }

            .detail-value {
                max-width: 50%;
            }
        }
    </style>
</head>
<body>
    <%
        Boolean isValid = (Boolean) request.getAttribute("isValid");
        IdCard idCard = (IdCard) request.getAttribute("idCard");
        Student student = (Student) request.getAttribute("student");
        String errorMessage = (String) request.getAttribute("errorMessage");
        
        if (idCard != null && isValid != null && isValid) {
            // Build full student name from student object (fresh data)
            StringBuilder nameBuilder = new StringBuilder();
            if (student != null) {
                if (student.getStudentName() != null) nameBuilder.append(student.getStudentName());
                if (student.getFatherName() != null) nameBuilder.append(" ").append(student.getFatherName());
                if (student.getSurname() != null) nameBuilder.append(" ").append(student.getSurname());
            }
            String studentName = nameBuilder.toString().trim();
            if (studentName.isEmpty()) studentName = idCard.getStudentName(); // Fallback to idCard
            
            String department = idCard.getDepartment();
            // Use fresh batch name from request attribute (fetched from DB), fallback to idCard
            String batchName = request.getAttribute("batchName") != null ? (String) request.getAttribute("batchName") : idCard.getBatchName();
            // Use fresh photo URL from student object (fresh data), fallback to idCard
            String photoUrl = (student != null && student.getProfilePhotoUrl() != null) ? student.getProfilePhotoUrl() : idCard.getProfilePhotoUrl();
            String idCardId = idCard.getIdCardId();
            
            // Calculate remaining days
            long remainingDays = 0;
            boolean isExpired = false;
            if (idCard.getValidUntil() != null) {
                LocalDate validUntil = idCard.getValidUntil().toLocalDate();
                LocalDate today = LocalDate.now();
                remainingDays = ChronoUnit.DAYS.between(today, validUntil);
                isExpired = remainingDays < 0;
            }
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
    %>
    <div class="verification-container">
        <div class="verification-card">
            <!-- Top Badge -->
            <div class="verified-badge">
                <i class="bi bi-patch-check-fill"></i>
                <%= isExpired ? "EXPIRED" : "VERIFIED" %>
            </div>

            <!-- Header -->
            <div class="card-header <%= isExpired ? "expired" : "" %>">
                <div class="brand-header">
                    <i class="bi bi-mortarboard-fill"></i>
                    <span>EduHub Verification</span>
                </div>
                <h1 class="header-title">
                    <i class="bi bi-person-vcard me-1"></i>
                    ID Card <%= isExpired ? "Expired" : "Verified" %>
                </h1>
            </div>

            <!-- Profile Section -->
            <div class="profile-section">
                <div class="profile-photo-wrapper">
                    <% if (photoUrl != null && !photoUrl.isEmpty()) { %>
                    <img src="<%= photoUrl %>" alt="Student Photo" class="profile-photo" 
                         onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                    <div class="profile-photo-placeholder" style="display:none;">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <% } else { %>
                    <div class="profile-photo-placeholder">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <% } %>
                    <div class="verification-icon <%= isExpired ? "expired" : "" %>">
                        <i class="bi bi-<%= isExpired ? "exclamation" : "check" %>-lg"></i>
                    </div>
                </div>
                
                <h2 class="student-name"><%= studentName != null ? studentName : "Student" %></h2>
                
                <% if (request.getAttribute("instituteName") != null) { %>
                <div class="institute-name">
                    <i class="bi bi-building"></i>
                    <%= request.getAttribute("instituteName") %>
                </div>
                <% } %>
            </div>

            <!-- Details Section -->
            <div class="details-section">
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-upc-scan"></i> Batch Code
                        </span>
                        <span class="detail-value"><%= request.getAttribute("batchCode") != null ? request.getAttribute("batchCode") : "N/A" %></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-people-fill"></i> Batch Name
                        </span>
                        <span class="detail-value"><%= (batchName != null && !batchName.equals("N/A")) ? batchName : (request.getAttribute("batchName") != null ? request.getAttribute("batchName") : "N/A") %></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-book-half"></i> Course Name
                        </span>
                        <span class="detail-value"><%= request.getAttribute("courseName") != null ? request.getAttribute("courseName") : "N/A" %></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-geo-alt-fill"></i> Branch Name
                        </span>
                        <span class="detail-value"><%= request.getAttribute("branchName") != null ? request.getAttribute("branchName") : (department != null ? department : "N/A") %></span>
                    </div>

                    <% if (idCard.getIssueDate() != null) { %>
                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-calendar-check"></i> Issue Date
                        </span>
                        <span class="detail-value"><%= idCard.getIssueDate().toLocalDate().format(formatter) %></span>
                    </div>
                    <% } %>

                    <% if (idCard.getValidUntil() != null) { %>
                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-calendar-x"></i> Valid Until
                        </span>
                        <span class="detail-value"><%= idCard.getValidUntil().toLocalDate().format(formatter) %></span>
                    </div>
                    <% } %>

                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-shield-check"></i> Status
                        </span>
                        <span class="detail-value">
                            <% if (idCard.isActive() && !isExpired) { %>
                            <span class="status-badge active">
                                <i class="bi bi-check-circle-fill"></i> Active
                            </span>
                            <% } else if (!idCard.isActive()) { %>
                            <span class="status-badge inactive">
                                <i class="bi bi-x-circle-fill"></i> Inactive
                            </span>
                            <% } else { %>
                            <span class="status-badge expired-status">
                                <i class="bi bi-exclamation-circle-fill"></i> Expired
                            </span>
                            <% } %>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Validity Banner -->
            <div class="validity-section">
                <% if (isExpired) { %>
                <div class="validity-card expired">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span class="validity-text">Expired <%= Math.abs(remainingDays) %> days ago</span>
                </div>
                <% } else { %>
                <div class="validity-card">
                    <i class="bi bi-check-circle-fill"></i>
                    <span class="validity-text">Valid for <%= remainingDays > 0 ? remainingDays + " more days" : "today" %></span>
                </div>
                <% } %>
            </div>

            <!-- Footer -->
            <div class="card-footer">
                <div class="security-text">
                    <i class="bi bi-lock-fill"></i>
                    Verified on <%= new java.text.SimpleDateFormat("dd MMM yyyy, hh:mm a").format(new java.util.Date()) %>
                </div>
                <a href="${pageContext.request.contextPath}/" class="brand-footer">
                    <i class="bi bi-mortarboard-fill"></i> EduHub
                </a>
            </div>
        </div>
    </div>
    <%
        } else if (idCard != null && !idCard.isActive()) {
            // ID Card is deactivated
    %>
    <div class="verification-container">
        <div class="verification-card">
            <!-- Header -->
            <div class="card-header invalid">
                <div class="brand-header">
                    <i class="bi bi-mortarboard-fill"></i>
                    <span>EduHub Verification</span>
                </div>
                <h1 class="header-title">
                    <i class="bi bi-slash-circle me-1"></i>
                    ID Card Deactivated
                </h1>
            </div>

            <!-- Error Content -->
            <div class="error-section">
                <div class="error-icon-wrapper warning">
                    <i class="bi bi-slash-circle-fill"></i>
                </div>
                
                <h3 class="error-title">This ID Card Has Been Deactivated</h3>
                
                <p class="error-message">
                    This ID card is no longer valid as it has been deactivated by the administrator.
                    <% if (idCard.getDeactivateReason() != null && !idCard.getDeactivateReason().isEmpty()) { %>
                    <br><br><strong>Reason:</strong> <%= idCard.getDeactivateReason() %>
                    <% } %>
                </p>
                
                <div class="help-text">
                    <i class="bi bi-info-circle-fill"></i>
                    If you believe this is an error, please contact the issuing institution.
                </div>
            </div>

            <!-- Footer -->
            <div class="card-footer">
                <div class="security-text">
                    <i class="bi bi-shield-exclamation"></i>
                    Verification attempted
                </div>
                <a href="${pageContext.request.contextPath}/" class="brand-footer">
                    <i class="bi bi-mortarboard-fill"></i> EduHub
                </a>
            </div>
        </div>
    </div>
    <%
        } else {
            // Invalid or not found
    %>
    <div class="verification-container">
        <div class="verification-card">
            <!-- Header -->
            <div class="card-header invalid">
                <div class="brand-header">
                    <i class="bi bi-mortarboard-fill"></i>
                    <span>EduHub Verification</span>
                </div>
                <h1 class="header-title">
                    <i class="bi bi-x-octagon me-1"></i>
                    Verification Failed
                </h1>
            </div>

            <!-- Error Content -->
            <div class="error-section">
                <div class="error-icon-wrapper">
                    <i class="bi bi-x-octagon-fill"></i>
                </div>
                
                <h3 class="error-title">ID Card Not Verified</h3>
                
                <p class="error-message">
                    <%= errorMessage != null 
                        ? errorMessage 
                        : "The ID card could not be verified. This may indicate the ID card is invalid, expired, or has been tampered with." %>
                </p>
                
                <div class="help-text">
                    <i class="bi bi-info-circle-fill"></i>
                    If you believe this is an error, please contact the issuing institution.
                </div>
            </div>

            <!-- Footer -->
            <div class="card-footer">
                <div class="security-text">
                    <i class="bi bi-shield-exclamation"></i>
                    Verification failed
                </div>
                <a href="${pageContext.request.contextPath}/" class="brand-footer">
                    <i class="bi bi-mortarboard-fill"></i> EduHub
                </a>
            </div>
        </div>
    </div>
    <%
        }
    %>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
