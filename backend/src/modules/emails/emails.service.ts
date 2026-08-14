import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import { EMAIL_TRANSPORTER } from './constants/email.tokens';
import { buildWelcomeEmail } from './templates/welcome-email.template';
import { buildNewsletterEmail } from './templates/newsletter-email.template';
import { buildPaymentConfirmationEmail } from './templates/payment-confirmation-email.template';
import { buildNewOrderAdminEmail } from './templates/new-order-admin-email.template';
import { buildRefundConfirmationEmail } from './templates/refund-confirmation-email.template';
import type { PaymentSucceededEvent } from '../payments/interfaces/payment.interface';
import type { RefundCompletedEvent } from '../payments/refunds/interfaces/refund.interface';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    @Inject(EMAIL_TRANSPORTER)
    private readonly transporter: Transporter,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    if (!this.configService.get<boolean>('email.enabled', false)) {
      this.logger.debug(`Welcome email skipped for ${to}: mail is disabled`);
      return;
    }

    const template = buildWelcomeEmail(name, this.siteUrl());

    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('email.from'),
      to,
      ...template,
    });
  }

  async sendNewsletterEmail(
    to: string,
    subject: string,
    content: string,
    previewText?: string,
  ): Promise<void> {
    if (!this.configService.get<boolean>('email.enabled', false)) {
      this.logger.debug(`Newsletter email skipped for ${to}: mail is disabled`);
      return;
    }

    const template = buildNewsletterEmail(
      subject,
      previewText,
      content,
      this.siteUrl(),
    );

    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('email.from'),
      to,
      ...template,
    });
  }

  async sendPaymentConfirmation(
    event: PaymentSucceededEvent,
    invoice: Buffer,
  ): Promise<void> {
    if (!this.configService.get<boolean>('email.enabled', false)) {
      this.logger.debug(
        `Payment confirmation skipped for ${event.customer.email}: mail is disabled`,
      );
      return;
    }

    const template = buildPaymentConfirmationEmail(
      event,
      invoice,
      this.siteUrl(),
    );

    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('email.from'),
      to: event.customer.email,
      ...template,
    });
  }

  async sendNewOrderToAdmin(
    event: PaymentSucceededEvent,
    invoice: Buffer,
  ): Promise<void> {
    if (!this.configService.get<boolean>('email.enabled', false)) return;

    const template = buildNewOrderAdminEmail(event, invoice, this.siteUrl());

    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('email.from'),
      to: this.configService.getOrThrow<string>('email.adminTo'),
      ...template,
    });
  }

  async sendRefundConfirmation(event: RefundCompletedEvent): Promise<void> {
    if (!this.configService.get<boolean>('email.enabled', false)) {
      this.logger.debug(
        `Refund confirmation skipped for ${event.customer.email}: mail is disabled`,
      );
      return;
    }

    const template = buildRefundConfirmationEmail(event, this.siteUrl());

    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('email.from'),
      to: event.customer.email,
      ...template,
    });
  }

  private siteUrl(): string {
    return (
      this.configService.get<string>('email.siteUrl') ?? 'http://localhost:3000'
    );
  }
}
