<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.eduhub.dao.impl.InstituteDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.InstituteDAO" %>
<%@ page import="com.eduhub.model.Institute" %>
<%
    String instituteName = "EduHub"; // Default
    String instituteId = (String) session.getAttribute("instituteId");
    if (instituteId != null) {
        try {
            InstituteDAO instituteDAO = new InstituteDAOImpl();
            Institute institute = instituteDAO.getInstituteById(instituteId);
            if (institute != null && institute.getInstituteName() != null) {
                instituteName = institute.getInstituteName();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="ID Cards & Certificates - Dashboard - EduHub"/>
        <jsp:param name="description" value="Generate student ID cards and certificates in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/id-certificates.css">
    <!-- html2canvas for image generation -->
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <!-- JSZip for batch downloading -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <!-- Toast Notifications -->
    <jsp:include page="/components/toast-dependencies.jsp" />
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="id-certificates"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="ID Cards & Certificates"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <div class="page-title-container">
                        <h2>ID Cards & Certificates</h2>
                        <p class="text-muted">Generate and manage student ID cards and certificates</p>
                    </div>
                    
                    <div class="back-button-container d-flex gap-2">
                        <button class="btn btn-outline-primary" onclick="refreshData()">
                            <i class="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/students/all-students.jsp"/>
                            <jsp:param name="text" value="Back to Students"/>
                        </jsp:include>
                    </div>
                </div>

                <!-- Tab Navigation -->
                <ul class="nav nav-tabs mb-4" id="documentTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="id-cards-tab" data-bs-toggle="tab" data-bs-target="#id-cards" type="button" role="tab">
                            <i class="bi bi-person-badge"></i> ID Cards
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="certificates-tab" data-bs-toggle="tab" data-bs-target="#certificates" type="button" role="tab">
                            <i class="bi bi-award"></i> Certificates
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab">
                            <i class="bi bi-clock-history"></i> Generation History
                        </button>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content" id="documentTabsContent">
                    <!-- ID Cards Tab -->
                    <div class="tab-pane fade show active" id="id-cards" role="tabpanel">
                        <div class="row" style="position: relative;">
                            <!-- Selection Panel -->
                            <div class="col-lg-4" style="position: relative; z-index: 100;">
                                <div class="card-custom mb-4" style="overflow: visible;">
                                    <h5 class="mb-3"><i class="bi bi-funnel"></i> Student Selection</h5>
                                    
                                    <!-- Selection Type -->
                                    <div class="mb-3">
                                        <label class="form-label">Selection Type</label>
                                        <select class="form-select" id="idSelectionType" onchange="handleIdSelectionType()">
                                            <option value="single">Single Student</option>
                                            <option value="batch">Batch/Class</option>
                                        </select>
                                    </div>

                                    <!-- Single Student Selection -->
                                    <div id="singleIdSelection">
                                        <div class="mb-3">
                                            <label class="form-label">Search Student</label>
                                            <div class="search-input-wrapper">
                                                <input type="text" class="form-control" id="idStudentSearch" 
                                                       placeholder="Search by name or ID" onkeyup="searchStudentForId()" 
                                                       onfocus="searchStudentForId()" autocomplete="off">
                                                <div id="idStudentResults"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Batch Selection -->
                                    <div id="batchIdSelection" style="display: none;">
                                        <div class="mb-3">
                                            <label class="form-label">Select Batch</label>
                                            <select class="form-select" id="idBatchSelect">
                                                <option value="">-- Select Batch --</option>
                                                <option value="2024">2024-2025</option>
                                                <option value="2023">2023-2024</option>
                                                <option value="2022">2022-2023</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Generate Button -->
                                    <div class="mt-4 d-grid gap-2">
                                        <button class="btn btn-primary" onclick="generateIdCard()">
                                            <i class="bi bi-card-heading"></i> Generate ID Card
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Preview Panel -->
                            <div class="col-lg-8">
                                <div class="d-flex justify-content-end mb-3">
                                    <button class="btn btn-success" id="downloadPreviewBtn" onclick="downloadCurrentPreview()" disabled>
                                        <i class="bi bi-download"></i> Download
                                    </button>
                                </div>
                                <div id="idCardPreview" class="d-flex justify-content-center align-items-center" style="min-height: 500px;">
                                    <div class="text-center text-muted">
                                        <i class="bi bi-card-heading" style="font-size: 4rem; opacity: 0.2;"></i>
                                        <p class="mt-3">Select a student or batch to view ID cards</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Certificates Tab -->
                    <div class="tab-pane fade" id="certificates" role="tabpanel">
                        <div class="row">
                            <!-- Certificate Configuration -->
                            <div class="col-lg-4">
                                <div class="card-custom mb-4">
                                    <h5 class="mb-3"><i class="bi bi-gear"></i> Certificate Configuration</h5>
                                    
                                    <!-- Certificate Type -->
                                    <div class="mb-3">
                                        <label class="form-label">Certificate Type</label>
                                        <select class="form-select" id="certificateType" onchange="handleCertificateType()">
                                            <option value="completion">Course Completion</option>
                                            <option value="achievement">Achievement</option>
                                            <option value="participation">Participation</option>
                                            <option value="excellence">Academic Excellence</option>
                                            <option value="custom">Custom Certificate</option>
                                        </select>
                                    </div>

                                    <!-- Student Selection -->
                                    <div class="mb-3">
                                        <label class="form-label">Selection Type</label>
                                        <select class="form-select" id="certSelectionType" onchange="handleCertSelectionType()">
                                            <option value="single">Single Student</option>
                                            <option value="multiple">Multiple Students</option>
                                            <option value="batch">Batch/Class</option>
                                        </select>
                                    </div>

                                    <!-- Student Search -->
                                    <div id="singleCertSelection">
                                        <div class="mb-3">
                                            <label class="form-label">Search Student</label>
                                            <div class="search-input-wrapper">
                                                <input type="text" class="form-control" id="certStudentSearch" 
                                                       placeholder="Search by name or ID" onkeyup="searchStudentForCert()" 
                                                       onfocus="searchStudentForCert()" autocomplete="off">
                                                <div id="certStudentResults"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Certificate Details -->
                                    <div id="certificateDetails">
                                        <div class="mb-3">
                                            <label class="form-label">Course/Event Name</label>
                                            <input type="text" class="form-control" id="certCourseName" 
                                                   placeholder="e.g., Web Development Course">
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Issue Date</label>
                                            <input type="date" class="form-control" id="certIssueDate" 
                                                   value="<%= new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()) %>">
                                        </div>

                                        <div class="mb-3" id="gradeSection" style="display: none;">
                                            <label class="form-label">Grade/Score</label>
                                            <input type="text" class="form-control" id="certGrade" 
                                                   placeholder="e.g., A+ or 95%">
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Additional Notes (Optional)</label>
                                            <textarea class="form-control" id="certNotes" rows="2" 
                                                      placeholder="Special achievements or remarks"></textarea>
                                        </div>

                                        <div class="form-check mb-2">
                                            <input class="form-check-input" type="checkbox" id="includeSignature" checked>
                                            <label class="form-check-label" for="includeSignature">Include Authorized Signature</label>
                                        </div>

                                        <div class="form-check mb-3">
                                            <input class="form-check-input" type="checkbox" id="includeSeal" checked>
                                            <label class="form-check-label" for="includeSeal">Include Institution Seal</label>
                                        </div>
                                    </div>

                                    <!-- Generate Buttons -->
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-primary" onclick="generateCertificate()">
                                            <i class="bi bi-award"></i> Generate Certificate
                                        </button>
                                        <button class="btn btn-outline-secondary" onclick="previewCertificate()">
                                            <i class="bi bi-eye"></i> Preview
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Certificate Preview -->
                            <div class="col-lg-8">
                                <div class="card-custom">
                                    <h5 class="mb-3"><i class="bi bi-eye"></i> Certificate Preview</h5>
                                    <div id="certificatePreview" class="text-center p-4">
                                        <i class="bi bi-award" style="font-size: 4rem; opacity: 0.2;"></i>
                                        <p class="text-muted mt-3">Configure certificate details and click "Preview" to see the certificate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- History Tab -->
                    <div class="tab-pane fade" id="history" role="tabpanel">
                        <div class="card-custom">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="mb-0"><i class="bi bi-clock-history"></i> Generation History</h5>
                                <button class="btn btn-sm btn-outline-danger" onclick="clearHistory()">
                                    <i class="bi bi-trash"></i> Clear History
                                </button>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-custom">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Document Type</th>
                                            <th>Student(s)</th>
                                            <th>Count</th>
                                            <th>Generated By</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="historyTableBody">
                                        <tr>
                                            <td colspan="6" class="text-center py-4">
                                                <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                                                <p class="text-muted mt-2 mb-0">No generation history yet</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script>
        const contextPath = "${pageContext.request.contextPath}";
        const instituteName = "<%= instituteName %>";
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/id-certificates.js"></script>
</body>
</html>
