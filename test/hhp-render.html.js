'use strict'

const test = require('tape')
const spok = require('spok')
const path = require('path')
const render = require('../lib/html')
const getSummary = require('./util/get-summary')

/* eslint-disable no-unused-vars */
const ocat = require('./util/ocat')
const dumpHtml = require('./util/dump-html')
const save = require('./util/save')
/* eslint-enable no-unused-vars */

const fixtures = path.join(__dirname, 'fixtures')
const psActiononallCalm = path.join(fixtures, 'ps-actiononall.calm.txt')

test('\nhtml: ps action on all calm - default options', function(t) {
  const summary = getSummary(psActiononallCalm)
  // save('summary-action-on-all-calm.json', summary)
  const rendered = render({ summary })

  const res = rendered.split('<br>')

  spok(t, res,
    [ 'PokerStars No-Limit Hold\'em, $4.10+$0.40 USD, Tournament, Level I 10/20 Blinds 3 Ante (9 handed)'
    , ''
    , 'SB ($1,434)'
    , 'BB ($1,494)'
    , 'Hero (UTG) ($1,494)'
    , 'UTG+1 ($1,494)'
    , 'UTG+2 ($1,494)'
    , 'LJ ($1,494)'
    , 'HJ ($1,658)'
    , 'CO ($1,484)'
    , 'BU ($1,454)'
    , ''
    , '<font color="#19a974"><b>Hero\'s M</b>: 26</font>'
    , ''
    , '<b>Preflop:</b> Hero is UTG with <font color="#ff4136">5♥</font><font color="#19a974">9♣</font>'
    , '<font color="#555555"><i>2 folds</i></font>, UTG+2 calls $20, <font color="#555555"><i>1 fold</i></font>, HJ calls $20, <font color="#555555"><i>2 folds</i></font>, SB calls $10, BB checks'
    , ''
    , '<b>Flop:</b> ($107) <font color="#555555">3♠</font><font color="#357edd">7♦</font><font color="#ff4136">A♥</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB checks, UTG+2 bets $40, HJ calls $40, SB calls $40, BB calls $40'
    , ''
    , '<b>Turn:</b> ($267) <font color="#357edd">3♦</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB checks, UTG+2 checks, HJ checks'
    , ''
    , '<b>River:</b> ($267) <font color="#555555">7♠</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB bets $180, <font color="#555555"><i>3 folds</i></font>'
    , ''
    , '<b>Total pot:</b> $267' ])

  t.end()
})

test('\nhtml: ps action on all calm - amount as bb', function(t) {
  const summary = getSummary(psActiononallCalm)
  const rendered = render({ summary, amountAsBB: true })

  const res = rendered.split('<br>')

  spok(t, res,
    [ 'PokerStars No-Limit Hold\'em, $4.10+$0.40 USD, Tournament, Level I 10/20 Blinds 3 Ante (9 handed)'
    , ''
    , 'SB (71.7BB)'
    , 'BB (74.7BB)'
    , 'Hero (UTG) (74.7BB)'
    , 'UTG+1 (74.7BB)'
    , 'UTG+2 (74.7BB)'
    , 'LJ (74.7BB)'
    , 'HJ (82.9BB)'
    , 'CO (74.2BB)'
    , 'BU (72.7BB)'
    , ''
    , '<font color="#19a974"><b>Hero\'s M</b>: 26</font>'
    , ''
    , '<b>Preflop:</b> Hero is UTG with <font color="#ff4136">5♥</font><font color="#19a974">9♣</font>'
    , '<font color="#555555"><i>2 folds</i></font>, UTG+2 calls 1.0BB, <font color="#555555"><i>1 fold</i></font>, HJ calls 1.0BB, <font color="#555555"><i>2 folds</i></font>, SB calls 0.5BB, BB checks'
    , ''
    , '<b>Flop:</b> (5.4BB) <font color="#555555">3♠</font><font color="#357edd">7♦</font><font color="#ff4136">A♥</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB checks, UTG+2 bets 2.0BB, HJ calls 2.0BB, SB calls 2.0BB, BB calls 2.0BB'
    , ''
    , '<b>Turn:</b> (13.4BB) <font color="#357edd">3♦</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB checks, UTG+2 checks, HJ checks'
    , ''
    , '<b>River:</b> (13.4BB) <font color="#555555">7♠</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB bets 9.0BB, <font color="#555555"><i>3 folds</i></font>'
    , ''
    , '<b>Total pot:</b> 13.4BB' ])

  t.end()
})

test('\nhtml: ps action on all calm - amount as bb, do not show hero cards', function(t) {
  const summary = getSummary(psActiononallCalm)
  const rendered = render({ summary, amountAsBB: true, showHeroCards: false })

  const res = rendered.split('<br>')

  spok(t, res,
    [ 'PokerStars No-Limit Hold\'em, $4.10+$0.40 USD, Tournament, Level I 10/20 Blinds 3 Ante (9 handed)'
    , ''
    , 'SB (71.7BB)'
    , 'BB (74.7BB)'
    , 'Hero (UTG) (74.7BB)'
    , 'UTG+1 (74.7BB)'
    , 'UTG+2 (74.7BB)'
    , 'LJ (74.7BB)'
    , 'HJ (82.9BB)'
    , 'CO (74.2BB)'
    , 'BU (72.7BB)'
    , ''
    , '<font color="#19a974"><b>Hero\'s M</b>: 26</font>'
    , ''
    , '<b>Preflop:</b> Hero is UTG'
    , '<font color="#555555"><i>2 folds</i></font>, UTG+2 calls 1.0BB, <font color="#555555"><i>1 fold</i></font>, HJ calls 1.0BB, <font color="#555555"><i>2 folds</i></font>, SB calls 0.5BB, BB checks'
    , ''
    , '<b>Flop:</b> (5.4BB) <font color="#555555">3♠</font><font color="#357edd">7♦</font><font color="#ff4136">A♥</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB checks, UTG+2 bets 2.0BB, HJ calls 2.0BB, SB calls 2.0BB, BB calls 2.0BB'
    , ''
    , '<b>Turn:</b> (13.4BB) <font color="#357edd">3♦</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB checks, UTG+2 checks, HJ checks'
    , ''
    , '<b>River:</b> (13.4BB) <font color="#555555">7♠</font> <font color="#555555">(</font><font color="#19a974">4 players</font><font color="#555555">)</font>'
    , 'SB checks, BB bets 9.0BB, <font color="#555555"><i>3 folds</i></font>'
    , ''
    , '<b>Total pot:</b> 13.4BB' ])

  t.end()
})
