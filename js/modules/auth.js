const USER_KEY = 'foodieVerseUser';
const SESSION_KEY = 'foodieVerseSession';

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, '');
}

export function getRegisteredUser() {
  return readJson(USER_KEY);
}

export function getCurrentUser() {
  return readJson(SESSION_KEY);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function registerUser({ fullName, email, phone, password }) {
  const existing = getRegisteredUser();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (existing && (existing.email === normalizedEmail || existing.phone === normalizedPhone)) {
    return { ok: false, message: 'An account with that email or phone number already exists.' };
  }

  const user = {
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function loginUser(identifier, password) {
  const user = getRegisteredUser();
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const matchesUser = user && (
    user.email === normalizedIdentifier ||
    user.phone === normalizePhone(identifier)
  );

  if (!matchesUser || user.password !== password) {
    return { ok: false, message: 'Those details do not match an account. Please try again.' };
  }

  const session = { fullName: user.fullName, email: user.email, phone: user.phone };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user: session };
}
