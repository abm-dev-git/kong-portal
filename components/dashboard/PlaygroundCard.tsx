'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Copy, Check, Shuffle, User, Building2, Linkedin, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Contact type for sample and user contacts
interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  linkedIn: string;
  description: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

// Sample ABM thought leaders for demo with real profile images
const sampleContacts: Contact[] = [
  {
    id: 'sangram',
    name: 'Sangram Vajre',
    email: 'sangram@gtmpartners.com',
    company: 'GTM Partners',
    linkedIn: 'https://linkedin.com/in/sangramvajre',
    description: 'Terminus founder, ABM fundamentals & ROI',
    avatarUrl: 'https://learn.g2.com/hubfs/Sangram%20Vajre%20Headshot.jpg',
  },
  {
    id: 'bev',
    name: 'Bev Burgess',
    email: 'bev@inflexiongroup.com',
    company: 'Inflexion Group',
    linkedIn: 'https://linkedin.com/in/bevburgess',
    description: 'ABM pioneer & author',
    avatarUrl: 'https://cdn.koganpage.com/media/public/image/author_bev-burgess.jpg',
  },
  {
    id: 'alisha',
    name: 'Alisha Lyndon',
    email: 'alisha@momentumabm.com',
    company: 'Momentum ITSMA',
    linkedIn: 'https://linkedin.com/in/alishalyndon',
    description: 'CEO & ABM Effect author',
    avatarUrl: 'https://momentumabm.com/uploads/people/Team/_400x567_crop_center-center_none/headshot_Alisha.jpg',
  },
  {
    id: 'john',
    name: 'John Short',
    email: 'john@compoundgrowthmarketing.com',
    company: 'Compound Growth Marketing',
    linkedIn: 'https://linkedin.com/in/johngshort',
    description: 'B2B demand gen expert',
    avatarUrl: 'https://cdn.prod.website-files.com/64aed602be43700a98aeba91/6823a84286ef253a83bf0afd_John%20Short%20(1).png',
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
  currentUser?: {
    name: string;
    email: string;
    imageUrl?: string;
  };
}

export function PlaygroundCard({ className, apiKey, currentUser }: PlaygroundCardProps) {
  const [selectedContact, setSelectedContact] = useState<Contact>(sampleContacts[0]);
  const [customLinkedIn, setCustomLinkedIn] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<object | null>(null);
  const [copied, setCopied] = useState(false);
  const [hoveredContact, setHoveredContact] = useState<Contact | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  // Combine current user with sample contacts
  const allContacts = useMemo((): Contact[] => {
    if (currentUser) {
      return [
        {
          id: 'current-user',
          name: currentUser.name || 'You',
          email: currentUser.email,
          company: '',
          linkedIn: '',
          description: 'Your profile',
          avatarUrl: currentUser.imageUrl,
          isCurrentUser: true,
        },
        ...sampleContacts,
      ];
    }
    return sampleContacts;
  }, [currentUser]);

  // Valid if: any non-empty field (AND/OR logic)
  const isCustomInputValid =
    customLinkedIn.trim() !== '' ||
    customEmail.trim() !== '' ||
    customName.trim() !== '' ||
    customCompany.trim() !== '';

  // Handle pill click - populate input fields
  const handlePillClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsCustomMode(true);
    setCustomName(contact.name || '');
    setCustomEmail(contact.email || '');
    setCustomCompany(contact.company || '');
    setCustomLinkedIn(contact.linkedIn || '');
  };

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, { id: Date.now(), message, type, timestamp: new Date() }]);
  };

  const selectRandomContact = () => {
    const others = allContacts.filter((c) => c.id !== selectedContact.id && !c.isCurrentUser);
    const random = others[Math.floor(Math.random() * others.length)];
    setSelectedContact(random);
    setIsCustomMode(false);
  };

  const handleEnrich = async () => {
    setIsLoading(true);
    setLogs([]);
    setResult(null);

    const contact = isCustomMode
      ? {
          email: customEmail || undefined,
          name: customName || undefined,
          company: customCompany || undefined,
          linkedIn: customLinkedIn || undefined,
        }
      : {
          email: selectedContact.email,
          name: selectedContact.name,
          company: selectedContact.company,
          linkedIn: selectedContact.linkedIn,
        };

    // Determine what we're enriching based on input
    const enrichTarget = contact.linkedIn
      ? contact.linkedIn
      : contact.email
        ? contact.email
        : `${contact.name} at ${contact.company}`;

    // Simulated streaming logs (in production, this would be real API events)
    addLog(`Starting enrichment for ${enrichTarget}...`, 'info');

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
          fullName: contact.name || 'Discovered Name',
          email: contact.email || 'discovered@example.com',
          title: isCustomMode ? 'Professional' : 'CEO & Co-founder',
          linkedinUrl: contact.linkedIn || 'https://linkedin.com/in/discovered',
        },
        company: {
          name: contact.company || 'Discovered Company',
          domain: contact.email?.split('@')[1] || 'example.com',
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
          <div className="relative" ref={pillsContainerRef}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[var(--cream)]/70">Try with:</span>
              {allContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handlePillClick(contact)}
                  onMouseEnter={() => setHoveredContact(contact)}
                  onMouseLeave={() => setHoveredContact(null)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                    !isCustomMode && selectedContact.id === contact.id
                      ? "bg-[var(--turquoise)] text-[var(--dark-blue)] font-medium"
                      : "bg-[var(--turquoise)]/10 text-[var(--cream)]/70 hover:bg-[var(--turquoise)]/20",
                    contact.isCurrentUser && "ring-1 ring-[var(--turquoise)]/40"
                  )}
                >
                  {contact.avatarUrl ? (
                    <img
                      src={contact.avatarUrl}
                      alt={contact.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[var(--turquoise)]/30 flex items-center justify-center">
                      <span className="text-xs">{contact.name[0]}</span>
                    </div>
                  )}
                  {contact.isCurrentUser ? 'You' : contact.name.split(' ')[0]}
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

            {/* Hover Tooltip */}
            {hoveredContact && (
              <div className="absolute z-20 mt-2 p-3 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 shadow-lg min-w-[200px]">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-[var(--cream)]/50" />
                  <span className="text-[var(--cream)]">{hoveredContact.name}</span>
                </div>
                {hoveredContact.email && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Mail className="w-4 h-4 text-[var(--cream)]/50" />
                    <span className="text-[var(--cream)]/70">{hoveredContact.email}</span>
                  </div>
                )}
                {hoveredContact.company && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Building2 className="w-4 h-4 text-[var(--cream)]/50" />
                    <span className="text-[var(--cream)]/70">{hoveredContact.company}</span>
                  </div>
                )}
                {hoveredContact.description && (
                  <p className="text-xs text-[var(--cream)]/50 mt-2 italic">{hoveredContact.description}</p>
                )}
              </div>
            )}
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
            {isCustomMode ? '← Use sample contacts' : 'Or enter your own details to enrich →'}
          </button>

          {/* Custom Input Fields */}
          {isCustomMode && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--cream)]/50">
                Enter any combination of contact details
              </p>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/40" />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={customLinkedIn}
                  onChange={(e) => setCustomLinkedIn(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--cream)]/40">
                <span className="flex-1 h-px bg-[var(--cream)]/10" />
                <span>and/or</span>
                <span className="flex-1 h-px bg-[var(--cream)]/10" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/40" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--cream)]/40">
                <span className="flex-1 h-px bg-[var(--cream)]/10" />
                <span>and/or</span>
                <span className="flex-1 h-px bg-[var(--cream)]/10" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/40" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50"
                  />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/40" />
                  <input
                    type="text"
                    placeholder="Company"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enrich Button */}
        <Button
          onClick={handleEnrich}
          disabled={isLoading || (isCustomMode && !isCustomInputValid)}
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
