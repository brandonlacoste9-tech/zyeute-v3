import { TranslationResource } from './types';

export const esSUR: TranslationResource = {
  common: {
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  navigation: {
    feed: 'Inicio',
    explore: 'Descubrir', // "Discover" - slightly more poetic than explore
    studio: 'Taller', // "Workshop/Studio" - artisan feel
    profile: 'Perfil',
  },
  upload: {
    title: 'Publicar',
    placeholder: 'Comparte tu visión...',
    button: 'Compartir',
    ai_assist: 'Asistente IA',
  },
  studio: {
    title: 'Estudio de Creación',
    generate: 'Crear',
    prompt_placeholder: 'Describe tu imaginación...',
  },
  auth: {
    login: 'Ingresar',
    signup: 'Registrarse',
    logout: 'Cerrar sesión',
  },
  region: {
    name: 'América del Sur',
    welcome: 'La mirada del sur te saluda.', // Poetic, "The gaze of the south greets you"
  },
};
