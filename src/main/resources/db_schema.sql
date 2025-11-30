-- Table structure for table `courses`
CREATE TABLE IF NOT EXISTS `courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `institute_id` varchar(50) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `level` varchar(20) DEFAULT NULL,
  `description` text,
  `duration_value` int(11) DEFAULT NULL,
  `duration_unit` varchar(20) DEFAULT NULL,
  `fee` decimal(10,2) DEFAULT '0.00',
  `status` varchar(20) DEFAULT 'Active',
  `certificate_offered` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `unique_course_code` (`institute_id`,`course_code`),
  KEY `idx_institute_id` (`institute_id`),
  CONSTRAINT `fk_courses_institute` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
