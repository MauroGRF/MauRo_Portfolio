// Carrusel + lightbox con navegación de imágenes y autoplay
// Soporta múltiples carruseles en la página
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.carousel').forEach(function(carousel){
    const images = carousel.querySelectorAll('.carousel-images img');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    let current = Array.from(images).findIndex(img => img.classList.contains('active'));
    if(current === -1) current = 0;
    let timer = null;

    function showImage(idx) {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === idx);
      });
    }

    function next() {
      current = (current + 1) % images.length;
      showImage(current);
      resetAutoplay();
    }
    function prev() {
      current = (current - 1 + images.length) % images.length;
      showImage(current);
      resetAutoplay();
    }
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    showImage(current);

    // --- AUTOPLAY cada 3s ---
    function autoplay() {
      timer = setInterval(() => {
        current = (current + 1) % images.length;
        showImage(current);
      }, 3000);
    }
    function resetAutoplay() {
      if(timer) clearInterval(timer);
      autoplay();
    }
    autoplay();

    // Lightbox funcionality con navegación
    images.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        showLightbox(images, i);
      });
    });
  });

  function showLightbox(images, startIdx) {
    // Remove any existing lightbox
    document.querySelectorAll('.lightbox-overlay').forEach(e => e.remove());
    let current = startIdx;

    // Build overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.tabIndex = 0;
    overlay.innerHTML = `
      <button class="lightbox-arrow lightbox-prev" style="position: absolute; left: 2vw; height: 80px; width: 80px; top: 50%; transform: translateY(-50%); font-size: 3em; background: #181830d8; color: #fff; border-radius: 50%; border: none; cursor: pointer; z-index: 10001;">&#10094;</button>
      <img src="${images[current].src}" alt="${images[current].alt}" class="lightbox-img">
      <button class="lightbox-arrow lightbox-next" style="position: absolute; right: 2vw; height: 80px; width: 80px; top: 50%; transform: translateY(-50%); font-size: 3em; background: #181830d8; color: #fff; border-radius: 50%; border: none; cursor: pointer; z-index: 10001;">&#10095;</button>
    `;
    document.body.appendChild(overlay);
    overlay.focus();

    function updateImg() {
      overlay.querySelector('.lightbox-img').src = images[current].src;
      overlay.querySelector('.lightbox-img').alt = images[current].alt;
    }
    function next() {
      current = (current + 1) % images.length;
      updateImg();
    }
    function prev() {
      current = (current - 1 + images.length) % images.length;
      updateImg();
    }
    function close() {
      overlay.remove();
      document.removeEventListener('keydown', escHandler, true);
    }
    function escHandler(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) close();
    });
    overlay.querySelector('.lightbox-prev').addEventListener('click', function(e){ e.stopPropagation(); prev(); });
    overlay.querySelector('.lightbox-next').addEventListener('click', function(e){ e.stopPropagation(); next(); });
    document.addEventListener('keydown', escHandler, true);
  }
});
