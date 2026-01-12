'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Copy, Check, Shuffle, User, Building2, Linkedin, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sample ABM thought leaders for demo
const sampleContacts = [
  {
    id: 'sangram',
    name: 'Sangram Vajre',
    email: 'sangram@gtmpartners.com',
    company: 'GTM Partners',
    linkedIn: 'https://linkedin.com/in/sangramvajre',
    description: 'Terminus founder, ABM fundamentals & ROI',
  },
  {
    id: 'bev',
    name: 'Bev Burgess',
    email: 'bev@itsma.com',
    company: 'ITSMA',
    linkedIn: 'https://linkedin.com/in/bevburgess',
    description: 'ABM program design & scaling expert',
  },
  {
    id: 'alisha',
    name: 'Alisha Lyndon',
    email: 'alisha@momentumitsma.com',
    company: 'Momentum ITSMA',
    linkedIn: 'https://linkedin.com/in/alishalyndon',
    description: 'Strategic client engagement leader',
  },
  {
    id: 'john',
    name: 'John Short',
    email: 'john@influ2.com',
    company: 'Influ2',
    linkedIn: 'https://linkedin.com/in/johnshort',
    description: 'Sales-marketing alignment expert',
  },
];

interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'processing';
  timestamp: Date;
}

interface PlaygroundCardProps {
  className?: string;
  apiKey?: string;
}

export function PlaygroundCard({ className, apiKey }: PlaygroundCardProps) {
  const [selectedContact, setSelectedContact] = useState(sampleContacts[0]);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<object | null>(null);
  const [copied, setCopied] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, { id: Date.now(), message, type, timestamp: new Date() }]);
  };

  const selectRandomContact = () => {
    const others = sampleContacts.filter((c) => c.id !== selectedContact.id);
    const random = others[Math.floor(Math.random() * others.length)];
    setSelectedContact(random);
    setIsCustomMode(false);
  };

  const handleEnrich = async () => {
    setIsLoading(true);
    setLogs([]);
    setResult(null);

    const contact = isCustomMode
      ? { email: customEmail, name: customName }
      : { email: selectedContact.email, name: selectedContact.name };

    // Simulated streaming logs (in production, this would be real API events)
    addLog(`Starting enrichment for ${contact.email}...`, 'info');

    await delay(500);
    addLog('Searching LinkedIn profiles...', 'processing');

    await delay(800);
    addLog(`Found LinkedIn profile: ${isCustomMode ? 'linkedin.com/in/...' : selectedContact.linkedIn}`, 'success');

    await delay(600);
    addLog('Extracting company data from multiple sources...', 'processing');

    await delay(700);
    addLog('Querying Clearbit for company information...', 'processing');

    await delay(500);
    addLog('Validating email deliverability...', 'processing');

    await delay(600);
    addLog('Aggregating data from 4 sources...', 'processing');

    await delay(400);
    addLog('Calculating confidence scores...', 'processing');

    await delay(300);
    addLog('Enrichment complete!', 'success');

    // Mock enriched result
    const mockResult = {
      jobId: `enr_${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      data: {
        person: {
          fullName: isCustomMode ? customName || 'Unknown' : selectedContact.name,
          email: contact.email,
          title: isCustomMode ? 'Professional' : 'CEO & Co-founder',
          linkedinUrl: isCustomMode ? null : selectedContact.linkedIn,
        },
        company: {
          name: isCustomMode ? 'Company' : selectedContact.company,
          domain: contact.email.split('@')[1],
          industry: 'B2B Technology',
          employeeCount: '50-200',
        },
      },
      confidence: {
        'person.fullName': 0.95,
        'person.title': 0.88,
        'company.name': 0.99,
        'company.industry': 0.82,
      },
      sources: ['linkedin', 'clearbit', 'hunter', 'company-website'],
      processingTime: '1.2s',
    };

    setResult(mockResult);
    setIsLoading(false);
  };

  const handleCopyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--turquoise)]/20">
        <h3 className="text-lg font-medium text-[var(--cream)] flex items-center gap-2">
          <Play className="w-5 h-5 text-[var(--turquoise)]" />
          Try Enrichment
        </h3>
        <p className="text-sm text-[var(--cream)]/60 mt-1">
          Test the API with ABM thought leaders or your own contacts
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Sample Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--cream)]/70">Try with:</span>
            {sampleContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  setIsCustomMode(false);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-colors",
                  !isCustomMode && selectedContact.id === contact.id
                    ? "bg-[var(--turquoise)] text-[var(--dark-blue)] font-medium"
                    : "bg-[var(--turquoise)]/10 text-[var(--cream)]/70 hover:bg-[var(--turquoise)]/20"
                )}
              >
                {contact.name.split(' ')[0]}
              </button>
            ))}
            <button
              onClick={selectRandomContact}
              className="p-1.5 rounded-full bg-[var(--turquoise)]/10 text-[var(--cream)]/70 hover:bg-[var(--turquoise)]/20 transition-colors"
              title="Random selection"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          {/* Contact Details */}
          {!isCustomMode && (
            <div className="p-3 rounded-lg bg-[var(--dark-blue)] space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-[var(--cream)]/50" />
                <span className="text-[var(--cream)]">{selectedContact.name}</span>
                <span className="text-[var(--cream)]/50">—</span>
                <span className="text-[var(--cream)]/70">{selectedContact.description}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[var(--cream)]/50" />
                <span className="text-[var(--cream)]/70">{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-[var(--cream)]/50" />
                <span className="text-[var(--cream)]/70">{selectedContact.company}</span>
              </div>
            </div>
          )}

          {/* Custom Input Toggle */}
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-sm text-[var(--turquoise)] hover:underline"
          >
            {isCustomMode ? '← Use sample contacts' : 'Or enter your own contact →'}
          </button>

          {/* Custom Input Fields */}
          {isCustomMode && (
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email address"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50"
              />
              <input
                type="text"
                placeholder="Full name (optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50"
              />
            </div>
          )}
        </div>

        {/* Enrich Button */}
        <Button
          onClick={handleEnrich}
          disabled={isLoading || (isCustomMode && !customEmail)}
          className="w-full bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enriching...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Enrich Now
            </>
          )}
        </Button>

        {/* Logs & Results Container - only show min-height when content exists */}
        {(logs.length > 0 || result) && (
        <div className="min-h-[280px] space-y-4">
          {/* Streaming Logs */}
          {logs.length > 0 && (
          <div className="rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/10 overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--turquoise)]/10 flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--cream)]/60 uppercase tracking-wide">
                Live Logs
              </span>
              {isLoading && (
                <span className="flex items-center gap-1 text-xs text-[var(--turquoise)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--turquoise)] animate-pulse" />
                  Processing
                </span>
              )}
            </div>
            <div className="p-3 max-h-40 overflow-y-auto font-mono text-xs space-y-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start gap-2",
                    log.type === 'success' && "text-emerald-400",
                    log.type === 'error' && "text-red-400",
                    log.type === 'processing' && "text-[var(--turquoise)]",
                    log.type === 'info' && "text-[var(--cream)]/70"
                  )}
                >
                  <span className="text-[var(--cream)]/30">
                    {log.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span>
                    {log.type === 'processing' && '▶ '}
                    {log.type === 'success' && '✓ '}
                    {log.type === 'error' && '✗ '}
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="rounded-lg bg-[var(--dark-blue)] border border-emerald-500/20 overflow-hidden">
            <div className="px-3 py-2 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-500/5">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                <Check className="w-3 h-3" />
                Enrichment Result
              </span>
              <button
                onClick={handleCopyResult}
                className="text-xs text-[var(--cream)]/60 hover:text-[var(--cream)] flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-xs text-[var(--cream)]/80 overflow-x-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        </div>
        )}
      </div>
    </div>
  );
}

// Helper function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
