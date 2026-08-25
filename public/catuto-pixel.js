/**
 * Catuto Analytics Pixel - Rastreamento leve, rápido e 100% em conformidade com a LGPD.
 * Pesa menos de 1 KB e não armazena cookies invasivos.
 */
;(function () {
  'use strict'

  if (typeof window === 'undefined') return

  // Identifica o elemento do script e extrai as configurações
  var currentScript =
    document.currentScript ||
    document.querySelector('script[data-site]') ||
    document.querySelector('script[src*="catuto-pixel.js"]')

  var monitorId = currentScript ? currentScript.getAttribute('data-site') : null
  var customEndpoint = currentScript ? currentScript.getAttribute('data-endpoint') : null

  // Identifica a origem do servidor Catuto onde o script está hospedado
  var scriptOrigin = ''
  if (currentScript && currentScript.src) {
    try {
      var parsed = new URL(currentScript.src)
      scriptOrigin = parsed.origin
    } catch (e) {}
  }

  var targetEndpoint = customEndpoint || (scriptOrigin ? scriptOrigin + '/api/analytics/track' : '/api/analytics/track')

  function getDeviceType() {
    var width = window.innerWidth || document.documentElement.clientWidth || 0
    if (width <= 768) return 'mobile'
    if (width <= 1024) return 'tablet'
    return 'desktop'
  }

  function getBrowser() {
    var ua = navigator.userAgent || ''
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) return 'Chrome'
    if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari'
    if (ua.indexOf('Firefox') > -1) return 'Firefox'
    if (ua.indexOf('Edg') > -1) return 'Edge'
    return 'Outro'
  }

  function cleanReferrer(ref) {
    if (!ref) return 'direct'
    try {
      var url = new URL(ref)
      if (url.hostname === window.location.hostname) return 'internal'
      var host = url.hostname.replace(/^www\./, '')
      if (host.indexOf('google') > -1) return 'Google'
      if (host.indexOf('instagram') > -1) return 'Instagram'
      if (host.indexOf('facebook') > -1) return 'Facebook'
      if (host.indexOf('linkedin') > -1) return 'LinkedIn'
      if (host.indexOf('whatsapp') > -1) return 'WhatsApp'
      if (host.indexOf('t.co') > -1 || host.indexOf('twitter') > -1 || host.indexOf('x.com') > -1) return 'Twitter/X'
      return host
    } catch (e) {
      return 'referral'
    }
  }

  function getSessionId() {
    try {
      var key = '_catuto_sid'
      var sid = sessionStorage.getItem(key)
      if (!sid) {
        sid = Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
        sessionStorage.setItem(key, sid)
      }
      return sid
    } catch (e) {
      return 'anon'
    }
  }

  var lastTrackedPath = ''

  function trackPageView() {
    var path = window.location.pathname || '/'
    if (path === lastTrackedPath) return
    lastTrackedPath = path

    var payload = {
      monitor_id: monitorId || null,
      domain: window.location.hostname,
      path: path,
      referrer: cleanReferrer(document.referrer),
      device_type: getDeviceType(),
      browser: getBrowser(),
      session_id: getSessionId(),
    }

    var bodyString = JSON.stringify(payload)

    // Dispara o beacon assíncrono para o servidor da Catuto
    if (navigator.sendBeacon) {
      navigator.sendBeacon(targetEndpoint, new Blob([bodyString], { type: 'application/json' }))
    } else {
      fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
        keepalive: true,
        mode: 'cors',
      }).catch(function () {})
    }
  }

  // Executa no carregamento inicial
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    trackPageView()
  } else {
    window.addEventListener('DOMContentLoaded', trackPageView)
  }

  // Suporte a Single Page Applications (Next.js / React)
  var pushState = history.pushState
  if (pushState) {
    history.pushState = function () {
      pushState.apply(this, arguments)
      setTimeout(trackPageView, 50)
    }
    window.addEventListener('popstate', function () {
      setTimeout(trackPageView, 50)
    })
  }
})()
