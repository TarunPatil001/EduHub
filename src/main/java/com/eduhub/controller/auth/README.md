# Authentication Controllers

Handle user login, logout, registration, and password management.

## Files to Create

1. **LoginServlet.java**
   - Handle user login
   - Verify credentials
   - Create session
   - Redirect to dashboard

2. **LogoutServlet.java**
   - Invalidate session
   - Clear cookies
   - Redirect to login

3. **RegisterServlet.java**
   - Handle user registration
   - Validate input
   - Create user account
   - Send confirmation

4. **RegisterAdminServlet.java**
   - Admin registration
   - Role assignment

5. **RegisterInstituteServlet.java**
   - Institute registration
   - Initial setup

6. **ForgotPasswordServlet.java**
   - Password reset request
   - Send reset link

7. **ResetPasswordServlet.java**
   - Handle password reset
   - Update password

## URL Patterns

```
/auth/login
/auth/logout
/auth/register
/auth/register-admin
/auth/register-institute
/auth/forgot-password
/auth/reset-password
```
