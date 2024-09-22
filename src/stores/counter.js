import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL; // 환경 변수에서 API_URL 가져오기

export const fetchTodayVisitorCount = async (visitorCountRef) => {
  try {
    const token = localStorage.getItem('token');
    
    // 토큰이 존재하지 않는 경우 경고
    if (!token) {
      console.error('No authorization token found in local storage.');
      return;
    }

    const response = await axios.get(`${API_URL}/api/v1/todayVisitor`, {
      headers: {
        Authorization: `Bearer ${token}` // 로컬 스토리지에서 토큰 가져오기
      }
    });
    
    // 응답 데이터가 예상한 형식인지 확인
    if (response.data && typeof response.data.todayVisitorCount !== 'undefined') {
      visitorCountRef.value = response.data.todayVisitorCount;
    } else {
      console.error('Unexpected response format:', response.data);
    }
    
  } catch (error) {
    // 오류 메시지에 상세 정보를 포함
    console.error('Failed to fetch today\'s visitor count:', error.response ? error.response.data : error.message);
  }
};
