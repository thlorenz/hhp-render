'use strict'

const test = require('tape')
const spok = require('spok')
const path = require('path')
const render = require('../lib/html')
const getSummary = require('./util/get-summary')

/* eslint-disable no-unused-vars */
const ocat = require('./util/ocat')
const dumpHtml = require('./util/dump-html')
/* eslint-enable no-unused-vars */

const fixtures = path.join(__dirname, 'fixtures')

test('\nhtml: fixes comma error', function(t) {
  const file = 'all-in-comma-error.txt'
  const summary = getSummary(path.join(fixtures, file))
  const rendered = render({ summary })

  const res = rendered.split('<br>')
  spok(t, res,
    [ 'PokerStars No-Limit Hold\'em, $3.19+$0.31 USD, Tournament, Level I 10/20 Blinds 3 Ante (9 handed)'
    , ''
    , 'SB ($1,844)'
    , 'BB ($1,488)'
    , 'UTG ($2,312)'
    , 'UTG+1 ($1,468)'
    , 'UTG+2 ($1,448)'
    , 'LJ ($1,575)'
    , 'Hero (HJ) ($1,084)'
    , 'CO ($1,428)'
    , 'BU ($853)'
    , ''
    , '<font color="#19a974"><b>Hero\'s M</b>: 19</font>'
    , ''
    , '<b>Preflop:</b> Hero is HJ with <font color="#357edd">2♦</font><font color="#ff4136">9♥</font>'
    , 'UTG calls $20, UTG+1 calls $20, UTG+2 raises $137, <font color="#555555"><i>2 folds</i></font>, CO raises $1,425, BU calls $850, <font color="#555555"><i>4 folds</i></font>, UTG+2 calls $1,288'
    , ''
    , '<b>Total pot:</b> $3,797'
    , ''
    , '<details><summary>Results below</summary>UTG+2 <font color="#555555">A♠</font><font color="#ff4136">Q♥</font>, CO <font color="#357edd">T♦</font><font color="#19a974">T♣</font>, BU <font color="#ff4136">A♥</font><font color="#357edd">A♦</font></details>' ])
  t.end()
})
