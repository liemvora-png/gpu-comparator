let gpuData = [];

async function loadGpuData() {
    try {
        const response = await fetch('gpu_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        gpuData = await response.json();
        renderCards(gpuData);
    } catch (error) {
        console.error("Could not load GPU data:", error);
        document.getElementById('comparison-section').innerHTML = `<p style="color: red; text-align: center; width: 100%;">Error loading GPU data. Please try again later.</p>`;
    }
}

function renderCards(data) {
    const container = document.getElementById('comparison-section');
    if (!container) return;
    
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No GPUs match your search.</p>';
        return;
    }

    data.forEach(gpu => {
        const card = document.createElement('div');
        card.className = 'gpu-card';
        
        let specsHtml = '';
        for (const [key, value] of Object.entries(gpu.specs)) {
            specsHtml += `<div class="spec-item"><span class="spec-label">${key}</span><span class="spec-value">${value}</span></div>`;
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
                <div class="price">${gpu.price}</div>
                ${gpu.url !== '#' ? `<a href="${gpu.url}" target="_blank" class="details-link" style="color: var(--white); text-decoration: none; font-size: 0.9rem;">View Details</a>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

function filterAndSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const vendorFilter = document.getElementById('vendor-filter').value;

    const filtered = gpuData.filter(gpu => {
        const matchesSearch = 
            gpu.name.toLowerCase().includes(searchTerm) || 
            gpu.brand.toLowerCase().includes(searchTerm);
        
        const matchesVendor = vendorFilter === 'all' || gpu.vendor_id === vendorFilter;
        
        return matchesSearch && matchesVendor;
    });

    renderCards(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    loadGpuData();

    document.getElementById('search-input').addEventListener('input', filterAndSearch);
    document.getElementById('vendor-filter').addEventListener('change', filterAndSearch);

    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            document.getElementById('comparison-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});
