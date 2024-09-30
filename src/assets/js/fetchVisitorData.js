import axios from 'axios'; // axios 임포트
const API_URL = import.meta.env.VITE_API_URL;

export const fetchVisitorData = async (selectedRange, visitorCount, visitorCountMonth, updateChart) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found in local storage.');
      return;
    }

    // 엔드포인트를 컨트롤러에 맞게 수정
    const endpoint = selectedRange.value === 'daily'  // selectedRange가 'daily'일 경우
      ? `${API_URL}/api/v1/dailyVisitors`
      : `${API_URL}/api/v1/monthlyVisitors`;  // 'monthly'일 경우

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (selectedRange.value === 'daily') {
      // 일일 방문자 데이터 처리
      if (Array.isArray(response.data)) {
        visitorCount.value = response.data;
      } else {
        console.error('Invalid data format for daily visitors:', response.data);
      }
    } else {
      // 월별 방문자 데이터 처리
      if (Array.isArray(response.data)) {
        visitorCountMonth.value = response.data;
      } else {
        console.error('Invalid data format for monthly visitors:', response.data);
      }
    }

    // 차트 업데이트
    updateChart(selectedRange, visitorCount, visitorCountMonth);
  } catch (error) {
    console.error('Failed to fetch visitor data:', error.message || error);
  }
};
