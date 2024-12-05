document.addEventListener('DOMContentLoaded', function() {
    // Get filter values from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get('country');
    const dateRange = urlParams.get('date_range');

    // Generate data based on filters
    const analysisData = generateAnalysisData(country, dateRange);
    
    // Create all charts with the generated data
    createAnalysisCharts(analysisData);
});

function generateAnalysisData(country, dateRange) {
    // Generate dummy data based on country and date range
    return {
        transactions: Array.from({length: 30}, (_, i) => ({
            date: new Date(2024, 0, i + 1),
            amount: Math.random() * 10000 + 1000,
            isfraud: Math.random() > 0.95
        })),
        fraudStats: {
            totalTransactions: 1000,
            fraudulentTransactions: 50,
            normalTransactions: 950,
            averageAmount: 5000
        },
        hourlyPattern: Array.from({length: 24}, (_, hour) => ({
            hour: hour,
            count: Math.floor(Math.random() * 100) + 20
        })),
        categories: [
            { name: 'Electronics', amount: 45000, fraudRate: 5.2 },
            { name: 'Clothing', amount: 32000, fraudRate: 3.8 },
            { name: 'Travel', amount: 28000, fraudRate: 4.5 },
            { name: 'Services', amount: 15000, fraudRate: 6.1 }
        ]
    };
}

function createAnalysisCharts(data) {
    const commonLayout = {
        paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
        plot_bgcolor: 'rgba(248, 249, 250, 0.5)',
        height: 400,
        margin: { t: 40, b: 40, l: 40, r: 40 },
        font: {
            family: 'Arial, sans-serif',
            size: 12,
            color: '#444'
        }
    };

    // Line Chart - Transaction Volume
    Plotly.newPlot('line-chart', [{
        x: data.transactions.map(t => t.date),
        y: data.transactions.map(t => t.amount),
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: 'rgb(75, 192, 192)', width: 2 },
        name: 'Transaction Amount'
    }], {
        ...commonLayout,
        title: 'Transaction Volume Over Time',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Amount (£)' }
    });

    // Histogram - Amount Distribution
    Plotly.newPlot('histogram', [{
        x: data.transactions.map(t => t.amount),
        type: 'histogram',
        nbinsx: 20,
        marker: { color: 'rgba(75, 192, 192, 0.7)' }
    }], {
        ...commonLayout,
        title: 'Transaction Amount Distribution',
        xaxis: { title: 'Amount (£)' },
        yaxis: { title: 'Frequency' }
    });

    // ROC Curve
    const fpr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    const tpr = fpr.map(x => Math.min(x * 1.2, 1));

    Plotly.newPlot('roc-curve', [{
        x: fpr,
        y: tpr,
        type: 'scatter',
        mode: 'lines',
        name: 'ROC Curve',
        line: { color: 'rgb(255, 99, 132)' }
    }], {
        ...commonLayout,
        title: 'ROC Curve (AUC = 0.85)',
        xaxis: { title: 'False Positive Rate' },
        yaxis: { title: 'True Positive Rate' }
    });

    // Heatmap - Transaction Patterns
    const hours = Array.from({length: 24}, (_, i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const heatmapData = days.map(() => 
        hours.map(() => Math.floor(Math.random() * 100))
    );

    Plotly.newPlot('heatmap', [{
        z: heatmapData,
        x: hours,
        y: days,
        type: 'heatmap',
        colorscale: 'Viridis'
    }], {
        ...commonLayout,
        title: 'Transaction Patterns by Day and Hour'
    });

    // Scatter Plot
    Plotly.newPlot('scatter-plot', [{
        x: data.hourlyPattern.map(h => h.hour),
        y: data.hourlyPattern.map(h => h.count),
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 10,
            color: data.hourlyPattern.map(h => h.count),
            colorscale: 'Viridis',
            showscale: true
        }
    }], {
        ...commonLayout,
        title: 'Transaction Amount vs Time',
        xaxis: { title: 'Hour of Day' },
        yaxis: { title: 'Number of Transactions' }
    });

    // Box Plot
    const boxPlotData = ['Normal', 'Suspicious', 'Fraudulent'].map(category => ({
        y: Array.from({length: 100}, () => Math.random() * 1000),
        type: 'box',
        name: category
    }));

    Plotly.newPlot('box-plot', boxPlotData, {
        ...commonLayout,
        title: 'Transaction Amount Distribution by Category',
        yaxis: { title: 'Amount (£)' }
    });

    // CUSUM Chart
    const cusumData = data.transactions.reduce((acc, curr) => {
        const last = acc.length > 0 ? acc[acc.length - 1] : 0;
        acc.push(last + (curr.amount - data.fraudStats.averageAmount));
        return acc;
    }, []);

    Plotly.newPlot('cusum-chart', [{
        y: cusumData,
        type: 'scatter',
        mode: 'lines',
        line: { color: 'rgb(255, 159, 64)' }
    }], {
        ...commonLayout,
        title: 'Cumulative Sum Analysis',
        xaxis: { title: 'Transaction Sequence' },
        yaxis: { title: 'Cumulative Sum' }
    });

    // Pie Chart
    Plotly.newPlot('pie-chart', [{
        values: data.categories.map(c => c.amount),
        labels: data.categories.map(c => c.name),
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ]
        },
        textinfo: 'label+percent'
    }], {
        ...commonLayout,
        title: 'Transaction Categories Distribution'
    });
}