-- 데이터베이스 생성 (이미 존재하면 무시)
CREATE DATABASE IF NOT EXISTS class_registration;
USE class_registration;

-- 1. 강의 정보 테이블 (courses)
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    max_students INT NOT NULL
);

-- 2. 학생 정보 테이블 (students)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- 3. 수강 신청 내역 테이블 (enrollments)
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    -- 중복 신청 방지 (한 학생이 동일 강의를 중복해서 신청할 수 없음)
    UNIQUE KEY unique_enrollment (student_id, course_id),
    -- 외래 키 설정
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
