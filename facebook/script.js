const video = document.getElementById('videoAd');
const muteToggle = document.getElementById('muteToggle');
const videoTouch = document.getElementById('videoTouchLayer');
const ctaBtn = document.getElementById('ctaBtn');
const downloadBtn = document.getElementById('downloadReport');
const likeBtn = document.getElementById('likeBtn');
const redirectElements = document.querySelectorAll('.goto-link');

const destinationUrl = "https://www.interactivebrokers.com";

// --- OBJETO DE MÉTRICAS ---
const metrics = {
    plays: 0,
    pauses: 0,
    mutes: 1, // Inicia muteado por defecto
    unmutes: 0,
    ctaClicks: 0,
    likes: 0
};


// Forzar reproducción al cargar
window.addEventListener('DOMContentLoaded', () => {
    video.play().catch(error => {
        console.log("Autoplay esperando interacción del usuario");
    });
});

// 1. Manejo de Play/Pause
videoTouch.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        metrics.plays++;
    } else {
        video.pause();
        metrics.pauses++;
    }
    console.log("Métrica - Play/Pause:", metrics);
});

// 2. Toggle de Mute
muteToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    muteToggle.classList.toggle('is-muted');
    
    if (video.muted) {
        metrics.mutes++;
    } else {
        metrics.unmutes++;
    }
    console.log("Métrica - Sonido:", metrics);
});

// 3. Like (extra)
likeBtn.addEventListener('click', () => {
    metrics.likes++;
    const countSpan = document.getElementById('likeCount');
    countSpan.innerText = (2100 + metrics.likes);
});

// 4. Clics en CTA y Redirección
const trackAndRedirect = () => {
    metrics.ctaClicks++;
    console.log("Métrica - Clic Final:", metrics);
    setTimeout(() => window.open(destinationUrl, '_blank'), 200);
};

ctaBtn.addEventListener('click', trackAndRedirect);
redirectElements.forEach(el => el.addEventListener('click', trackAndRedirect));

// --- GENERACIÓN DEL PDF (DASHBOARD) ---
downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Estilos del reporte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Reporte de Interacción - Ad", 20, 30);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 40);
    doc.text(`Anunciante: Interactive Brokers`, 20, 47);
    
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    // Datos del Dashboard
    doc.setFontSize(16);
    doc.text("Métricas de Video", 20, 70);
    
    doc.setFontSize(12);
    const startY = 80;
    const spacing = 10;
    
    const data = [
        ["Reproducciones (Play)", metrics.plays],
        ["Pausas (Pause)", metrics.pauses],
        ["Silencios (Mute)", metrics.mutes],
        ["Activación Sonido (Unmute)", metrics.unmutes],
        ["Interacciones 'Like'", metrics.likes],
        ["Clics al Sitio (CTA)", metrics.ctaClicks]
    ];

    data.forEach((item, index) => {
        doc.text(`${item[0]}:`, 25, startY + (index * spacing));
        doc.setFont("helvetica", "bold");
        doc.text(`${item[1]}`, 100, startY + (index * spacing));
        doc.setFont("helvetica", "normal");
    });

    // Pie de página o conclusión rápida
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Este reporte fue generado automáticamente por el sistema de tracking del Ad.", 20, 150);

    // Descarga el archivo
    doc.save("analisis_interaccion_ad.pdf");
});