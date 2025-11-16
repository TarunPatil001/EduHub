# Dashboard Folder Structure

## Overview
This document describes the organized folder structure for the EduHub dashboard module.

## Folder Structure

```
dashboard/
├── components/          # Reusable dashboard components
│   ├── sidebar.jsp      # Navigation sidebar
│   ├── header.jsp       # Top header with notifications and profile
│   └── stats-card.jsp   # Reusable statistics card component
│
├── css/                 # Dashboard-specific stylesheets
│   └── dashboard.css    # Main dashboard styles (layout, sidebar, header, cards)
│
├── js/                  # Dashboard-specific JavaScript
│   └── dashboard.js     # Dashboard functionality (sidebar toggle, utilities)
│
└── pages/              # Individual dashboard pages
    ├── students.jsp    # Student management page
    ├── teachers.jsp    # Teacher management page
    ├── attendance.jsp  # Attendance tracking page
    ├── courses.jsp     # Course management page
    └── profile.jsp     # User profile page
```

## Files Description

### Components (`dashboard/components/`)

#### `sidebar.jsp`
- Navigation menu for the dashboard
- Displays menu items with icons
- Highlights active page
- Responsive mobile support
- **Parameters**: `activePage` (optional)

#### `header.jsp`
- Top navigation bar
- Search functionality
- Notifications dropdown
- User profile dropdown
- **Parameters**: `pageTitle` (optional)

#### `stats-card.jsp`
- Reusable statistics card component
- Display key metrics with icons
- Color-coded themes (primary, success, warning, danger, info)
- **Parameters**: 
  - `title` - Card title
  - `value` - Statistic value
  - `icon` - Bootstrap icon class
  - `color` - Color theme
  - `change` - Percentage change (optional)

### CSS (`dashboard/css/`)

#### `dashboard.css`
Complete styling for:
- Dashboard layout (sidebar + main content)
- Sidebar navigation
- Header bar
- Statistics cards
- Tables and cards
- Responsive design (mobile-friendly)
- Color variables and themes

### JavaScript (`dashboard/js/`)

#### `dashboard.js`
Functions for:
- Sidebar toggle (mobile and desktop)
- Responsive behavior
- Tooltip initialization
- Loading spinner utilities
- Toast notifications
- Number formatting

### Pages (`dashboard/pages/`)

All pages follow the same structure:
- Include the sidebar component
- Include the header component
- Main content area
- Proper page titles and descriptions

## Usage Examples

### Using the Dashboard Layout

```jsp
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="../../components/head.jsp">
        <jsp:param name="title" value="Your Page - Dashboard - EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <jsp:include page="../components/sidebar.jsp">
            <jsp:param name="activePage" value="yourpage"/>
        </jsp:include>
        
        <!-- Main Content -->
        <div class="dashboard-main">
            <!-- Header -->
            <jsp:include page="../components/header.jsp">
                <jsp:param name="pageTitle" value="Your Page Title"/>
            </jsp:include>
            
            <!-- Content -->
            <div class="dashboard-content">
                <!-- Your content here -->
            </div>
        </div>
    </div>
    
    <jsp:include page="../../components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
```

### Using Stats Cards

```jsp
<div class="col-md-6 col-lg-3">
    <jsp:include page="dashboard/components/stats-card.jsp">
        <jsp:param name="title" value="Total Students"/>
        <jsp:param name="value" value="1,234"/>
        <jsp:param name="icon" value="bi-people-fill"/>
        <jsp:param name="color" value="primary"/>
        <jsp:param name="change" value="12.5"/>
    </jsp:include>
</div>
```

## URLs

- Main Dashboard: `/dashboard`
- Students: `/dashboard/pages/students.jsp`
- Teachers: `/dashboard/pages/teachers.jsp`
- Attendance: `/dashboard/pages/attendance.jsp`
- Courses: `/dashboard/pages/courses.jsp`
- Profile: `/dashboard/pages/profile.jsp`

## Features

✅ Clean, modular folder structure
✅ Reusable components
✅ Responsive design (mobile, tablet, desktop)
✅ Modern UI with Bootstrap 5
✅ Dark sidebar with light content area
✅ Statistics cards with color themes
✅ Notifications and user profile dropdowns
✅ Smooth transitions and animations
✅ Utility JavaScript functions
✅ Proper documentation

## Adding New Pages

1. Create a new JSP file in `dashboard/pages/`
2. Use the template structure shown above
3. Add the page link to `sidebar.jsp`
4. Set the appropriate `activePage` parameter

## Customization

### Colors
Edit CSS variables in `dashboard/css/dashboard.css`:
```css
:root {
    --sidebar-bg: #1E293B;
    --primary-color: #0D6EFD;
    /* etc. */
}
```

### Sidebar Menu
Edit `dashboard/components/ui_component/sidebar.jsp` to add/remove menu items.

### Header Actions
Edit `dashboard/components/ui_component/header.jsp` to customize notifications and profile menu.
