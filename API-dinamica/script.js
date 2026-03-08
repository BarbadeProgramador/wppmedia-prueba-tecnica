/**
 * EVERGREEN - DCO Engine (WPP Assessment)
 */

// URL de tu MockAPI con los 30 registros
const ENDPOINT_URL = "https://69acd808b50a169ec87e2256.mockapi.io/api/v1/banners";

async function fetchBannerContent() {
    try {
        console.log("Iniciando conexión con el endpoint...");
        const response = await fetch(ENDPOINT_URL);
        
        if (!response.ok) throw new Error("Error en la respuesta de la API");

        const data = await response.json();

        if (data && data.length > 0) {
            // Seleccionar un registro aleatorio de los 30 disponibles
            const randomAd = data[Math.floor(Math.random() * data.length)];
            updateUI(randomAd);
        }
    } catch (error) {
        console.error("Fallo DCO:", error);
        // Fallback en caso de error
        document.getElementById('headline').innerText = "EVERGREEN SOLUTIONS";
    }
}

function updateUI(ad) {
    // Mapeo de datos al HTML
    document.getElementById('cityName').innerText = ad.country.toUpperCase();
    document.getElementById('productType').innerText = ad.product.toUpperCase();
    document.getElementById('headline').innerText = ad.headline.toUpperCase();
    document.getElementById('subheadline').innerText = ad.subheadline;
    document.getElementById('ctaButton').innerText = ad.cta_text || "DESCUBRIR";

    const img = document.getElementById('productImage');
    if (img && ad.image_url) {
        img.src = ad.image_url;
        img.onload = () => img.classList.add('loaded');
    }

    // Toque extra: Temperatura aleatoria basada en clima DCO
    const temp = Math.floor(Math.random() * (32 - 18) + 18);
    document.getElementById('temperature').innerText = `${temp}°`;
}

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', fetchBannerContent);

// Tracking de clics
document.getElementById('adBanner').addEventListener('click', () => {
    const pName = document.getElementById('productType').innerText;
    console.log(`[TRACKING] Usuario interesado en: ${pName}`);
});