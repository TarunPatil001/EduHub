# Filter Package

Contains servlet filters for cross-cutting concerns.

## Purpose
- Intercept requests before they reach servlets
- Intercept responses before they reach client
- Handle authentication, authorization, logging, etc.

## Files to Create

1. **AuthenticationFilter.java**
   - Check if user is logged in
   - Redirect to login if not authenticated
   - Allow public resources

2. **AuthorizationFilter.java**
   - Check user roles and permissions
   - Ensure user has access to requested resource
   - Return 403 if unauthorized

3. **LoggingFilter.java**
   - Log all requests
   - Log response times
   - Track user activity

4. **CORSFilter.java**
   - Handle Cross-Origin Resource Sharing
   - Set CORS headers
   - Allow specific origins

5. **EncodingFilter.java**
   - Set character encoding to UTF-8
   - Ensure proper text handling

6. **CacheControlFilter.java**
   - Set cache headers
   - Control browser caching

## Example Filter

```java
package com.eduhub.filter;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class AuthenticationFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization code
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        
        String uri = req.getRequestURI();
        HttpSession session = req.getSession(false);
        
        boolean isPublicResource = uri.contains("/auth/") || 
                                   uri.contains("/assets/");
        boolean isLoggedIn = (session != null && 
                             session.getAttribute("user") != null);
        
        if (isLoggedIn || isPublicResource) {
            chain.doFilter(request, response);
        } else {
            res.sendRedirect(req.getContextPath() + "/views/auth/login.jsp");
        }
    }
    
    @Override
    public void destroy() {
        // Cleanup code
    }
}
```

## Best Practices
- Keep filters focused on single responsibility
- Order filters properly in web.xml
- Don't put business logic in filters
- Always call chain.doFilter() when appropriate
- Handle exceptions gracefully
