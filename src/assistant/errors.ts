/**
 * Localized, honest explanations of assistant errors. Every code the backend
 * can emit has an entry; unknown codes fall back to a generic message that
 * still says the model did not answer.
 */
import type { LangCode } from '@/content/schema';

const MESSAGES: Record<LangCode, Record<string, string>> = {
  en: {
    not_configured: 'The AI assistant is not set up on this site yet.',
    learners_disabled: 'The site owner has not opened the AI assistant to learners yet.',
    invalid_key: 'The site’s OpenRouter key was rejected. The owner needs to check it.',
    no_credits: 'The site’s OpenRouter account has no credits left, so the model cannot answer right now.',
    forbidden: 'OpenRouter refused this request (moderation or permissions).',
    model_not_found: 'The model chosen by the site owner is not available on OpenRouter.',
    model_unavailable: 'The model is unavailable right now. Try again in a minute.',
    provider_rate_limited: 'OpenRouter is rate limiting this site’s key. Try again shortly.',
    rate_limited: 'You are sending messages too quickly. Wait a moment and try again.',
    daily_limit: 'You have reached today’s limit of AI messages on this device.',
    budget_exhausted: 'The AI assistant has used up its budget for now.',
    message_too_long: 'That message is too long for the assistant.',
    conversation_too_long: 'This conversation is too long to send. Start a new chat.',
    bad_messages: 'The conversation could not be sent. Start a new chat.',
    timeout: 'OpenRouter took too long to answer.',
    network: 'The server could not reach OpenRouter.',
    decrypt_failed: 'The assistant is misconfigured on the server (the saved key cannot be read).',
    csrf: 'The request was blocked for safety. Reload the page and try again.',
    owner_required: 'Owner sign-in required.',
    aborted: 'Stopped.',
    unknown: 'The model did not answer because of an unexpected error.',
    unreachable: 'The assistant backend cannot be reached from this page.',
  },
  he: {
    not_configured: 'עוזר ה-AI עדיין לא הוגדר באתר הזה.',
    learners_disabled: 'בעל האתר עדיין לא פתח את עוזר ה-AI ללומדים.',
    invalid_key: 'מפתח ה-OpenRouter של האתר נדחה. בעל האתר צריך לבדוק אותו.',
    no_credits: 'לחשבון ה-OpenRouter של האתר לא נשאר אשראי, ולכן המודל לא יכול לענות כרגע.',
    forbidden: 'OpenRouter סירב לבקשה הזאת (סינון תוכן או הרשאות).',
    model_not_found: 'המודל שבעל האתר בחר אינו זמין ב-OpenRouter.',
    model_unavailable: 'המודל לא זמין כרגע. נסו שוב בעוד דקה.',
    provider_rate_limited: 'OpenRouter מגביל כרגע את המפתח של האתר. נסו שוב בקרוב.',
    rate_limited: 'אתם שולחים הודעות מהר מדי. חכו רגע ונסו שוב.',
    daily_limit: 'הגעתם למכסת ההודעות היומית של עוזר ה-AI במכשיר הזה.',
    budget_exhausted: 'עוזר ה-AI ניצל את התקציב שלו לעת עתה.',
    message_too_long: 'ההודעה הזאת ארוכה מדי בשביל העוזר.',
    conversation_too_long: 'השיחה הזאת ארוכה מדי לשליחה. התחילו שיחה חדשה.',
    bad_messages: 'לא הצלחנו לשלוח את השיחה. התחילו שיחה חדשה.',
    timeout: 'OpenRouter לא ענה בזמן.',
    network: 'השרת לא הצליח להגיע ל-OpenRouter.',
    decrypt_failed: 'העוזר מוגדר בצורה שגויה בשרת (אי אפשר לקרוא את המפתח השמור).',
    csrf: 'הבקשה נחסמה מטעמי בטיחות. טענו את הדף מחדש ונסו שוב.',
    owner_required: 'נדרשת כניסה של בעל האתר.',
    aborted: 'נעצר.',
    unknown: 'המודל לא ענה בגלל שגיאה לא צפויה.',
    unreachable: 'אי אפשר להגיע לשרת של העוזר מהדף הזה.',
  },
};

export function describeAssistantError(code: string | undefined, lang: LangCode, fallback?: string): string {
  const table = MESSAGES[lang] ?? MESSAGES.en;
  if (code && table[code]) return table[code];
  return fallback && fallback.trim() ? fallback : table.unknown;
}
