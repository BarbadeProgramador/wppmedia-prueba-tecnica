/**
 * VELOCITY - Script DCO 
 * Enlaces simplificados a Homes Oficiales y carga de imágenes optimizada
 */

const banner = document.getElementById('adBanner');
let currentProductLink = "https://www.wpp.com";

// Referencias DOM
const elCity = document.getElementById('cityName');
const elTemp = document.getElementById('temperature');
const elCond = document.getElementById('condition');
const elIcon = document.getElementById('weatherIcon');
const elShoe = document.getElementById('shoeImage');
const elModel = document.getElementById('shoeModel');
const elHead = document.getElementById('headline');
const elSub = document.getElementById('subheadline');
const elEffects = document.getElementById('weatherEffects');

const cities = [
    { name: "Bogotá", lat: 4.6097, lon: -74.0817 },
    { name: "Medellín", lat: 6.2442, lon: -75.5812 },
    { name: "Cali", lat: 3.4372, lon: -76.5225 },
    { name: "Barranquilla", lat: 10.9685, lon: -74.7813 },
    { name: "Pasto", lat: 1.2136, lon: -77.2811 },
    { name: "Manizales", lat: 5.0689, lon: -75.5174 }
];

const selectedCity = cities[Math.floor(Math.random() * cities.length)];

/**
 * MATRIZ DCO - Links a Páginas Oficiales
 */
const creativeMatrix = {
    extreme_hot: {
        bg: "linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)",
        effect: "sun", cond: "Calor Intenso", icon: "☀️",
        products: [
            { name: "Nike Running", link: "https://www.nike.com.co", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", head: "HEAT READY", sub: "Malla transpirable." },
            { name: "Adidas Performance", link: "https://www.adidas.co", img: "https://images.unsplash.com/photo-1552346154-21d32810aba3", head: "SOLAR RUN", sub: "Energía infinita." }
        ]
    },
    clear_warm: {
        bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        effect: "sun", cond: "Despejado", icon: "🌤️",
        products: [
            { name: "Puma Colombia", link: "https://co.puma.com", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", head: "DÍA PERFECTO", sub: "Estilo y velocidad." },
            { name: "New Balance", link: "https://www.newbalance.co", img: "https://images.unsplash.com/photo-1539185441755-769473a23570", head: "CONFORT TOTAL", sub: "Amortiguación premium." }
        ]
    },
    cloudy_cool: {
        bg: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        effect: "fog", cond: "Nublado", icon: "☁️",
        products: [
            { name: "Asics Colombia", link: "https://www.asics.com.co", img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", head: "PASO CONSTANTE", sub: "Soporte estable." },
            { name: "Hoka Global", link: "https://www.hoka.com", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", head: "SUAVIDAD DIARIA", sub: "Ligereza máxima." }
        ]
    },
    rain_heavy: {
        bg: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        effect: "rain", cond: "Lluvia Fuerte", icon: "🌧️",
        products: [
            { name: "Salomon Colombia", link: "https://www.salomon.com.co", img: "https://images.unsplash.com/photo-1520639889313-7272175b1c79", head: "ANTI-LLUVIA", sub: "Protección Gore-Tex." },
            { name: "Nike Shield", link: "https://www.nike.com.co", img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519", head: "DOMINA EL AGUA", sub: "Tracción en mojado." }
        ]
    }
};

async function fetchWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`;
        const response = await fetch(url);
        const data = await response.json();
        updateAd(Math.round(data.current_weather.temperature), data.current_weather.weathercode);
    } catch (e) { updateAd(18, 0); }
}

function updateAd(temp, code) {
    let key = "cloudy_cool";
    if (code >= 51) key = "rain_heavy";
    else if (temp >= 28) key = "extreme_hot";
    else if (temp >= 20) key = "clear_warm";
    else key = "cloudy_cool";

    const config = creativeMatrix[key];
    const product = config.products[Math.floor(Math.random() * config.products.length)];
    
    currentProductLink = product.link;
    elCity.innerText = selectedCity.name;
    elTemp.innerText = `${temp}°`;
    elCond.innerText = config.cond;
    elIcon.innerText = config.icon; 
    elModel.innerText = product.name;
    elHead.innerText = product.head;
    elSub.innerText = product.sub;

    banner.style.background = config.bg;
    elEffects.className = `weather-effects ${config.effect}`;
    
    elShoe.style.opacity = 0;
    setTimeout(() => {
        // Usamos parámetros de Unsplash para asegurar calidad y variedad
        elShoe.src = `${product.img}?auto=format&fit=crop&w=600&q=80`; 
        elShoe.style.opacity = 1;
    }, 200);

    elShoe.onerror = function() {
        this.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600";
    };
}

banner.onclick = () => window.open(currentProductLink, "_blank");
fetchWeather();