'use client'

import { useState } from 'react'
import {
  Baby,
  Leaf,
  User,
  Share2,
  Pencil,
  Check,
  X,
  Plus,
  RefreshCw,
  Copy,
} from 'lucide-react'
import { useChildren, useCreateChild, useUpdateChild, useJoinChild } from '@/hooks/useChild'
import { formatDate } from '@/lib/utils'
import { extractApiError } from '@/lib/utils'
import type { Child, Sex } from '@/types'

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'MALE', label: 'Menino' },
  { value: 'FEMALE', label: 'Menina' },
  { value: 'UNKNOWN', label: 'Não definido' },
]

function SexChips({ value, onChange }: { value: Sex; onChange: (s: Sex) => void }) {
  return (
    <div className="flex gap-2">
      {SEX_OPTIONS.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 rounded-xl border-[1.5px] text-xs font-semibold transition-colors ${
              active
                ? 'bg-primary border-primary text-white'
                : 'bg-surface border-border text-text-secondary'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function InviteModal({ child, onClose }: { child: Child; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = `Use o código ${child.inviteCode} no app Meu Filho para acompanhar nosso bebê!`
    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(child.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-[20px] p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-text">Código de convite</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text">
            <X size={20} />
          </button>
        </div>
        <p className="text-[13px] text-text-secondary mb-5 leading-relaxed">
          Compartilhe este código com o(a) parceiro(a) para que ele(a) acesse o perfil do bebê.
        </p>
        <div className="bg-background rounded-2xl py-5 flex items-center justify-center mb-4">
          <span className="text-[32px] font-extrabold text-primary tracking-[6px]">
            {child.inviteCode}
          </span>
        </div>
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 font-semibold"
        >
          {copied ? <Copy size={16} /> : <Share2 size={16} />}
          {copied ? 'Copiado!' : 'Compartilhar'}
        </button>
      </div>
    </div>
  )
}

function ChildCard({ child }: { child: Child }) {
  const [editing, setEditing] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [editName, setEditName] = useState(child.name ?? '')
  const [editSex, setEditSex] = useState<Sex>(child.sex ?? 'UNKNOWN')
  const [editDueDate, setEditDueDate] = useState(
    child.dueDate ? child.dueDate.split('T')[0] : ''
  )
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateChild = useUpdateChild(child.id)

  const handleSave = async () => {
    setSaveError(null)
    try {
      await updateChild.mutateAsync({
        name: editName.trim() || undefined,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : undefined,
        sex: editSex,
      })
      setEditing(false)
    } catch (err) {
      setSaveError(extractApiError(err))
    }
  }

  const handleCancel = () => {
    setEditName(child.name ?? '')
    setEditSex(child.sex ?? 'UNKNOWN')
    setEditDueDate(child.dueDate ? child.dueDate.split('T')[0] : '')
    setSaveError(null)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-surface rounded-[20px] p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text">Editar bebê</h3>
          <button onClick={handleCancel} className="text-text-secondary hover:text-text">
            <X size={20} />
          </button>
        </div>

        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
          Nome (opcional)
        </label>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Nome do bebê"
          className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors"
        />

        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
          Sexo
        </label>
        <SexChips value={editSex} onChange={setEditSex} />

        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
          Data prevista de nascimento
        </label>
        <input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors"
        />

        {saveError && (
          <p className="text-error text-xs mt-2">{saveError}</p>
        )}

        <button
          onClick={handleSave}
          disabled={updateChild.isPending}
          className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {updateChild.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check size={16} />
              Salvar
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="bg-surface rounded-[20px] p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.07)] relative">
        <button
          onClick={() => setEditing(true)}
          className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text"
        >
          <Pencil size={16} />
        </button>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-3">
            <Baby size={40} className="text-primary" />
          </div>

          <h3 className="text-2xl font-bold text-text">{child.name ?? 'Nosso bebê'}</h3>

          {child.sex !== 'UNKNOWN' && (
            <span className="mt-1.5 bg-primary-light px-3 py-0.5 rounded-full text-xs font-semibold text-text">
              {child.sex === 'MALE' ? 'Menino' : 'Menina'}
            </span>
          )}

          {child.dueDate && (
            <p className="text-sm text-text-secondary mt-1">
              Previsão: {formatDate(child.dueDate)}
            </p>
          )}
        </div>

        {child.members.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border w-full">
            <p className="text-xs text-text-secondary mb-2">Responsáveis</p>
            <div className="flex flex-col gap-1.5">
              {child.members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <User size={14} className="text-text-secondary" />
                  <span className="text-sm text-text">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowInvite(true)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary-light transition-colors"
        >
          <Share2 size={14} />
          Convidar parceiro(a)
        </button>
      </div>

      {showInvite && <InviteModal child={child} onClose={() => setShowInvite(false)} />}
    </>
  )
}

function AddChildSection() {
  const [mode, setMode] = useState<'closed' | 'choose' | 'create' | 'join'>('closed')
  const [name, setName] = useState('')
  const [sex, setSex] = useState<Sex>('UNKNOWN')
  const [dueDate, setDueDate] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateChild()
  const joinMutation = useJoinChild()

  const reset = () => {
    setName('')
    setSex('UNKNOWN')
    setDueDate('')
    setInviteCode('')
    setError(null)
    setMode('closed')
  }

  const handleCreate = async () => {
    setError(null)
    try {
      await createMutation.mutateAsync({
        name: name.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        sex,
      })
      reset()
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  const handleJoin = async () => {
    const code = inviteCode.trim().toUpperCase()
    if (code.length !== 8) { setError('O código deve ter 8 caracteres'); return }
    setError(null)
    try {
      await joinMutation.mutateAsync(code)
      reset()
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  if (mode === 'closed') {
    return (
      <button
        onClick={() => setMode('choose')}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-[1.5px] border-dashed border-primary text-primary text-sm font-semibold mt-1 hover:bg-primary-light transition-colors"
      >
        <Plus size={16} />
        Adicionar outro bebê
      </button>
    )
  }

  if (mode === 'choose') {
    return (
      <div className="bg-surface rounded-[20px] p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text">Adicionar bebê</h3>
          <button onClick={reset} className="text-text-secondary hover:text-text">
            <X size={20} />
          </button>
        </div>
        <button
          onClick={() => setMode('create')}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold"
        >
          Criar perfil do bebê
        </button>
        <button
          onClick={() => setMode('join')}
          className="w-full py-3.5 border-[1.5px] border-primary text-primary rounded-xl font-semibold mt-3"
        >
          Entrar com código
        </button>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="bg-surface rounded-[20px] p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text">Código de convite</h3>
          <button onClick={() => setMode('choose')} className="text-text-secondary hover:text-text">
            <X size={20} />
          </button>
        </div>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          placeholder="Ex: XKPQ7MNR"
          maxLength={8}
          className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors uppercase tracking-widest"
        />
        {error && <p className="text-error text-xs mt-1">{error}</p>}
        <button
          onClick={handleJoin}
          disabled={joinMutation.isPending}
          className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-semibold disabled:opacity-70 flex items-center justify-center"
        >
          {joinMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Entrar'
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-[20px] p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-text">Novo bebê</h3>
        <button onClick={() => setMode('choose')} className="text-text-secondary hover:text-text">
          <X size={20} />
        </button>
      </div>

      <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
        Nome (opcional)
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do bebê"
        className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors"
      />

      <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
        Sexo
      </label>
      <SexChips value={sex} onChange={setSex} />

      <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
        Data prevista de nascimento (opcional)
      </label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors"
      />

      {error && <p className="text-error text-xs mt-2">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={createMutation.isPending}
        className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-semibold disabled:opacity-70 flex items-center justify-center"
      >
        {createMutation.isPending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Criar'
        )}
      </button>
    </div>
  )
}

function EmptyState() {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [name, setName] = useState('')
  const [sex, setSex] = useState<Sex>('UNKNOWN')
  const [dueDate, setDueDate] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateChild()
  const joinMutation = useJoinChild()

  const handleCreate = async () => {
    setError(null)
    try {
      await createMutation.mutateAsync({
        name: name.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        sex,
      })
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  const handleJoin = async () => {
    const code = inviteCode.trim().toUpperCase()
    if (code.length !== 8) { setError('O código deve ter 8 caracteres'); return }
    setError(null)
    try {
      await joinMutation.mutateAsync(code)
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  if (mode === 'choose') {
    return (
      <div className="flex flex-col items-center pt-10">
        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mb-4">
          <Leaf size={48} className="text-primary" />
        </div>
        <h2 className="text-[22px] font-bold text-text text-center">
          Bem-vindo ao Meu Filho
        </h2>
        <p className="text-sm text-text-secondary mt-2 text-center leading-relaxed">
          Crie um perfil para o bebê ou entre com um código de convite
        </p>
        <button
          onClick={() => setMode('create')}
          className="mt-6 w-full py-3.5 bg-primary text-white rounded-xl font-semibold"
        >
          Criar perfil do bebê
        </button>
        <button
          onClick={() => setMode('join')}
          className="mt-3 w-full py-3.5 border-[1.5px] border-primary text-primary rounded-xl font-semibold"
        >
          Entrar com código
        </button>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="bg-surface rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <h3 className="text-xl font-bold text-text mb-4">Código de convite</h3>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          placeholder="Ex: XKPQ7MNR"
          maxLength={8}
          className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors uppercase tracking-widest"
        />
        {error && <p className="text-error text-xs mt-1">{error}</p>}
        <button
          onClick={handleJoin}
          disabled={joinMutation.isPending}
          className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-semibold disabled:opacity-70 flex items-center justify-center"
        >
          {joinMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Entrar'
          )}
        </button>
        <button
          onClick={() => setMode('choose')}
          className="mt-4 w-full text-center text-sm text-text-secondary"
        >
          ← Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
      <h3 className="text-xl font-bold text-text mb-4">Novo bebê</h3>

      <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
        Nome (opcional)
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do bebê"
        className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors"
      />

      <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
        Sexo
      </label>
      <SexChips value={sex} onChange={setSex} />

      <label className="block text-[13px] font-medium text-text-secondary mb-1.5 mt-3">
        Data prevista de nascimento (opcional)
      </label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full h-12 px-3.5 rounded-xl border border-border text-[15px] text-text bg-background outline-none focus:border-primary transition-colors"
      />

      {error && <p className="text-error text-xs mt-2">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={createMutation.isPending}
        className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-semibold disabled:opacity-70 flex items-center justify-center"
      >
        {createMutation.isPending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Criar'
        )}
      </button>
      <button
        onClick={() => setMode('choose')}
        className="mt-4 w-full text-center text-sm text-text-secondary"
      >
        ← Voltar
      </button>
    </div>
  )
}

export function HomePage() {
  const { data: children, isLoading, isError, refetch } = useChildren()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 gap-4">
        <p className="text-error text-base">Erro ao carregar dados</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
        >
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    )
  }

  const hasChildren = children && children.length > 0

  return (
    <div className="px-4 py-6 max-w-[680px] mx-auto">
      {hasChildren ? (
        <>
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
          <AddChildSection />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
