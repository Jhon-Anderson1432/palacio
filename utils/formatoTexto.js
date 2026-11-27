const PALABRAS_MENORES = [
  'de', 'del', 'con', 'y', 'e', 'o', 'u', 'el', 'la', 'los', 'las', 'en', 'por',
  'un', 'una', 'unos', 'unas', 'a', 'al', 'with', 'and', 'of', 'in', 'the',
  'et', 'au', 'aux', 'à'
]

/**
 * Formatea un título aplicando Title Case inteligente:
 * - Capitaliza la palabra inmediatamente posterior a comillas, paréntesis o signos de apertura.
 * - Mantiene en minúscula preposiciones y artículos menores en mitad de título.
 * - Soporta palabras compuestas con guion o apóstrofe y letras acentuadas Unicode.
 */
export const formatoTitulo = (texto) => {
  if (typeof texto !== 'string' || !texto) return ''

  return texto
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index, arr) => {
      const match = word.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u)
      if (!match) return word

      const leading = match[1]
      const core = match[2]
      const trailing = match[3]

      if (!core) return word

      const tieneSimboloApertura = /[“"«‘'(\[{¿¡]/.test(leading)
      const sigueADosPuntos = index > 0 && /:$/.test(arr[index - 1])

      if (index > 0 && !tieneSimboloApertura && !sigueADosPuntos && PALABRAS_MENORES.includes(core)) {
        return leading + core + trailing
      }

      const coreFormateado = core
        .split(/([-'])/)
        .map((part) => {
          if (part === '-' || part === "'") return part
          return part.charAt(0).toUpperCase() + part.slice(1)
        })
        .join('')

      return leading + coreFormateado + trailing
    })
    .join(' ')
}

/**
 * Formatea un párrafo manteniendo únicamente la primera letra en mayúscula.
 */
export const formatoParrafo = (texto) => {
  if (typeof texto !== 'string' || !texto) return ''
  const t = texto.trim()
  return t.charAt(0).toUpperCase() + t.slice(1)
}
