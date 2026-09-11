import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Measurement, MeasurementType } from '@/types'

export function useMeasurements(childId: string, type?: MeasurementType) {
  return useQuery<Measurement[]>({
    queryKey: ['measurements', childId, type],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (type) params.set('type', type)
      const { data } = await api.get(`/children/${childId}/measurements?${params.toString()}`)
      return data.data as Measurement[]
    },
    enabled: !!childId,
  })
}

export function useAddMeasurement(childId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { type: MeasurementType; value: number; date: string; unit?: string }) => {
      const { data } = await api.post(`/children/${childId}/measurements`, payload)
      return data.data as Measurement
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['measurements', childId] }),
  })
}

export function useDeleteMeasurement(childId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (measurementId: string) => {
      await api.delete(`/measurements/${measurementId}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['measurements', childId] }),
  })
}
