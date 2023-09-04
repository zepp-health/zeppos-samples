export function getResourcePath(p, prefix = 'data://download/') {
  if (p.indexOf(prefix) === 0) return p
  return prefix + p
}