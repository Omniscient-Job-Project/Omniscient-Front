import axios from 'axios';

// 'todayVisitorCount'는 Vue의 ref 객체로 가정
export const fetchTodayVisitorCount = async (todayVisitorCount) => {
    try {
        const response = await axios.get('http://localhost:8090/api/v1/visitor-today'); // 올바른 API 엔드포인트로 수정
        todayVisitorCount.value = response.data.count || response.data; 
    } catch (error) {
        console.error('Failed to fetch today visitor count:', error);
    }
};
