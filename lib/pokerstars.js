const ordinal = require('ordinal')

function currencySuffix(currency) {
  return currency === '$' ? 'USD' : 'EUR'
}

function type(pokertype) {
  return pokertype === 'holdem' ? `Hold'em` : 'Unknown'
}

function pokerLimit(limit) {
  return limit === 'limit' ? 'Limit' : 'No Limit'
}

function twoDigit(x) {
  const s = x.toString()
  if (s.length === 2) return s
  return '0' + s
}

function postType(x) {
  return (
      x === 'ante'  ? 'the ante'
    : x === 'sb'    ? 'small blind'
    : x === 'bb'    ? 'big blind'
    : 'unknown'
  )
}

function cards(x) {
  return `[${x.card1} ${x.card2}]`
}

function collectPot(x) {
  return x.pot == null ? 'pot' : `${x.pot} pot`
}

function action(x, chips) {
  const s = (
      x.type === 'fold'     ? 'folds'
    : x.type === 'check'    ? 'checks'
    : x.type === 'call'     ? `calls ${chips(x.amount)}`
    : x.type === 'bet'      ? `bets ${chips(x.amount)}`
    : x.type === 'raise'    ? `raises ${chips(x.amount)} to ${chips(x.raiseTo)}`
    : 'unknown'
  )

  if (!x.allin) return s
  return s + ' and is all-in'
}

function renderStreet(street, chips) {
  if (street.length === 0) return ''
  return '\n' + street
    .map(x => {
      if (x.type === 'bet-returned') {
        return `Uncalled bet (${chips(x.amount)}) returned to ${x.player}`
      }
      if (x.type === 'collect') {
        // no ':' after name
        return `${x.player} collected ${chips(x.amount)} from ${collectPot(x)}`
      }
      return `${x.player}: ${action(x, chips)}`
    })
    .join('\n')
}

function flopHead(board) {
  return `[${board.card1} ${board.card2} ${board.card3}]`
}

function turnHead(board) {
  return `${flopHead(board)} [${board.card4}]`
}

function riverHead(board) {
  return `[${board.card1} ${board.card2} ${board.card3} ${board.card4}] [${board.card5}]`
}

function variableBoard(board) {
  if (board.card1 == null) return '[]'
  if (board.card4 == null) return `[${board.card1} ${board.card2} ${board.card3}]`
  if (board.card5 == null) return `[${board.card1} ${board.card2} ${board.card3} ${board.card4}]`
  return `[${board.card1} ${board.card2} ${board.card3} ${board.card4} ${board.card5}]`
}

function description(x) {
  if (x.desc == null || x.desc.length === 0) return ''
  return ' (' + x.desc + ')'
}

function place(x) {
  if (x.place == null) return ''
  return ` in ${ordinal(x.place)} place`
}

function received(x, currency) {
  if (x.amount == null) return ''
  return ` and received ${currency}${x.amount}.`
}

function notnull(x) {
  return x != null
}

function renderShowdown(down, seatsByPlayer, currency, chips) {
  const lines = down
    .map(x => {
      if (x.type === 'show') return `${x.player}: shows ${cards(x)}${description(x)}`
      if (x.type === 'muck') return `${x.player}: mucks hand`
      if (x.type === 'collect') return `${x.player} collected ${x.amount} from ${collectPot(x)}`
      if (x.type === 'finish') return `${x.player} finished the tournament${place(x)}${received(x, currency)}`
      if (x.type === 'bet-returned') {
        return `uncalled bet (${chips(x.amount)}) returned to ${x.player}`
      }
      if (x.type === 'reveal') return null
      return `Unknown showdown: ${x.type}`
    })
    .filter(notnull)
  return lines.length === 0 ? '' : lines.join('\n') + '\n'
}

function pot(x, chips) {
  if (x.single) return `Total pot ${chips(x.amount)} | Rake ${chips(x.rake) || 0}`

  // Total pot 22104 Main pot 14502. Side pot 7602. | Rake 0
  return `Total pot ${chips(x.amount)} ` +
         `Main pot ${chips(x.main)}. Side pot ${chips(x.side)}. | Rake ${chips(x.rake)}`
}

function position(x) {
  if (x.position === 'bu') return '(button) '
  if (x.position === 'sb') return '(small blind) '
  if (x.position === 'bb') return '(big blind) '
  return ''
}

function wonOrLost(x, chips) {
  if (x.won) return `won (${chips(x.amount)}) with ${x.description}`
  return `lost with ${x.description}`
}

function folded(x) {
  const when = (
      x.street === 'preflop'  ? 'before Flop'
    : x.street === 'flop'     ? 'on the Flop'
    : x.street === 'turn'     ? 'on the Turn'
    : x.street === 'river'    ? 'on the River'
    : 'unknown'
  )

  const s = `folded ${when}`
  return x.bet ? s : `${s} (didn't bet)`
}

function renderSummary(summary, board, chips, muckMap) {
  var arr = summary
    .map(x => {
      if (x.type === 'pot') return pot(x, chips)
      if (x.type === 'muck') {
        return `Seat ${x.seatno}: ${x.player} ${position(x)}` +
               `mucked ${cards(x)}`
      }
      if (x.type === 'showed') {
        return `Seat ${x.seatno}: ${x.player} ${position(x)}` +
               `showed ${cards(x)} and ${wonOrLost(x, chips)}`
      }
      if (x.type === 'folded') {
        // Convert folds into mucks when we chose to include
        // revealed cards (by Ignition) that way.
        // This seems the best option since PS has no concept of
        // revealing a card.
        const xx = muckMap[x.player]
        return xx == null
        ? (`Seat ${x.seatno}: ${x.player} ${position(x)}` +
            `${folded(x)}`)
        : `Seat ${x.seatno}: ${x.player} ${position(x)}` +
               `mucked ${cards(xx)}`
      }
      if (x.type === 'collected') {
        return `Seat ${x.seatno}: ${x.player} ${position(x)}` +
               `collected (${chips(x.amount)})`
      }
    })

  if (board != null) arr.splice(1, 0, `Board ${variableBoard(board)}`)

  return arr.join('\n') + '\n'
}

function chipsFn(istourney, currency) {
  return function chips(x) {
    return istourney ? x : currency + x
  }
}

/**
 * Renders an hhp parsed hand in PokerStars format.
 *
 * @name renderPokerStars
 * @function
 * @param {Object} hand the parsed hand
 * @param {Object} $0 options
 * @param {Object} [$0.muckRevealed=true] if `true` includes cards revealed via Ignition as mucks
 * @return {string} hand rendered to be importable as PokerStars hand
 */
function renderPokerStars(hand, { muckRevealed = true } = {}) {
  const {
    handid, gametype, gameno, currency = '$', donation = 10, rake = 1,
    pokertype, limit, sb, bb, level,
    year, month, day, hour, min, sec, timezone = 'ET' } = hand.info

  const { tableno, maxseats, button } = hand.table

  const seatsByPlayer = hand.seats.reduce((acc, x) => { acc[x.player] = x.seatno; return acc }, {})

  const istourney = gametype === 'tournament'

  function chips(x) {
    return istourney ? x : currency + x
  }

  const head = istourney
    ? (`PokerStars Hand #${handid}: Tournament #${gameno}, ` +
       `${currency}${donation}+${currency}${rake} ${currencySuffix(currency)} ` +
       `${type(pokertype)} ${pokerLimit(limit)} - ` +
       `Level ${level.toString().toUpperCase()} (${sb}/${bb}) - ` +
       `${year}/${twoDigit(month)}/${twoDigit(day)} ` +
       `${hour}:${min}:${sec} ${timezone}`) + '\n'
    : 'TODO'

  const table = istourney
    ? `Table '${gameno} ${tableno}' ${maxseats}-max Seat #${button} is the button\n`
    : 'TODO'

  const seats = hand.seats.length > 0
    ? hand.seats
        .map(x => `Seat ${x.seatno}: ${x.player} (${chips(x.chips)} in chips)`)
        .join('\n') + '\n'
    : ''

  const posts = hand.posts.length > 0
    ? hand.posts
        .map(x => `${x.player}: posts ${postType(x.type)} ${chips(x.amount)}`)
        .join('\n') + '\n'
    : ''

  const holecards = hand.holecards != null
    ?  '*** HOLE CARDS ***\n' + `Dealt to ${hand.hero} ${cards(hand.holecards)}`
    : ''

  const preflop = hand.preflop.length > 0 ? renderStreet(hand.preflop, chips) : ''
  const flop = hand.board != null && hand.board.card1 != null
    ? `\n*** FLOP *** ${flopHead(hand.board)}` + renderStreet(hand.flop, chips)
    : ''
  const turn = hand.board != null && hand.board.card4 != null
    ? `\n*** TURN *** ${turnHead(hand.board)}` + renderStreet(hand.turn, chips)
    : ''
  const river = hand.board != null && hand.board.card5 != null
    ? `\n*** RIVER *** ${riverHead(hand.board)}` + renderStreet(hand.river, chips)
    : ''

  const showdown = hand.showdown.length > 0
    ? `\n*** SHOW DOWN ***\n` + renderShowdown(hand.showdown, seatsByPlayer, currency, chips)
    : ''

  const muckMap = {}
  if (muckRevealed) {
    hand.showdown.forEach(x => {
      if (x.type === 'reveal') muckMap[x.player] = x
    })
  }
  const summary = hand.summary.length > 0
    ? `*** SUMMARY ***\n` + renderSummary(hand.summary, hand.board, chipsFn(istourney, currency), muckMap)
    : ''

  return (
    head +
    table +
    seats +
    posts +
    holecards +
    preflop +
    flop +
    turn +
    river +
    showdown +
    summary
  )
}

module.exports = renderPokerStars
