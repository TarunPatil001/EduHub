package com.eduhub.service.impl;

import com.eduhub.dao.impl.CourseDAOImpl;
import com.eduhub.dao.interfaces.CourseDAO;
import com.eduhub.model.Course;
import com.eduhub.service.interfaces.CourseService;

import java.util.List;

public class CourseServiceImpl implements CourseService {
    
    private CourseDAO courseDAO;

    public CourseServiceImpl() {
        this.courseDAO = new CourseDAOImpl();
    }

    @Override
    public boolean createCourse(Course course) {
        // Business logic validation can be added here
        if (course.getInstituteId() == null || course.getCourseCode() == null || course.getCourseName() == null) {
            return false;
        }
        
        // Check if course code already exists for this institute
        if (courseDAO.getCourseByCode(course.getInstituteId(), course.getCourseCode()) != null) {
            return false; // Course code must be unique
        }
        
        return courseDAO.createCourse(course);
    }

    @Override
    public Course getCourseById(String courseId, String instituteId) {
        return courseDAO.getCourseById(courseId, instituteId);
    }

    @Override
    public Course getCourseByCode(String instituteId, String courseCode) {
        return courseDAO.getCourseByCode(instituteId, courseCode);
    }

    @Override
    public List<Course> getCourses(String instituteId, int page, int limit, String search, String category, String level, String status) {
        int offset = (page - 1) * limit;
        if (offset < 0) offset = 0;
        return courseDAO.getCourses(instituteId, offset, limit, search, category, level, status);
    }

    @Override
    public int getTotalCourseCount(String instituteId, String search, String category, String level, String status) {
        return courseDAO.getTotalCourseCount(instituteId, search, category, level, status);
    }

    @Override
    public List<String> getDistinctCategories(String instituteId) {
        return courseDAO.getDistinctCategories(instituteId);
    }

    @Override
    public List<String> getDistinctLevels(String instituteId) {
        return courseDAO.getDistinctLevels(instituteId);
    }

    @Override
    public List<String> getDistinctStatuses(String instituteId) {
        return courseDAO.getDistinctStatuses(instituteId);
    }

    @Override
    public java.util.Map<String, Integer> getCourseStatistics(String instituteId) {
        return courseDAO.getCourseStatistics(instituteId);
    }

    @Override
    public boolean updateCourse(Course course) {
        return courseDAO.updateCourse(course);
    }

    @Override
    public boolean deleteCourse(String courseId, String instituteId) {
        return courseDAO.deleteCourse(courseId, instituteId);
    }
}
