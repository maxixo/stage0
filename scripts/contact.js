// Simple client-side validation for aboutme form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const email = document.getElementById('mail');
  const name = document.getElementById('full-name');
  const message = document.getElementById('message');
  const subject = document.getElementById('subject');
  const errorEl = document.getElementById('error');
  const validEl = document.getElementById('valid');
  const nameError = document.getElementById('full-name-error');
  const mailError = document.getElementById('mail-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function showError(text) {
    // show global error
    errorEl.textContent = text;
    validEl.textContent = '';
    errorEl.classList.add('visible');
    validEl.classList.remove('visible');
  }

  function showSuccess(text) {
    // clear field errors
    [nameError, mailError, subjectError, messageError].forEach(el => { if(el) el.textContent = ''; });
    [name, email, subject, message].forEach(f => { if(f) f.removeAttribute('aria-invalid'); });

    validEl.textContent = text;
    errorEl.textContent = '';
    validEl.classList.add('visible');
    errorEl.classList.remove('visible');
  }

  function isValidEmail(value) {
    // simple email regex (not perfect but good enough for client-side)
    return /\S+@\S+\.\S+/.test(value);
  }

  // Clear a specific field's error when its value meets validation rules
  function clearFieldError(field, errorElement) {
    if (!field) return;
    const val = (field.value || '').trim();
    let valid = true;
    switch (field.id) {
      case 'full-name':
        valid = val.length > 0;
        break;
      case 'mail':
        valid = isValidEmail(val);
        break;
      case 'subject':
        valid = val.length >= 3;
        break;
      case 'message':
        valid = val.length >= 10;
        break;
      default:
        valid = val.length > 0;
    }

    if (valid) {
      if (errorElement) errorElement.textContent = '';
      field.removeAttribute('aria-invalid');
      updateGlobalErrorState();
    }
  }

  // If there are no remaining field errors, clear the global error
  function updateGlobalErrorState() {
    const hasFieldErrors = [nameError, mailError, subjectError, messageError].some(el => el && el.textContent && el.textContent.trim().length > 0);
    if (!hasFieldErrors) {
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }
  }

  // Attach input listeners to clear errors live as the user types
  if (name) name.addEventListener('input', () => clearFieldError(name, nameError));
  if (email) email.addEventListener('input', () => clearFieldError(email, mailError));
  if (subject) subject.addEventListener('input', () => clearFieldError(subject, subjectError));
  if (message) message.addEventListener('input', () => clearFieldError(message, messageError));

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nameVal = name.value.trim();
    const emailVal = email.value.trim();
    const messageVal = message.value.trim();

    if (!nameVal) {
      const msg = 'Please enter your full name.';
      showError(msg);
      if (nameError) nameError.textContent = msg;
      name.setAttribute('aria-invalid', 'true');
      name.focus();
      return;
    }

    if (!emailVal) {
      const msg = 'Please enter your email address.';
      showError(msg);
      if (mailError) mailError.textContent = msg;
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return;
    }

    if (!isValidEmail(emailVal)) {
      const msg = 'Please enter a valid email address.';
      showError(msg);
      if (mailError) mailError.textContent = msg;
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return;
    }

    if (!subject || !subject.value.trim()) {
      const msg = 'Please enter a subject.';
      showError(msg);
      if (subjectError) subjectError.textContent = msg;
      if (subject) subject.setAttribute('aria-invalid', 'true');
      if (subject) subject.focus();
      return;
    }


    if (!messageVal) {
      const msg = 'Please enter a message.';
      showError(msg);
      if (messageError) messageError.textContent = msg;
      message.setAttribute('aria-invalid', 'true');
      message.focus();
      return;
    }

    if (messageVal.length < 10) {
      const msg = 'Your message must be at least 10 characters long.';
      showError(msg);
      if (messageError) messageError.textContent = msg;
      message.setAttribute('aria-invalid', 'true');
      message.focus();
      return;
    }

    // If we reach here, the form is valid.
    showSuccess('Thanks — your message looks good! (form not submitted in demo)');

    // TODO: actually submit via fetch/ajax or remove preventDefault to allow normal submission
  });
});
