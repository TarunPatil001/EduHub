package com.eduhub.listener;

import com.eduhub.util.DropdownData;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;


@WebListener
public class AppInitializer implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext context = sce.getServletContext();
        
        context.setAttribute("roles", DropdownData.ROLES);
        context.setAttribute("departments", DropdownData.DEPARTMENTS);
        context.setAttribute("employmentTypes", DropdownData.EMPLOYMENT_TYPES);
        context.setAttribute("workShifts", DropdownData.WORK_SHIFTS);
        context.setAttribute("maritalStatuses", DropdownData.MARITAL_STATUSES);
        context.setAttribute("qualifications", DropdownData.QUALIFICATIONS);
        context.setAttribute("genders", DropdownData.GENDERS);
        context.setAttribute("bloodGroups", DropdownData.BLOOD_GROUPS);
        context.setAttribute("classes", DropdownData.CLASSES);
        context.setAttribute("courseCategories", DropdownData.COURSE_CATEGORIES);
        context.setAttribute("courseLevels", DropdownData.COURSE_LEVELS);
        context.setAttribute("courseStatuses", DropdownData.COURSE_STATUSES);
        context.setAttribute("modesOfConduct", DropdownData.MODES_OF_CONDUCT);
        context.setAttribute("batchStatuses", DropdownData.BATCH_STATUSES);
        context.setAttribute("durationUnits", DropdownData.DURATION_UNITS);
        context.setAttribute("placementStatuses", DropdownData.PLACEMENT_STATUSES);
        context.setAttribute("batchYears", DropdownData.BATCH_YEARS);
        context.setAttribute("instituteTypes", DropdownData.INSTITUTE_TYPES);
        context.setAttribute("countries", DropdownData.COUNTRIES);
        
        System.out.println("EduHub: Dropdown data initialized in application scope.");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Cleanup if needed
    }
}
