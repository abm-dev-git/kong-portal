import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Documentation - ABM.dev',
  description: 'ABM.dev API Documentation',
};

export default function DocsPage() {
  redirect('/api-reference');
}
