/**
 * EVERGREEN - DCO Engine (WPP Assessment)
 * Estrategia: Fetch Real con Fallback Local (Anti-CORS)
 */

const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbw2HfG3UMxsXrtlBd4atlATrSVG3nOe4CQxs6qGRi0LDJ6JfuE2jc7hXBcjyrDR8MtYwg/exec";

// --- DATOS DE RESPALDO (MOCK DATA) ---
// Esto asegura que si la API falla, el banner siga siendo impresionante.
const backupInventory = [
    {
        Country: "BOGOTÁ",
        Product: "KIT BOTÁNICO IA",
        Headline: "CULTIVA EL FUTURO",
        Subheadline: "Sistemas de riego inteligentes con sensores de humedad.",
        Image_URL: "/assets/img/soraOpenAi.jpg", // Usa tus imágenes locales para asegurar carga
        CTA_Text: "DESCUBRIR"
    },
    {
        Country: "MEDELLÍN",
        Product: "FERTILIZANTE DCO",
        Headline: "FLORECE CON PRECISIÓN",
        Subheadline: "Nutrición basada en algoritmos de crecimiento.",
        Image_URL: "/assets/img/codexIA.png",
        CTA_Text: "VER MÁS"
    },
    {
        Country: "CALI",
        Product: "PALA EVERGREEN",
        Headline: "DISEÑO INNOVADOR",
        Subheadline: "Ergonomía superior para jardines urbanos.",
        Image_URL: "/assets/img/dalleE.png",
        CTA_Text: "COMPRAR"
    }
];

async function fetchGardenData() {
    console.log("Iniciando sincronización DCO...");

    try {
        // Intentamos la petición real
        const response = await fetch(ENDPOINT_URL);
        
        if (!response.ok) throw new Error("Error en servidor Google");

        const allRecords = await response.json();
        
        if (allRecords && allRecords.length > 0) {
            console.log("API Real conectada:", allRecords.length, "registros.");
            const selected = allRecords[Math.floor(Math.random() * allRecords.length)];
            updateFrontend(selected);
        } else {
            throw new Error("API vacía");
        }

    } catch (error) {
        console.warn("CORS/Red detectado. Activando Capa de Resiliencia (Mock Data).");
        
        // Seleccionamos uno al azar de nuestros datos de respaldo
        const fallbackItem = backupInventory[Math.floor(Math.random() * backupInventory.length)];
        updateFrontend(fallbackItem);
    }
}

function updateFrontend(data) {
    // Mapeo de elementos con validación de existencia
    const setElementText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text.toUpperCase();
    };

    setElementText('cityName', data.Country || "LATAM");
    setElementText('productType', data.Product || "GARDEN TOOL");
    setElementText('headline', data.Headline || "GROW WITH US");
    
    const sub = document.getElementById('subheadline');
    if (sub) sub.innerText = data.Subheadline || "Soluciones verdes para tu hogar.";

    const img = document.getElementById('productImage');
    if (img && data.Image_URL) {
        // Si la URL de la API es absoluta se usa, si no, busca en locales
        img.src = data.Image_URL;
        img.onerror = () => { img.src = "assets/img/soraOpenAi.jpg"; }; // Fallback final de imagen
    }

    const cta = document.getElementById('ctaButton');
    if (cta) cta.innerText = data.CTA_Text || "VER MÁS";
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchGardenData);

// Tracking de interacción
document.getElementById('adBanner').addEventListener('click', (e) => {
    // Evitar que el clic en botones dispare doble evento
    if(e.target.tagName !== 'BUTTON') {
        const product = document.getElementById('productType').innerText;
        console.log(`Click Tracking: Interés en ${product}`);
        // window.open("https://openai.com", "_blank");
    }
});