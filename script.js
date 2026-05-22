/**
 * Shree Om Hospital — Landing Page Scripts
 * WhatsApp appointment booking, navigation, and UI interactions
 */

// ============================================
// CONFIGURATION — Update these values
// ============================================
const CONFIG = {
  hospitalName: 'Shree Om Hospital',
  // 10-digit Indian mobile (Call Now + WhatsApp appointments)
  phoneNumber: '9829895006',
  doctorPhones: {
    vivek: '9829895006',
    rashi: '9351711300',
  },
  mapsPlaceUrl:
    'https://www.google.com/maps/place/Shri+Om+Hospital/@26.6027272,75.9454406,17z/data=!3m1!4b1!4m6!3m5!1s0x396ddbacdb24f5d3:0xbb66e8a80b2afaeb!8m2!3d26.6027272!4d75.9480155!16s%2Fg%2F11c2p49c9l?entry=ttu',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13622.4!2d75.9480155!3d26.6027272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396ddbacdb24f5d3%3A0xbb66e8a80b2afaeb!2sShri%20Om%20Hospital!5e0!3m2!1sen!2sin!4v1730000000000!5m2!1sen!2sin',
  addressLines: [
    'Shree Om Hospital, Chaksu Road,',
    'Akodiya, Chaksu, Jaipur, Rajasthan — 303901',
  ],
  addressShort: 'Chaksu Road, Akodiya, Chaksu, Jaipur — 303901',
};

// ============================================
// DOM Elements
// ============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const modal = document.getElementById('appointmentModal');
const callModal = document.getElementById('callModal');
const callModalPhone = document.getElementById('callModalPhone');
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
// WhatsApp Helpers (mobile app / desktop Web)
// ============================================
const MOBILE_LAYOUT_MEDIA = '(max-width: 768px)';

function isMobileLayout() {
  return window.matchMedia(MOBILE_LAYOUT_MEDIA).matches;
}

function getWhatsAppNumber() {
  return `91${CONFIG.phoneNumber}`;
}

function buildWhatsAppUrl(message, { forWeb = false } = {}) {
  const encoded = encodeURIComponent(message);
  const phone = getWhatsAppNumber();
  if (forWeb) {
    return `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  }
  return `https://wa.me/${phone}?text=${encoded}`;
}

function openWhatsApp(message) {
  const forWeb = !isMobileLayout();
  const url = buildWhatsAppUrl(message, { forWeb });

  if (forWeb) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
}

// Set floating WhatsApp button link
if (whatsappFloat) {
  const defaultMessage = `Hello ${CONFIG.hospitalName}, I would like to inquire about an appointment.`;
  whatsappFloat.addEventListener('click', (e) => {
    e.preventDefault();
    openWhatsApp(defaultMessage);
  });
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
  if (!callModal?.classList.contains('active')) {
    document.body.style.overflow = '';
  }
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
  if (e.key !== 'Escape') return;
  if (callModal && callModal.classList.contains('active')) {
    closeCallModal();
  } else if (modal.classList.contains('active')) {
    closeAppointmentModal();
  }
});

// ============================================
// Call Now — desktop popup, mobile dialer
// ============================================
function formatPhoneDisplay(number) {
  if (number.length === 10) {
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
  }
  return `+91 ${number}`;
}

function initContactDetails() {
  const telHref = getTelHref();
  const phoneDisplay = formatPhoneDisplay(CONFIG.phoneNumber);

  document.querySelectorAll('[data-phone-link]').forEach((el) => {
    el.setAttribute('href', telHref);
    if (el.hasAttribute('data-phone-text')) {
      el.textContent = phoneDisplay;
    }
  });

  const directions = document.getElementById('getDirections');
  if (directions) directions.href = CONFIG.mapsPlaceUrl;

  const mapFrame = document.getElementById('locationMap');
  if (mapFrame) mapFrame.src = CONFIG.mapsEmbedUrl;

  const addressEl = document.getElementById('locationAddress');
  if (addressEl) {
    addressEl.innerHTML = CONFIG.addressLines.join('<br>');
  }

  const footerAddress = document.getElementById('footerAddress');
  if (footerAddress) footerAddress.textContent = CONFIG.addressShort;
}

function resolveCallPhone(trigger) {
  const fromButton = trigger?.getAttribute('data-phone');
  if (fromButton) return fromButton.replace(/\D/g, '');
  return CONFIG.phoneNumber;
}

function getTelHref(phone = CONFIG.phoneNumber) {
  return `tel:+91${phone}`;
}

function isMobileCallContext() {
  return isMobileLayout();
}

function openCallModal(phone, subtitle = '') {
  if (!callModal) return;
  if (callModalPhone) {
    callModalPhone.textContent = formatPhoneDisplay(phone);
  }
  const callModalSubtitle = document.getElementById('callModalSubtitle');
  if (callModalSubtitle) {
    callModalSubtitle.textContent =
      subtitle || 'Reach Shree Om Hospital on the number below.';
  }
  callModal.classList.add('active');
  callModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCallModal() {
  if (!callModal) return;
  callModal.classList.remove('active');
  callModal.setAttribute('aria-hidden', 'true');
  if (!modal.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('[data-call-now]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (navMenu?.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    const phone = resolveCallPhone(btn);
    const subtitle = btn.getAttribute('data-call-label') || '';

    if (isMobileCallContext()) {
      window.location.href = getTelHref(phone);
      return;
    }
    openCallModal(phone, subtitle);
  });
});

document.querySelectorAll('[data-close-call]').forEach((el) => {
  el.addEventListener('click', closeCallModal);
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

initContactDetails();
