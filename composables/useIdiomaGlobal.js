// composables/useIdiomaGlobal.js

export const useIdiomaGlobal = () => {
  // useState garantiza que el idioma no se cruce entre diferentes usuarios visitando la página al mismo tiempo
  return useState('idiomaGlobal', () => 'es')
}