import { NextRequest, NextResponse } from 'next/server';
import { sendInviteEmail } from '@/lib/email';
import type { MemberRole } from '@/lib/types/user-management';

interface SendInviteEmailRequest {
  to: string;
  organizationName: string;
  inviterName: string;
  role: MemberRole;
  personalMessage?: string;
  inviteToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendInviteEmailRequest = await request.json();

    // Validate required fields
    if (!body.to || !body.organizationName || !body.inviterName || !body.role || !body.inviteToken) {
      return NextResponse.json(
        { error: 'Missing required fields: to, organizationName, inviterName, role, inviteToken' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: MemberRole[] = ['admin', 'editor', 'viewer'];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, editor, or viewer' },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendInviteEmail({
      to: body.to,
      organizationName: body.organizationName,
      inviterName: body.inviterName,
      role: body.role,
      personalMessage: body.personalMessage,
      inviteToken: body.inviteToken,
    });

    if (!result.success) {
      console.error('Failed to send invite email:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error in send-invite-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
