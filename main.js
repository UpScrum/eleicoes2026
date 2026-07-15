// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Smooth nav on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

// Contact form submit
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('.btn-submit');
  const success = document.getElementById('formSuccess');
  const originalText = button.textContent;
  const formData = new FormData(form);

  success.classList.remove('show');
  success.classList.remove('error');
  button.textContent = 'Enviando...';
  button.disabled = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp'),
        message: formData.get('message')
      })
    });

    if (!response.ok) {
      throw new Error('Falha no envio');
    }

    success.textContent = 'Mensagem enviada! Nossa equipe entrará em contato em breve.';
    success.classList.add('show');
    button.textContent = 'Enviado!';
    form.reset();
  } catch (error) {
    success.textContent = 'Não foi possível enviar a mensagem. Tente novamente em alguns minutos.';
    success.classList.add('error');
    success.classList.add('show');
    button.textContent = originalText;
    button.disabled = false;
  }
});

// Intersection observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .diff-card, .compliance-item, .plan-card, .testimonial').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
