// Toggle password visibility function
function togglePassword(fieldId) {
	const field = document.getElementById(fieldId);
	const icon = document.getElementById(fieldId + '-icon');
	
	// Toggle between password and text input type
	if (field.type === 'password') {
		field.type = 'text';
		icon.classList.remove('bi-eye');
		icon.classList.add('bi-eye-slash');
	} else {
		field.type = 'password';
		icon.classList.remove('bi-eye-slash');
		icon.classList.add('bi-eye');
	}
}

// Form validation on submit
document.querySelector('.auth-form').addEventListener('submit', function(e) {
	const password = document.getElementById('password').value;
	const confirmPassword = document.getElementById('confirmPassword').value;
	
	// Check if passwords match
	if (password !== confirmPassword) {
		e.preventDefault();
		alert('Passwords do not match!');
		return false;
	}
	
	// Check minimum password length
	if (password.length < 8) {
		e.preventDefault();
		alert('Password must be at least 8 characters long!');
		return false;
	}

	// Check password strength requirements
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumbers = /\d/.test(password);
	
	if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
		e.preventDefault();
		alert('Password must contain at least one uppercase letter, one lowercase letter, and one number!');
		return false;
	}
});
