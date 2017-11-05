'use strict'

const formatNumber = require('simple-format-number')

const RED = '#ff4136'
const GREEN = '#19a974'
const BLUE = '#357edd'
const GRAY = '#555555'

const DEFAULT_SUITS = {
    h: { color: RED, symbol:'♥' }
  , s: { color: GRAY, symbol:'♠' }
  , d: { color: BLUE, symbol:'♦' }
  , c: { color: GREEN, symbol:'♣' }
}

const {
    renderCurrencySuffix
  , renderType
  , renderPokerLimit
  , istourney
  , renderGametype
  , renderAnte
  , renderRoom
} = require('./util')

function renderChips(n, currency, fractionDigits = 2) {
  const formatted = formatNumber(n, { fractionDigits })
  return currency != null ? `${currency}${formatted}` : formatted
}

function renderChipsAsBB(n) {
  return formatNumber(n, { fractionDigits: 1 }) + 'BB'
}

class MlBase {
  constructor({ text = '', summary = null, amountAsBB = false, showHeroCards = true }) {
    this._text = text
    this._summary = summary
    this._amountAsBB = amountAsBB
    this._showHeroCards = showHeroCards
  }

  // @override optionally
  get suits() { return DEFAULT_SUITS }

  // @overrides tag-open/tag-close
  color_(hex) { return this }
  _color(hex) { return this }

  bold_() { return this }
  _bold() { return this }

  italic_() { return this }
  _italic() { return this }

  spoiler_() { return this }
  _spoiler() { return this }

  // @overrides wrappers
  newline() { return this }
  card(c) {}
  playersInHand(n) {}

  //
  // algorithm
  //
  render() {
    this
      ._header(this._summary.header)
        .newline()
        .newline()
      ._seats(this._summary.seats, this._summary.preflopSummary.pos)
        .newline()
      ._chipStackRatio(this._summary.chipStackRatio)
        .newline()
        .newline()
      ._preflopSummary(this._summary.preflopSummary)
        .newline()
      ._playerActions(this._summary.preflopActions)

    if (this._summary.flopActions != null && this._summary.flopActions.length > 0) {
      this
        .newline()
        .newline()
        ._flopSummary(this._summary.flopSummary)
          .newline()
        ._playerActions(this._summary.flopActions)
    }

    if (this._summary.turnActions != null && this._summary.turnActions.length > 0) {
      this
        .newline()
        .newline()
        ._turnSummary(this._summary.turnSummary)
          .newline()
        ._playerActions(this._summary.turnActions)
    }

    if (this._summary.riverActions != null && this._summary.riverActions.length > 0) {
      this
        .newline()
        .newline()
        ._riverSummary(this._summary.riverSummary)
          .newline()
        ._playerActions(this._summary.riverActions)
    }

    this
      .newline()
      .newline()
      ._totalPot(this._summary.totalPot)
      ._spoilers(this._summary.spoilers, this._summary.preflopSummary)

    return this._text
  }

  _header(header) {
    const {
      room, gametype, currency = '$', donation = 10, rake = 1,
      pokertype, limit, sb, bb, ante, level = '', maxseats } = header

    const levelString = istourney(gametype)
      ? `Level ${level.toString().toUpperCase()} `
      : ''

    this._append(
      `${renderRoom(room)} ${renderPokerLimit(limit)} ${renderType(pokertype)}, ` +
      `${currency}${donation.toFixed(2)}+${currency}${rake.toFixed(2)} ${renderCurrencySuffix(currency)}, ` +
      `${renderGametype(gametype)}, ` +
      `${levelString}${sb}/${bb} Blinds ${renderAnte(ante)}` +
      `(${maxseats} handed)`
    )
    return this
  }

  _seats(seats, heroPos) {
    for (const s of seats) {
      const posString = s.pos === heroPos ? `Hero (${s.pos})` : s.pos

      this
        ._append(`${posString} (${this._renderAmount(s.chipsAmount, s.chipsBB)})`)
        .newline()
    }
    return this
  }

  _chipStackRatio(chipStackRatio) {
    const { label, amount } = chipStackRatio

    return this
      .color_(GREEN)
        .bold_()
          ._append(`Hero's ${label}`)
        ._bold()
        ._append(`: ${amount}`)
      ._color(GREEN)
  }

  _preflopSummary(preflopSummary) {
    // Preflop: Hero is UTG with 5, 9
    const { cards, pos } = preflopSummary
    this
      .bold_()
        ._append('Preflop:')
      ._bold()
      ._append(` Hero is ${pos}`)

    const { card1, card2 } = cards
    if (this._showHeroCards && card1 != null && card2 != null) {
      this._append(' with ').card(card1).card(card2)
    }
    return this
  }

  _playerActions(actions) {
    for (var i = 0; i < actions.length; i++) {
      const x = actions[i]
      const pos = x.pos
      const islast = i + 1 === actions.length
      const multifolds = x.type === 'folds'
      const hasChips = x.amountBB != null

      if (multifolds) {
        this._folds(x.number)
      } else if (hasChips) {
        this._append(`${pos} ${x.type}s ${this._renderAmount(x.amount, x.amountBB)}`)
      } else {
        this._append(`${pos} ${x.type}s`)
      }
      if (!islast) this._append(', ')
    }
  }

  _folds(n) {
    const folds = n > 1 ? `${n} folds` : `${n} fold`
    return this
      .color_(GRAY)
        .italic_()
          ._append(folds)
        ._italic()
      ._color(GRAY)
  }

  _flopSummary(summary) {
    const { pot, potBB, board, playersInvolved } = summary
    if (board == null || board.length < 3) return this
    const [ card1, card2, card3 ] = board

    return this
      .bold_()
        ._append('Flop:')
      ._bold()
      ._append(` (${this._renderAmount(pot, potBB)}) `)
      .card(card1)
      .card(card2)
      .card(card3)
      ._append(' ')
      ._playersInvolved(playersInvolved)
  }

  _turnSummary(summary) {
    const { pot, potBB, board, playersInvolved } = summary
    if (board == null) return this
    const card4 = board

    return this
      .bold_()
        ._append('Turn:')
      ._bold()
      ._append(` (${this._renderAmount(pot, potBB)}) `)
      .card(card4)
      ._append(' ')
      ._playersInvolved(playersInvolved)
  }

  _riverSummary(summary) {
    const { pot, potBB, board, playersInvolved } = summary
    if (board == null) return this
    const card5 = board

    return this
      .bold_()
        ._append('River:')
      ._bold()
      ._append(` (${this._renderAmount(pot, potBB)}) `)
      .card(card5)
      ._append(' ')
      ._playersInvolved(playersInvolved)
  }

  _totalPot(totalPot) {
    const renderedTotalPot = this._renderAmount(totalPot.amount, totalPot.bb)
    return this
      .bold_()
        ._append('Total pot:')
      ._bold()
      ._append(` ${renderedTotalPot}`)
  }

  _spoilers(spoilers, preflopSummary) {
    if (this._showHeroCards && (spoilers == null || spoilers.length === 0)) return this
    this
      .newline()
      .newline()
      .spoiler_()

    if (!this._showHeroCards && preflopSummary.cards != null) {
      const { cards, pos } = preflopSummary
      const { card1, card2 } = cards
      if (card1 != null && card2 != null) {
        this
          ._append(`Hero (${pos}) `)
          .card(card1)
          .card(card2)
        if (spoilers && spoilers.length) this._append(', ')
      }
    }

    if (spoilers != null) {
      for (var i = 0; i < spoilers.length; i++) {
        const x = spoilers[i]
        const islast = i + 1 === spoilers.length
        if (x.cards == null) continue

        const { card1, card2 } = x.cards
        if (card1 == null || card2 == null) continue

        this
          ._append(`${x.pos} `)
          .card(card1)
          .card(card2)
        if (!islast) this._append(', ')
      }
    }

    return this._spoiler()
  }

  _playersInvolved(players) {
    return this
      .color_(GRAY)
        ._append('(')
      ._color(GRAY)
      .color_(GREEN)
        ._append(`${players} players`)
      ._color(GREEN)
      .color_(GRAY)
        ._append(')')
      ._color(GRAY)
  }

  //
  // Helpers
  //
  _renderAmount(amount, amountBB = null) {
    const { currency = '$', bb } = this._summary.header
    if (this._amountAsBB) {
      const bigBlinds = amountBB != null ? amountBB : amount / bb
      return renderChipsAsBB(bigBlinds)
    } else {
      const { gametype } = this._summary.header
      const tourney = istourney(gametype)
      const fractionDigits = tourney ? 0 : 2
      return renderChips(amount, currency, fractionDigits)
    }
  }

  _append(s) {
    this._text += s
    return this
  }
}

module.exports = MlBase
