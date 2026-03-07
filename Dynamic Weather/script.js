/**
 * VELOCITY - Script DCO con Profundidad de Inventario
 * Preparado para Imágenes PNG Transparentes Locales
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
 * MATRIZ DCO EXPANDIDA - 3 Variaciones por Clima
 * IMPORTANTE: He cambiado las rutas a 'img/*.png' asumiendo que descargarás los PNGs
 */
const creativeMatrix = {
    extreme_hot: {
        bg: "linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)",
        effect: "sun", cond: "Calor Intenso", icon: "☀️",
        products: [
            { name: "Nike Air Zoom Pegasus", link: "https://www.nike.com/co", img: "img/calor_1.png", head: "HEAT READY", sub: "Malla transpirable." },
            { name: "Adidas Ultraboost Light", link: "https://www.adidas.co", img: "img/calor_2.png", head: "SOLAR RUN", sub: "Energía infinita." },
            { name: "Asics Metaspeed Sky", link: "https://www.asics.com.co", img: "img/calor_3.png", head: "VELOCIDAD PURA", sub: "Ultraligeras para el calor." }
        ]
    },
    clear_warm: {
        bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        effect: "sun", cond: "Despejado", icon: "🌤️",
        products: [
            { name: "Asics Novablast 4", link: "https://www.asics.com.co", img: "img/despejado_1.png", head: "DÍA DE VELOCIDAD", sub: "Reactividad en asfalto." },
            { name: "Puma Deviate Nitro", link: "https://co.puma.com", img: "img/despejado_2.png", head: "ESTILO DINÁMICO", sub: "Placa de carbono para todos." },
            { name: "New Balance 1080v13", link: "https://www.newbalance.co", img: "img/despejado_3.png", head: "CONFORT TOTAL", sub: "Amortiguación premium." }
        ]
    },
    cloudy_cool: {
        bg: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        effect: "fog", cond: "Nublado", icon: "☁️",
        products: [
            { name: "New Balance Fresh Foam", link: "https://www.newbalance.co", img: "img/nublado_1.png", head: "TU MEJOR MARCA", sub: "Soporte estable y cómodo." },
            { name: "Saucony Endorphin", link: "https://www.saucony.com", img: "img/nublado_2.png", head: "PASO CONSTANTE", sub: "Eficiencia en cada kilómetro." },
            { name: "Hoka Clifton 9", link: "https://www.hoka.com", img: "img/nublado_3.png", head: "SUAVIDAD DIARIA", sub: "Ligereza máxima." }
        ]
    },
    extreme_cold: {
        bg: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
        effect: "fog", cond: "Frío Extremo", icon: "❄️",
        products: [
            { name: "Nike Shield Winflo", link: "https://www.nike.com/co", img: "img/frio_1.png", head: "CALIDEZ EN RUTA", sub: "Aislamiento térmico." },
            { name: "Hoka Bondi Frost", link: "https://www.hoka.com", img: "img/frio_2.png", head: "ESCUDO TÉRMICO", sub: "Protección invernal." },
            { name: "Saucony Peregrine ICE", link: "https://www.saucony.com", img: "img/frio_3.png", head: "AGARRE EN HIELO", sub: "Suela especial para frío." }
        ]
    },
    rain_light: {
        bg: "linear-gradient(135deg, #37ecba 0%, #72afd3 100%)",
        effect: "rain", cond: "Llovizna", icon: "🌦️",
        products: [
            { name: "UA HOVR Water", link: "https://www.underarmour.co", img: "img/llovizna_1.png", head: "SIN SALPICONES", sub: "Repele el agua ligera." },
            { name: "On Cloudrunner", link: "https://www.on.com", img: "img/llovizna_2.png", head: "PASOS SECOS", sub: "Membrana transpirable." },
            { name: "Brooks Ghost 15 GTX", link: "https://www.brooksrunning.com", img: "img/llovizna_3.png", head: "GORE-TEX LIGHT", sub: "Impermeabilidad diaria." }
        ]
    },
    rain_heavy: {
        bg: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        effect: "rain", cond: "Lluvia Fuerte", icon: "🌧️",
        products: [
            { name: "Nike Pegasus GTX", link: "https://www.nike.com/co", img: "img/lluvia_1.png", head: "ANTI-LLUVIA", sub: "Protección total Gore-Tex." },
            { name: "Salomon Speedcross", link: "https://www.salomon.com.co", img: "img/lluvia_2.png", head: "DOMINA EL AGUA", sub: "Grip agresivo en lodo." },
            { name: "Adidas Terrex Agravic", link: "https://www.adidas.co", img: "img/lluvia_3.png", head: "STORM PROOF", sub: "Suela Continental para mojado." }
        ]
    }
};

async function fetchWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`;
        const response = await fetch(url);
        const data = await response.json();
        updateAd(Math.round(data.current_weather.temperature), data.current_weather.weathercode);
    } catch (e) { updateAd(15, 3); }
}

function updateAd(temp, code) {
    let key = "cloudy_cool";
    if (code >= 51) {
        key = (code >= 63) ? "rain_heavy" : "rain_light";
    } else {
        if (temp >= 28) key = "extreme_hot";
        else if (temp >= 20) key = "clear_warm";
        else if (temp <= 12) key = "extreme_cold";
        else key = "cloudy_cool";
    }

    const config = creativeMatrix[key];
    
    // SELECCIÓN ALEATORIA: Elegimos 1 de los 3 productos disponibles para este clima
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
        elShoe.src = product.img; // Carga la ruta local 'img/*.png'
        elShoe.style.opacity = 1;
    }, 300);

    // Fallback de seguridad si el PNG local no existe
    elShoe.onerror = function() {
        this.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
    };
}

banner.onclick = () => window.open(currentProductLink, "_blank");
fetchWeather();