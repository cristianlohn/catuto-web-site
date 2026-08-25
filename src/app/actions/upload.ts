'use server'

import { createAdminClient } from '@/lib/supabase/server'
import sharp from 'sharp'

export async function uploadBrandAssetAction(formData: FormData) {
  try {
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'brand'

    if (!file || file.size === 0) {
      return { success: false, error: 'Nenhum arquivo enviado.' }
    }

    // Validar tipo de arquivo permitido
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
      'image/webp',
      'image/x-icon',
      'image/vnd.microsoft.icon',
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Formato não suportado. Envie arquivos PNG, JPG, SVG, WebP ou ICO.',
      }
    }

    // Limite de 8MB para upload bruto
    if (file.size > 8 * 1024 * 1024) {
      return { success: false, error: 'O tamanho do arquivo não pode exceder 8MB.' }
    }

    const supabase = createAdminClient()
    const bucketName = 'site-assets'

    // Garante que o bucket existe no Supabase Storage
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === bucketName)

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880,
      })
    }

    let finalBuffer: Buffer
    let finalContentType: string
    let fileExt: string

    const inputBuffer = Buffer.from(await file.arrayBuffer())

    // Se for vetor SVG ou ícone ICO, mantém o formato original preservando as características vetoriais
    if (file.type === 'image/svg+xml' || file.type.includes('icon')) {
      finalBuffer = inputBuffer
      finalContentType = file.type
      fileExt = file.type === 'image/svg+xml' ? 'svg' : 'ico'
    } else {
      // Otimização automática e conversão para WebP de última geração via Sharp
      const image = sharp(inputBuffer)
      const metadata = await image.metadata()

      // Redimensiona se for uma imagem gigante de câmera/design (> 1600px de largura) mantendo proporção
      let pipeline = image.rotate() // Auto-orienta com base no EXIF

      if (metadata.width && metadata.width > 1600) {
        pipeline = pipeline.resize({
          width: 1600,
          withoutEnlargement: true,
          fit: 'inside',
        })
      }

      // Converte para WebP com compressão inteligente (85% qualidade visual perceptualmente idêntica e tamanho ~90% menor)
      finalBuffer = await pipeline
        .webp({
          quality: 85,
          effort: 4,
          lossless: file.type === 'image/png' && (metadata.width || 0) <= 500, // Se for logo pequeno, preserva nitidez máxima
        })
        .toBuffer()

      finalContentType = 'image/webp'
      fileExt = 'webp'
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const fileName = `${folder}/asset-${uniqueId}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, finalBuffer, {
        contentType: finalContentType,
        cacheControl: '31536000', // 1 ano de cache no CDN do browser
        upsert: true,
      })

    if (uploadError) {
      console.error('[uploadBrandAssetAction] Erro no upload do Supabase Storage:', uploadError)
      return { success: false, error: uploadError.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(fileName)

    const originalSizeKb = (file.size / 1024).toFixed(1)
    const optimizedSizeKb = (finalBuffer.length / 1024).toFixed(1)
    const reductionPercent = (
      (1 - finalBuffer.length / file.size) *
      100
    ).toFixed(0)

    console.log(
      `[ImageOptimizer] Upload processado com sucesso: ${originalSizeKb} KB -> ${optimizedSizeKb} KB (${reductionPercent}% de redução)`
    )

    return {
      success: true,
      publicUrl,
      fileName,
      originalSize: `${originalSizeKb} KB`,
      optimizedSize: `${optimizedSizeKb} KB`,
      reduction: `${reductionPercent}%`,
    }
  } catch (err: any) {
    console.error('[uploadBrandAssetAction] Erro inesperado no processamento:', err)
    return { success: false, error: err.message || 'Falha ao otimizar e enviar imagem.' }
  }
}
