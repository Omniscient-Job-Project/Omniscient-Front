import { ref, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const chartInstance = ref(null); // 차트 인스턴스를 전역적으로 선언

export const updateChart = async (selectedRange, visitorCount, visitorCountMonth) => {
    await nextTick(); // DOM이 완전히 렌더링된 후 실행

    const canvasElement = document.getElementById('visitorsChart');
    if (!canvasElement) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
        console.error('Chart context is not available.');
        return;
    }

    // 차트 인스턴스가 이미 있다면 파괴
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    // 기본값 설정
    const rangeValue = selectedRange?.value || 'daily'; // selectedRange가 undefined일 경우 기본값 설정
    const labels = rangeValue === 'daily'
        ? Array.from({ length: 31 }, (_, i) => `${i + 1}일`)
        : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // visitorCount와 visitorCountMonth에 대한 기본값 설정
    const data = Array.isArray(visitorCount?.value) ? visitorCount.value : [];
    const monthlyData = Array.isArray(visitorCountMonth?.value) ? visitorCountMonth.value : [];

    if (!Array.isArray(data)) {
        console.error('Visitor data is not an array:', data);
        return;
    }

    try {
        // 새로운 차트 인스턴스 생성
        chartInstance.value = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '방문자수',
                    data: rangeValue === 'daily' ? data : monthlyData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
        console.log('Chart instance created:', chartInstance.value);
    } catch (error) {
        console.error('Error creating chart:', error);
    }
};
