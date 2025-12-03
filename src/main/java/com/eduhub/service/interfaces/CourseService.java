package com.eduhub.service.interfaces;

import com.eduhub.model.Course;
import java.util.List;
import java.util.Map;

public interface CourseService {
    boolean createCourse(Course course);
    Course getCourseByCode(String instituteId, String courseCode);
    List<Course> getCourses(String instituteId, int page, int limit, String search, String category, String level, String status);
    int getTotalCourseCount(String instituteId, String search, String category, String level, String status);
    List<String> getDistinctCategories(String instituteId);
    List<String> getDistinctLevels(String instituteId);
    List<String> getDistinctStatuses(String instituteId);
    Map<String, Integer> getCourseStatistics(String instituteId);
    boolean updateCourse(Course course);
    boolean deleteCourse(String courseId, String instituteId);
    Course getCourseById(String courseId, String instituteId);
    List<Course> getActiveCourses(String instituteId);
}
