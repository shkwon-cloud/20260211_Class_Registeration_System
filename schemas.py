from pydantic import BaseModel, EmailStr
from typing import List, Optional

# Course Schemas
class CourseBase(BaseModel):
    title: str
    instructor: str
    max_students: int

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int

    class Config:
        orm_mode = True

# Student Schemas
class StudentBase(BaseModel):
    name: str
    email: EmailStr

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int

    class Config:
        orm_mode = True

# Enrollment Schemas
class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int

class Enrollment(BaseModel):
    id: int
    student_id: int
    course_id: int

    class Config:
        orm_mode = True
