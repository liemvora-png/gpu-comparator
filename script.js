let gpuData = [];

async function loadGpuData() {
    try {
        const response = await fetch('gpu_data.json');
        if (!response.ok) {
            throw new Error('Failed to load GPU data');
        }
        gpuData = await response.json();
        renderCards(gpuData);
    } catch (error) {
        console.error('Error loading GPU data:', error);
        const comparisonSection = document.getElementById('comparison-section');
        if (comparisonSection) {
            comparisonSection.innerHTML = '<p class="error" style="color: red; text-align: center; width: 100%;">Data not loaded. Please check data file.</p>';
        }
    }
}

function renderCards(data) {
    const comparisonSection = document.getElementById('comparison-section');
    if (!comparisonSection) return;

    comparisonSection.innerHTML = '';
    
    if (!data || data.length === 0) {
        comparisonSection.innerHTML = '<p class="no-results" style="grid-column: 1 / -1; text-align: center; color: var(--twilight-indigo); opacity: 0.7;">No GPUs found matching your criteria.</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'gpu-grid';

    data.forEach(gpu => {
        const card = document.createElement('div');
        card.className = 'gpu-card glass-card';
        
        let specsHtml = '';
        if (gpu.specs) {
            for (const [key, value] of Object.entries(gpu.specs)) {
                specsHtml += `
                    <div class="spec-item">
                        <span class="spec-label">${key}:</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `;
            }
        }

        card.innerHTML = `
            <div class="card-header">
                <span class="brand-tag">${gpu.brand}</span>
                <h2 class="gpu-name">${gpu.name}</h2>
            </div>
            <div class="card-body">
                ${specsHtml}
            </div>
            <div class="card-footer">
                <span class="price">${gpu.price || 'N/A'}</span>
            </div>
        `;
        grid.appendChild(card);
    });

    comparisonSection.appendChild(grid);
}

function filterData() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const vendor = document.getElementById('vendor-filter').value;

    const filteredData = gpuData.filter(gpu => {
        const matchesSearch = 
            gpu.name.toLowerCase().includes(searchTerm) || 
            gpu.brand.toLowerCase().includes(searchTerm);
        const matchesVendor = vendor === 'all' || gpu.vendor_id === vendor;
        return matchesSearch && matchesVendor;
    });

    renderCards(filteredData);
}

document.addEventListener('DOMContentLoaded', () => {
    loadGpuData();

    const searchInput = document.getElementById('search-input');
    const vendorFilter = document.getElementById('vendor-filter');
    const startBtn = document.querySelector('.start-btn');

    if (searchInput) {
        searchInput.addEventListener('input', filterData);
    }
    if (vendorFilter) {
        vendorFilter.addEventListener('change', filterData);
    }
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            document.getElementById('comparison-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});
