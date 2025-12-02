package com.eduhub.util;

import java.util.Arrays;
import java.util.List;

public class DropdownData {

    public static final List<String> ROLES = Arrays.asList(
            "Technical Trainer",
            "Programming Trainer",
            "Soft Skills Trainer",
            "HR Executive",
            "HR Manager",
            "Front Desk",
            "Placement Officer",
            "Placement Coordinator",
            "Accountant",
            "IT Support",
            "Lab Assistant",
            "Branch Manager",
            "Other");

    public static final List<String> DEPARTMENTS = Arrays.asList(
            "Computer Science", "Electronics", "Mechanical", "Civil",
            "Administration", "Human Resources", "Accounts", "Library",
            "Placement", "IT Support", "MBA");

    public static final List<String> STAFF_DEPARTMENTS = Arrays.asList(
            "Trainer",
            "HR & Admin",
            "Placement",
            "Accounts",
            "Technical Support",
            "Management"
    );

    public static final List<String> EMPLOYMENT_TYPES = Arrays.asList(
            "Full-Time", "Part-Time", "Contract", "Temporary");

    public static final List<String> WORK_SHIFTS = Arrays.asList(
            "Morning (6 AM - 2 PM)", "Day (9 AM - 5 PM)",
            "Evening (2 PM - 10 PM)", "Night (10 PM - 6 AM)", "Flexible");

    public static final List<String> MARITAL_STATUSES = Arrays.asList(
            "Single", "Married", "Divorced", "Widowed");

    public static final List<String> QUALIFICATIONS = Arrays.asList(
            "High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other");

    public static final List<String> SPECIALIZATIONS = Arrays.asList(
            "Computer Science", "Information Technology", "Electronics & Comm.",
            "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
            "Commerce", "Arts", "Science", "Business Administration", "Other");

    public static final List<String> GENDERS = Arrays.asList(
            "Male", "Female", "Other", "Prefer not to say");

    public static final List<String> BLOOD_GROUPS = Arrays.asList(
            "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");

    public static final List<String> CLASSES = Arrays.asList(
            "Class 10-A", "Class 10-B", "Class 11-A", "Class 11-B", "Class 12-A", "Class 12-B");

    public static final List<String> COURSE_CATEGORIES = Arrays.asList(
            "Development", "Design", "Business", "Marketing", "Data Science");

    public static final List<String> COURSE_LEVELS = Arrays.asList(
            "Beginner", "Intermediate", "Advanced");

    public static final List<String> COURSE_STATUSES = Arrays.asList(
            "Active", "Inactive", "Draft", "Archived");

    public static final List<String> MODES_OF_CONDUCT = Arrays.asList(
            "Online", "Offline", "Hybrid");

    public static final List<String> BATCH_STATUSES = Arrays.asList(
            "Upcoming", "Active", "Completed", "Cancelled");

    public static final List<String> DURATION_UNITS = Arrays.asList(
            "Days", "Weeks", "Months", "Years");

    public static final List<String> PLACEMENT_STATUSES = Arrays.asList(
            "Placed", "Offered", "Joined", "Declined", "Pending");

    public static final List<String> BATCH_YEARS = Arrays.asList(
            "2025-26", "2024-25", "2023-24", "2022-23");

    public static final List<String> INSTITUTE_TYPES = Arrays.asList(
            "School", "College", "University", "Coaching Institute", "Vocational Training", "Training");

    public static final List<String> COUNTRIES = Arrays.asList(
            "India", "USA", "UK", "Canada", "Australia", "Germany", "France", "Japan", "Singapore", "UAE");

    public static final List<String> STATES = Arrays.asList(
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
            "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
            "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
            "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry");

    public static final List<String> COURSES = Arrays.asList(
            "Web Development - Full Stack", "Data Science - Advanced", "Mobile App Development", "Digital Marketing",
            "Python Programming");

    public static final List<String> STUDENT_STATUSES = Arrays.asList(
            "Active", "Inactive", "Suspended", "Graduated");

    public static final List<String> STAFF_STATUSES = Arrays.asList(
            "Yet to Onboard", "Active", "Inactive");

    // Format: "value|label"
    public static final List<String> DOCUMENT_TYPES = Arrays.asList(
            "aadharCard|Aadhar Card (Required)",
            "panCard|PAN Card",
            "marksheet|Marksheet (Required)",
            "degreeCertificate|Degree Certificate",
            "jobGuarantee|Job Guarantee Doc",
            "resume|Resume/CV");
}
