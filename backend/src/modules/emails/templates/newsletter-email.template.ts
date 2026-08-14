import { emailLayout, escapeHtml } from './email-layout';

export interface NewsletterEmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export function buildNewsletterEmail(
  subject: string,
  previewText: string | undefined,
  content: string,
  siteUrl: string,
): NewsletterEmailTemplate {
  const htmlContent = escapeHtml(content).replaceAll('\n', '<br />');

  const body = `
    ${previewText ? `<p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#b4472f">${escapeHtml(previewText)}</p>` : ''}
    <div style="font-size:15px;line-height:1.7;color:#52525b">${htmlContent}</div>
    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#52525b">Ready for something new? Browse this week's arrivals, deals and featured devices in the store.</p>`;

  const footerExtra = `
    <p style="margin:14px 0 0;font-size:11px;line-height:1.7;color:#52525b">You received this email because you subscribed to DeviceDock updates.<br />Manage your notifications from <a href="${siteUrl}/account/notifications" style="color:#a1a1aa;text-decoration:underline">your account</a>.</p>`;

  return {
    subject,
    text: [
      previewText ?? '',
      '',
      content,
      '',
      `Browse the store: ${siteUrl}/shop`,
    ]
      .filter(Boolean)
      .join('\n'),
    html: emailLayout({
      preheader: previewText ?? subject,
      eyebrow: 'DeviceDock update',
      title: subject,
      body,
      primaryCta: { label: 'Browse the store', href: `${siteUrl}/shop` },
      siteUrl,
      footerExtra,
    }),
  };
}
