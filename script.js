/**
 * Om Sai Hospital — Landing Page Scripts
 * WhatsApp appointment booking, navigation, and UI interactions
 */

// ============================================
// CONFIGURATION — Update these values
// ============================================
const CONFIG = {
  // WhatsApp number in international format without + or spaces
  // Example: 919876543210 for +91 98765 43210
  whatsappNumber: '919876543210',
  hospitalName: 'Om Sai Hospital',
};

// ============================================
// DOM Elements
// ============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const modal = document.getElementById('appointmentModal');
const appointmentForm = document.getElementById('appointmentForm');
const doctorSelect = document.getElementById('doctor');
const preferredDateInput = document.getElementById('preferredDate');
const whatsappFloat = document.getElementById('whatsappFloat');

// Set minimum date for appointment to today
if (preferredDateInput) {
  const today = new Date().toISOString().split('T')[0];
  preferredDateInput.setAttribute('min', today);
}

// ============================================
// WhatsApp Helpers
// ============================================
function buildWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
}

function openWhatsApp(message) {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}

// Set floating WhatsApp button link
if (whatsappFloat) {
  const defaultMessage = `Hello ${CONFIG.hospitalName}, I would like to inquire about an appointment.`;
  whatsappFloat.href = buildWhatsAppUrl(defaultMessage);
}

// ============================================
// Mobile Navigation
// ============================================
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// Navbar scroll effect
// ============================================
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 4px 20px rgba(2, 128, 144, 0.2)';
  } else {
    navbar.style.boxShadow = '';
  }
});

// ============================================
// Appointment Modal
// ============================================
function openAppointmentModal(preselectedDoctor = '') {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (preselectedDoctor && doctorSelect) {
    doctorSelect.value = preselectedDoctor;
  }

  const firstInput = document.getElementById('fullName');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 300);
  }
}

function closeAppointmentModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  clearFormErrors();
}

document.querySelectorAll('[data-open-appointment]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const doctor = btn.getAttribute('data-doctor') || '';
    openAppointmentModal(doctor);
  });
});

document.querySelectorAll('[data-close-appointment]').forEach((el) => {
  el.addEventListener('click', closeAppointmentModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeAppointmentModal();
  }
});

// ============================================
// Form Validation
// ============================================
function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach((el) => {
    el.textContent = '';
  });
  document.querySelectorAll('.error').forEach((el) => {
    el.classList.remove('error');
  });
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (field) field.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function validateMobile(mobile) {
  const cleaned = mobile.replace(/\s|-/g, '');
  return /^[6-9]\d{9}$/.test(cleaned) || /^\+?91[6-9]\d{9}$/.test(cleaned);
}

function formatDate(dateStr) {
  if (!dateStr) return 'Not specified';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildAppointmentMessage(data) {
  return [
    `*Appointment Request — ${CONFIG.hospitalName}*`,
    '',
    `*Name:* ${data.fullName}`,
    `*Mobile:* ${data.mobile}`,
    data.email ? `*Email:* ${data.email}` : null,
    `*Doctor:* ${data.doctor}`,
    `*Preferred Date:* ${formatDate(data.preferredDate)}`,
    data.concern ? `*Concern:* ${data.concern}` : null,
    '',
    '_Sent via hospital website_',
  ]
    .filter(Boolean)
    .join('\n');
}

// ============================================
// Form Submit → WhatsApp
// ============================================
if (appointmentForm) {
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    const fullName = document.getElementById('fullName').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const doctor = doctorSelect.value;
    const preferredDate = preferredDateInput.value;
    const concern = document.getElementById('concern').value.trim();

    let isValid = true;

    if (!fullName) {
      setFieldError('fullName', 'Please enter your full name.');
      isValid = false;
    }

    if (!mobile) {
      setFieldError('mobile', 'Please enter your mobile number.');
      isValid = false;
    } else if (!validateMobile(mobile)) {
      setFieldError('mobile', 'Please enter a valid 10-digit Indian mobile number.');
      isValid = false;
    }

    if (!doctor) {
      setFieldError('doctor', 'Please select a doctor.');
      isValid = false;
    }

    if (!isValid) return;

    const message = buildAppointmentMessage({
      fullName,
      mobile,
      email,
      doctor,
      preferredDate,
      concern,
    });

    openWhatsApp(message);
    closeAppointmentModal();
    appointmentForm.reset();
  });

  // Clear errors on input
  appointmentForm.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errorEl = document.getElementById(`${field.id}Error`);
      if (errorEl) errorEl.textContent = '';
    });
  });
}

// ============================================
// Smooth scroll offset for sticky navbar
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
