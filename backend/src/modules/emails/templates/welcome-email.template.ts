import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { emailLayout, escapeHtml } from './email-layout';

const WELCOME_BANNER_CID = 'welcome-banner@nestjs-learning';
const welcomeBanner = readFileSync(
  join(__dirname, '../assets/welcome-banner.png'),
);

export interface WelcomeEmailTemplate {
  subject: string;
  text: string;
  html: string;
  attachments: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
    cid: string;
  }>;
}

export function buildWelcomeEmail(
  name: string,
  siteUrl: string,
): WelcomeEmailTemplate {
  const safeName = escapeHtml(name);

  const body = `
    <p style="margin:0 0 6px;font-size:15px;line-height:1.7;color:#52525b">Thanks for joining <strong style="color:#18181b">DeviceDock</strong>, ${safeName}. Your account is ready and your cart is saved.</p>
    <p style="margin:14px 0 4px;font-size:15px;line-height:1.7;color:#52525b">Here is how to get started:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 0">
      <tr>
        <td width="24" valign="top" style="padding:2px 0 10px;font-size:15px;font-weight:800;color:#b4472f">1</td>
        <td style="padding:0 0 10px;font-size:14px;line-height:1.6;color:#52525b"><strong style="color:#18181b">Browse the collection</strong><br />Phones, laptops, tablets, audio, watches and accessories.</td>
      </tr>
      <tr>
        <td width="24" valign="top" style="padding:2px 0 10px;font-size:15px;font-weight:800;color:#b4472f">2</td>
        <td style="padding:0 0 10px;font-size:14px;line-height:1.6;color:#52525b"><strong style="color:#18181b">Build your selection</strong><br />Save to your wishlist and add what fits to your cart.</td>
      </tr>
      <tr>
        <td width="24" valign="top" style="padding:2px 0 10px;font-size:15px;font-weight:800;color:#b4472f">3</td>
        <td style="padding:0 0 10px;font-size:14px;line-height:1.6;color:#52525b"><strong style="color:#18181b">Check out your way</strong><br />Pay by card, or cash on delivery with a small card deposit.</td>
      </tr>
      <tr>
        <td width="24" valign="top" style="padding:2px 0 0;font-size:15px;font-weight:800;color:#b4472f">4</td>
        <td style="padding:0;font-size:14px;line-height:1.6;color:#52525b"><strong style="color:#18181b">Follow your order</strong><br />Track every step and download invoices from your account.</td>
      </tr>
    </table>`;

  const headerBannerHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <img src="cid:${WELCOME_BANNER_CID}" width="600" alt="Welcome to DeviceDock" style="display:block;width:100%;height:auto;border-radius:20px 20px 0 0" />
        </td>
      </tr>
    </table>`;

  return {
    subject: 'Welcome to DeviceDock',
    text: [
      `Hi ${name},`,
      '',
      'Welcome to DeviceDock! Your account is ready.',
      '',
      'Explore phones, laptops, tablets, audio, watches and accessories. Save what you like to your wishlist, build your cart, and check out with card or cash on delivery.',
      '',
      `Explore the store: ${siteUrl}/shop`,
      `Go to your account: ${siteUrl}/profile`,
      '',
      'The DeviceDock team',
    ].join('\n'),
    html: emailLayout({
      preheader:
        'Your DeviceDock account is ready. Explore phones, laptops, audio and more.',
      title: `Hi ${safeName}, welcome to DeviceDock`,
      body,
      primaryCta: { label: 'Explore the store', href: `${siteUrl}/shop` },
      secondaryCta: { label: 'Go to your account', href: `${siteUrl}/profile` },
      headerBannerHtml,
      siteUrl,
    }),
    attachments: [
      {
        filename: 'welcome-banner.png',
        content: welcomeBanner,
        contentType: 'image/png',
        cid: WELCOME_BANNER_CID,
      },
    ],
  };
}
