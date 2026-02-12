import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Student() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [stuRes, couRes] = await Promise.all([
                axios.get('http://localhost:8000/students'),
                axios.get('http://localhost:8000/courses')
            ]);
            setStudents(stuRes.data);
            setCourses(couRes.data);
        } catch (err) {
            console.error("Data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        if (!selectedStudentId) {
            alert("학생을 먼저 선택해주세요!");
            return;
        }

        try {
            await axios.post('http://localhost:8000/enroll', {
                student_id: parseInt(selectedStudentId),
                course_id: courseId
            });
            alert("신청 완료!");
        } catch (err) {
            alert(err.response?.data?.detail || "신청에 실패했습니다.");
        }
    };

    if (loading) return <div className="container title">로딩 중...</div>;

    return (
        <div className="container">
            <h1 className="title">학생 수강 신청</h1>

            {/* 신분 선택 (Login Simulation) */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>🆔 신분 선택</h3>
                <select
                    className="input-field"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                    <option value="">-- 학생을 선택하세요 --</option>
                    {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                </select>
            </div>

            {/* 강의 목록 */}
            <div className="grid">
                {courses.map(course => (
                    <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ color: '#818cf8', marginTop: 0 }}>{course.title}</h2>
                            <p>📍 강사: {course.instructor}</p>
                            <p>👥 정원: {course.max_students}명</p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleEnroll(course.id)}
                        >
                            신청하기
                        </button>
                    </div>
                ))}
            </div>

            {courses.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    등록된 강의가 없습니다. 관리자 모드에서 강의를 개설해 주세요.
                </div>
            )}
        </div>
    );
}

export default Student;
