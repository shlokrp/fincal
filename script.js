document.getElementById('calculate-btn').addEventListener('click', function() {
    const age = document.getElementById('age').value;
    const corpus = parseInt(document.getElementById('corpus').value);
    const risk = document.getElementById('risk').value;
    const time = parseInt(document.getElementById('time').value);

    let equityPercentage, fixedIncomePercentage;

    // Base risk percentages
    switch(risk) {
        case 'Very Aggressive':
            equityPercentage = 90;
            fixedIncomePercentage = 10;
            break;
        case 'Aggressive':
            equityPercentage = 75;
            fixedIncomePercentage = 25;
            break;
        case 'Moderate':
            equityPercentage = 60;
            fixedIncomePercentage = 40;
            break;
        case 'Conservative':
            equityPercentage = 40;
            fixedIncomePercentage = 60;
            break;
        case 'Very Conservative':
            equityPercentage = 25;
            fixedIncomePercentage = 75;
            break;
    }

    // // Adjust risk based on age
    // switch(age) {
    //     case '<30':
    //         equityPercentage = Math.min(equityPercentage + 10, 100);
    //         fixedIncomePercentage = 100 - equityPercentage;
    //         break;
    //     case '30-40':
    //         equityPercentage = Math.min(equityPercentage + 5, 100);
    //         fixedIncomePercentage = 100 - equityPercentage;
    //         break;
    //     case '40-50':
    //         // No change
    //         break;
    //     case '50-60':
    //         equityPercentage = Math.max(equityPercentage - 5, 0);
    //         fixedIncomePercentage = 100 - equityPercentage;
    //         break;
    //     case '>60':
    //         equityPercentage = Math.max(equityPercentage - 10, 0);
    //         fixedIncomePercentage = 100 - equityPercentage;
    //         break;
    // }

    updatePieChart(equityPercentage, fixedIncomePercentage, corpus, time);
    calculateAndDisplayFinalAmount(corpus, equityPercentage, fixedIncomePercentage, time);

    document.getElementById('result').classList.remove('hidden');
});

function updatePieChart(equityPercentage, fixedIncomePercentage, corpus, time) {
    const equityGrowthRate = 1.15;
    const fixedIncomeGrowthRate = 1.07;

    const equityCorpus = corpus * (Math.pow(equityGrowthRate, time) * (equityPercentage / 100));
    const fixedIncomeCorpus = corpus * (Math.pow(fixedIncomeGrowthRate, time) * (fixedIncomePercentage / 100));

    const ctx = document.getElementById('pie-chart').getContext('2d');

    const chartData = {
        labels: [
            `Fixed Income Asset Class (${fixedIncomePercentage}%)`,
            `Equity Asset Class (${equityPercentage}%)`
        ],
        datasets: [{
            data: [fixedIncomeCorpus, equityCorpus],
            backgroundColor: ['#FF6384', '#36A2EB'],
        }]
    };

    updateOrCreateChart(ctx, chartData);
}

function updateOrCreateChart(ctx, chartData) {
    if (window.myPieChart != undefined) {
        window.myPieChart.data.datasets[0].data = chartData.datasets[0].data;
        window.myPieChart.data.labels = chartData.labels;
        window.myPieChart.update();
    } else {
        window.myPieChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ₹${tooltipItem.raw.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

function calculateAndDisplayFinalAmount(corpus, equityPercentage, fixedIncomePercentage, time) {
    const equityGrowthRate = 1.15;
    const fixedIncomeGrowthRate = 1.07;

    const finalCorpus = corpus * (Math.pow(equityGrowthRate, time) * (equityPercentage / 100) + Math.pow(fixedIncomeGrowthRate, time) * (fixedIncomePercentage / 100));

    const finalAmount = finalCorpus.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    document.getElementById('final-amount').innerText = `${finalAmount}`;
}
