'use strict'

const test = require('tape')
const spok = require('spok')
const path = require('path')
const render = require('../lib/facebook')
const getSummary = require('./util/get-summary')

/* eslint-disable no-unused-vars */
const ocat = require('./util/ocat')
const dumpHtml = require('./util/dump-html')
/* eslint-enable no-unused-vars */

const fixtures = path.join(__dirname, 'fixtures')
const psActiononallCalm = path.join(fixtures, 'ps-actiononall.calm.txt')

test('\npocket fives: ps action on all calm - default options', function(t) {
  const summary = getSummary(psActiononallCalm)
  const rendered = render({ summary })

  const res = rendered.split('\n')
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
    , '<b>Hero\'s M</b>: 26'
    , ''
    , '<b>Preflop:</b> Hero is UTG with 5♥9♣'
    , '<i>2 folds</i>, UTG+2 calls $20, <i>1 fold</i>, HJ calls $20, <i>2 folds</i>, SB calls $10, BB checks'
    , ''
    , '<b>Flop:</b> ($107) 3♠7♦A♥ (4 players)'
    , 'SB checks, BB checks, UTG+2 bets $40, HJ calls $40, SB calls $40, BB calls $40'
    , ''
    , '<b>Turn:</b> ($267) 3♦ (4 players)'
    , 'SB checks, BB checks, UTG+2 checks, HJ checks'
    , ''
    , '<b>River:</b> ($267) 7♠ (4 players)'
    , 'SB checks, BB bets $180, <i>3 folds</i>'
    , ''
    , '<b>Total pot:</b> $267' ])

  t.end()
})
