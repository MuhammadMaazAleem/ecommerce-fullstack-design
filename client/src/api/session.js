const SESSION_KEY = 'ecom_session_id';

const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const getSessionId = () => {
  const existing = localStorage.getItem(SESSION_KEY);

  if (existing) {
    return existing;
  }

  const sessionId = generateSessionId();
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};
