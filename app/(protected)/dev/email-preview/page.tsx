'use client';

import { useState } from 'react';
import { TeamInviteEmail } from '@/emails/team-invite';
import type { TeamInviteEmailProps } from '@/emails/team-invite';
import { render } from '@react-email/components';

type RoleType = TeamInviteEmailProps['role'];

interface PreviewProps {
  organizationName: string;
  inviterName: string;
  role: RoleType;
  personalMessage: string;
  acceptUrl: string;
  currentYear: string;
}

const defaultProps: PreviewProps = {
  organizationName: 'Acme Corp',
  inviterName: 'John Smith',
  role: 'Editor',
  personalMessage: 'Looking forward to working with you on our data enrichment project!',
  acceptUrl: 'https://dev.abm.dev/invite/abc123',
  currentYear: new Date().getFullYear().toString(),
};

export default function EmailPreviewPage() {
  const [props, setProps] = useState<PreviewProps>(defaultProps);
  const [includeMessage, setIncludeMessage] = useState(true);
  const [htmlOutput, setHtmlOutput] = useState<string | null>(null);

  const currentProps = {
    ...props,
    personalMessage: includeMessage ? props.personalMessage : undefined,
  };

  const handleGenerateHtml = async () => {
    const html = await render(TeamInviteEmail(currentProps));
    setHtmlOutput(html);
  };

  const handleCopyHtml = async () => {
    if (htmlOutput) {
      await navigator.clipboard.writeText(htmlOutput);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-[#0A1F3D] text-[#FAEBD7] flex items-center justify-center">
        <p>Email preview is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Email Template Preview</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Template Variables</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Organization Name</label>
              <input
                type="text"
                value={props.organizationName}
                onChange={(e) => setProps({ ...props, organizationName: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Inviter Name</label>
              <input
                type="text"
                value={props.inviterName}
                onChange={(e) => setProps({ ...props, inviterName: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={props.role}
                onChange={(e) => setProps({ ...props, role: e.target.value as RoleType })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <input
                  type="checkbox"
                  checked={includeMessage}
                  onChange={(e) => setIncludeMessage(e.target.checked)}
                  className="rounded"
                />
                Include Personal Message
              </label>
              {includeMessage && (
                <textarea
                  value={props.personalMessage}
                  onChange={(e) => setProps({ ...props, personalMessage: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-24"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Accept URL</label>
              <input
                type="text"
                value={props.acceptUrl}
                onChange={(e) => setProps({ ...props, acceptUrl: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={handleGenerateHtml}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                Generate HTML
              </button>
              {htmlOutput && (
                <button
                  onClick={handleCopyHtml}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
                >
                  Copy HTML to Clipboard
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-700 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400 ml-2">Team Invite Email Preview</span>
              </div>
              <div className="p-4">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          body { margin: 0; padding: 0; }
                        </style>
                      </head>
                      <body>
                        ${htmlOutput || '<div style="padding: 20px; text-align: center; color: #666;">Click "Generate HTML" to preview</div>'}
                      </body>
                    </html>
                  `}
                  className="w-full h-[700px] bg-white rounded"
                  title="Email Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
