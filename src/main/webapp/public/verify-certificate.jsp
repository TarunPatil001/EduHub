<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.eduhub.model.Certificate" %>
<%@ page import="java.time.LocalDate" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.temporal.ChronoUnit" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate Verification | EduHub</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet">
    
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
            --gold: #d4af37;
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

        .card-header.revoked {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
            color: var(--gold);
        }

        .header-title {
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
            letter-spacing: 0.5px;
        }

        /* Certificate Icon Section */
        .certificate-section {
            position: relative;
            margin-top: -50px;
            z-index: 5;
            padding: 0 30px;
            text-align: center;
        }

        .certificate-icon-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold) 0%, #c9a227 100%);
            border: 4px solid white;
            box-shadow: 0 8px 24px rgba(212,175,55,0.3);
        }

        .certificate-icon-wrapper i {
            font-size: 2.5rem;
            color: white;
        }

        .certificate-icon-wrapper.revoked {
            background: linear-gradient(135deg, var(--error) 0%, #dc2626 100%);
            box-shadow: 0 8px 24px rgba(239,68,68,0.3);
        }

        .student-name {
            font-family: 'Great Vibes', cursive;
            font-size: 2.2rem;
            font-weight: 400;
            color: var(--primary);
            margin: 16px 0 8px;
            line-height: 1.2;
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

        .status-badge.revoked {
            background: var(--error-bg);
            color: var(--error);
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

        .validity-card.revoked {
            background: var(--error-bg);
            border-color: rgba(239,68,68,0.2);
        }

        .validity-card i {
            font-size: 1.25rem;
            color: var(--success);
        }

        .validity-card.revoked i {
            color: var(--error);
        }

        .validity-text {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--success);
        }

        .validity-card.revoked .validity-text {
            color: var(--error);
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
            
            .certificate-section, .details-section, .validity-section {
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
        Certificate cert = (Certificate) request.getAttribute("certificate");
        String errorMessage = (String) request.getAttribute("errorMessage");
        
        // Get dynamic attributes
        String studentName = (String) request.getAttribute("studentName");
        String courseName = (String) request.getAttribute("courseName");
        String instituteName = (String) request.getAttribute("instituteName");
        Integer durationValue = (Integer) request.getAttribute("courseDurationValue");
        String durationUnit = (String) request.getAttribute("courseDurationUnit");
        
        if (cert != null && isValid != null && isValid) {
            boolean isRevoked = cert.isRevoked();
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            
            // Build duration string
            String duration = "N/A";
            if (durationValue != null && durationUnit != null) {
                duration = durationValue + " " + durationUnit;
            }
    %>
    <div class="verification-container">
        <div class="verification-card">
            <!-- Top Badge -->
            <div class="verified-badge">
                <i class="bi bi-patch-check-fill"></i>
                <%= isRevoked ? "REVOKED" : "VERIFIED" %>
            </div>

            <!-- Header -->
            <div class="card-header <%= isRevoked ? "revoked" : "" %>">
                <div class="brand-header">
                    <i class="bi bi-mortarboard-fill"></i>
                    <span>EduHub Verification</span>
                </div>
                <h1 class="header-title">
                    <i class="bi bi-award me-1"></i>
                    Certificate <%= isRevoked ? "Revoked" : "Verified" %>
                </h1>
            </div>

            <!-- Certificate Section -->
            <div class="certificate-section">
                <div class="certificate-icon-wrapper <%= isRevoked ? "revoked" : "" %>">
                    <i class="bi bi-<%= isRevoked ? "x-lg" : "award-fill" %>"></i>
                </div>
                
                <h2 class="student-name"><%= studentName != null ? studentName : "Student" %></h2>
                
                <% if (instituteName != null) { %>
                <div class="institute-name">
                    <i class="bi bi-building"></i>
                    <%= instituteName %>
                </div>
                <% } %>
            </div>

            <!-- Details Section -->
            <div class="details-section">
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-hash"></i> Certificate ID
                        </span>
                        <span class="detail-value"><%= cert.getCertificateId() != null ? cert.getCertificateId() : "N/A" %></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-book-half"></i> Course Name
                        </span>
                        <span class="detail-value"><%= courseName != null ? courseName : "N/A" %></span>
                    </div>

                    <% if (cert.getIssueDate() != null) { %>
                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-calendar-check"></i> Issue Date
                        </span>
                        <span class="detail-value"><%= cert.getIssueDate().toLocalDate().format(formatter) %></span>
                    </div>
                    <% } %>

                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-clock-history"></i> Duration
                        </span>
                        <span class="detail-value"><%= duration %></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">
                            <i class="bi bi-shield-check"></i> Status
                        </span>
                        <span class="detail-value">
                            <% if (!isRevoked) { %>
                            <span class="status-badge active">
                                <i class="bi bi-check-circle-fill"></i> Active
                            </span>
                            <% } else { %>
                            <span class="status-badge revoked">
                                <i class="bi bi-x-circle-fill"></i> Revoked
                            </span>
                            <% } %>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Validity Banner -->
            <div class="validity-section">
                <% if (isRevoked) { %>
                <div class="validity-card revoked">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span class="validity-text">This certificate has been revoked</span>
                </div>
                <% } else { %>
                <div class="validity-card">
                    <i class="bi bi-check-circle-fill"></i>
                    <span class="validity-text">This certificate is digitally verified and valid.</span>
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
        } else if (cert != null && cert.isRevoked()) {
            // Certificate is revoked
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
    %>
    <div class="verification-container">
        <div class="verification-card">
            <!-- Header -->
            <div class="card-header revoked">
                <div class="brand-header">
                    <i class="bi bi-mortarboard-fill"></i>
                    <span>EduHub Verification</span>
                </div>
                <h1 class="header-title">
                    <i class="bi bi-slash-circle me-1"></i>
                    Certificate Revoked
                </h1>
            </div>

            <!-- Error Content -->
            <div class="error-section">
                <div class="error-icon-wrapper">
                    <i class="bi bi-slash-circle-fill"></i>
                </div>
                
                <h3 class="error-title">This Certificate Has Been Revoked</h3>
                
                <p class="error-message">
                    This certificate is no longer valid as it has been revoked by the issuing institution.
                    <% if (cert.getRevokeReason() != null && !cert.getRevokeReason().isEmpty()) { %>
                    <br><br><strong>Reason:</strong> <%= cert.getRevokeReason() %>
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
                
                <h3 class="error-title">Certificate Not Verified</h3>
                
                <p class="error-message">
                    <%= errorMessage != null 
                        ? errorMessage 
                        : "The certificate could not be verified. This may indicate the certificate is invalid, does not exist, or has been tampered with." %>
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
