/**
 * Setup Resend Email Templates
 *
 * This script creates and publishes email templates in your Resend account.
 * Run with: npx tsx scripts/setup-resend-templates.ts
 *
 * Prerequisites:
 * - RESEND_API_KEY must be set in .env or environment
 *
 * After running:
 * - Copy the template ID from the output
 * - Add it to .env as RESEND_TEAM_INVITE_TEMPLATE_ID
 */

import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY environment variable is not set');
  console.error('');
  console.error('Set it by running:');
  console.error('  export RESEND_API_KEY=re_xxxxxxxxxxxx');
  console.error('');
  console.error('Or add it to your .env file');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function createTeamInviteTemplate() {
  const templatePath = path.join(
    __dirname,
    '../lib/email-templates/team-invite.resend.html'
  );

  if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file not found at ${templatePath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(templatePath, 'utf-8');

  console.log('Creating Team Invite template in Resend...');

  try {
    // Create the template
    const response = await fetch('https://api.resend.com/templates', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Team Invite',
        description: 'Invitation email for new team members',
        html,
        variables: [
          { key: 'organizationName', type: 'string', default: 'Acme Corp' },
          { key: 'inviterName', type: 'string', default: 'John Smith' },
          { key: 'role', type: 'string', default: 'Editor' },
          { key: 'roleArticle', type: 'string', default: 'an' },
          { key: 'personalMessage', type: 'string', default: 'Looking forward to working with you!' },
          { key: 'hasPersonalMessage', type: 'string', default: 'true' },
          { key: 'acceptUrl', type: 'string', default: 'https://dev.abm.dev/invite/abc123' },
          { key: 'currentYear', type: 'string', default: new Date().getFullYear().toString() },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to create template:', error);
      process.exit(1);
    }

    const data = await response.json();
    console.log('Template created successfully!');
    console.log('');
    console.log('Template ID:', data.id);
    console.log('');

    // Publish the template
    console.log('Publishing template...');
    const publishResponse = await fetch(
      `https://api.resend.com/templates/${data.id}/publish`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      console.error('Failed to publish template:', error);
      console.log('');
      console.log('You can publish it manually in the Resend dashboard.');
    } else {
      console.log('Template published successfully!');
    }

    console.log('');
    console.log('Add this to your .env file:');
    console.log(`RESEND_TEAM_INVITE_TEMPLATE_ID=${data.id}`);
    console.log('');
    console.log('Or update it in the Resend dashboard:');
    console.log(`https://resend.com/templates/${data.id}`);
  } catch (error) {
    console.error('Failed to create template:', error);
    process.exit(1);
  }
}

async function main() {
  console.log('');
  console.log('=================================');
  console.log('  Resend Template Setup Script');
  console.log('=================================');
  console.log('');

  await createTeamInviteTemplate();

  console.log('');
  console.log('Setup complete!');
}

main().catch(console.error);
