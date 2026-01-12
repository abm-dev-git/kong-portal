import { ApiKeysClient } from './_components/ApiKeysClient';

export const metadata = {
  title: 'API Keys - ABM.dev Developer Portal',
  description: 'Manage your API keys for accessing the ABM.dev API',
};

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <ApiKeysClient />
    </div>
  );
}
