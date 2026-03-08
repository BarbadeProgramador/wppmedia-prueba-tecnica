/**
 * EVERGREEN - DCO Engine
 * Consumo de API personalizada via Google Sheets para WPP Media
 */

// 1. URL de tu aplicación web (Asegúrate de que termine en /exec)
const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbw2HfG3UMxsXrtlBd4atlATrSVG3nOe4CQxs6qGRi0LDJ6JfuE2jc7hXBcjyrDR8MtYwg/exec";

/**
 * Función principal para obtener datos del inventario
 */
async function fetchGardenData() {
    const headlineEl = document.getElementById('headline');
    const subheadlineEl = document.getElementById('subheadline');

    try {
        // PASO CLAVE PARA CORS: 
        // No agregues headers personalizados ni 'mode: cors'. 
        // Una petición simple de fetch es la que mejor funciona con los redirects de Google.
        const response = await fetch(ENDPOINT_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const allRecords = await response.json();
        console.log("Datos sincronizados con éxito:", allRecords);
        
        if (allRecords && allRecords.length > 0) {
            // Seleccionamos un registro al azar (DCO Strategy)
            const randomIndex = Math.floor(Math.random() * allRecords.length);
            const selectedItem = allRecords[randomIndex];
            
            // Actualizamos la interfaz
            updateFrontend(selectedItem);
        } else {
            throw new Error("La base de datos está vacía");
        }

    } catch (error) {
        console.error("Falla en la conexión DCO:", error);
        
        // Fallback Profesional: Si la API falla, el usuario nunca ve un error, ve una promo genérica.
        if (headlineEl) headlineEl.innerText = "SOLUCIONES PARA TU JARDÍN";
        if (subheadlineEl) subheadlineEl.innerText = "Calidad EverGreen en cada rincón.";
        
        // Imagen de respaldo por si falla la API
        const imageEl = document.getElementById('productImage');
        if (imageEl) imageEl.src = "assets/img/fallback-product.png"; 
    }
}

/**
 * Mapeo de datos al DOM
 * IMPORTANTE: Verifica que los nombres (data.Country, data.Product, etc.) 
 * coincidan EXACTAMENTE con las cabeceras de tu Google Sheet.
 */
function updateFrontend(data) {
    // 1. Ubicación
    const cityEl = document.getElementById('cityName');
    if (cityEl) cityEl.innerText = (data.Country || "BOGOTÁ").toUpperCase();

    // 2. Tipo de Producto
    const productEl = document.getElementById('productType');
    if (productEl) productEl.innerText = data.Product || "GARDEN ESSENTIALS";

    // 3. Headline Dinámico
    const headlineEl = document.getElementById('headline');
    if (headlineEl) headlineEl.innerText = data.Headline || "REINVENTA TU ESPACIO";

    // 4. Subheadline
    const subheadlineEl = document.getElementById('subheadline');
    if (subheadlineEl) subheadlineEl.innerText = data.Subheadline || "Descubre nuestra nueva colección.";

    // 5. Imagen del Producto
    const imageEl = document.getElementById('productImage');
    if (imageEl && data.Image_URL) {
        imageEl.src = data.Image_URL;
        // Animación de entrada suave cuando carga la imagen
        imageEl.onload = () => imageEl.style.opacity = "1";
    }

    // 6. Botón CTA
    const ctaEl = document.getElementById('ctaButton');
    if (ctaEl) ctaEl.innerText = data.CTA_Text || "VER CATÁLOGO";
}

// Inicialización
window.addEventListener('DOMContentLoaded', fetchGardenData);

// Tracking de clics para el reporte (Muy importante para WPP)
const bannerEl = document.getElementById('adBanner');
if (bannerEl) {
    bannerEl.addEventListener('click', () => {
        const product = document.getElementById('productType').innerText;
        console.log(`Evento: Clic en Banner - Producto: ${product}`);
        // window.open("https://evergreen.com/shop", "_blank");
    });
}