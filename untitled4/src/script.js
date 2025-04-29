// Свойства материалов
const MATERIAL_PROPERTIES = {
    air: { density: 0.001225, color: '#e0f2fe' },
    water: { density: 1.0, color: '#bae6fd' },
    paper: { density: 0.7, color: '#f3f4f6' },
    concrete: { density: 2.4, color: '#d1d5db' },
    aluminum: { density: 2.7, color: '#94a3b8' },
    iron: { density: 7.87, color: '#6b7280' },
    copper: { density: 8.96, color: '#b87333' },
    lead: { density: 11.34, color: '#475569' },
    uranium: { density: 19.1, color: '#1e40af' },
    wood: { density: 0.6, color: '#deb887' },    // Новый материал
    glass: { density: 2.5, color: '#b0c4de' },   // Новый материал
    plastic: { density: 0.95, color: '#d1fae5' } // Новый материал
};

const PENETRATION_CONSTANTS = {
    alpha: { base: 0.02, energyFactor: 0.5, densityFactor: 0.8 },
    beta: { base: 2.0, energyFactor: 0.7, densityFactor: 0.9 },
    gamma: { base: 100, energyFactor: 0.3, densityFactor: 0.95 },
    neutron: { base: 150, energyFactor: 0.4, densityFactor: 0.85 }
};

const INITIAL_PARTICLES = 1000;

// Получаем элементы DOM
const radiationTypeSelect = document.getElementById('radiationType');
const radiationEnergySlider = document.getElementById('radiationEnergy');
const energyValue = document.getElementById('energyValue');
const materialTypeSelect = document.getElementById('materialType');
const materialDensitySlider = document.getElementById('materialDensity');
const densityValue = document.getElementById('densityValue');
const thicknessSlider = document.getElementById('thickness');
const thicknessValue = document.getElementById('thicknessValue');
const radiationParticles = document.querySelector('.radiation-particles');
const materialBarrier = document.querySelector('.material-barrier');
const initialCount = document.getElementById('initialCount');
const penetratedCount = document.getElementById('penetratedCount');
const penetrationRate = document.getElementById('penetrationRate');
const halfValueLayer = document.getElementById('halfValueLayer');

let penetration = 1; // глобальная переменная

function updateSimulation() {
    const radiationType = radiationTypeSelect.value;
    const energy = parseFloat(radiationEnergySlider.value);
    const materialType = materialTypeSelect.value;
    const density = parseFloat(materialDensitySlider.value);
    const thickness = parseFloat(thicknessSlider.value);

    energyValue.textContent = `${energy} MeV`;
    densityValue.textContent = `${density} г/см³`;
    thicknessValue.textContent = `${thickness} мм`;
    radiationParticles.setAttribute('data-type', radiationType);
    materialBarrier.setAttribute('data-material', materialType);
    materialBarrier.style.backgroundColor = MATERIAL_PROPERTIES[materialType].color;

    const baseThickness = PENETRATION_CONSTANTS[radiationType].base;
    const energyFactor = Math.pow(energy, PENETRATION_CONSTANTS[radiationType].energyFactor);
    const densityFactor = Math.pow(density, PENETRATION_CONSTANTS[radiationType].densityFactor);
    const halfValueThickness = baseThickness * energyFactor / densityFactor;

    penetration = Math.exp(-Math.log(2) * thickness / halfValueThickness);
    const particlesPenetrated = Math.round(INITIAL_PARTICLES * penetration);

    initialCount.textContent = `${INITIAL_PARTICLES} частиц`;
    penetratedCount.textContent = `${particlesPenetrated} частиц`;
    penetrationRate.textContent = `${(penetration * 100).toFixed(1)}%`;
    halfValueLayer.textContent = `${halfValueThickness.toFixed(2)} мм`;

    materialBarrier.style.width = `${Math.min(thickness * 1, 600)}px`;
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 20}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.setProperty('--randomY', `${Math.random() * 100 - 50}px`);
    const duration = 2 + Math.random();
    particle.style.animationDuration = `${duration}s`;

    particle.addEventListener('animationend', () => {
        if (Math.random() < penetration) {
            triggerDetectorFlash();
        }
        particle.remove();
    });

    radiationParticles.appendChild(particle);
}

function triggerDetectorFlash() {
    const detector = document.querySelector('.detector');
    detector.classList.add('flash');
    setTimeout(() => {
        detector.classList.remove('flash');
    }, 300);
}

setInterval(() => {
    createParticle();
}, 100);

radiationTypeSelect.addEventListener('change', updateSimulation);
radiationEnergySlider.addEventListener('input', updateSimulation);
materialTypeSelect.addEventListener('change', () => {
    const material = materialTypeSelect.value;
    materialDensitySlider.value = MATERIAL_PROPERTIES[material].density;
    densityValue.textContent = `${MATERIAL_PROPERTIES[material].density} г/см³`;
    updateSimulation();
});
materialDensitySlider.addEventListener('input', updateSimulation);
thicknessSlider.addEventListener('input', updateSimulation);

updateSimulation();
