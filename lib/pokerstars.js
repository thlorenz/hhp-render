const ordinal = require('ordinal')

function currencySuffix(currency) {
  return currency === '$' ? 'USD' : 'EUR'
}

function type(pokertype) {
  return pokertype === 'holdem' ? `Hold'em` : 'Unknown'
}

function pokerLimit(limit) {
  return limit === 'nolimit' ? 'No Limit' : 'Limit'
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

function action(x) {
  const s = (
      x.type === 'fold'     ? 'folds'
    : x.type === 'check'    ? 'checks'
    : x.type === 'call'     ? `calls ${x.amount}`
    : x.type === 'bet'      ? `bets ${x.amount}`
    : x.type === 'raise'    ? `raises ${x.amount} to ${x.raiseTo}`
    : x.type === 'collect'  ? `${x.player} collected ${x.amount} from ${collectPot(x)}`
    : 'unknown'
  )

  if (!x.allin) return s
  return s + ' and is all-in'
}

function renderStreet(street) {
  if (street.length === 0) return ''
  return '\n' + street
    .map(x => `${x.player}: ${action(x)}`)
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

function renderShowdown(down, seatsByPlayer, currency) {
  return down
    .map(x => {
      if (x.type === 'show') return `${x.player}: shows ${cards(x)}${description(x)}`
      if (x.type === 'muck') return `${x.player}: mucks hand`
      if (x.type === 'collect') return `${x.player} collected ${x.amount} from ${collectPot(x)}`
      if (x.type === 'finish') return `${x.player} finished the tournament${place(x)}${received(x, currency)}`
      return `Unknown showdown: ${x.type}`
    })
    .join('\n') + '\n'
}

function pot(x, chips) {
  if (x.single) return `Total pot ${chips(x.amount)} | Rake ${chips(x.rake)}`

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

function renderSummary(summary, board, chips) {
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
        return `Seat ${x.seatno}: ${x.player} ${position(x)}` +
               `${folded(x)}`
      }
      if (x.type === 'collected') {
        return `Seat ${x.seatno}: ${x.player} ${position(x)}` +
               `collected ${chips(x.amount)}`
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

function renderPokerStars(hand) {
  const {
    handid, gametype, gameno, currency, donation, rake, pokertype, limit, sb, bb, ante, level,
    year, month, day, hour, min, sec, timezone } = hand.info

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

  // TODO: pull out reveals and ignore them during street render
  const preflop = hand.preflop.length > 0 ? renderStreet(hand.preflop) : ''
  const flop = hand.board.card1 != null
    ? `\n*** FLOP *** ${flopHead(hand.board)}` + renderStreet(hand.flop)
    : ''
  const turn = hand.board.card4 != null
    ? `\n*** TURN *** ${turnHead(hand.board)}` + renderStreet(hand.turn)
    : ''
  const river = hand.board.card5 != null
    ? `\n*** RIVER *** ${riverHead(hand.board)}` + renderStreet(hand.river)
    : ''

  const showdown = hand.showdown.length > 0
    ? `\n*** SHOW DOWN ***\n` + renderShowdown(hand.showdown, seatsByPlayer, currency)
    : ''

  const summary = hand.summary.length > 0
    ? `*** SUMMARY ***\n` + renderSummary(hand.summary, hand.board, chipsFn(istourney, currency))
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