import { TranslationResource } from './types';

export const esMX: TranslationResource = {
  common: {
    loading: 'Cargando...',
    error: '¡Ay! Algo salió mal',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  navigation: {
    feed: 'Inicio',
    explore: 'Explorar',
    studio: 'Estudio',
    profile: 'Perfil',
  },
  upload: {
    title: 'Subir',
    placeholder: 'Cuéntanos tu historia...',
    button: 'Publicar',
    ai_assist: 'Asistente IA',
  },
  studio: {
    title: 'Estudio Creativo',
    generate: 'Generar',
    prompt_placeholder: 'Describe tu visión...',
  },
  auth: {
    login: 'Entrar',
    signup: 'Únete al barrio', // "Join the neighborhood" - warm, communal
    logout: 'Salir',
  },
  region: {
    name: 'México',
    welcome: '¡Bienvenido a la comunidad!', // Warm, direct
  },
};
