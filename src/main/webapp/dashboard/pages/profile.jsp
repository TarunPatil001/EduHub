<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Profile - Dashboard - EduHub"/>
        <jsp:param name="description" value="User profile in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="profile"/>
        </jsp:include>
        
        <!-- Main Content -->
        <div class="dashboard-main">
            <!-- Header -->
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="My Profile"/>
            </jsp:include>
            
            <!-- Content -->
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>Profile</h2>
                    <p>Manage your profile information</p>
                </div>
                
                <div class="card-custom">
                    <h5>Profile Information</h5>
                    <form id="profileForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="instituteName" class="form-label">Institute Name</label>
                                <input type="text" class="form-control" id="instituteName" name="instituteName" value="Your Institute Name">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="contactEmail" class="form-label">Contact Email</label>
                                <input type="email" class="form-control" id="contactEmail" name="contactEmail" value="contact@example.com">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Address</label>
                            <textarea class="form-control" id="address" name="address" rows="3">123 Main St, Anytown</textarea>
                        </div>
                                                <button type="submit" class="btn btn-primary">Update</button>
                        <button type="button" class="btn btn-secondary" id="discardChanges">Discard</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/modal.jsp" />
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const profileForm = document.getElementById('profileForm');
            let isDirty = false;

            // Function to set form as dirty
            const setDirty = () => {
                isDirty = true;
                // Optional: visually indicate unsaved changes
            };

            // Add event listeners to all form inputs
            profileForm.querySelectorAll('input, textarea, select').forEach(input => {
                input.addEventListener('input', setDirty);
            });

            // Function to save profile
            const saveProfile = () => {
                // Here you would typically handle the form submission via AJAX
                console.log('Saving profile...');
                
                // Simulate AJAX delay
                setTimeout(() => {
                    console.log('Profile saved');
                    showSuccessModal({
                        title: 'Profile Updated',
                        message: 'Your profile information has been updated successfully.',
                        onClose: () => {
                            isDirty = false; // Reset dirty flag after saving
                        }
                    });
                }, 500);
            };

            // Handle form submission
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveProfile();
            });

            document.getElementById('discardChanges').addEventListener('click', function() {
                profileForm.reset();
                isDirty = false;
            });

            // Function to handle navigation away from the page
            const handleNavigation = (e, targetUrl) => {
                if (isDirty) {
                    e.preventDefault();
                    showConfirmationModal({
                        title: 'Unsaved Changes',
                        message: 'You have unsaved changes. What would you like to do?',
                        confirmText: 'Save and Leave',
                        confirmClass: 'btn-primary',
                        onConfirm: () => {
                            // This simulates a save action.
                            // In a real app, you'd have an async save and then navigate.
                            console.log('Saving changes...');
                            profileForm.submit(); // This will trigger the submit handler
                            // We can't navigate immediately here if saving is async.
                            // For this demo, we'll assume submit handler does what's needed.
                            setTimeout(() => {
                                isDirty = false;
                                window.location.href = targetUrl;
                            }, 500); // Give a moment for the "save" to process
                        },
                        
                        cancelText: 'Update Changes',
                        onCancel: () => {
                            // Trigger save with navigation callback
                            saveProfile(() => {
                                window.location.href = targetUrl;
                            });
                        },

                        extraBtnText: 'Leave Without Saving',
                        extraBtnClass: 'btn-danger',
                        onExtraBtn: () => {
                            isDirty = false; // Discard changes
                            window.location.href = targetUrl;
                        }
                    });
                }
            };

            // Add click listeners to all navigation links
            document.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetUrl = this.href;
                    
                    // Ignore javascript links or links that open in a new tab
                    if (!targetUrl || targetUrl.startsWith('javascript:') || this.target === '_blank') {
                        return;
                    }
                    
                    // Check if the link is for the current page to avoid loop
                    if (targetUrl === window.location.href) {
                        return;
                    }

                    handleNavigation(e, targetUrl);
                });
            });

            // Handle browser back/forward button or closing tab
            window.addEventListener('beforeunload', (e) => {
                if (isDirty) {
                    e.preventDefault();
                    // Most browsers will show a generic confirmation message
                    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                }
            });
        });
    </script>
</body>
</html>