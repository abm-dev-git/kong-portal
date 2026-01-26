export interface EnrichmentConfig {
  sources: string[]
  require_linkedin: boolean
  enable_auditor: boolean
  min_confidence_to_proceed: number
  auto_proceed: boolean
  enable_hubspot_writeback: boolean
  person_system_prompt: string
  company_system_prompt: string
}

export const AVAILABLE_SOURCES = [
  { id: 'linkedin', name: 'LinkedIn', description: 'Professional profiles and job history' },
  { id: 'hunter', name: 'Hunter', description: 'Email verification and domain patterns' },
  { id: 'perplexity', name: 'Perplexity', description: 'AI-powered company research' },
  { id: 'tavily', name: 'Tavily', description: 'Web search and social profiles' },
] as const

export const DEFAULT_PERSON_SYSTEM_PROMPT = `You are enriching a B2B prospect for sales outreach.
Focus on:
- Buying signals and authority level
- Technology stack and current solutions
- Pain points relevant to our product
- Recent company changes or initiatives
Keep summaries action-oriented for sales reps.`

export const DEFAULT_COMPANY_SYSTEM_PROMPT = `You are researching a company for sales targeting.
Focus on:
- Industry vertical and company size
- Growth trajectory and funding status
- Technology adoption patterns
- Competitive landscape position
Output should support personalized outreach.`

export const DEFAULT_ENRICHMENT_CONFIG: EnrichmentConfig = {
  sources: ['linkedin', 'hunter', 'perplexity', 'tavily'],
  require_linkedin: false,
  enable_auditor: true,
  min_confidence_to_proceed: 0.5,
  auto_proceed: true,
  enable_hubspot_writeback: true,
  person_system_prompt: DEFAULT_PERSON_SYSTEM_PROMPT,
  company_system_prompt: DEFAULT_COMPANY_SYSTEM_PROMPT,
}
