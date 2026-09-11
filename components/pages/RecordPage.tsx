'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Scale, Ruler, Heart } from 'lucide-react'
import { useChildren } from '@/hooks/useChild'
import { useAddMeasurement } from '@/hooks/useMeasurements'
import { toLocalDateString, extractApiError } from '@/lib/utils'
import type { MeasurementType } from '@/types'

const TYPES = [
  { type: 'WEIGHT' as MeasurementType, label: 'Peso', unit: 'g', placeholder: 'Ex: 3500', Icon: Scale },
  { type: 'HEIGHT' as MeasurementType, label: 'Altura', unit: 'cm', placeholder: 'Ex: 50', Icon: Ruler },
  { type: 'BPM' as MeasurementType, label: 'BPM', unit: 'bpm', placeholder: 'Ex: 140', Icon: Heart },
]

const schema = z.object({
  value: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Deve ser um número positivo'),
})

type FormData = z.infer<typeof schema>

export function RecordPage() {
  const { data: children, isLoading } = useChildren()
  const child = children?.[0]
  const addMeasurement = useAddMeasurement(child?.id ?? '')

  const [selectedType, setSelectedType] = useState<MeasurementType>('WEIGHT')
  const [date, setDate] = useState(toLocalDateString(new Date()))
  const [success, setSuccess] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const activeType = TYPES.find((t) => t.type === selectedType)!

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { value: '' },
  })

  const onSubmit = async (values: FormData) => {
    if (!child) return
    setApiError(null)
    setSuccess(null)
    try {
      await addMeasurement.mutateAsync({
        type: selectedType,
        value: Number(values.value),
        date,
        unit: activeType.unit,
      })
      setSuccess(`${activeType.label} registrado com sucesso!`)
      reset({ value: '' })
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setApiError(extractApiError(err))
    }
  }

  if (isLoading) {
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

  return (
    <div className="px-4 py-6 max-w-[560px] mx-auto">
      <h2 className="text-xl font-bold text-text mb-1">Nova medição</h2>
      <p className="text-[13px] text-text-secondary mb-5 leading-snug">
        Selecione o tipo e informe o valor.
      </p>

      {/* Type selector */}
      <div className="flex gap-2 mb-6">
        {TYPES.map(({ type, label, Icon }) => {
          const active = selectedType === type
          return (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type)
                reset({ value: '' })
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-[1.5px] text-[13px] font-semibold transition-colors ${
                active
                  ? 'bg-primary border-primary text-white'
                  : 'bg-surface border-border text-text-secondary'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Value */}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-text-secondary mb-2">
            {activeType.label} ({activeType.unit})
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={activeType.placeholder}
            {...register('value')}
            className={`w-full h-[52px] px-3.5 rounded-xl border text-lg font-semibold text-text bg-surface outline-none transition-colors focus:border-primary ${
              errors.value ? 'border-error' : 'border-border'
            }`}
          />
          {errors.value && (
            <p className="text-error text-xs mt-1">{errors.value.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-text-secondary mb-2">
            Data
          </label>
          <input
            type="date"
            value={date}
            max={toLocalDateString(new Date())}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-[52px] px-3.5 rounded-xl border border-border text-[15px] text-text bg-surface outline-none focus:border-primary transition-colors"
          />
        </div>

        {success && (
          <div className="bg-primary-light rounded-xl px-4 py-3 mb-4">
            <p className="text-primary text-sm font-semibold text-center">{success}</p>
          </div>
        )}

        {apiError && (
          <div className="bg-error-light rounded-xl px-4 py-3 mb-4">
            <p className="text-error text-sm text-center">{apiError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={addMeasurement.isPending}
          className="w-full h-[52px] bg-primary text-white rounded-[14px] text-base font-bold disabled:opacity-70 flex items-center justify-center"
        >
          {addMeasurement.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Salvar medição'
          )}
        </button>
      </form>
    </div>
  )
}
