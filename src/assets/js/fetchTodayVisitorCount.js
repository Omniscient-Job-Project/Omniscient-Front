export const fetchTodayVisitorCount = async (visitorCountRef) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authorization token found in local storage.');
      return;
    }

    const response = await axios.get(`${API_URL}/api/v1/todayVisitor`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && typeof response.data.todayVisitorCount === 'number') {
      visitorCountRef.value = response.data.todayVisitorCount;  // 방문자 수 할당
    } else {
      console.error('Unexpected response format:', response.data);
    }

  } catch (error) {
    console.error('Failed to fetch today\'s visitor count:', error.response ? error.response.data : error.message);
  }
};
