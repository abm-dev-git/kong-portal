import { ApiReference } from '@/components/api-reference';

export const metadata = {
  title: 'API Reference - ABM.dev Developer Portal',
  description: 'Interactive API documentation for the ABM.dev GTM Intelligence API',
};

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen bg-[var(--dark-blue)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 mb-6">
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            API Reference
          </h1>
          <p className="text-[var(--cream)]/70">
            Explore and test the ABM.dev API endpoints. Sign in to use the interactive Try It console.
          </p>
        </div>
        <ApiReference />
      </div>
    </div>
  );
}
