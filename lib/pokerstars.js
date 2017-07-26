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

function action(x) {
  const s = (
      x.type === 'fold'     ? 'folds'
    : x.type === 'check'    ? 'checks'
    : x.type === 'call'     ? `calls ${x.amount}`
    : x.type === 'bet'      ? `bets ${x.amount}`
    : x.type === 'raise'    ? `raises ${x.amount} to ${x.raiseTo}`
    : x.type === 'collect'  ? `collects ${x.amount}`
    // TODO: verify collect and add show/muck
    : 'unknown'
  )

  if (!x.allin) return s
  return s + ' and is all-in'
}

function renderStreet(street) {
 return street
    .map(x => `${x.player}: ${action(x)}`)
    .join('\n') + '\n'
}

function flopHead(board) {
  return `[${board.card1} ${board.card2} ${board.card3}]`
}

function turnHead(board) {
  return `[${board.card1} ${board.card2} ${board.card3} ${board.card4}]`
}

function riverHead(board) {
  return `[${board.card1} ${board.card2} ${board.card3} ${board.card4} ${board.card5}]`
}

function description(x) {
  if (x.desc == null || x.desc.length === 0) return ''
  return ' (' + x.desc + ')'
}

function renderShowdown(down, seatsByPlayer) {
  return down
    .map(x => {
      if (x.type === 'show') return `${x.player}: shows ${cards(x)}${description(x)}`
      if (x.type === 'muck') return `Seat ${seatsByPlayer[x.player]}: ${x.player} mucked ${cards(x)}`
      if (x.type === 'collect') return `${x.player} collected ${x.amount} from pot`
    })
    .join('\n') + '\n'
}

function render(hand) {
  const {
    handid, gametype, gameno, currency, donation, rake, pokertype, limit, sb, bb, ante, level,
    year, month, day, hour, min, sec, timezone } = hand.info

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
    ?  '*** HOLE CARDS ***\n' + `Dealt to ${hand.hero} ${cards(hand.holecards)}\n`
    : ''

  // TODO: pull out reveals and ignore them during street render
  const preflop = hand.preflop.length > 0 ? renderStreet(hand.preflop) : ''
  const flop = hand.flop.length > 0
    ? `*** FLOP *** ${flopHead(hand.board)}\n` + renderStreet(hand.flop)
    : ''
  const turn = hand.turn.length > 0
    ? `*** TURN *** ${turnHead(hand.board)}\n` + renderStreet(hand.turn)
    : ''
  const river = hand.river.length > 0
    ? `*** RIVER *** ${riverHead(hand.board)}\n` + renderStreet(hand.river)
    : ''

  const showdown = hand.showdown.length > 0
    ? `*** SHOW DOWN ***\n` + renderShowdown(hand.showdown, seatsByPlayer)
    : ''

  return (
    head +
    seats +
    posts +
    holecards +
    preflop +
    flop +
    turn +
    river +
    showdown
  )
}

const fs = require('fs')
const path = require('path')
const fixtures = path.join(__dirname, '..', '..', 'hhp', 'test', 'fixtures')
const holdemps = path.join(fixtures, 'holdem', 'pokerstars')
const txt = fs.readFileSync(path.join(holdemps, 'actiononall.txt'), 'utf8')
const parse = require('../../hhp')
const hand = parse(txt)
console.log(render(hand))
