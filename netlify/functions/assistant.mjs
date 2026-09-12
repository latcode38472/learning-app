/**
 * Netlify Function: the AI assistant backend at /api/assistant/*.
 *
 * Configuration lives in the Netlify site environment (Site configuration →
 * Environment variables), never in the repository:
 *   OWNER_PASSWORD     the owner's sign-in password (8+ characters)
 *   ASSISTANT_SECRET   random string, 16+ characters; encrypts the stored key
 * The OpenRouter API key itself is pasted by the owner on the /#/owner page
 * and stored encrypted in Netlify Blobs. See docs/ASSISTANT-SETUP.md.
 */
import { createAssistantHandler } from '../../server/assistant/handler.mjs';
import { createNetlifyBlobStorage } from '../../server/assistant/storage.mjs';

let handlerPromise = null;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      const storage = await createNetlifyBlobStorage();
      return createAssistantHandler({ env: process.env, storage, log: (m) => console.log(`[assistant] ${m}`) });
    })();
  }
  return handlerPromise;
}

export default async (request, context) => {
  const handler = await getHandler();
  return handler(request, { ip: context?.ip });
};

export const config = {
  path: '/api/assistant/*',
};
