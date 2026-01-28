/**
 * Test sending an invite email
 * Run with: npx tsx scripts/test-invite-email.ts
 */

import { Resend } from 'resend';
import { TeamInviteEmail } from '../emails/team-invite';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY environment variable is not set');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function sendTestEmail() {
  const to = process.argv[2] || 'stuart@stuartmcleod.me';

  console.log(`Sending test invite email to: ${to}`);
  console.log('');

  const { data, error } = await resend.emails.send({
    from: 'ABM.dev <invites@abm.dev>',
    to,
    replyTo: 'support@abm.dev',
    subject: "You're invited to join Acme Corp on abm.dev",
    react: TeamInviteEmail({
      organizationName: 'Acme Corp',
      inviterName: 'Stuart McLeod',
      role: 'Admin',
      personalMessage: 'Hey! Looking forward to working with you on our data enrichment project. Let me know if you have any questions!',
      acceptUrl: 'https://dev.abm.dev/invite/test-token-abc123',
      currentYear: new Date().getFullYear().toString(),
    }),
  });

  if (error) {
    console.error('Failed to send email:', error);
    process.exit(1);
  }

  console.log('Email sent successfully!');
  console.log('Message ID:', data?.id);
}

sendTestEmail().catch(console.error);
