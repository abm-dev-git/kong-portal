'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  X,
  User,
  Building2,
  Mail,
  Linkedin,
  Loader2,
  Check,
  Copy,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';
import { LinkedInMemberSelector, type LinkedInSelectionStrategy } from '@/components/enrichments';

// Sample ABM thought leaders for demo (fallback when LinkedIn not connected or no connections API)
const sampleContacts = [
  {
    id: 'sangram',
    fullName: 'Sangram Vajre',
    email: 'sangram@gtmpartners.com',
    company: 'GTM Partners',
    title: 'Co-founder & Chief Evangelist',
    profileUrl: 'https://linkedin.com/in/sangramvajre',
    headline: 'Co-founder at GTM Partners | Author of ABM is B2B',
    connectedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
  },
  {
    id: 'bev',
    fullName: 'Bev Burgess',
    email: 'bev@momentumitsma.com',
    company: 'Momentum ITSMA',
    title: 'SVP, Global ABM Practice',
    profileUrl: 'https://linkedin.com/in/bevburgess',
    headline: 'SVP, Global ABM Practice at Momentum ITSMA',
    connectedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
  },
  {
    id: 'alisha',
    fullName: 'Alisha Lyndon',
    email: 'alisha@momentumitsma.com',
    company: 'Momentum ITSMA',
    title: 'CEO & Founder',
    profileUrl: 'https://linkedin.com/in/alishalyndon',
    headline: 'CEO & Founder at Momentum ITSMA',
    connectedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
  },
];

// Enrichment sources
const sources = [
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'hunter', name: 'Hunter', color: '#FF6F59' },
  { id: 'perplexity', name: 'Perplexity', color: '#00C2A8' },
  { id: 'tavily', name: 'Tavily', color: '#7C3AED' },
];

interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'processing';
  timestamp: Date;
}

interface EnrichContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: string;
  orgId?: string;
  teamId?: string;
  hasLinkedIn?: boolean;
  onComplete?: () => void;
}

type ModalStep = 'select' | 'enriching' | 'complete';

interface Contact {
  id?: string;
  fullName: string;
  email?: string;
  company?: string;
  title?: string;
  profileUrl?: string;
  headline?: string;
  connectedAt?: string;
}

export function EnrichContactModal({
  open,
  onOpenChange,
  token,
  orgId,
  teamId,
  hasLinkedIn = false,
  onComplete,
}: EnrichContactModalProps) {
  const [step, setStep] = useState<ModalStep>('select');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualLinkedIn, setManualLinkedIn] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sourceStatus, setSourceStatus] = useState<Record<string, 'pending' | 'processing' | 'complete' | 'error'>>({});
  const [result, setResult] = useState<object | null>(null);
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [showTeamRouting, setShowTeamRouting] = useState(false);
  const [selectedLinkedInUserId, setSelectedLinkedInUserId] = useState<string | undefined>();
  const [linkedInStrategy, setLinkedInStrategy] = useState<LinkedInSelectionStrategy>('closest');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Use sample contacts for now (will use real LinkedIn connections when API is available)
  const contacts = sampleContacts;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep('select');
      setSelectedContact(null);
      setShowManualEntry(false);
      setManualEmail('');
      setManualLinkedIn('');
      setLogs([]);
      setSourceStatus({});
      setResult(null);
      setShowJson(false);
      setShowTeamRouting(false);
      setSelectedLinkedInUserId(undefined);
      setLinkedInStrategy('closest');
    }
  }, [open]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, { id: Date.now() + Math.random(), message, type, timestamp: new Date() }]);
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} year${diffDays >= 730 ? 's' : ''} ago`;
  };

  const shuffleContact = () => {
    const currentId = selectedContact?.id;
    const others = contacts.filter((c) => c.id !== currentId);
    const random = others[Math.floor(Math.random() * others.length)];
    setSelectedContact(random);
  };

  const handleEnrich = async () => {
    const contact = showManualEntry
      ? { fullName: 'Unknown', email: manualEmail || undefined, profileUrl: manualLinkedIn || undefined }
      : selectedContact;

    if (!contact) return;

    setStep('enriching');
    setLogs([]);
    setSourceStatus(
      sources.reduce((acc, s) => ({ ...acc, [s.id]: 'pending' }), {})
    );

    // Log team routing configuration if applicable
    if (teamId) {
      if (selectedLinkedInUserId) {
        addLog(`Using preferred team member's LinkedIn connection`, 'info');
      } else {
        addLog(`Using ${linkedInStrategy} strategy for LinkedIn routing`, 'info');
      }
    }

    // Simulated enrichment process (in production, this would call the real API)
    addLog(`Starting enrichment for ${contact.fullName || contact.email || 'contact'}...`, 'info');

    // Simulate each source
    for (const source of sources) {
      await delay(500 + Math.random() * 500);
      setSourceStatus((prev) => ({ ...prev, [source.id]: 'processing' }));
      addLog(`Querying ${source.name}...`, 'processing');

      await delay(800 + Math.random() * 700);
      setSourceStatus((prev) => ({ ...prev, [source.id]: 'complete' }));
      addLog(`${source.name} data retrieved`, 'success');
    }

    await delay(500);
    addLog('Aggregating data from all sources...', 'processing');

    await delay(600);
    addLog('Calculating confidence scores...', 'processing');

    await delay(400);
    addLog('Enrichment complete!', 'success');

    // Mock result (in production, this would come from the API)
    // The actual API call would include:
    // - team_id: teamId
    // - preferred_linkedin_user_id: selectedLinkedInUserId
    // - linkedin_selection_strategy: linkedInStrategy
    const mockResult = {
      jobId: `enr_${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      data: {
        person: {
          fullName: contact.fullName || 'Unknown',
          email: contact.email || `${(contact.fullName || 'contact').toLowerCase().replace(' ', '.')}@company.com`,
          title: contact.title || 'Professional',
          company: contact.company || 'Company',
          linkedinUrl: contact.profileUrl || null,
          location: 'United States',
        },
        company: {
          name: contact.company || 'Company',
          domain: contact.email?.split('@')[1] || 'company.com',
          industry: 'B2B Technology',
          employeeCount: '50-200',
          revenue: '$10M-$50M',
          location: 'San Francisco, CA',
        },
      },
      confidence: {
        overall: 0.92,
        'person.email': 0.95,
        'person.title': 0.88,
        'company.name': 0.99,
        'company.industry': 0.82,
      },
      sources: sources.map((s) => s.id),
      processingTime: `${(2 + Math.random() * 2).toFixed(1)}s`,
      ...(teamId && {
        teamRouting: {
          teamId,
          strategy: linkedInStrategy,
          preferredUserId: selectedLinkedInUserId || null,
          usedConnection: selectedLinkedInUserId || 'auto-selected',
        },
      }),
    };

    setResult(mockResult);
    setStep('complete');
  };

  const handleCopyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDone = () => {
    onComplete?.();
    onOpenChange(false);
  };

  const canEnrich = showManualEntry
    ? manualEmail || manualLinkedIn
    : selectedContact !== null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--turquoise)]/20">
            <Dialog.Title className="text-lg font-medium text-[var(--cream)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--turquoise)]" />
              {step === 'select' && 'Enrich a Contact'}
              {step === 'enriching' && `Enriching ${selectedContact?.fullName || 'Contact'}...`}
              {step === 'complete' && 'Enrichment Complete!'}
            </Dialog.Title>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-lg hover:bg-[var(--turquoise)]/10 text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Dialog.Description className="sr-only">
            Select a contact to enrich with data from multiple sources
          </Dialog.Description>

          {/* Content */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {/* Step 1: Select Contact */}
            {step === 'select' && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--cream)]/70">
                  {hasLinkedIn
                    ? 'Pick one of your LinkedIn connections to enrich:'
                    : 'Pick a contact to enrich with all 4 data sources:'}
                </p>

                {/* Contact List */}
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowManualEntry(false);
                      }}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-all",
                        selectedContact?.id === contact.id
                          ? "bg-[var(--turquoise)]/10 border-[var(--turquoise)]/40"
                          : "bg-[var(--dark-blue)] border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--turquoise)]/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-[var(--turquoise)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--cream)]">{contact.fullName}</span>
                            {selectedContact?.id === contact.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shuffleContact();
                                }}
                                className="p-1 rounded hover:bg-[var(--turquoise)]/20"
                                title="Pick another"
                              >
                                <Shuffle className="w-3 h-3 text-[var(--turquoise)]" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-[var(--cream)]/60 truncate">{contact.headline}</p>
                          <p className="text-xs text-[var(--cream)]/40 mt-1">
                            Connected {formatTimeAgo(contact.connectedAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Manual Entry Toggle */}
                <div className="border-t border-[var(--turquoise)]/10 pt-4">
                  <button
                    onClick={() => {
                      setShowManualEntry(!showManualEntry);
                      if (!showManualEntry) setSelectedContact(null);
                    }}
                    className="flex items-center gap-2 text-sm text-[var(--turquoise)] hover:text-[var(--turquoise)]/80"
                  >
                    {showManualEntry ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Or enter details manually
                  </button>

                  {showManualEntry && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="block text-xs text-[var(--cream)]/60 mb-1">LinkedIn URL</label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={manualLinkedIn}
                          onChange={(e) => setManualLinkedIn(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--cream)]/60 mb-1">Email (optional)</label>
                        <input
                          type="email"
                          placeholder="name@company.com"
                          value={manualEmail}
                          onChange={(e) => setManualEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Team LinkedIn Routing */}
                {teamId && (
                  <div className="border-t border-[var(--turquoise)]/10 pt-4">
                    <button
                      onClick={() => setShowTeamRouting(!showTeamRouting)}
                      className="flex items-center gap-2 text-sm text-[var(--turquoise)] hover:text-[var(--turquoise)]/80"
                    >
                      {showTeamRouting ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <Users className="w-4 h-4" />
                      Team LinkedIn Routing
                    </button>

                    {showTeamRouting && (
                      <div className="mt-3 p-4 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20">
                        <LinkedInMemberSelector
                          teamId={teamId}
                          selectedUserId={selectedLinkedInUserId}
                          selectedStrategy={linkedInStrategy}
                          onUserSelect={setSelectedLinkedInUserId}
                          onStrategySelect={setLinkedInStrategy}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Enrich Button */}
                <Button
                  onClick={handleEnrich}
                  disabled={!canEnrich}
                  className="w-full bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enrich with 4 Sources
                </Button>
              </div>
            )}

            {/* Step 2: Enriching */}
            {step === 'enriching' && (
              <div className="space-y-4">
                {/* Source Status Pills */}
                <div className="flex flex-wrap gap-2">
                  {sources.map((source) => {
                    const status = sourceStatus[source.id] || 'pending';
                    return (
                      <div
                        key={source.id}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
                          status === 'pending' && "bg-[var(--dark-blue)] text-[var(--cream)]/50",
                          status === 'processing' && "bg-[var(--turquoise)]/20 text-[var(--turquoise)]",
                          status === 'complete' && "bg-emerald-500/20 text-emerald-400",
                          status === 'error' && "bg-red-500/20 text-red-400"
                        )}
                      >
                        {status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                        {status === 'complete' && <Check className="w-3 h-3" />}
                        {source.name}
                      </div>
                    );
                  })}
                </div>

                {/* Logs */}
                <div className="rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/10 overflow-hidden">
                  <div className="px-3 py-2 border-b border-[var(--turquoise)]/10 flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--cream)]/60 uppercase tracking-wide">
                      Live Enrichment Log
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--turquoise)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--turquoise)] animate-pulse" />
                      Processing
                    </span>
                  </div>
                  <div className="p-3 h-48 overflow-y-auto font-mono text-xs space-y-1">
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
              </div>
            )}

            {/* Step 3: Complete */}
            {step === 'complete' && result && (
              <div className="space-y-4">
                {/* Result Summary */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Person Card */}
                  <div className="p-3 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/10">
                    <div className="flex items-center gap-2 mb-2 text-xs text-[var(--cream)]/60 uppercase tracking-wide">
                      <User className="w-3 h-3" />
                      Person
                    </div>
                    <p className="font-medium text-[var(--cream)]">
                      {(result as any).data?.person?.fullName}
                    </p>
                    <p className="text-sm text-[var(--cream)]/70">
                      {(result as any).data?.person?.title}
                    </p>
                    <p className="text-sm text-[var(--cream)]/60">
                      {(result as any).data?.person?.company}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Mail className="w-3 h-3 text-[var(--cream)]/50" />
                      <span className="text-xs text-[var(--cream)]/60">{(result as any).data?.person?.email}</span>
                      <span className="ml-auto text-xs text-emerald-400">
                        {Math.round((result as any).confidence?.['person.email'] * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Company Card */}
                  <div className="p-3 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/10">
                    <div className="flex items-center gap-2 mb-2 text-xs text-[var(--cream)]/60 uppercase tracking-wide">
                      <Building2 className="w-3 h-3" />
                      Company
                    </div>
                    <p className="font-medium text-[var(--cream)]">
                      {(result as any).data?.company?.name}
                    </p>
                    <p className="text-sm text-[var(--cream)]/70">
                      {(result as any).data?.company?.industry}
                    </p>
                    <p className="text-sm text-[var(--cream)]/60">
                      {(result as any).data?.company?.employeeCount} employees
                    </p>
                    <p className="text-xs text-[var(--cream)]/50 mt-2">
                      {(result as any).data?.company?.location}
                    </p>
                  </div>
                </div>

                {/* Sources & Time */}
                <div className="flex items-center justify-between text-xs text-[var(--cream)]/60">
                  <div className="flex items-center gap-2">
                    <span>Sources:</span>
                    {sources.map((source) => (
                      <span key={source.id} className="px-2 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                        {source.name}
                      </span>
                    ))}
                  </div>
                  <span>Time: {(result as any).processingTime}</span>
                </div>

                {/* JSON Toggle */}
                <div>
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="flex items-center gap-1 text-sm text-[var(--turquoise)] hover:text-[var(--turquoise)]/80"
                  >
                    {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showJson ? 'Hide' : 'View'} Full JSON
                  </button>

                  {showJson && (
                    <div className="mt-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/10 overflow-hidden">
                      <div className="px-3 py-2 border-b border-[var(--turquoise)]/10 flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--cream)]/60">JSON Response</span>
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
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 text-xs text-[var(--cream)]/80 overflow-x-auto max-h-48">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Done Button */}
                <Button
                  onClick={handleDone}
                  className="w-full bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] font-medium"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Helper function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
