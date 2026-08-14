import type { RefundCompletedEvent } from '../../payments/refunds/interfaces/refund.interface';
import {
  emailLayout,
  escapeHtml,
  formatMoney,
  renderSummaryCard,
} from './email-layout';

export interface RefundConfirmationEmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export function buildRefundConfirmationEmail(
  event: RefundCompletedEvent,
  siteUrl: string,
): RefundConfirmationEmailTemplate {
  const amount = formatMoney(event.amount, event.currency);

  const body = `
    <p style="margin:0;font-size:15px;line-height:1.7;color:#52525b">Hello <strong style="color:#18181b">${escapeHtml(event.customer.name)}</strong>,</p>
    <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#52525b">A refund of <strong style="color:#18181b">${amount}</strong> for order <strong style="color:#18181b">${escapeHtml(event.orderNumber)}</strong> has been issued. The money will return to your original payment method.</p>

    ${renderSummaryCard([
      { label: 'Refunded amount', value: amount, strong: true },
      { label: 'Order number', value: event.orderNumber },
      { label: 'Refund ID', value: event.refundId.toString() },
      { label: 'Issued on', value: event.refundDate },
      ...(event.reason ? [{ label: 'Reason', value: event.reason }] : []),
    ])}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 6px">
      <tr>
        <td style="padding:0 0 10px;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#71717a">What happens next</td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="24" valign="top" style="padding:2px 0 10px;font-size:15px;font-weight:800;color:#b4472f">1</td>
        <td style="padding:0 0 10px;font-size:14px;line-height:1.6;color:#52525b">Your refund leaves our payment provider.</td>
      </tr>
      <tr>
        <td width="24" valign="top" style="padding:2px 0 0;font-size:15px;font-weight:800;color:#b4472f">2</td>
        <td style="padding:0;font-size:14px;line-height:1.6;color:#52525b">It usually reaches your account within a few business days.</td>
      </tr>
    </table>

    <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#71717a">Questions about this refund? <a href="${siteUrl}/contact" style="color:#b4472f;font-weight:700;text-decoration:none">Contact our support team</a> — we are happy to help.</p>`;

  return {
    subject: `Refund issued for order ${event.orderNumber}`,
    text: [
      `Hello ${event.customer.name},`,
      '',
      `A refund of ${amount} for order ${event.orderNumber} has been issued.`,
      'The amount will be returned to your original payment method within a few business days.',
      ...(event.reason ? [`Reason: ${event.reason}`] : []),
      `Refund ID: ${event.refundId}`,
      `Issued on: ${event.refundDate}`,
      '',
      `View your order: ${siteUrl}/account/orders`,
      `Contact support: ${siteUrl}/contact`,
    ].join('\n'),
    html: emailLayout({
      preheader: `A refund of ${amount} for order ${event.orderNumber} has been issued.`,
      eyebrow: 'Refund issued',
      title: `Refund of ${amount} issued`,
      body,
      primaryCta: {
        label: 'View your order',
        href: `${siteUrl}/account/orders`,
      },
      secondaryCta: { label: 'Contact support', href: `${siteUrl}/contact` },
      siteUrl,
    }),
  };
}
