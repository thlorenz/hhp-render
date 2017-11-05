'use strict'

function renderCurrencySuffix(currency) {
  return currency === '$' ? 'USD' : 'EUR'
}

function renderType(pokertype) {
  return pokertype === 'holdem' ? `Hold'em` : 'Unknown'
}

function renderPokerLimit(limit) {
  return limit === 'limit' ? 'Limit' : 'No-Limit'
}

function istourney(type) {
  return /tournament/.test(type)
}

function renderGametype(type) {
   return istourney(type) ? 'Tournament' : 'Cash'
}

function renderAnte(ante) {
  if (ante == null || ante === 0) return ''
  return `${ante} Ante `
}

function renderRoom(room) {
  return (
      room === 'pokerstars' ? 'PokerStars'
    : ''
  )
}

module.exports = {
    renderCurrencySuffix
  , renderType
  , renderPokerLimit
  , istourney
  , renderGametype
  , renderAnte
  , renderRoom
}
