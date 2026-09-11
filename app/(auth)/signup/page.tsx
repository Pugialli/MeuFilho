'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { extractApiError } from '@/lib/utils'
import type { Role } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['PAI', 'MAE']),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'MAE' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (values: FormData) => {
    setApiError(null)
    setLoading(true)
    try {
      await signup(values)
      router.replace('/')
    } catch (err) {
      setApiError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-3">
            <Leaf size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Meu Filho</h1>
          <p className="text-text-secondary text-sm mt-1 text-center">
            Acompanhe cada momento do seu filho
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-[20px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-[22px] font-semibold text-text mb-5">Criar conta</h2>

          <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Nome
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                {...register('name')}
                className={`w-full h-12 px-3.5 rounded-xl border text-[15px] text-text bg-background outline-none transition-colors focus:border-primary ${
                  errors.name ? 'border-error' : 'border-border'
                }`}
              />
              {errors.name && (
                <p className="text-error text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                {...register('email')}
                className={`w-full h-12 px-3.5 rounded-xl border text-[15px] text-text bg-background outline-none transition-colors focus:border-primary ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  {...register('password')}
                  className={`w-full h-12 pl-3.5 pr-11 rounded-xl border text-[15px] text-text bg-background outline-none transition-colors focus:border-primary ${
                    errors.password ? 'border-error' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Você é
              </label>
              <div className="flex gap-2">
                {(['MAE', 'PAI'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue('role', r)}
                    className={`flex-1 py-2.5 rounded-xl border-[1.5px] text-sm font-semibold transition-colors ${
                      selectedRole === r
                        ? 'bg-primary border-primary text-white'
                        : 'bg-surface border-border text-text-secondary'
                    }`}
                  >
                    {r === 'MAE' ? 'Mãe' : 'Pai'}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-error text-xs mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="bg-error-light rounded-lg px-3 py-2.5 mb-4">
                <p className="text-error text-sm text-center">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] bg-primary text-white rounded-xl text-base font-semibold mt-2 transition-opacity disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-5">
            Já tem conta?{' '}
            <Link href="/login" className="text-primary font-semibold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
