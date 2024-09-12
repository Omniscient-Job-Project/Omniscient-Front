import Chart from 'chart.js/auto';

export const updateChart = (selectedRange, visitorCount, visitorCountMonth, chartInstance) => {
    const ctx = document.getElementById('visitorsChart').getContext('2d');
    
    if (!ctx) {
        console.error('Chart context is not available.');
        return;
    }
    
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    // 라벨과 데이터 설정
    const labels = selectedRange.value === 'daily'
        ? Array.from({ length: 31 }, (_, i) => `${i + 1}일`)
        : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    const data = selectedRange.value === 'daily' ? visitorCount.value : visitorCountMonth.value;

    if (!Array.isArray(data)) {
        console.error('Visitor data is not an array:', data);
        return;
    }

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
