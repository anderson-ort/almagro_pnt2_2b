export function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

export function isOverdue(expectedReturnDate) {
  return new Date(expectedReturnDate) < new Date()
}

export function daysUntilDue(expectedReturnDate) {
  const diff = new Date(expectedReturnDate) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
