import type { MemberRole } from '@/lib/types/user-management';

export interface SendInviteEmailParams {
  to: string;
  organizationName: string;
  inviterName: string;
  role: MemberRole;
  personalMessage?: string;
  inviteToken: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailConfig {
  from: string;
  replyTo?: string;
}

export const EMAIL_CONFIG: EmailConfig = {
  from: 'ABM.dev <invites@abm.dev>',
  replyTo: 'support@abm.dev',
};
