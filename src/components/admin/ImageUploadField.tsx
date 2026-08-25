'use client'

import * as React from 'react'
import { uploadBrandAssetAction } from '@/app/actions/upload'
import { Input } from '@/components/ui/input'
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Zap,
} from 'lucide-react'

interface ImageUploadFieldProps {
  label: string
  description?: string
  value: string | null | undefined
  onChange: (url: string) => void
  folder?: string
}

export function ImageUploadField({
  label,
  description,
  value,
  onChange,
  folder = 'brand',
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [optimizationStats, setOptimizationStats] = React.useState<{
    originalSize?: string
    optimizedSize?: string
    reduction?: string
  } | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setOptimizationStats(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const result = await uploadBrandAssetAction(formData)

      if (result.success && result.publicUrl) {
        onChange(result.publicUrl)
        if (result.reduction && result.reduction !== '0%') {
          setOptimizationStats({
            originalSize: result.originalSize,
            optimizedSize: result.optimizedSize,
            reduction: result.reduction,
          })
        }
      } else {
        setError(result.error || 'Erro ao fazer upload da imagem.')
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar imagem. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setOptimizationStats(null)
            }}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3 h-3" />
            Remover imagem
          </button>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-zinc-400">{description}</p>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0])
            }
          }}
        />

        {isUploading ? (
          <div className="py-4 flex flex-col items-center gap-2 text-blue-400">
            <Loader2 className="w-7 h-7 animate-spin" />
            <span className="text-xs font-medium text-zinc-300">
              Otimizando e convertendo para WebP de alta performance...
            </span>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-zinc-900 border border-zinc-800 p-2 flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={value}
                alt="Preview da marca"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Imagem otimizada e salva no CDN
              </div>

              {optimizationStats && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold mt-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  Convertido para WebP: {optimizationStats.originalSize} → {optimizationStats.optimizedSize} (-{optimizationStats.reduction})
                </div>
              )}
            </div>

            <span className="text-[11px] text-zinc-400">
              Clique ou arraste outro arquivo para substituir
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-zinc-200">
              Clique para selecionar ou arraste sua imagem aqui
            </div>
            <span className="text-[11px] text-zinc-400">
              Conversão automática para WebP otimizado (PNG, JPG, SVG até 8MB)
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* URL manual alternativa */}
      <div className="pt-1">
        <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
          Ou informe uma URL direta de imagem:
        </label>
        <Input
          type="url"
          placeholder="https://suaempresa.com/logo.png"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value)
            setOptimizationStats(null)
          }}
          className="text-xs h-9"
        />
      </div>
    </div>
  )
}
