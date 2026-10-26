import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_8isbnsh';
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_rcwpv3h';
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'K-7G1zd0zimZrSQe-';

export const isEmailJSConfigured = Boolean(
  serviceId &&
  templateId &&
  publicKey &&
  !serviceId.includes('your') &&
  !templateId.includes('your') &&
  !publicKey.includes('your')
);

/**
 * Generate formatted mailto URL for direct email client fallback
 * @param {Object} params Form payload
 * @returns {string} mailto: URL
 */
export function generateMailtoUrl(params = {}) {
  const recipient = 'joshualagare255@gmail.com';
  const artworkType = params.artworkType || 'Commission';
  const clientName = params.clientName || 'Inquirer';
  const subject = `[JUSWADRAWS Commission] ${artworkType} - ${clientName}`;

  const body = `Hi Joshua,

I would like to inquire about a digital art commission! Here are my project details:

--------------------------------------------------
CLIENT INFORMATION
--------------------------------------------------
• Name / Nickname: ${params.clientName || 'N/A'}
• Email: ${params.clientEmail || 'N/A'}

--------------------------------------------------
PROJECT SPECIFICATIONS
--------------------------------------------------
• Artwork Type: ${params.artworkType || 'Half Body'}
• Currency: ${params.currency || 'PHP'}
• Estimated Price: ${params.estimatedPrice || '₱500'}
• Target Completion: ${params.deadline || 'Flexible / ~1 week'}
• Preferred Style: ${params.preferredStyle || 'MHA / Kinetic Anime Style'}

--------------------------------------------------
ARTWORK DESCRIPTION
--------------------------------------------------
${params.description || 'N/A'}

--------------------------------------------------
REFERENCE LINKS
--------------------------------------------------
${params.referenceLinks || 'None provided'}

--------------------------------------------------
ADD-ONS
--------------------------------------------------
• Additional Characters: ${params.additionalCharacters ? 'Yes' : 'No'}
• Detailed Background: ${params.detailedBackground ? 'Yes' : 'No'}
${params.notes ? `\n• Extra Notes: ${params.notes}` : ''}

Looking forward to your confirmation and sketch schedule!

Best regards,
${params.clientName || 'Client'}`;

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Send commission inquiry email via EmailJS
 * @param {Object} params Form payload
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendCommissionInquiry(params) {
  // 1. Anti-spam Honeypot check
  if (params.honeypot && params.honeypot.trim().length > 0) {
    console.warn('Spam submission detected via honeypot.');
    return { success: true, message: 'Inquiry received.' };
  }

  // 2. Client-side Rate limiting check (prevent accidental double-clicks within 10s)
  const lastSubmission = localStorage.getItem('juswa_last_inquiry_time');
  const now = Date.now();
  if (lastSubmission && now - parseInt(lastSubmission, 10) < 10000) {
    const waitSeconds = Math.ceil((10000 - (now - parseInt(lastSubmission, 10))) / 1000);
    throw new Error(`Please wait ${waitSeconds} seconds before submitting another inquiry.`);
  }

  // 3. Configuration check
  if (!isEmailJSConfigured) {
    throw new Error(
      'EmailJS service is not configured with live credentials.'
    );
  }

  const synthesizedMessage = `
NEW COMMISSION INQUIRY
========================
Client: ${params.clientName}
Email: ${params.clientEmail}
Artwork Type: ${params.artworkType}
Estimated Price: ${params.estimatedPrice} (${params.currency})
Target Deadline: ${params.deadline || 'Flexible / ~1 week'}

Description:
${params.description}

Reference Links:
${params.referenceLinks || 'None provided'}

Options:
- Additional Characters: ${params.additionalCharacters ? 'Yes' : 'No'}
- Detailed Background: ${params.detailedBackground ? 'Yes' : 'No'}
- Preferred Style: ${params.preferredStyle || 'MHA / Kinetic Anime Style'}
${params.notes ? `\nNotes:\n${params.notes}` : ''}
  `.trim();

  // Multi-key templateParams to match any standard EmailJS template mapping
  const templateParams = {
    to_email: 'joshualagare255@gmail.com',
    to_name: 'Joshua Lagare (JUSWADRAWS)',
    reply_to: params.clientEmail,
    from_name: params.clientName,
    from_email: params.clientEmail,
    client_name: params.clientName,
    client_email: params.clientEmail,
    name: params.clientName,
    email: params.clientEmail,
    artwork_type: params.artworkType,
    currency: params.currency,
    estimated_price: params.estimatedPrice,
    description: params.description,
    reference_links: params.referenceLinks || 'None provided',
    deadline: params.deadline || 'Flexible / ~1 week',
    additional_characters: params.additionalCharacters ? 'Yes' : 'No',
    detailed_background: params.detailedBackground ? 'Yes' : 'No',
    preferred_style: params.preferredStyle || 'MHA / Kinetic Anime Style',
    notes: params.notes || 'None',
    subject: `[JUSWADRAWS Commission] ${params.artworkType} - ${params.clientName}`,
    message: synthesizedMessage
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
