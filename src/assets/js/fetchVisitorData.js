import axios from 'axios';

export const fetchVisitorData = async (selectedRange, visitorCount, visitorCountMonth, updateChart) => {
    try {
        let response;
        const endpoint = selectedRange.value === 'daily' ? '/api/dailyVisitors' : '/api/monthlyVisitors'; // 적절한 API 엔드포인트 설정

        response = await axios.get(endpoint);

        if (selectedRange.value === 'daily') {
            if (Array.isArray(response.data)) {
                visitorCount.value = Array(31).fill(0); // 31일로 초기화
                response.data.forEach(visitor => {
                    const day = new Date(visitor.visitDate).getDate();
                    if (day >= 1 && day <= 31) { // 일(day)이 1과 31 사이인지 확인
                        visitorCount.value[day - 1] = visitor.visitCount;
                    }
                });
            } else {
                console.error('Expected an array but got:', typeof response.data);
            }
        } else if (selectedRange.value === 'monthly') {
            if (Array.isArray(response.data) && response.data.length === 12) { // 월별 데이터가 12개월인지 확인
                visitorCountMonth.value = response.data;
            } else {
                console.error('Expected an array with 12 items but got:', response.data);
            }
        }
        updateChart();
    } catch (error) {
        console.error('Failed to fetch visitor data:', error);
    }
};
