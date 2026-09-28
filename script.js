const gpuData = [
    {
        brand: 'NVIDIA',
        name: 'RTX 4090',
        specs: {
            'VRAM': '24GB GDDR6X',
            'Architecture': 'Ada Lovelace',
            'TDP': '450W',
            'Interface': 'PCIe 4.0 x16'
        },
        price: '$1,599'
    },
    {
        brand: 'AMD',
        name: 'Radeon RX 7900 XTX',
        specs: {
            'VRAM': '24GB GDDR6',
            'Architecture': 'RDNA 3',
            'TDP': '355W',
            'Interface': 'PCIe 4.0 x16'
        },
        price: '$999'
    },
    {
        brand: 'Intel',
        name: 'Arc A770',
        specs: {
            'VRAM': '16GB GDDR6',
            'Architecture': 'Alchemist',
            'TDP': '225W',
            'Interface': 'PCIe 4.0 x16'
        },
        price: '$299'
    }
];

function renderCards() {
    const container = document.getElementById('comparison-section');
    if (!container) return;
    
    container.innerHTML = '';

    gpuData.forEach(gpu => {
        const card = document.createElement('div');
        card.className = 'gpu-card';
        
        let specsHtml = '';
        for (const [key, value] of Object.entries(gpu.specs)) {
            specsHtml += `<li><span>${key}</span><span>${value}</span></li>`;
        }

        card.innerHTML = `
            <span class="brand">${gpu.brand}</span>
            <h2>${gpu.name}</h2>
            <ul class="specs">
                ${specsHtml}
            </ul>
            <div class="price">${gpu.price}</div>
        `;
        
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCards();

    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const section = document.getElementById('comparison-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
