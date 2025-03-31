// Fungsi untuk memuat data harga Bitcoin dari API
async function fetchBitcoinPrice() {
    try {
        // Ganti dengan API yang sesuai (contoh: CoinGecko, Binance, dll)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr&include_24hr_change=true');
        const data = await response.json();
        
        // Update harga di halaman
        document.getElementById('current-price').textContent = `Rp ${data.bitcoin.idr.toLocaleString('id-ID')}`;
        
        // Update perubahan harga
        const change = data.bitcoin.idr_24h_change;
        document.getElementById('price-change').textContent = `${change.toFixed(2)}%`;
        document.getElementById('price-change').style.color = change >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
        
        // Update di semua halaman
        updateAllPriceDisplays(data.bitcoin.idr, change);
    } catch (error) {
        console.error('Gagal memuat data harga:', error);
        document.getElementById('current-price').textContent = 'Gagal memuat data';
    }
}

// Fungsi untuk update harga di semua halaman
function updateAllPriceDisplays(price, change) {
    const priceElements = document.querySelectorAll('.price-display');
    priceElements.forEach(element => {
        element.querySelector('#current-price').textContent = `Rp ${price.toLocaleString('id-ID')}`;
        
        const changeElement = element.querySelector('#price-change');
        if (changeElement) {
            changeElement.textContent = `${change.toFixed(2)}%`;
            changeElement.style.color = change >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
        }
    });
}

// Fungsi untuk memuat data statistik tambahan
async function fetchAdditionalStats() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false');
        const data = await response.json();
        
        // Update statistik 24 jam
        const marketData = data.market_data;
        document.getElementById('24h-high').textContent = `Rp ${marketData.high_24h.idr.toLocaleString('id-ID')}`;
        document.getElementById('24h-low').textContent = `Rp ${marketData.low_24h.idr.toLocaleString('id-ID')}`;
        document.getElementById('24h-volume').textContent = `${marketData.total_volume.btc.toLocaleString('id-ID')} BTC`;
        
        // Update ringkasan pasar
        document.getElementById('market-cap').textContent = `Rp ${marketData.market_cap.idr.toLocaleString('id-ID')}`;
        document.getElementById('circulating-supply').textContent = `${marketData.circulating_supply.toLocaleString('id-ID')} BTC`;
        
        // Update di halaman statistik harga
        updatePriceStatsPage(marketData);
    } catch (error) {
        console.error('Gagal memuat statistik tambahan:', error);
    }
}

// Fungsi untuk update halaman statistik harga
function updatePriceStatsPage(marketData) {
    const statsPage = document.querySelector('.price-stats-grid');
    if (statsPage) {
        statsPage.querySelector('#24h-high').textContent = `Rp ${marketData.high_24h.idr.toLocaleString('id-ID')}`;
        statsPage.querySelector('#24h-low').textContent = `Rp ${marketData.low_24h.idr.toLocaleString('id-ID')}`;
        statsPage.querySelector('#24h-volume').textContent = `${marketData.total_volume.btc.toLocaleString('id-ID')} BTC`;
        statsPage.querySelector('#24h-change').textContent = `${marketData.price_change_percentage_24h.toFixed(2)}%`;
        statsPage.querySelector('#24h-change').style.color = marketData.price_change_percentage_24h >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
    }
}

// Fungsi untuk toggle dark/light mode
function setupThemeToggle() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'light') {
            toggleSwitch.checked = true;
        }
    }
    
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme, false);
    }
}

// Fungsi untuk inisialisasi timeframes di halaman statistik
function setupTimeframes() {
    const timeframeBtns = document.querySelectorAll('.timeframe-btn');
    
    timeframeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeframeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Di sini Anda akan memuat data yang sesuai dengan timeframe yang dipilih
            const timeframe = btn.dataset.timeframe;
            loadPriceData(timeframe);
        });
    });
}

// Fungsi untuk memuat data harga berdasarkan timeframe
async function loadPriceData(timeframe) {
    // Implementasi aktual akan tergantung pada API yang digunakan
    console.log(`Memuat data untuk timeframe: ${timeframe}`);
    // Di sini Anda akan memanggil API dan mengupdate chart
}

// Fungsi untuk memuat data historis
async function loadHistoricalData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=idr&days=30');
        const data = await response.json();
        
        // Update tabel data historis
        updateHistoricalTable(data.prices);
    } catch (error) {
        console.error('Gagal memuat data historis:', error);
    }
}

// Fungsi untuk update tabel data historis
function updateHistoricalTable(prices) {
    const tableBody = document.getElementById('historical-data');
    if (!tableBody) return;
    
    // Kosongkan tabel
    tableBody.innerHTML = '';
    
    // Ambil 10 data terakhir untuk ditampilkan
    const recentPrices = prices.slice(-10);
    
    recentPrices.forEach(([timestamp, price]) => {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString('id-ID');
        const formattedPrice = `Rp ${price.toLocaleString('id-ID')}`;
        
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = formattedDate;
        
        const priceCell = document.createElement('td');
        priceCell.textContent = formattedPrice;
        
        // Hitung perubahan (sederhana, bisa diperbaiki dengan data lebih akurat)
        const prevPrice = prices[prices.findIndex(p => p[0] === timestamp) - 1]?.[1] || price;
        const change = ((price - prevPrice) / prevPrice) * 100;
        const changeFormatted = change.toFixed(2) + '%';
        
        const changeCell = document.createElement('td');
        changeCell.textContent = changeFormatted;
        changeCell.style.color = change >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
        
        // Volume dummy (API sebenarnya memerlukan endpoint berbeda)
        const volumeCell = document.createElement('td');
        volumeCell.textContent = (Math.random() * 1000).toFixed(2) + ' BTC';
        
        row.appendChild(dateCell);
        row.appendChild(priceCell);
        row.appendChild(changeCell);
        row.appendChild(volumeCell);
        
        tableBody.appendChild(row);
    });
}

// Fungsi untuk inisialisasi semua elemen interaktif
function initializeInteractiveElements() {
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup timeframes di halaman statistik
    if (document.querySelector('.timeframe-selector')) {
        setupTimeframes();
    }
    
    // Setup tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

// Fungsi untuk menampilkan tooltip
function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
}

// Fungsi untuk menyembunyikan tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Fungsi utama yang dijalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Memuat data harga Bitcoin
    fetchBitcoinPrice();
    
    // Memuat statistik tambahan
    fetchAdditionalStats();
    
    // Jika di halaman statistik, muat data historis
    if (document.getElementById('historical-data')) {
        loadHistoricalData();
    }
    
    // Inisialisasi elemen interaktif
    initializeInteractiveElements();
    
    // Perbarui data setiap 1 menit
    setInterval(fetchBitcoinPrice, 60000);
    setInterval(fetchAdditionalStats, 60000);
});
