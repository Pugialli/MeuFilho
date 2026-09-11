export function formatDate(iso: string | null): string {
  if (!iso) return '–'
  const datePart = iso.split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function formatGroupDate(dateStr: string): string {
  const datePart = dateStr.split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function toLocalDateString(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function extractApiError(err: unknown): string {
  if (err && typeof err === 'object') {
    if ('response' in err) {
      const res = (err as { response?: { status?: number; data?: { message?: string | string[] } } }).response
      const msg = res?.data?.message
      if (Array.isArray(msg)) return msg[0]
      if (msg) return msg
      if (res?.status) return `Erro ${res.status}`
    }
    if ('message' in err) {
      const msg = (err as { message?: string }).message
      if (msg) return msg
    }
  }
  return 'Erro inesperado'
}
