import axios from 'axios';

export const fetchTodayVisitorCount = async (visitorCountRef) => {
  try {
    const response = await axios.get('/api/v1/todayVisitor', {
      headers: {
        Authorization: `Bearer 7a51575042706f7733376b565a4e64` // 필요한 경우 인증 토큰을 추가
      }
    });
    visitorCountRef.value = response.data.todayVisitorCount;
  } catch (error) {
    console.error('Failed to fetch today\'s visitor count:', error);
  }
};
