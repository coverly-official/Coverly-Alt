import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_URL || 'https://duhxy56e.us-east.insforge.app';
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || '';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export const isInsForgeConfigured = Boolean(
  import.meta.env.VITE_INSFORGE_URL && import.meta.env.VITE_INSFORGE_ANON_KEY
);
