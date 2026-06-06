/* ===========================
   COLOMBIA 5.0 — MAIN JS
   =========================== */

// ---- NAV TOGGLE (mobile) ----
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ---- ACTIVE NAV LINK ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ---- LANGUAGE TOGGLE ----
document.querySelectorAll('.lang-toggle').forEach(toggle => {
  const block = toggle.closest('.conference-block');
  toggle.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      toggle.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      block.querySelectorAll('.lang-content').forEach(c => {
        c.classList.toggle('active', c.dataset.lang === lang);
      });
    });
  });
});

// ---- MEDIA UPLOAD (fotos e videos) ----
document.querySelectorAll('.media-slot').forEach(slot => {
  const input  = slot.querySelector('input[type="file"]');
  const remove = slot.querySelector('.remove-btn');
  if (!input) return;

  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    // Eliminar cualquier media anterior
    slot.querySelectorAll('img, video').forEach(el => el.remove());

    // Crear URL de objeto local — esto es lo que funciona correctamente
    const url = URL.createObjectURL(file);

    let media;
    if (file.type.startsWith('video/')) {
      media = document.createElement('video');
      media.src = url;
      media.controls = true;
      media.muted = false;
      media.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:10px;';
    } else {
      media = document.createElement('img');
      media.src = url;
      media.alt = 'Foto conferencia';
      media.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:10px;';
    }

    slot.appendChild(media);
    slot.classList.add('has-file');
  });

  if (remove) {
    remove.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      slot.querySelectorAll('img, video').forEach(el => {
        // Liberar memoria del blob URL
        if (el.src && el.src.startsWith('blob:')) URL.revokeObjectURL(el.src);
        el.remove();
      });
      slot.classList.remove('has-file');
      input.value = '';
    });
  }
});

// ---- GLOSSARY SEARCH ----
const glossarySearch = document.getElementById('glossarySearch');
if (glossarySearch) {
  glossarySearch.addEventListener('input', () => {
    const q = glossarySearch.value.toLowerCase();
    document.querySelectorAll('.glossary-table tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ---- SCROLL FADE-IN ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.card, .info-card, .conf-prev-card, .pillar, .ethics-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
