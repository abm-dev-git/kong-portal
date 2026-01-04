declare module '@stoplight/elements' {
  import { ComponentType } from 'react';

  export interface APIProps {
    apiDescriptionUrl?: string;
    apiDescriptionDocument?: string | object;
    basePath?: string;
    router?: 'hash' | 'memory' | 'history';
    layout?: 'sidebar' | 'stacked' | 'responsive';
    hideExport?: boolean;
    hideInternal?: boolean;
    hideTryIt?: boolean;
    hideSchemas?: boolean;
    tryItCredentialsPolicy?: 'omit' | 'include' | 'same-origin';
    tryItCorsProxy?: string;
    logo?: string;
  }

  export const API: ComponentType<APIProps>;
}

declare module '@stoplight/elements/styles.min.css' {
  const content: string;
  export default content;
}
