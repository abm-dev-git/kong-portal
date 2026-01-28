import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
  Hr,
  Preview,
} from '@react-email/components';
import * as React from 'react';

// Brand Colors
const colors = {
  primary: '#40E0D0',
  background: '#0A1F3D',
  cardBg: '#1a1a2e',
  text: '#FAEBD7',
  accent: '#2563eb',
  muted: 'rgba(250, 235, 215, 0.6)',
  mutedLight: 'rgba(250, 235, 215, 0.5)',
  mutedLighter: 'rgba(250, 235, 215, 0.4)',
  mutedLightest: 'rgba(250, 235, 215, 0.3)',
  border: 'rgba(64, 224, 208, 0.2)',
  borderLight: 'rgba(64, 224, 208, 0.3)',
  primaryMuted: 'rgba(64, 224, 208, 0.1)',
  primaryMutedLight: 'rgba(64, 224, 208, 0.05)',
};

// Typography
const fonts = {
  headline: "Georgia, 'Times New Roman', serif",
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  logo: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

export interface TeamInviteEmailProps {
  organizationName: string;
  inviterName: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  personalMessage?: string;
  acceptUrl: string;
  currentYear?: string;
}

export const TeamInviteEmail = ({
  organizationName = 'Acme Corp',
  inviterName = 'John Smith',
  role = 'Editor',
  personalMessage,
  acceptUrl = 'https://dev.abm.dev/invite/abc123',
  currentYear = new Date().getFullYear().toString(),
}: TeamInviteEmailProps) => {
  const previewText = `${inviterName} invited you to join ${organizationName} on abm.dev`;

  const getRoleArticle = (role: string) => {
    if (role === 'Admin' || role === 'Editor') return 'an';
    return 'a';
  };

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={wrapper}>
          {/* Logo Header */}
          <Section style={logoSection}>
            <Text style={logo}>
              <span style={{ color: colors.text }}>abm</span>
              <span style={{ color: colors.accent }}>.dev</span>
            </Text>
          </Section>

          {/* Main Card */}
          <Section style={card}>
            {/* Card Header */}
            <Text style={headline}>
              You&apos;ve been invited to join
              <br />
              <span style={{ color: colors.primary }}>{organizationName}</span>
            </Text>

            {/* Invitation Details */}
            <Text style={bodyText}>
              <strong style={{ color: colors.primary }}>{inviterName}</strong> has
              invited you to join their organization on abm.dev as{' '}
              {getRoleArticle(role)}{' '}
              <strong style={{ color: colors.primary }}>{role}</strong>.
            </Text>

            {/* Personal Message (if provided) */}
            {personalMessage && (
              <Section style={messageBox}>
                <Text style={messageLabel}>Message from {inviterName}</Text>
                <Text style={messageContent}>&ldquo;{personalMessage}&rdquo;</Text>
              </Section>
            )}

            {/* Role Badge */}
            <Section style={badgeContainer}>
              <span style={roleBadge}>Role: {role}</span>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={acceptUrl}>
                Accept Invitation
              </Button>
            </Section>

            {/* Expiration Notice */}
            <Text style={expirationText}>
              This invitation expires in{' '}
              <strong style={{ color: colors.text }}>7 days</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            {/* Divider */}
            <Hr style={divider} />

            {/* Help Text */}
            <Text style={helpText}>
              If you didn&apos;t expect this invitation, you can safely ignore
              this email.
            </Text>

            {/* Company Info */}
            <Text style={companyInfo}>
              <Link href="https://abm.dev" style={footerLink}>
                abm.dev
              </Link>{' '}
              &middot; AI-powered data enrichment
            </Text>
            <Text style={copyright}>
              &copy; {currentYear} ABM.dev. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main: React.CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: colors.background,
  fontFamily: fonts.body,
};

const wrapper: React.CSSProperties = {
  padding: '40px 20px',
  maxWidth: '600px',
  margin: '0 auto',
};

const logoSection: React.CSSProperties = {
  textAlign: 'center',
  paddingBottom: '32px',
};

const logo: React.CSSProperties = {
  fontFamily: fonts.logo,
  fontSize: '28px',
  fontWeight: 700,
  margin: 0,
};

const card: React.CSSProperties = {
  backgroundColor: colors.cardBg,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '40px',
};

const headline: React.CSSProperties = {
  margin: '0 0 24px 0',
  fontFamily: fonts.headline,
  fontSize: '28px',
  fontWeight: 400,
  color: colors.text,
  lineHeight: 1.3,
};

const bodyText: React.CSSProperties = {
  margin: '0 0 24px 0',
  fontSize: '16px',
  lineHeight: 1.7,
  color: colors.text,
};

const messageBox: React.CSSProperties = {
  backgroundColor: colors.primaryMutedLight,
  borderLeft: `3px solid ${colors.primary}`,
  borderRadius: '0 8px 8px 0',
  padding: '16px 20px',
  marginBottom: '24px',
};

const messageLabel: React.CSSProperties = {
  margin: '0 0 8px 0',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: colors.muted,
};

const messageContent: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.6,
  color: colors.text,
  fontStyle: 'italic',
};

const badgeContainer: React.CSSProperties = {
  marginBottom: '32px',
};

const roleBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: colors.primaryMuted,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: '20px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 500,
  color: colors.primary,
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
};

const button: React.CSSProperties = {
  display: 'inline-block',
  padding: '16px 48px',
  fontFamily: fonts.body,
  fontSize: '16px',
  fontWeight: 600,
  color: colors.background,
  backgroundColor: colors.primary,
  borderRadius: '8px',
  textDecoration: 'none',
};

const expirationText: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: colors.muted,
  textAlign: 'center',
};

const footer: React.CSSProperties = {
  paddingTop: '32px',
};

const divider: React.CSSProperties = {
  borderColor: 'transparent',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderImage: `linear-gradient(90deg, transparent, ${colors.borderLight}, transparent) 1`,
  marginBottom: '24px',
};

const helpText: React.CSSProperties = {
  margin: '0 0 16px 0',
  fontSize: '14px',
  color: colors.mutedLight,
  textAlign: 'center',
  lineHeight: 1.6,
};

const companyInfo: React.CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: colors.mutedLighter,
  textAlign: 'center',
};

const footerLink: React.CSSProperties = {
  color: colors.primary,
  textDecoration: 'none',
};

const copyright: React.CSSProperties = {
  margin: '8px 0 0 0',
  fontSize: '12px',
  color: colors.mutedLightest,
  textAlign: 'center',
};

export default TeamInviteEmail;
