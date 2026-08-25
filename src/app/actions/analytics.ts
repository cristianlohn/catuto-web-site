'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { SitePageview } from '@/types/database'

export interface AnalyticsSummary {
  total_pageviews: number
  unique_visitors: number
  today_pageviews: number
  mobile_percentage: number
  daily_chart: Array<{
    date: string
    pageviews: number
    visitors: number
  }>
  top_pages: Array<{
    path: string
    views: number
    percentage: number
  }>
  top_referrers: Array<{
    referrer: string
    count: number
    percentage: number
  }>
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
}

export async function getAnalyticsSummaryAction(
  monitorId?: string | null,
  periodDays: number = 30
): Promise<{
  success: boolean
  data: AnalyticsSummary
  error?: string
}> {
  const emptySummary: AnalyticsSummary = {
    total_pageviews: 0,
    unique_visitors: 0,
    today_pageviews: 0,
    mobile_percentage: 0,
    daily_chart: [],
    top_pages: [],
    top_referrers: [],
    devices: { desktop: 0, mobile: 0, tablet: 0 },
  }

  try {
    const supabase = createAdminClient()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)
    startDate.setHours(0, 0, 0, 0)

    let query = supabase
      .from('site_pageviews')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (monitorId) {
      query = query.eq('monitor_id', monitorId)
    }

    const { data: pageviews, error } = await query

    if (error) {
      // Se a tabela ainda não existir no Supabase, retorna sumário vazio amigável
      return { success: false, data: emptySummary, error: error.message }
    }

    const views = (pageviews as SitePageview[]) || []

    if (views.length === 0) {
      return { success: true, data: emptySummary }
    }

    const totalViews = views.length
    const uniqueSessionIds = new Set(views.map((v) => v.session_id).filter(Boolean))
    const uniqueVisitors = uniqueSessionIds.size || Math.round(totalViews * 0.75)

    const todayStr = new Date().toISOString().slice(0, 10)
    const todayViews = views.filter((v) => v.created_at?.startsWith(todayStr)).length

    // Dispositivos
    const desktopCount = views.filter((v) => v.device_type === 'desktop').length
    const mobileCount = views.filter((v) => v.device_type === 'mobile').length
    const tabletCount = views.filter((v) => v.device_type === 'tablet').length
    const mobilePercentage = totalViews > 0 ? Math.round((mobileCount / totalViews) * 100) : 0

    // Agrupamento por Páginas
    const pageCounts: Record<string, number> = {}
    views.forEach((v) => {
      const p = v.path || '/'
      pageCounts[p] = (pageCounts[p] || 0) + 1
    })

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([path, count]) => ({
        path,
        views: count,
        percentage: Math.round((count / totalViews) * 100),
      }))

    // Agrupamento por Origem (Referrers)
    const refCounts: Record<string, number> = {}
    views.forEach((v) => {
      const r = v.referrer || 'direct'
      refCounts[r] = (refCounts[r] || 0) + 1
    })

    const topReferrers = Object.entries(refCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([referrer, count]) => ({
        referrer: referrer === 'direct' ? 'Tráfego Direto' : referrer,
        count,
        percentage: Math.round((count / totalViews) * 100),
      }))

    // Gráfico Diário (Últimos 14 dias)
    const dailyMap: Record<string, { pageviews: number; sessions: Set<string> }> = {}

    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dailyMap[key] = { pageviews: 0, sessions: new Set() }
    }

    views.forEach((v) => {
      const day = v.created_at?.slice(0, 10)
      if (day && dailyMap[day]) {
        dailyMap[day].pageviews++
        if (v.session_id) dailyMap[day].sessions.add(v.session_id)
      }
    })

    const daily_chart = Object.entries(dailyMap).map(([key, val]) => {
      const [, m, day] = key.split('-')
      return {
        date: `${day}/${m}`,
        pageviews: val.pageviews,
        visitors: val.sessions.size || Math.round(val.pageviews * 0.7),
      }
    })

    return {
      success: true,
      data: {
        total_pageviews: totalViews,
        unique_visitors: uniqueVisitors,
        today_pageviews: todayViews,
        mobile_percentage: mobilePercentage,
        daily_chart,
        top_pages: topPages,
        top_referrers: topReferrers,
        devices: {
          desktop: desktopCount,
          mobile: mobileCount,
          tablet: tabletCount,
        },
      },
    }
  } catch (err: any) {
    return { success: false, data: emptySummary, error: err.message }
  }
}
