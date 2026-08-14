import type { PaymentSucceededEvent } from '../../payments/interfaces/payment.interface';
import {
  emailLayout,
  escapeHtml,
  formatMoney,
  renderDivider,
  renderSummaryCard,
} from './email-layout';

export interface NewOrderAdminEmailTemplate {
  subject: string;
  text: string;
  html: string;
  attachments: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export function buildNewOrderAdminEmail(
  event: PaymentSucceededEvent,
  invoice: Buffer,
  siteUrl: string,
): NewOrderAdminEmailTemplate {
  const currency = event.currency.toUpperCase();
  const orderTotal = formatMoney(event.orderTotal, currency);
  const paidNow = formatMoney(event.totalAmount, currency);
  const dueOnDelivery = formatMoney(event.dueOnDelivery, currency);

  const address = [
    event.customer.addressLine,
    event.customer.area,
    event.customer.city,
    event.customer.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  const itemRows = event.items
    .map(
      (item) => `
        <tr>
          <td style="padding:0 0 12px;font-size:13px;line-height:1.5;color:#18181b">${escapeHtml(item.productTitle)} <span style="color:#a1a1aa">· ${escapeHtml(item.productSku)}</span><br /><span style="font-size:12px;color:#71717a">Qty ${item.quantity} × ${escapeHtml(formatMoney(item.unitAmount, currency))}</span></td>
          <td style="padding:0 0 12px;font-size:13px;font-weight:700;color:#18181b;text-align:right;white-space:nowrap">${escapeHtml(formatMoney(item.totalAmount, currency))}</td>
        </tr>`,
    )
    .join('');

  const body = `
    <p style="margin:0;font-size:15px;line-height:1.7;color:#52525b">A new order was just confirmed on DeviceDock and needs fulfilment.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 6px">
      <tr>
        <td style="padding:0 0 10px;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#71717a">Customer and delivery</td>
      </tr>
    </table>
    ${renderSummaryCard([
      { label: 'Customer', value: event.customer.name },
      { label: 'Email', value: event.customer.email },
      { label: 'Phone', value: event.customer.phone },
      { label: 'Address', value: address },
      { label: 'Delivery zone', value: event.deliveryZone.replace('_', ' ') },
      { label: 'Payment method', value: event.paymentMethod.replace('_', ' ') },
    ])}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 6px">
      <tr>
        <td style="padding:0 0 10px;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#71717a">Items</td>
      </tr>
      ${itemRows}
    </table>

    ${renderSummaryCard([
      { label: 'Order total', value: orderTotal, strong: true },
      { label: 'Paid online', value: paidNow },
      ...(event.paymentMethod === 'CASH_ON_DELIVERY'
        ? [{ label: 'Due on delivery', value: dueOnDelivery }]
        : []),
    ])}

    ${renderDivider()}

    <p style="margin:0;font-size:13px;line-height:1.7;color:#71717a">The PDF invoice is attached. Manage this order from the <a href="${siteUrl}/admin/orders" style="color:#b4472f;font-weight:700;text-decoration:none">admin order list</a>.</p>`;

  return {
    subject: `New confirmed order ${event.orderNumber}`,
    text: [
      `Order: ${event.orderNumber}`,
      `Customer: ${event.customer.name}`,
      `Email: ${event.customer.email}`,
      `Phone: ${event.customer.phone}`,
      `Address: ${address}`,
      `Delivery zone: ${event.deliveryZone}`,
      `Payment: ${event.paymentMethod}`,
      '',
      ...event.items.map(
        (item) =>
          `${item.productTitle} (${item.productSku}) × ${item.quantity} — ${formatMoney(item.totalAmount, currency)}`,
      ),
      '',
      `Order total: ${orderTotal}`,
      `Paid online: ${paidNow}`,
      ...(event.paymentMethod === 'CASH_ON_DELIVERY'
        ? [`Due on delivery: ${dueOnDelivery}`]
        : []),
      '',
      `Open admin orders: ${siteUrl}/admin/orders`,
    ].join('\n'),
    html: emailLayout({
      preheader: `Order ${event.orderNumber} was confirmed and is ready for fulfilment.`,
      eyebrow: 'New order',
      title: `Order ${event.orderNumber}`,
      body,
      primaryCta: {
        label: 'Open admin orders',
        href: `${siteUrl}/admin/orders`,
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
