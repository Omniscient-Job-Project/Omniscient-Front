import Chart from 'chart.js/auto';
import { ref } from 'vue';

const chartInstance = ref(null);

export const updateChart = (selectedRange, visitorCount, visitorCountMonth) => {
    const ctx = document.getElementById('visitorsChart').getContext('2d');
    
    if (!ctx) {
        console.error('Chart context is not available.');
        return;
    }

    // 기존 차트 인스턴스가 존재하면 파괴
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    const labels = selectedRange.value === 'daily'
        ? Array.from({ length: 31 }, (_, i) => `${i + 1}일`)
        : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    const data = selectedRange.value === 'daily' ? visitorCount.value : visitorCountMonth.value;

    if (!Array.isArray(data)) {
        console.error('Visitor data is not an array:', data);
        return;
    }

    // 새로운 차트 생성
    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '방문자수',
                data: data,
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
};
