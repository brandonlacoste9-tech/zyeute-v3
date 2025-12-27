export type Locale = 'fr-CA' | 'en-CA' | 'hi-IN' | 'es-ES' | 'es-MX' | 'es-SUR';

export interface TranslationResource {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
  };
  navigation: {
    feed: string;
    explore: string;
    studio: string;
    profile: string;
  };
  upload: {
    title: string;
    placeholder: string;
    button: string;
    ai_assist: string;
  };
  studio: {
    title: string;
    generate: string;
    prompt_placeholder: string;
  };
  auth: {
    login: string;
    signup: string;
    logout: string;
  };
  region: {
    name: string;
    welcome: string;
  };
}

export const defaultLocale: Locale = 'fr-CA';
