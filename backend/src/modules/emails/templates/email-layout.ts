export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatMoney(amountInCents: number, currency: string): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

export interface EmailCta {
  label: string;
  href: string;
}

export interface EmailLayoutOptions {
  preheader?: string;
  eyebrow?: string;
  title: string;
  body: string;
  primaryCta?: EmailCta;
  secondaryCta?: EmailCta;
  headerBannerHtml?: string;
  siteUrl: string;
  footerExtra?: string;
}

function renderButton(cta: EmailCta): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0 4px">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#b4472f;border-radius:999px">
                <a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:14px 36px;border-radius:999px;background:#b4472f;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">${escapeHtml(cta.label)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function renderFooter(siteUrl: string, footerExtra?: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;border-radius:0 0 20px 20px">
      <tr>
        <td align="center" style="padding:32px 40px 0">
          <span style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#ffffff">Device<span style="color:#e58055">Dock</span></span>
          <p style="margin:10px auto 0;max-width:380px;font-size:12px;line-height:1.7;color:#71717a">Premium electronics, clear specifications and a simpler way to choose your next device.</p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:24px 40px 0">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 14px;font-size:12px;font-weight:700"><a href="${siteUrl}/shop" style="color:#a1a1aa;text-decoration:none">Shop</a></td>
              <td style="padding:0 14px;font-size:12px;font-weight:700"><a href="${siteUrl}/account/orders" style="color:#a1a1aa;text-decoration:none">Orders</a></td>
              <td style="padding:0 14px;font-size:12px;font-weight:700"><a href="${siteUrl}/cart" style="color:#a1a1aa;text-decoration:none">Cart</a></td>
              <td style="padding:0 14px;font-size:12px;font-weight:700"><a href="${siteUrl}/contact" style="color:#a1a1aa;text-decoration:none">Support</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:24px 40px 30px">
          <p style="margin:0;border-top:1px solid #1f1f23;padding-top:22px;font-size:11px;line-height:1.8;color:#52525b">© 2026 DeviceDock · Built for Bangladesh<br />Dhaka, Bangladesh · <a href="${siteUrl}/contact" style="color:#a1a1aa;text-decoration:none">Contact us</a></p>
          ${footerExtra ?? ''}
        </td>
      </tr>
    </table>`;
}

export function emailLayout(options: EmailLayoutOptions): string {
  const {
    preheader,
    eyebrow,
    title,
    body,
    primaryCta,
    secondaryCta,
    headerBannerHtml,
    siteUrl,
    footerExtra,
  } = options;

  const preheaderHtml = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f7f7f8">${escapeHtml(preheader)}</div>`
    : '';

  const headerHtml = headerBannerHtml
    ? headerBannerHtml
    : `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:34px 24px 30px">
            <span style="font-size:24px;font-weight:800;letter-spacing:-0.02em;color:#ffffff">Device<span style="color:#e58055">Dock</span></span>
          </td>
        </tr>
      </table>`;

  const eyebrowHtml = eyebrow
    ? `<p style="margin:0 0 12px;font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#b4472f">${escapeHtml(eyebrow)}</p>`
    : '';

  const ctaHtml = primaryCta
    ? `${renderButton(primaryCta)}${
        secondaryCta
          ? `<p style="margin:18px 0 0;text-align:center;font-size:13px;font-weight:700"><a href="${escapeHtml(secondaryCta.href)}" style="color:#b4472f;text-decoration:none">${escapeHtml(secondaryCta.label)}</a></p>`
          : ''
      }`
    : '';

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;padding:0;background:#f7f7f8;font-family:Arial,Helvetica,sans-serif;color:#18181b;-webkit-text-size-adjust:100%">
        ${preheaderHtml}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f8">
          <tr>
            <td align="center" style="padding:36px 16px 48px">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
                <tr>
                  <td style="background:#0a0a0b;border-radius:20px 20px 0 0">${headerHtml}</td>
                </tr>
                <tr>
                  <td style="background:#ffffff;padding:36px 40px 40px;border-radius:0 0 20px 20px">
                    ${eyebrowHtml}
                    <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;color:#0a0a0b">${escapeHtml(title)}</h1>
                    ${body}
                    ${ctaHtml}
                  </td>
                </tr>
                <tr>
                  <td>${renderFooter(siteUrl, footerExtra)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `.trim();
}

export interface SummaryRow {
  label: string;
  value: string;
  strong?: boolean;
}

export function renderSummaryCard(rows: SummaryRow[]): string {
  const rowsHtml = rows
    .map((row, index) => {
      const verticalPadding = index === 0 ? '0 20px 12px' : '12px 20px';
      return `
        <tr>
          <td style="padding:${verticalPadding};font-size:13px;color:#52525b;white-space:nowrap">${escapeHtml(row.label)}</td>
          <td style="padding:${verticalPadding};font-size:13px;color:${row.strong ? '#0a0a0b' : '#18181b'};font-weight:${row.strong ? '800' : '600'};text-align:right">${escapeHtml(row.value)}</td>
        </tr>
        ${index < rows.length - 1 ? `<tr><td colspan="2" style="padding:0 20px"><div style="height:1px;background:#ececf0"></div></td></tr>` : ''}`;
    })
    .join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;background:#f7f7f8;border:1px solid #e6e6ea;border-radius:14px">
      ${rowsHtml}
    </table>`;
}

export function renderDivider(): string {
  return `<div style="height:1px;background:#ececf0;margin:24px 0"></div>`;
}
