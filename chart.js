// Inisialisasi chart RSI
function initRSIChart() {
    const ctx = document.getElementById('rsiChart').getContext('2d');
    
    // Data dummy - dalam implementasi nyata, Anda akan mengambil data dari API
    const labels = [];
    const rsiValues = [];
    
    // Generate data dummy untuk 14 hari
    for (let i = 0; i < 14; i++) {
        labels.push(`Hari ${i + 1}`);
        rsiValues.push(Math.random() * 30 + 30); // RSI antara 30-60
    }
    
    // Update current RSI display
    document.getElementById('current-rsi').textContent = rsiValues[rsiValues.length - 1].toFixed(2);
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'RSI (14)',
                data: rsiValues,
                borderColor: 'var(--primary-color)',
                backgroundColor: 'rgba(210, 105, 30, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'var(--text-color)'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 70,
                            yMax: 70,
                            borderColor: 'var(--danger-color)',
                            borderWidth: 1,
                            label: {
                                content: 'Overbought',
                                enabled: true,
                                position: 'left'
                            }
                        },
                        line2: {
                            type: 'line',
                            yMin: 30,
                            yMax: 30,
                            borderColor: 'var(--success-color)',
                            borderWidth: 1,
                            label: {
                                content: 'Oversold',
                                enabled: true,
                                position: 'left'
                            }
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 3,
                    hoverRadius: 5
                }
            }
        }
    });
}

// Inisialisasi chart MA
function initMAChart() {
    const ctx = document.getElementById('maChart').getContext('2d');
    
    // Data dummy - dalam implementasi nyata, Anda akan mengambil data dari API
    const labels = [];
    const ma50Values = [];
    const ma200Values = [];
    const priceValues = [];
    
    // Generate data dummy untuk 200 hari
    for (let i = 0; i < 200; i++) {
        labels.push(`Hari ${i + 1}`);
        
        // Harga acak dengan sedikit tren naik
        const basePrice = 500000000 + i * 1000000;
        const randomFactor = Math.random() * 20000000 - 10000000;
        priceValues.push(basePrice + randomFactor);
        
        // MA 50 (hitung rata-rata 50 hari terakhir)
        if (i >= 49) {
            const sum50 = priceValues.slice(i - 49, i + 1).reduce((a, b) => a + b, 0);
            ma50Values.push(sum50 / 50);
        } else {
            ma50Values.push(null);
        }
        
        // MA 200 (hitung rata-rata 200 hari terakhir)
        if (i >= 199) {
            const sum200 = priceValues.slice(i - 199, i + 1).reduce((a, b) => a + b, 0);
            ma200Values.push(sum200 / 200);
        } else {
            ma200Values.push(null);
        }
    }
    
    // Hanya tampilkan 50 data terakhir untuk tampilan yang lebih baik
    const displayCount = 50;
    const displayLabels = labels.slice(-displayCount);
    const displayMA50 = ma50Values.slice(-displayCount);
    const displayMA200 = ma200Values.slice(-displayCount);
    const displayPrices = priceValues.slice(-displayCount);
    
    // Update current MA displays
    document.getElementById('ma-50').textContent = `Rp ${displayMA50[displayMA50.length - 1].toLocaleString('id-ID')}`;
    document.getElementById('ma-200').textContent = `Rp ${displayMA200[displayMA200.length - 1].toLocaleString('id-ID')}`;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: displayLabels,
            datasets: [
                {
                    label: 'Harga BTC',
                    data: displayPrices,
                    borderColor: 'var(--text-color)',
                    backgroundColor: 'rgba(224, 224, 224, 0.1)',
                    borderWidth: 1,
                    tension: 0.1
                },
                {
                    label: 'MA 50',
                    data: displayMA50,
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(210, 105, 30, 0.1)',
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: 'MA 200',
                    data: displayMA200,
                    borderColor: 'var(--secondary-color)',
                    backgroundColor: 'rgba(73, 121, 107, 0.1)',
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return `Rp ${value.toLocaleString('id-ID')}`;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'var(--text-color)'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += `Rp ${context.parsed.y.toLocaleString('id-ID')}`;
                            }
                            return label;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                point: {
                    radius: 0 // Hilangkan titik untuk tampilan yang lebih bersih
                }
            }
        }
    });
}

// Inisialisasi chart harga utama di halaman statistik
function initPriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Data dummy - dalam implementasi nyata, Anda akan mengambil data dari API
    const labels = [];
    const prices = [];
    
    // Generate data dummy untuk 30 hari
    for (let i = 0; i < 30; i++) {
        labels.push(`${i + 1} Jan`);
        
        // Harga dengan sedikit volatilitas
        const basePrice = 500000000;
        const trend = i * 1000000;
        const randomFactor = Math.random() * 30000000 - 15000000;
        prices.push(basePrice + trend + randomFactor);
    }
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Harga BTC/IDR',
                data: prices,
                borderColor: 'var(--primary-color)',
                backgroundColor: 'rgba(210, 105, 30, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return `Rp ${value.toLocaleString('id-ID')}`;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'var(--text-color)'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += `Rp ${context.parsed.y.toLocaleString('id-ID')}`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Inisialisasi semua chart yang diperlukan saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('rsiChart')) {
        initRSIChart();
    }
    
    if (document.getElementById('maChart')) {
        initMAChart();
    }
    
    if (document.getElementById('priceChart')) {
        initPriceChart();
    }
});
