export const fetchVisitorData = async (selectedRange, visitorCount, visitorCountMonth, updateChart) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No authorization token found in local storage.');
      return;
    }

    const endpoint = selectedRange.value === 'daily' 
      ? `${API_URL}/api/v1/dailyVisitors` 
      : `${API_URL}/api/v1/monthlyVisitors`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (selectedRange.value === 'daily') {
      if (Array.isArray(response.data)) {
        visitorCount.value = Array(31).fill(0);  // 31일로 초기화
        response.data.forEach(visitor => {
          const day = new Date(visitor.visitDate).getDate();
          if (day >= 1 && day <= 31) {
            visitorCount.value[day - 1] = visitor.visitCount;  // 해당 날짜의 방문자 수 할당
          }
        });
      } else {
        console.error('Expected an array but got:', typeof response.data);
      }
    } else if (selectedRange.value === 'monthly') {
      if (Array.isArray(response.data) && response.data.length === 12) {  // 12개월 데이터 확인
        visitorCountMonth.value = response.data;  // 월별 데이터 할당
      } else {
        console.error('Expected an array with 12 items but got:', response.data);
      }
    }

    updateChart();  // 차트 업데이트
  } catch (error) {
    console.error('Failed to fetch visitor data:', error.message || error);
  }
};
