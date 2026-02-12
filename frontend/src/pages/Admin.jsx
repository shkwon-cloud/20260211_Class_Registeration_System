import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
    const [course, setCourse] = useState({ title: '', instructor: '', max_students: 20 });
    const [student, setStudent] = useState({ name: '', email: '' });
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await axios.get('http://localhost:8000/admin/enrollments');
            setRegistrations(res.data);
        } catch (err) {
            console.error("Failed to fetch registrations:", err);
        }
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/courses', course);
            alert('강의 개설 완료!');
            setCourse({ title: '', instructor: '', max_students: 20 });
            fetchRegistrations();
        } catch (err) {
            alert('강의 개설 실패: ' + (err.response?.data?.detail || err.message));
        }
    };

    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/students', student);
            alert('학생 등록 완료!');
            setStudent({ name: '', email: '' });
            fetchRegistrations();
        } catch (err) {
            alert('학생 등록 실패: ' + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            <h1 className="title">관리자 대시보드</h1>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                {/* 강의 개설 폼 */}
                <div className="card">
                    <h2>📚 강의 개설</h2>
                    <form onSubmit={handleCourseSubmit}>
                        <div className="input-group">
                            <label className="input-label">강의명</label>
                            <input
                                className="input-field"
                                value={course.title}
                                onChange={e => setCourse({ ...course, title: e.target.value })}
                                placeholder="예: Python 프로그래밍"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">담당 강사</label>
                            <input
                                className="input-field"
                                value={course.instructor}
                                onChange={e => setCourse({ ...course, instructor: e.target.value })}
                                placeholder="예: 홍길동"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">수강 정원</label>
                            <input
                                className="input-field"
                                type="number"
                                value={course.max_students}
                                onChange={e => setCourse({ ...course, max_students: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>개설하기</button>
                    </form>
                </div>

                {/* 학생 등록 폼 */}
                <div className="card">
                    <h2>👤 학생 등록</h2>
                    <form onSubmit={handleStudentSubmit}>
                        <div className="input-group">
                            <label className="input-label">이름</label>
                            <input
                                className="input-field"
                                value={student.name}
                                onChange={e => setStudent({ ...student, name: e.target.value })}
                                placeholder="예: 이몽룡"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">이메일</label>
                            <input
                                className="input-field"
                                type="email"
                                value={student.email}
                                onChange={e => setStudent({ ...student, email: e.target.value })}
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '55px' }}>등록하기</button>
                    </form>
                </div>

                {/* 수강신청 현황 */}
                <div className="card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <h2>📊 수강신청 현황</h2>
                    {registrations.map((reg, idx) => (
                        <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: '#818cf8', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                                {reg.course_title}
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: '0.9rem' }}>
                                        <th style={{ padding: '0.5rem', width: '20%' }}>No.</th>
                                        <th style={{ padding: '0.5rem' }}>학생 이름</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reg.students.map((s, sIdx) => (
                                        <tr key={sIdx} style={{ borderBottom: '1px solid #1e293b' }}>
                                            <td style={{ padding: '0.5rem' }}>{s.no}</td>
                                            <td style={{ padding: '0.5rem' }}>{s.name}</td>
                                        </tr>
                                    ))}
                                    {reg.students.length === 0 && (
                                        <tr>
                                            <td colSpan="2" style={{ padding: '1rem', textAlign: 'center', color: '#475569' }}>
                                                신청 인원이 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ))}
                    {registrations.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#475569' }}>등록된 강의가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;
