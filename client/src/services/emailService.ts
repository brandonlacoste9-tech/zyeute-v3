/**
 * Email Service - Marketing and notification emails
 * Uses AI for content generation (Stubbed: OpenAI removed)
 */

import { logger } from '@/lib/logger';

const emailServiceLogger = logger.withContext('EmailService');

// Stub implementation since OpenAI was removed
const MOCK_MARKETING_EMAIL = {
  subject: "🔥 Nouvelles de Zyeuté!",
  body: `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #FF4500;">Salut la gang! ⚜️</h1>
      <p>Voici les dernières nouvelles de votre réseau social préféré.</p>
      <p>On travaille fort pour améliorer Zyeuté!</p>
      <p>À bientôt,<br>L'équipe Zyeuté 🦫</p>
    </div>
  `
};

export const generateMarketingEmail = async (prompt: string): Promise<{ subject: string; body: string }> => {
  emailServiceLogger.info('Generating marketing email (Stub)', { prompt });
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return MOCK_MARKETING_EMAIL;
};

export const sendMarketingEmail = async (
  recipients: string[],
  subject: string,
  body: string
): Promise<void> => {
  // Integration with Resend would go here
  emailServiceLogger.debug(`Sending email to ${recipients.length} recipients`);
  emailServiceLogger.debug(`Subject: ${subject}`);
  // In a real app, we would call the Resend API
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return Promise.resolve();
};
