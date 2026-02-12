import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <h1 className="title">수강 신청 시스템</h1>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <button
                    className="card btn"
                    style={{ width: '250px', height: '200px', fontSize: '1.5rem', cursor: 'pointer' }}
                    onClick={() => navigate('/admin')}
                >
                    🔑 관리자 모드
                </button>
                <button
                    className="card btn"
                    style={{ width: '250px', height: '200px', fontSize: '1.5rem', cursor: 'pointer' }}
                    onClick={() => navigate('/student')}
                >
                    🎓 학생 모드
                </button>
            </div>
        </div>
    );
}

export default Home;
