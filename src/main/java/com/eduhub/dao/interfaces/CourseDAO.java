package com.eduhub.dao.interfaces;

import com.eduhub.model.Course;
import java.util.List;

public interface CourseDAO {
    boolean createCourse(Course course);
    Course getCourseByCode(String instituteId, String courseCode);
    List<Course> getCourses(String instituteId, int offset, int limit, String search, String category, String level, String status);
    int getTotalCourseCount(String instituteId, String search, String category, String level, String status);
    List<String> getDistinctCategories(String instituteId);
    List<String> getDistinctLevels(String instituteId);
    List<String> getDistinctStatuses(String instituteId);
    java.util.Map<String, Integer> getCourseStatistics(String instituteId);
    boolean updateCourse(Course course);
    boolean deleteCourse(String courseId, String instituteId);
    Course getCourseById(String courseId, String instituteId);
    List<Course> getAllCourses(String instituteId);
}
