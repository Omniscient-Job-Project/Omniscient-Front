// src/assets/js/fetchUserCount.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // 환경 변수에서 API_URL 가져오기

export async function fetchUserCount() {
    try {
        const response = await axios.get(`${API_URL}/api/v1/user/user-count`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data; // 데이터 반환
    } catch (error) {
        console.error('회원 수를 가져오는 중 오류 발생:', error);
        return 0; // 오류 발생 시 기본값 반환
    }
}
