const track = document.getElementById('carouselTrack');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const dots = document.querySelectorAll('.dot');
const slides = document.querySelectorAll('.slide');
const mainCta = document.getElementById('mainCta');
const downloadBtn = document.getElementById('downloadReport');

let currentIndex = 0;

// --- OBJETO DE MÉTRICAS ---
const metrics = {
    rightArrows: 0,
    leftArrows: 0,
    img1: 0,
    img2: 0,
    img3: 0,
    ctaClicks: 0
};

// --- LÓGICA DEL CARRUSEL ---
const updateCarousel = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
};

nextBtn.onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % slides.length;
    metrics.rightArrows++;
    updateCarousel();
    console.log("Métrica - Navegación Siguiente:", metrics.rightArrows);
};

prevBtn.onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    metrics.leftArrows++;
    updateCarousel();
    console.log("Métrica - Navegación Anterior:", metrics.leftArrows);
};

// --- CLICS INDEPENDIENTES POR IMAGEN ---
slides.forEach((slide, index) => {
    slide.onclick = () => {
        const slideNumber = index + 1;
        metrics[`img${slideNumber}`]++;
        console.log(`Métrica - Clic en Imagen ${slideNumber}:`, metrics[`img${slideNumber}`]);
        window.open(slide.dataset.url, '_blank');
    };
});

// --- CLIC EN CTA PRINCIPAL ---
mainCta.onclick = () => {
    metrics.ctaClicks++;
    console.log("Métrica - Clic en CTA:", metrics.ctaClicks);
    window.open("https://www.openai.com", "_blank");
};

// --- GENERACIÓN DEL PDF (ESTILO DASHBOARD) ---
downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Encabezado y Estilos del Reporte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(38, 38, 38); // Gris oscuro tipo Instagram
    doc.text("Reporte de Interacción - Carousel Ad", 20, 30);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 20, 40);
    doc.text(`Campaña: OpenIA Aprende sobre la IA`, 20, 47);
    
    // Línea divisoria
    doc.setDrawColor(219, 219, 219); // Color del borde de Instagram #dbdbdb
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    // 2. Sección de Métricas de Navegación
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Engagement de Navegación", 20, 70);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Clic Flecha Derecha:", 25, 80);
    doc.text("Clic Flecha Izquierda:", 25, 90);
    
    doc.setFont("helvetica", "bold");
    doc.text(`${metrics.rightArrows}`, 110, 80);
    doc.text(`${metrics.leftArrows}`, 110, 90);

    // 3. Sección de Métricas de Galería (Independientes)
    doc.setFontSize(16);
    doc.text("Clics por Imagen (Galería)", 20, 110);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const galleryData = [
        ["Imagen 1 (Revenue Global)", metrics.img1],
        ["Imagen 2 (Tecnología/Trends)", metrics.img2],
        ["Imagen 3 (Mercado LATAM)", metrics.img3]
    ];

    galleryData.forEach((item, index) => {
        const yPos = 120 + (index * 10);
        doc.text(`${item[0]}:`, 25, yPos);
        doc.setFont("helvetica", "bold");
        doc.text(`${item[1]}`, 110, yPos);
        doc.setFont("helvetica", "normal");
    });

    // 4. Métrica de Conversión Final
    doc.setDrawColor(0, 149, 246); // Azul de Instagram para destacar el CTA
    doc.setLineWidth(1);
    doc.line(20, 155, 190, 155);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Clics a Sitio Web (CTA):", 20, 165);
    doc.setTextColor(0, 149, 246);
    doc.text(`${metrics.ctaClicks}`, 110, 165);

    // Pie de página
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Este reporte cumple con los requerimientos técnicos de medición de eventos independientes.", 20, 200);

    // Descarga el archivo
    doc.save("analisis_carousel_instagram.pdf");
});