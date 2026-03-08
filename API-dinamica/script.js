/**
 * EVERGREEN - DCO Engine
 * Assessment para WPP Media
 */

// 1. Tu Endpoint Real de MockAPI
const ENDPOINT_URL = "https://69acd808b50a169ec87e2256.mockapi.io/api/v1/banners";

/**
 * Función principal para consumir la API y actualizar el banner
 */
async function fetchBannerData() {
    const bannerEl = document.getElementById('adBanner');
    
    try {
        console.log("Conectando con el motor DCO...");
        const response = await fetch(ENDPOINT_URL);
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const allRecords = await response.json();
        
        // REQUERIMIENTO: Mostrar contenido diferente en cada recarga
        if (allRecords && allRecords.length > 0) {
            const randomIndex = Math.floor(Math.random() * allRecords.length);
            const selectedItem = allRecords[randomIndex];
            
            console.log("Contenido dinámico seleccionado:", selectedItem.product);
            updateFrontend(selectedItem);
        }

    } catch (error) {
        console.error("Falla en la conexión API. Usando Fallback local.", error);
        // Fallback en caso de error de red
        document.getElementById('headline').innerText = "EVERGREEN SOLUTIONS";
    } finally {
        // Mostrar el banner con una pequeña transición
        if (bannerEl) bannerEl.style.opacity = "1";
    }
}

/**
 * Mapea los datos del JSON a los elementos HTML
 * @param {Object} data - Registro individual del endpoint
 */
function updateFrontend(data) {
    // Texto y Contenido
    setElementContent('cityName', data.country);
    setElementContent('productType', data.product);
    setElementContent('headline', data.headline);
    setElementContent('subheadline', data.subheadline);
    setElementContent('ctaButton', data.cta_text);

    // Imagen con validación
    const imageEl = document.getElementById('productImage');
    if (imageEl && data.image_url) {
        imageEl.src = data.image_url;
        
        // Animación simple: aparecer suavemente cuando cargue la imagen
        imageEl.onload = () => {
            imageEl.classList.add('fade-in');
        };
    }
}

/**
 * Función auxiliar para evitar errores si el ID no existe
 */
function setElementContent(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = text ? text.toUpperCase() : "";
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchBannerData);

// Tracking de clics (Esencial para WPP)
const ctaBtn = document.getElementById('ctaButton');
if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        const product = document.getElementById('productType').innerText;
        console.log(`[DCO Tracking] Click en producto: ${product}`);
        // window.open('https://evergreen.com', '_blank');
    });
}