/**
 * EVERGREEN - DCO Engine
 * Consumo de API personalizada via Google Sheets para WPP Media
 */

// 1. URL de tu aplicación web (Endpoint validado)
const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbw2HfG3UMxsXrtlBd4atlATrSVG3nOe4CQxs6qGRi0LDJ6JfuE2jc7hXBcjyrDR8MtYwg/exec";

/**
 * Función principal para obtener datos del inventario de jardinería
 */
async function fetchGardenData() {
    try {
        // Realizamos la petición con modo 'cors' para evitar el bloqueo del navegador
        const response = await fetch(ENDPOINT_URL, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });

        if (!response.ok) {
            throw new Error('Error en la comunicación con el servidor de Google');
        }

        const allRecords = await response.json();
        
        // REQUERIMIENTO: Mostrar contenido diferente en cada recarga
        if (allRecords && allRecords.length > 0) {
            // Seleccionamos un registro al azar de los 30 generados
            const randomIndex = Math.floor(Math.random() * allRecords.length);
            const selectedItem = allRecords[randomIndex];
            
            // Inyectamos los datos en la interfaz
            updateFrontend(selectedItem);
        }
    } catch (error) {
        console.error("Error al conectar con el inventario EverGreen:", error);
        
        // Fallback profesional para asegurar que el banner siempre muestre algo
        document.getElementById('headline').innerText = "CALIDAD PARA TU JARDÍN";
        document.getElementById('subheadline').innerText = "Expertos en soluciones verdes.";
    }
}

/**
 * Mapeo de datos desde el JSON de la API al DOM del Banner
 */
function updateFrontend(data) {
    // Sincronización con los IDs definidos en tu archivo index.html
    
    // 1. Ubicación (DCO)
    const cityEl = document.getElementById('cityName');
    if (cityEl) cityEl.innerText = data.Country || "BOGOTÁ";

    // 2. Información del Producto
    const productEl = document.getElementById('productType');
    if (productEl) productEl.innerText = data.Product || "GARDEN TOOL";

    // 3. Textos Creativos
    const headlineEl = document.getElementById('headline');
    if (headlineEl) headlineEl.innerText = data.Headline || "GROW WITH US";

    const subheadlineEl = document.getElementById('subheadline');
    if (subheadlineEl) subheadlineEl.innerText = data.Subheadline || "Transforma tu espacio hoy.";

    // 4. Imagen del Producto (URL desde Google Sheets)
    const imageEl = document.getElementById('productImage');
    if (imageEl && data.Image_URL) {
        imageEl.src = data.Image_URL;
    }

    // 5. Texto del Botón (CTA)
    const ctaEl = document.getElementById('ctaButton');
    if (ctaEl) ctaEl.innerText = data.CTA_Text || "VER MÁS";
}

// Inicializar la carga de datos al abrir el banner
window.onload = fetchGardenData;

// Interactividad: Registro de interés del usuario
const bannerEl = document.getElementById('adBanner');
if (bannerEl) {
    bannerEl.addEventListener('click', () => {
        const product = document.getElementById('productType').innerText;
        console.log("Interés registrado en: " + product);
        // Aquí podrías añadir: window.open("tu_url_de_destino", "_blank");
    });
}