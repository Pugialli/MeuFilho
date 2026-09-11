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

const HTTP_ERRORS: Record<number, string> = {
  400: 'Requisição inválida',
  401: 'Sessão expirada. Faça login novamente',
  403: 'Sem permissão para realizar esta ação',
  404: 'Registro não encontrado',
  409: 'Conflito com dados existentes',
  422: '',
  500: 'Erro no servidor. Tente novamente',
}

export function extractApiError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { status?: number; data?: { message?: string | string[] } } }).response
    const status = res?.status
    const msg = res?.data?.message

    if (status === 422) {
      if (Array.isArray(msg)) return msg[0]
      if (msg) return msg
    }

    if (status && status in HTTP_ERRORS) {
      return HTTP_ERRORS[status] || 'Erro inesperado'
    }
  }
  return 'Erro inesperado'
}
