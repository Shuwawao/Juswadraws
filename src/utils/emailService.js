import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const isEmailJSConfigured = Boolean(
  serviceId &&
  templateId &&
  publicKey &&
  !serviceId.includes('your') &&
  !templateId.includes('your') &&
  !publicKey.includes('your')
);

/**
 * Send commission inquiry email via EmailJS
 * @param {Object} params Form payload
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendCommissionInquiry(params) {
  // 1. Anti-spam Honeypot check
  if (params.honeypot && params.honeypot.trim().length > 0) {
    console.warn('Spam submission detected via honeypot.');
    // Pretend to process to fool simple bots without sending
    return { success: true, message: 'Inquiry received.' };
  }

  // 2. Client-side Rate limiting check (prevent accidental double-clicks or flood within 30s)
  const lastSubmission = localStorage.getItem('juswa_last_inquiry_time');
  const now = Date.now();
  if (lastSubmission && now - parseInt(lastSubmission, 10) < 30000) {
    const waitSeconds = Math.ceil((30000 - (now - parseInt(lastSubmission, 10))) / 1000);
    throw new Error(`Please wait ${waitSeconds} seconds before submitting another inquiry.`);
  }

  // 3. Configuration check
  if (!isEmailJSConfigured) {
    throw new Error(
      'EmailJS service is not configured with live credentials. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.'
    );
  }

  const templateParams = {
    to_email: 'joshualagare255@gmail.com',
    client_name: params.clientName,
    client_email: params.clientEmail,
    artwork_type: params.artworkType,
    currency: params.currency,
    estimated_price: params.estimatedPrice,
    description: params.description,
    reference_links: params.referenceLinks || 'None provided',
    deadline: params.deadline || 'Flexible / ~1 week',
    additional_characters: params.additionalCharacters ? 'Yes (Requires custom quote)' : 'No',
    detailed_background: params.detailedBackground ? 'Yes (Requires custom quote)' : 'No',
    preferred_style: params.preferredStyle || 'Artist standard / MHA style',
    notes: params.notes || 'None'
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    if (response.status === 200) {
      localStorage.setItem('juswa_last_inquiry_time', now.toString());
      return { success: true, message: 'Commission inquiry successfully sent to Joshua (JUSWADRAWS)!' };
    } else {
      throw new Error(`Email delivery returned status ${response.status}: ${response.text}`);
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw new Error(error.text || error.message || 'Failed to deliver inquiry email.');
  }
}
