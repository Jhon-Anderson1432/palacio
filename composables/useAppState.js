// composables/useSearchState.js

export const useSearchState = () => {
  // useState garantiza que el estado sea global, reactivo y seguro para SSR.
  // El primer parámetro ('searchQuery') es una clave única para este estado.
  // El segundo parámetro es una función que retorna el valor inicial (un string vacío).
  return useState('searchQuery', () => '')
}