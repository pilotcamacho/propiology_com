import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const FROM = process.env.AWS_SES_FROM_EMAIL ?? 'hello@propiology.com';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: EmailPayload): Promise<void> {
  await ses.send(
    new SendEmailCommand({
      Destination: { ToAddresses: [to] },
      Source: `Propiology <${FROM}>`,
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: html, Charset: 'UTF-8' },
          Text: { Data: text, Charset: 'UTF-8' },
        },
      },
    })
  );
}
