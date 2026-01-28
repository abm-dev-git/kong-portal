import { Resend } from 'resend';
import { TeamInviteEmail } from '@/emails/team-invite';
import type { SendInviteEmailParams, EmailSendResult } from './types';
import { EMAIL_CONFIG } from './types';
import { ROLE_LABELS } from '@/lib/types/user-management';

const resend = new Resend(process.env.RESEND_API_KEY);

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://abm.dev'
    : 'https://dev.abm.dev';
};

const getRoleArticle = (role: string) => {
  if (role === 'Admin' || role === 'Editor') return 'an';
  return 'a';
};

/**
 * Send invite email using Resend.
 *
 * Supports two modes:
 * 1. Hosted Template (recommended): Set RESEND_TEAM_INVITE_TEMPLATE_ID
 *    - Templates are managed in Resend dashboard at https://resend.com/templates
 *    - Variables are passed via the template.variables object
 *
 * 2. Local React Email (fallback): If no template ID is set
 *    - Uses the React Email component from /emails/team-invite.tsx
 *
 * Template variables:
 * - organizationName: Organization name
 * - inviterName: Name of person who sent invite
 * - role: Role label (Admin/Editor/Viewer)
 * - roleArticle: "an" or "a" depending on role
 * - personalMessage: Optional message from inviter
 * - hasPersonalMessage: Boolean for conditional rendering
 * - acceptUrl: Full URL to accept the invitation
 * - currentYear: Current year for copyright
 */
export async function sendInviteEmail(
  params: SendInviteEmailParams
): Promise<EmailSendResult> {
  const { to, organizationName, inviterName, role, personalMessage, inviteToken } =
    params;

  const baseUrl = getBaseUrl();
  const acceptUrl = `${baseUrl}/invite/${inviteToken}`;
  const roleLabel = ROLE_LABELS[role] as 'Admin' | 'Editor' | 'Viewer';
  const roleArticle = getRoleArticle(roleLabel);
  const currentYear = new Date().getFullYear().toString();

  const templateId = process.env.RESEND_TEAM_INVITE_TEMPLATE_ID;

  try {
    // If a template ID is configured, use Resend's hosted template
    if (templateId) {
      // Use Resend's template system
      // Cast to unknown first to bypass strict type checking for template API
      const emailPayload = {
        from: EMAIL_CONFIG.from,
        to,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: `You're invited to join ${organizationName} on abm.dev`,
        template: {
          id: templateId,
          variables: {
            organizationName,
            inviterName,
            role: roleLabel,
            roleArticle,
            personalMessage: personalMessage || '',
            hasPersonalMessage: personalMessage ? 'true' : '',
            acceptUrl,
            currentYear,
          },
        },
      } as Parameters<typeof resend.emails.send>[0];

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error('Failed to send invite email via template:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    }

    // Fallback to local React Email template
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: `You're invited to join ${organizationName} on abm.dev`,
      react: TeamInviteEmail({
        organizationName,
        inviterName,
        role: roleLabel,
        personalMessage,
        acceptUrl,
        currentYear,
      }),
    });

    if (error) {
      console.error('Failed to send invite email:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to send invite email:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function resendInviteEmail(
  params: SendInviteEmailParams
): Promise<EmailSendResult> {
  return sendInviteEmail(params);
}
