package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.CourseDAO;
import com.eduhub.model.Course;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CourseDAOImpl implements CourseDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(CourseDAOImpl.class);

    @Override
    public boolean createCourse(Course course) {
        String sql = "INSERT INTO courses (course_id, institute_id, course_code, course_name, category, level, description, " +
                     "duration_value, duration_unit, fee, status, certificate_offered) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            String courseId = UUID.randomUUID().toString();
            course.setCourseId(courseId);
            
            pstmt.setString(1, courseId);
            pstmt.setString(2, course.getInstituteId());
            pstmt.setString(3, course.getCourseCode());
            pstmt.setString(4, course.getCourseName());
            pstmt.setString(5, course.getCategory());
            pstmt.setString(6, course.getLevel());
            pstmt.setString(7, course.getDescription());
            pstmt.setInt(8, course.getDurationValue());
            pstmt.setString(9, course.getDurationUnit());
            pstmt.setBigDecimal(10, course.getFee());
            pstmt.setString(11, course.getStatus());
            pstmt.setBoolean(12, course.isCertificateOffered());
            
            int affectedRows = pstmt.executeUpdate();
            
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error creating course: {}", e.getMessage(), e);
            System.out.println("DEBUG: SQL Error creating course: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public Course getCourseById(String courseId, String instituteId) {
        String sql = "SELECT * FROM courses WHERE course_id = ? AND institute_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, courseId);
            pstmt.setString(2, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToCourse(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting course by ID and Institute: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public Course getCourseByCode(String instituteId, String courseCode) {
        String sql = "SELECT * FROM courses WHERE institute_id = ? AND course_code = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            pstmt.setString(2, courseCode);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToCourse(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting course by code: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public List<Course> getCourses(String instituteId, int offset, int limit, String search, String category, String level, String status) {
        List<Course> courses = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM courses WHERE institute_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (course_name LIKE ? OR course_code LIKE ?)");
            String searchPattern = "%" + search.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }
        if (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category)) {
            sql.append(" AND category = ?");
            params.add(category);
        }
        if (level != null && !level.trim().isEmpty() && !"all".equalsIgnoreCase(level)) {
            sql.append(" AND level = ?");
            params.add(level);
        }
        if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
            sql.append(" AND status = ?");
            params.add(status);
        }

        sql.append(" ORDER BY created_at DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    courses.add(mapResultSetToCourse(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting paginated courses: {}", e.getMessage(), e);
        }
        return courses;
    }

    @Override
    public int getTotalCourseCount(String instituteId, String search, String category, String level, String status) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM courses WHERE institute_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (course_name LIKE ? OR course_code LIKE ?)");
            String searchPattern = "%" + search.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }
        if (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category)) {
            sql.append(" AND category = ?");
            params.add(category);
        }
        if (level != null && !level.trim().isEmpty() && !"all".equalsIgnoreCase(level)) {
            sql.append(" AND level = ?");
            params.add(level);
        }
        if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
            sql.append(" AND status = ?");
            params.add(status);
        }

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting total course count: {}", e.getMessage(), e);
        }
        return 0;
    }

    @Override
    public List<String> getDistinctCategories(String instituteId) {
        List<String> categories = new ArrayList<>();
        String sql = "SELECT DISTINCT category FROM courses WHERE institute_id = ? ORDER BY category";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String category = rs.getString("category");
                    if (category != null && !category.trim().isEmpty()) {
                        categories.add(category);
                    }
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting distinct categories: {}", e.getMessage(), e);
        }
        return categories;
    }

    @Override
    public List<String> getDistinctLevels(String instituteId) {
        List<String> levels = new ArrayList<>();
        String sql = "SELECT DISTINCT level FROM courses WHERE institute_id = ? ORDER BY level";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String level = rs.getString("level");
                    if (level != null && !level.trim().isEmpty()) {
                        levels.add(level);
                    }
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting distinct levels: {}", e.getMessage(), e);
        }
        return levels;
    }

    @Override
    public List<String> getDistinctStatuses(String instituteId) {
        List<String> statuses = new ArrayList<>();
        String sql = "SELECT DISTINCT status FROM courses WHERE institute_id = ? ORDER BY status";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String status = rs.getString("status");
                    if (status != null && !status.trim().isEmpty()) {
                        statuses.add(status);
                    }
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting distinct statuses: {}", e.getMessage(), e);
        }
        return statuses;
    }

    @Override
    public java.util.Map<String, Integer> getCourseStatistics(String instituteId) {
        java.util.Map<String, Integer> stats = new java.util.HashMap<>();
        stats.put("totalCourses", 0);
        stats.put("activeCourses", 0);
        stats.put("totalStudents", 0); // Placeholder as data not available
        stats.put("totalTeachers", 0); // Placeholder as data not available

        String sqlTotal = "SELECT COUNT(*) FROM courses WHERE institute_id = ?";
        String sqlActive = "SELECT COUNT(*) FROM courses WHERE institute_id = ? AND status = 'Active'";

        try (Connection conn = DBUtil.getConnection()) {
            // Get Total Courses
            try (PreparedStatement pstmt = conn.prepareStatement(sqlTotal)) {
                pstmt.setString(1, instituteId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        stats.put("totalCourses", rs.getInt(1));
                    }
                }
            }

            // Get Active Courses
            try (PreparedStatement pstmt = conn.prepareStatement(sqlActive)) {
                pstmt.setString(1, instituteId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        stats.put("activeCourses", rs.getInt(1));
                    }
                }
            }
            
        } catch (SQLException e) {
            logger.error("Error getting course statistics: {}", e.getMessage(), e);
        }
        
        return stats;
    }

    @Override
    public boolean updateCourse(Course course) {
        // Check for duplicate course code
        Course existingCourse = getCourseByCode(course.getInstituteId(), course.getCourseCode());
        if (existingCourse != null && !existingCourse.getCourseId().equals(course.getCourseId())) {
            logger.warn("Course code {} already exists for institute {}", course.getCourseCode(), course.getInstituteId());
            return false;
        }

        String sql = "UPDATE courses SET course_code = ?, course_name = ?, category = ?, level = ?, description = ?, " +
                     "duration_value = ?, duration_unit = ?, fee = ?, status = ?, certificate_offered = ? " +
                     "WHERE course_id = ? AND institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, course.getCourseCode());
            pstmt.setString(2, course.getCourseName());
            pstmt.setString(3, course.getCategory());
            pstmt.setString(4, course.getLevel());
            pstmt.setString(5, course.getDescription());
            pstmt.setInt(6, course.getDurationValue());
            pstmt.setString(7, course.getDurationUnit());
            pstmt.setBigDecimal(8, course.getFee());
            pstmt.setString(9, course.getStatus());
            pstmt.setBoolean(10, course.isCertificateOffered());
            pstmt.setString(11, course.getCourseId());
            pstmt.setString(12, course.getInstituteId());
            
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error updating course: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deleteCourse(String courseId, String instituteId) {
        String sql = "DELETE FROM courses WHERE course_id = ? AND institute_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, courseId);
            pstmt.setString(2, instituteId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting course with institute check: {}", e.getMessage(), e);
        }
        return false;
    }

    private Course mapResultSetToCourse(ResultSet rs) throws SQLException {
        Course course = new Course();
        course.setCourseId(rs.getString("course_id"));
        course.setInstituteId(rs.getString("institute_id"));
        course.setCourseCode(rs.getString("course_code"));
        course.setCourseName(rs.getString("course_name"));
        course.setCategory(rs.getString("category"));
        course.setLevel(rs.getString("level"));
        course.setDescription(rs.getString("description"));
        course.setDurationValue(rs.getInt("duration_value"));
        course.setDurationUnit(rs.getString("duration_unit"));
        course.setFee(rs.getBigDecimal("fee"));
        course.setStatus(rs.getString("status"));
        course.setCertificateOffered(rs.getBoolean("certificate_offered"));
        course.setCreatedAt(rs.getTimestamp("created_at"));
        course.setUpdatedAt(rs.getTimestamp("updated_at"));
        return course;
    }
}
