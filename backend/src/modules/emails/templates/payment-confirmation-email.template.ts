import type { PaymentSucceededEvent } from '../../payments/interfaces/payment.interface';
import {
  emailLayout,
  escapeHtml,
  formatMoney,
  renderDivider,
  renderSummaryCard,
} from './email-layout';

export interface PaymentConfirmationEmailTemplate {
  subject: string;
  text: string;
  html: string;
  attachments: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export function buildPaymentConfirmationEmail(
  event: PaymentSucceededEvent,
  invoice: Buffer,
  siteUrl: string,
): PaymentConfirmationEmailTemplate {
  const currency = event.currency.toUpperCase();
  const paidNow = formatMoney(event.totalAmount, currency);
  const orderTotal = formatMoney(event.orderTotal, currency);
  const dueOnDelivery = formatMoney(event.dueOnDelivery, currency);
  const deliveryCharge = formatMoney(event.deliveryCharge, currency);
  const discount = formatMoney(event.discountAmount, currency);

  const isCashOnDelivery = event.paymentMethod === 'CASH_ON_DELIVERY';
  const paymentNote = isCashOnDelivery
    ? `Your card deposit of <strong style="color:#18181b">${paidNow}</strong> is paid. The remaining <strong style="color:#18181b">${dueOnDelivery}</strong> is due when your order arrives.`
    : `We received your payment of <strong style="color:#18181b">${paidNow}</strong>. Your order is now being prepared.`;

  const itemRows = event.items
    .map(
      (item) => `
        <tr>
          <td style="padding:0 0 12px;font-size:14px;line-height:1.5;color:#18181b">${escapeHtml(item.productTitle)} <span style="color:#a1a1aa">· ${escapeHtml(item.productSku)}</span><br /><span style="font-size:12px;color:#71717a">Qty ${item.quantity} × ${escapeHtml(formatMoney(item.unitAmount, currency))}</span></td>
          <td style="padding:0 0 12px;font-size:14px;font-weight:700;color:#18181b;text-align:right;white-space:nowrap">${escapeHtml(formatMoney(item.totalAmount, currency))}</td>
        </tr>`,
    )
    .join('');

  const body = `
    <p style="margin:0;font-size:15px;line-height:1.7;color:#52525b">Hello <strong style="color:#18181b">${escapeHtml(event.customer.name)}</strong>,</p>
    <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#52525b">${paymentNote}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 6px">
      <tr>
        <td style="padding:0 0 10px;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#71717a">Items in this order</td>
      </tr>
      ${itemRows}
    </table>

    ${renderSummaryCard([
      { label: 'Subtotal', value: formatMoney(event.subtotalAmount, currency) },
      ...(event.discountAmount > 0
        ? [{ label: 'Discount', value: `-${discount}` }]
        : []),
      { label: 'Delivery', value: deliveryCharge },
      { label: 'Order total', value: orderTotal, strong: true },
      ...(isCashOnDelivery
        ? [
            { label: 'Paid online', value: paidNow },
            { label: 'Due on delivery', value: dueOnDelivery, strong: true },
          ]
        : []),
    ])}

    ${renderDivider()}

    ${renderSummaryCard([
      { label: 'Order number', value: event.orderNumber, strong: true },
      {
        label: 'Payment date',
        value: new Date(event.paymentDate).toLocaleDateString('en-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
      { label: 'Payment ID', value: event.paymentId.toString() },
    ])}

    <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#71717a">Your PDF invoice is attached to this email. You can also download it anytime from <a href="${siteUrl}/account/orders" style="color:#b4472f;font-weight:700;text-decoration:none">your orders</a>.</p>`;

  return {
    subject: `Order ${event.orderNumber} payment confirmed`,
    text: [
      `Hello ${event.customer.name},`,
      '',
      isCashOnDelivery
        ? `Your card deposit for order ${event.orderNumber} is paid. ${dueOnDelivery} is due in cash on delivery.`
        : `Your payment for order ${event.orderNumber} is confirmed.`,
      '',
      `Order number: ${event.orderNumber}`,
      `Payment ID: ${event.paymentId}`,
      `Order total: ${orderTotal}`,
      ...(isCashOnDelivery
        ? [`Paid online: ${paidNow}`, `Due on delivery: ${dueOnDelivery}`]
        : [`Paid: ${paidNow}`]),
      '',
      'Your PDF invoice is attached. Track the order from your account:',
      `${siteUrl}/account/orders`,
    ].join('\n'),
    html: emailLayout({
      preheader: `Order ${event.orderNumber} is confirmed. Your PDF invoice is attached.`,
      eyebrow: 'Payment confirmed',
      title: `Order ${event.orderNumber} is confirmed`,
      body,
      primaryCta: {
        label: 'View your order',
        href: `${siteUrl}/account/orders`,
      },
      siteUrl,
    }),
    attachments: [
      {
        filename: `devicedock-${event.orderNumber}.pdf`,
        content: invoice,
        contentType: 'application/pdf',
      },
    ],
  };
}
