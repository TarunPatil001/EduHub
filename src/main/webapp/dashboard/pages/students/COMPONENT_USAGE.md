# Components Usage Guide - All Students Page

## Components Included

This page uses two reusable components:

### 1. Modal Component
- **Location**: `/dashboard/components/modal.jsp`
- **Purpose**: Display confirmation dialogs, success messages, and error messages

### 2. Toast Notification Component
- **Location**: `/dashboard/components/toast-notification.jsp`
- **Purpose**: Display success/error/warning/info messages to users

---

## How They Work Together in All Students Page

### Example 1: Single Student Deletion
```javascript
// Show confirmation modal
showConfirmationModal({
    title: 'Delete Student',
    message: 'Are you sure you want to delete this student?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmClass: 'btn-danger',
    icon: 'bi-exclamation-triangle-fill text-danger',
    onConfirm: function() {
        // Delete the student
        deleteStudentAPI(studentId);
        
        // Show success toast
        showToast('Student deleted successfully', 'success');
    }
});
```

### Example 2: Bulk Student Deletion (Current Implementation)
```javascript
// 1. User selects multiple students via checkboxes
// 2. Clicks "Delete Selected" button
// 3. Confirmation modal appears
showConfirmationModal({
    title: 'Delete Multiple Students',
    message: `Are you sure you want to delete ${count} students?`,
    confirmText: 'Delete All',
    cancelText: 'Cancel',
    confirmClass: 'btn-danger',
    icon: 'bi-exclamation-triangle-fill text-danger',
    onConfirm: function() {
        // Delete all selected students
        // Show success toast
        showToast(`${count} students deleted successfully`, 'success');
    }
});
```

### Example 3: Data Export with Warning
```javascript
if (noDataToExport) {
    // Show warning toast
    showToast('No data to export', 'warning');
} else {
    // Export data
    exportData();
    // Show success toast
    showToast('Data exported successfully', 'success');
}
```

---

## Toast Notification API

### Basic Usage
```javascript
showToast('Message here', 'success');
showToast('Error occurred', 'danger');
showToast('Warning message', 'warning');
showToast('Info message', 'info');
```

### With Custom Duration
```javascript
showToast('Message', 'success', 3000); // 3 seconds
```

### With Icons (Enhanced)
```javascript
showToastWithIcon('Success!', 'success');
showToastWithIcon('Error!', 'danger');
```

### With Progress Bar
```javascript
showToastWithProgress('Saving...', 'info', 5000);
```

### Simplified API (Recommended)
```javascript
Toast.success('Operation completed!');
Toast.error('Something went wrong!');
Toast.warning('Please check your input!');
Toast.info('Information message');
Toast.loading('Processing...'); // For long operations
Toast.dismiss(toastId); // Dismiss specific toast
Toast.dismissAll(); // Dismiss all toasts
```

---

## Confirmation Modal API

### Basic Usage
```javascript
showConfirmationModal({
    title: 'Confirm Action',
    message: 'Are you sure?',
    confirmText: 'Yes',
    cancelText: 'No',
    confirmClass: 'btn-primary', // or 'btn-danger', 'btn-warning'
    icon: 'bi-question-circle-fill text-warning',
    onConfirm: function() {
        // Action to perform on confirmation
    },
    onCancel: function() {
        // Optional: Action on cancel
    }
});
```

### Common Icon Options
- `'bi-question-circle-fill text-warning'` - For questions
- `'bi-exclamation-triangle-fill text-danger'` - For destructive actions
- `'bi-info-circle-fill text-info'` - For information
- `'bi-check-circle-fill text-success'` - For confirmations

---

## Success/Error Modals

### Success Modal
```javascript
showSuccessModal({
    title: 'Success',
    message: 'Operation completed successfully!',
    onClose: function() {
        // Optional: Action after modal closes
    }
});
```

### Error Modal
```javascript
showErrorModal({
    title: 'Error',
    message: 'An error occurred. Please try again.',
    onClose: function() {
        // Optional: Action after modal closes
    }
});
```

---

## Current Implementation in All Students Page

### Features Using Components:

1. ✅ **Bulk Delete** - Uses both components
   - Confirmation modal for user confirmation
   - Toast notification for success feedback

2. ✅ **Single Delete** - Uses both components
   - Confirmation modal before deletion
   - Toast notification for success

3. ✅ **Export Data** - Uses toast component
   - Warning toast if no data
   - Success toast after export

4. ✅ **Form Validation** - Uses toast component
   - Warning toasts for validation errors

---

## Best Practices

1. **Always confirm destructive actions** - Use confirmation modal
2. **Provide feedback** - Use toast notifications for all user actions
3. **Use appropriate types**:
   - `success` - Green (completed actions)
   - `danger` - Red (errors, destructive actions)
   - `warning` - Yellow (warnings, validations)
   - `info` - Blue (information)

4. **Keep messages concise** - Short, clear messages work best
5. **Don't overuse** - Too many toasts can be annoying

---

## Testing the Components

1. **Test Bulk Delete**:
   - Select multiple students
   - Click "Delete Selected" button
   - Confirm in modal
   - See success toast

2. **Test Single Delete**:
   - Click delete button on any student
   - Confirm in modal
   - See success toast

3. **Test Export**:
   - Filter to show no students
   - Click Export
   - See warning toast
   - Show students and export again
   - See success toast
