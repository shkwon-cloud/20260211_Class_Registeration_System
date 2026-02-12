from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db

# DB 테이블 생성 (이미 존재하면 건너뜀)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Class Registration System API")

import os
from dotenv import load_dotenv

load_dotenv()

# React 프론트엔드 연결을 위한 CORS 설정
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 관리자용 API ---

@app.post("/courses", response_model=schemas.Course, status_code=status.HTTP_201_CREATED)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.post("/students", response_model=schemas.Student, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    # 이메일 중복 체크
    db_student = db.query(models.Student).filter(models.Student.email == student.email).first()
    if db_student:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
    
    new_student = models.Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

@app.get("/admin/enrollments")
def get_admin_enrollments(db: Session = Depends(get_db)):
    # 모든 강의를 가져오면서 연결된 신청 내역과 학생 정보를 함께 가져옵니다.
    courses = db.query(models.Course).all()
    result = []
    for course in courses:
        enrollments = db.query(models.Enrollment).filter(models.Enrollment.course_id == course.id).all()
        students = []
        for idx, en in enumerate(enrollments, 1):
            student = db.query(models.Student).filter(models.Student.id == en.student_id).first()
            if student:
                students.append({
                    "no": idx,
                    "name": student.name
                })
        result.append({
            "course_title": course.title,
            "students": students
        })
    return result

# --- 학생용 API ---

@app.get("/students", response_model=List[schemas.Student])
def read_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@app.get("/courses", response_model=List[schemas.Course])
def read_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@app.post("/enroll", response_model=schemas.Enrollment, status_code=status.HTTP_201_CREATED)
def enroll_course(enroll: schemas.EnrollmentCreate, db: Session = Depends(get_db)):
    # 1. 학생 및 강의 존재 여부 확인
    student = db.query(models.Student).filter(models.Student.id == enroll.student_id).first()
    course = db.query(models.Course).filter(models.Course.id == enroll.course_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="존재하지 않는 학생입니다.")
    if not course:
        raise HTTPException(status_code=404, detail="존재하지 않는 강의입니다.")

    # 2. 중복 신청 방지 방어 코드 (PRD 요구사항)
    existing_enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == enroll.student_id,
        models.Enrollment.course_id == enroll.course_id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="이미 신청한 강의입니다."
        )

    # 3. 수강 인원 초과 확인 (보안 및 방어 코드 추가)
    current_enrollments_count = db.query(models.Enrollment).filter(models.Enrollment.course_id == enroll.course_id).count()
    if current_enrollments_count >= course.max_students:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"수강 인원이 초과되었습니다. (최대 {course.max_students}명)"
        )
    
    # 4. 수강 신청 진행
    new_enrollment = models.Enrollment(
        student_id=enroll.student_id,
        course_id=enroll.course_id
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
