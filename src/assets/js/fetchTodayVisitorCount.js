import axios from 'axios'; // axios 임포트

// 환경 변수에서 API_URL 가져오기
const API_URL = import.meta.env.VITE_API_URL;

export const fetchTodayVisitorCount = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found in local storage.');
      return 0;
    }

    const response = await axios.get(`${API_URL}/api/v1/todayVisitor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (typeof response.data === 'number') {
      return response.data; // 반환 값을 0으로 처리
    } else {
      console.error('Unexpected response format:', response.data);
      return 0; // 오류 시 기본값으로 0 반환
    }
  } catch (error) {
    console.error('Failed to fetch today\'s visitor count:', error.message || error);
    return 0;
  }
};

