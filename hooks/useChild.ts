import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Child, Sex } from '@/types'

export function useChildren() {
  return useQuery<Child[]>({
    queryKey: ['children'],
    queryFn: async () => {
      const { data } = await api.get('/children')
      return data.data as Child[]
    },
  })
}

export function useCreateChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name?: string; dueDate?: string; sex?: Sex }) => {
      const { data } = await api.post('/children', payload)
      return data.data as Child
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['children'] }),
  })
}

export function useUpdateChild(childId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name?: string; dueDate?: string; sex?: Sex }) => {
      const { data } = await api.patch(`/children/${childId}`, payload)
      return data.data as Child
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['children'] }),
  })
}

export function useJoinChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data } = await api.post('/children/join', { inviteCode })
      return data.data as Child
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['children'] }),
  })
}
