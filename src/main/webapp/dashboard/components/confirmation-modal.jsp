<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Reusable Confirmation Modal Component
  
  Purpose: 
    - Provides a Bootstrap modal for confirmation dialogs
    - Can be used across all dashboard pages
  
  Usage:
    Include this component in your page and call showConfirmationModal() function
    
    Example:
    showConfirmationModal({
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        confirmText: 'Yes, Proceed',
        cancelText: 'Cancel',
        confirmClass: 'btn-primary',
        onConfirm: function() {
            // Your confirmation logic here
        }
    });
--%>

<!-- Confirmation Modal -->
<div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmationModalLabel">
                    <i class="bi bi-question-circle-fill text-warning"></i>
                    <span id="modalTitle">Confirm Action</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p id="modalMessage">Are you sure you want to proceed with this action?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="modalCancelBtn">Cancel</button>
                <button type="button" class="btn btn-primary" id="modalConfirmBtn">Confirm</button>
            </div>
        </div>
    </div>
</div>

<!-- Success Modal -->
<div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="successModalLabel">
                    <i class="bi bi-check-circle-fill"></i>
                    <span id="successModalTitle">Success</span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p id="successModalMessage">Operation completed successfully!</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<!-- Error Modal -->
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="errorModalLabel">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span id="errorModalTitle">Error</span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p id="errorModalMessage">An error occurred. Please try again.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script>
    // Reusable Confirmation Modal Function
    function showConfirmationModal(options) {
        const defaults = {
            title: 'Confirm Action',
            message: 'Are you sure you want to proceed?',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            confirmClass: 'btn-primary',
            icon: 'bi-question-circle-fill text-warning',
            onConfirm: function() {},
            onCancel: function() {}
        };
        
        const settings = Object.assign({}, defaults, options);
        
        // Set modal content
        document.getElementById('modalTitle').textContent = settings.title;
        document.getElementById('modalMessage').innerHTML = settings.message;
        document.getElementById('modalCancelBtn').textContent = settings.cancelText;
        document.getElementById('modalConfirmBtn').textContent = settings.confirmText;
        
        // Update icon
        const iconElement = document.querySelector('#confirmationModalLabel i');
        iconElement.className = 'bi ' + settings.icon;
        
        // Update confirm button class
        const confirmBtn = document.getElementById('modalConfirmBtn');
        confirmBtn.className = 'btn ' + settings.confirmClass;
        
        // Remove previous event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        const newCancelBtn = document.getElementById('modalCancelBtn').cloneNode(true);
        document.getElementById('modalCancelBtn').parentNode.replaceChild(newCancelBtn, document.getElementById('modalCancelBtn'));
        
        // Add new event listeners
        newConfirmBtn.addEventListener('click', function() {
            settings.onConfirm();
            bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
        });
        
        newCancelBtn.addEventListener('click', function() {
            settings.onCancel();
        });
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
    }
    
    // Success Modal Function
    function showSuccessModal(options) {
        const defaults = {
            title: 'Success',
            message: 'Operation completed successfully!',
            onClose: function() {}
        };
        
        const settings = Object.assign({}, defaults, options);
        
        document.getElementById('successModalTitle').textContent = settings.title;
        document.getElementById('successModalMessage').innerHTML = settings.message;
        
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
        
        // Add onClose event
        document.getElementById('successModal').addEventListener('hidden.bs.modal', function() {
            settings.onClose();
        }, { once: true });
    }
    
    // Error Modal Function
    function showErrorModal(options) {
        const defaults = {
            title: 'Error',
            message: 'An error occurred. Please try again.',
            onClose: function() {}
        };
        
        const settings = Object.assign({}, defaults, options);
        
        document.getElementById('errorModalTitle').textContent = settings.title;
        document.getElementById('errorModalMessage').innerHTML = settings.message;
        
        const modal = new bootstrap.Modal(document.getElementById('errorModal'));
        modal.show();
        
        // Add onClose event
        document.getElementById('errorModal').addEventListener('hidden.bs.modal', function() {
            settings.onClose();
        }, { once: true });
    }
</script>

<style>
    /* Modal Enhancements */
    .modal-content {
        border-radius: 12px;
        border: none;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    
    .modal-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        padding: 1.5rem;
    }
    
    .modal-title {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .modal-title i {
        font-size: 1.5rem;
    }
    
    .modal-body {
        padding: 1.5rem;
        font-size: 1rem;
        color: #495057;
    }
    
    .modal-footer {
        border-top: 1px solid #e9ecef;
        padding: 1rem 1.5rem;
    }
    
    .modal-backdrop.show {
        opacity: 0.6;
    }
</style>
