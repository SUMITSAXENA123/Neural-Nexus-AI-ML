document.addEventListener('DOMContentLoaded', function() {
    // Initialize with static data
    updateStaticDashboard();

    // Add event listener for apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default action
            applyFilters();
        });
    }
});

function updateStaticDashboard() {
    // Update metrics
    document.getElementById('total-transactions').textContent = '525,461';
    document.getElementById('total-fraud').textContent = '26,228';
    document.getElementById('fraud-rate').textContent = '4.99%';
    document.getElementById('total-amount').textContent = '2009 - 2010';

    // Update high risk customer details
    document.getElementById('risk-customer-id').textContent = '15311';
    document.getElementById('risk-country').textContent = 'United Kingdom';
    document.getElementById('risk-transactions').textContent = '34';
    document.getElementById('risk-score').textContent = '70/100';

    // Update anomaly metrics
    document.getElementById('anomaly-rate').textContent = '2.5%';
    document.getElementById('total-anomalies').textContent = '50';
    document.getElementById('amount-at-risk').textContent = '£12,500';
    document.getElementById('countries-affected').textContent = '4';
    
    // Update 24h stats
    document.getElementById('transactions-24h').textContent = '120';
    document.getElementById('anomalies-24h').textContent = '4';
    document.getElementById('amount-24h').textContent = '£10,200';

    // Update anomaly insights text
    const anomalyInsightsContainer = document.createElement('div');
    anomalyInsightsContainer.className = 'anomaly-insights-text mt-4 p-3 rounded';
    anomalyInsightsContainer.style.backgroundColor = 'rgba(255, 99, 132, 0.1)';
    anomalyInsightsContainer.style.border = '1px solid rgba(255, 99, 132, 0.2)';
    anomalyInsightsContainer.style.borderLeft = '4px solid rgb(255, 99, 132)';
    
    anomalyInsightsContainer.innerHTML = `
        <div class="d-flex align-items-start">
            <i class="fas fa-exclamation-triangle me-2" style="color: rgb(255, 99, 132);"></i>
            <p class="mb-0" style="color: #444; line-height: 1.5;">
                Multiple anomalies detected in transaction amounts, primarily involving customers from 
                <span class="fw-bold text-danger">high-risk countries</span>. 
                These anomalies often occur during 
                <span class="fw-bold text-danger">weekends</span>.
            </p>
        </div>
    `;

    // Find the anomaly metrics container and append the insights
    const anomalyMetricsContainer = document.querySelector('.anomaly-metrics');
    if (anomalyMetricsContainer) {
        anomalyMetricsContainer.appendChild(anomalyInsightsContainer);
    }

    // Populate recent alerts
    const alertList = document.getElementById('recent-alerts');
    if (alertList) {
        alertList.innerHTML = `
            <div class="alert-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Customer 15311</strong>
                        <span class="text-muted ms-2">United Kingdom</span>
                    </div>
                    <span class="badge bg-danger">£5,200</span>
                </div>
                <div class="text-muted small">Today, 14:30</div>
                <div class="d-flex justify-content-between mt-1">
                    <small>Quantity: 12</small>
                    <small class="text-danger">Risk Score: 85/100</small>
                </div>
            </div>
            <div class="alert-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Customer 12456</strong>
                        <span class="text-muted ms-2">France</span>
                    </div>
                    <span class="badge bg-warning">£3,400</span>
                </div>
                <div class="text-muted small">Today, 12:15</div>
                <div class="d-flex justify-content-between mt-1">
                    <small>Quantity: 8</small>
                    <small class="text-warning">Risk Score: 65/100</small>
                </div>
            </div>
        `;
    }

    // Populate country dropdown with static data
    const countrySelect = document.getElementById('country-filter');
    const countries = [
        'United Kingdom', 'Germany', 'Brazil', 'Australia', 'France',
        'Spain', 'Netherlands', 'Japan', 'Belgium', 'Portugal', 'Greece'
    ];
    
    countrySelect.innerHTML = '<option value="">All Countries</option>';
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    // Create static charts
    createStaticCharts();

    // Initialize date range picker with type selection
    initializeDateRangePicker();
}

function createStaticCharts() {
    // Common layout settings
    const commonLayout = {
        paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
        plot_bgcolor: 'rgba(248, 249, 250, 0.5)',
        height: 400,  // Increased height
        margin: { t: 40, b: 40, l: 40, r: 40 },
        font: {
            family: 'Arial, sans-serif',
            size: 12,
            color: '#444'
        },
        title: {
            font: {
                size: 16,
                color: '#1a237e',
                weight: 600
            },
            y: 0.95
        }
    };

    // Fraud by Country Chart
    const fraudByCountryData = {
        labels: ['United Kingdom', 'France', 'Germany', 'Spain'],
        values: [5.4, 4.8, 3.9, 4.5]
    };

    Plotly.newPlot('fraud-by-country', [{
        x: fraudByCountryData.labels,
        y: fraudByCountryData.values,
        type: 'bar',
        marker: {
            color: 'rgb(255, 99, 132)',
            opacity: 0.8,
            gradient: {
                type: 'vertical',
                color: ['rgb(255, 99, 132)', 'rgb(255, 150, 170)']
            }
        },
        hovertemplate: '<b>%{x}</b><br>Fraud Rate: %{y}%<extra></extra>'
    }], {
        ...commonLayout,
        title: 'Fraud Rate by Country (%)',
        xaxis: {
            title: 'Country',
            tickangle: -45,
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: 'Fraud Rate (%)',
            gridcolor: 'rgba(0,0,0,0.1)'
        }
    });

    // Amount Distribution Chart
    const amountData = {
        labels: ['Fraudulent', 'Non-Fraudulent'],
        values: [26000, 500000]
    };

    Plotly.newPlot('amount-distribution', [{
        labels: amountData.labels,
        values: amountData.values,
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)']
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>Amount: £%{value:,.0f}<br>(%{percent})<extra></extra>'
    }], {
        ...commonLayout,
        title: 'Amount Distribution',
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.1
        }
    });

    // Transaction Timeline
    const timelineData = {
        x: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        y: [20, 15, 25, 30, 20, 10]
    };

    Plotly.newPlot('transactions-over-time', [{
        x: timelineData.x,
        y: timelineData.y,
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: 'rgb(75, 192, 192)',
            width: 3,
            shape: 'spline'
        },
        marker: {
            size: 8,
            color: 'rgb(75, 192, 192)',
            line: {
                color: 'white',
                width: 2
            }
        },
        fill: 'tonexty',
        fillcolor: 'rgba(75, 192, 192, 0.1)',
        hovertemplate: '<b>Time: %{x}</b><br>Transactions: %{y}<extra></extra>'
    }], {
        ...commonLayout,
        title: 'Transaction Timeline',
        xaxis: {
            title: 'Time of Day',
            showgrid: true,
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: 'Number of Transactions',
            showgrid: true,
            gridcolor: 'rgba(0,0,0,0.1)'
        }
    });

    // Fraud Categories
    const categoriesData = {
        labels: ['Phishing Attacks', 'Fake Refunds', 'Identity Theft'],
        values: [40, 35, 25]
    };

    Plotly.newPlot('fraud-categories', [{
        labels: categoriesData.labels,
        values: categoriesData.values,
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)'
            ]
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>Cases: %{value}<br>(%{percent})<extra></extra>'
    }], {
        ...commonLayout,
        title: 'Top Fraud Categories',
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.1
        }
    });
}

// Initialize date range picker with type selection
function initializeDateRangePicker() {
    const dateRangeInput = $('#date-range');
    const dateRangeType = $('#date-range-type');

    const dateRangeOptions = {
        showDropdowns: true,
        minYear: 2009,
        maxYear: 2024,
        opens: 'left',
        autoUpdateInput: false,
        minDate: '01/01/2009',
        maxDate: '12/31/2024',
        locale: {
            format: 'MM/DD/YYYY',
            cancelLabel: 'Clear'
        },
        ranges: {
            'This Week': [moment().startOf('week'), moment().endOf('week')],
            'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')],
            'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        }
    };

    // Initialize daterangepicker
    dateRangeInput.daterangepicker(dateRangeOptions);

    // Handle date range type changes
    dateRangeType.on('change', function() {
        const selectedType = $(this).val();
        let start, end;

        switch(selectedType) {
            case 'week':
                start = moment().startOf('week');
                end = moment().endOf('week');
                break;
            case 'month':
                start = moment().startOf('month');
                end = moment().endOf('month');
                break;
            case 'year':
                start = moment().startOf('year');
                end = moment().endOf('year');
                break;
            case 'custom':
                dateRangeInput.data('daterangepicker').show();
                return;
        }

        dateRangeInput.data('daterangepicker').setStartDate(start);
        dateRangeInput.data('daterangepicker').setEndDate(end);
        dateRangeInput.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    });

    // Handle date selection
    dateRangeInput.on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
        // Set type to custom when manually selecting dates
        dateRangeType.val('custom');
    });

    // Handle clear button
    dateRangeInput.on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    // Handle reset button
    $('#reset-dates').on('click', function() {
        dateRangeInput.val('');
        dateRangeType.val('week');
    });
}

// Update the applyFilters function
function applyFilters() {
    const country = document.getElementById('country-filter').value;
    const dateRange = document.getElementById('date-range').value;
    
    if (!country && !dateRange) {
        alert('Please select at least one filter (Country or Date Range)');
        return;
    }
    
    // Create URL with query parameters
    const queryParams = new URLSearchParams({
        country: country,
        date_range: dateRange
    });
    
    // Open in new tab and ensure it opens
    const url = `/analysis-report?${queryParams.toString()}`;
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
        newWindow.focus();
    } else {
        // If popup is blocked, try opening in current tab
        window.location.href = url;
    }
}
  