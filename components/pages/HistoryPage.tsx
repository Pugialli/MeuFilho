'use client'

import { useState } from 'react'
import { Scale, Ruler, Heart, Trash2, ClipboardList, RefreshCw } from 'lucide-react'
import { useChildren } from '@/hooks/useChild'
import { useMeasurements, useDeleteMeasurement } from '@/hooks/useMeasurements'
import { formatGroupDate } from '@/lib/utils'
import { extractApiError } from '@/lib/utils'
import type { Measurement, MeasurementType } from '@/types'

const TABS: { label: string; value: MeasurementType | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Peso', value: 'WEIGHT' },
  { label: 'Altura', value: 'HEIGHT' },
  { label: 'BPM', value: 'BPM' },
]

const ICONS: Record<MeasurementType, React.ComponentType<{ size?: number; className?: string }>> = {
  WEIGHT: Scale,
  HEIGHT: Ruler,
  BPM: Heart,
}

const TYPE_LABELS: Record<MeasurementType, string> = {
  WEIGHT: 'Peso',
  HEIGHT: 'Altura',
  BPM: 'BPM',
}

function groupByDate(measurements: Measurement[]): { date: string; items: Measurement[] }[] {
  const map = new Map<string, Measurement[]>()
  for (const m of measurements) {
    const existing = map.get(m.date) ?? []
    existing.push(m)
    map.set(m.date, existing)
  }
  return Array.from(map.entries())
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

function MeasurementItem({
  item,
  onDelete,
  deleting,
}: {
  item: Measurement
  onDelete: (id: string) => void
  deleting: boolean
}) {
  const Icon = ICONS[item.type]
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="flex justify-between items-center bg-surface rounded-2xl p-3.5 mb-2 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-[10px] bg-primary-light flex items-center justify-center shrink-0">
          <Icon size={20} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-text">{TYPE_LABELS[item.type]}</p>
          <p className="text-xs text-text-secondary truncate">por {item.recordedBy.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-lg font-bold text-primary">
          {item.value}{' '}
          <span className="text-xs font-normal text-text-secondary">{item.unit}</span>
        </span>

        {confirm ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(item.id)}
              disabled={deleting}
              className="text-[11px] font-semibold text-error px-2 py-1 rounded-lg bg-error-light disabled:opacity-50"
            >
              Excluir
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="text-[11px] text-text-secondary px-2 py-1"
            >
              Não
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirm(true)}
            className="text-error hover:opacity-70 p-1"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export function HistoryPage() {
  const [activeTab, setActiveTab] = useState<MeasurementType | undefined>(undefined)
  const { data: children, isLoading: loadingChild } = useChildren()
  const child = children?.[0]

  const { data: measurements, isLoading, isRefetching, refetch } = useMeasurements(
    child?.id ?? '',
    activeTab
  )
  const deleteMutation = useDeleteMeasurement(child?.id ?? '')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeleteError(null)
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err) {
      setDeleteError(extractApiError(err))
    }
  }

  if (loadingChild || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-8">
        <p className="text-text-secondary text-base text-center leading-relaxed">
          Cadastre ou entre em um perfil de bebê primeiro na aba Bebê.
        </p>
      </div>
    )
  }

  const grouped = groupByDate(measurements ?? [])

  return (
    <div className="flex flex-col max-w-[680px] mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 px-6 py-3 bg-surface border-b border-border sticky top-0 z-10">
        {TABS.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-2 rounded-[20px] text-[13px] font-semibold transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-white'
                : 'bg-background text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Refresh button */}
      <div className="px-6 pt-3 flex justify-end">
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefetching ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {deleteError && (
        <div className="mx-4 mt-2 bg-error-light rounded-xl px-4 py-2">
          <p className="text-error text-sm">{deleteError}</p>
        </div>
      )}

      {/* List */}
      <div className="px-6 pb-6 mt-2">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center pt-16 gap-3">
            <ClipboardList size={48} className="text-muted" />
            <p className="text-text-secondary text-base">Nenhuma medição encontrada</p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.date} className="mb-5">
              <p className="text-[13px] font-semibold text-text-secondary capitalize mb-2.5">
                {formatGroupDate(group.date)}
              </p>
              {group.items.map((m) => (
                <MeasurementItem
                  key={m.id}
                  item={m}
                  onDelete={handleDelete}
                  deleting={deleteMutation.isPending}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
