'use strict'

const test = require('tape')
const spok = require('spok')
const fs = require('fs')
const path = require('path')
const fixtures = path.join(__dirname, 'fixtures')

/* eslint-disable no-unused-vars */
const ocat = require('./util/ocat')
/* eslint-ensable no-unused-vars */

const parse = require('hhp')
const render = require('../').renderPokerStars

test('\npokerstars: ignition triple-up', function(t) {
  const txt = fs.readFileSync(path.join(fixtures, 'sng-sidepot.txt'), 'utf8')
  const hand = parse(txt)
  const rendered = render(hand)
  spok(t, rendered.trim().split('\n'),
    [ 'PokerStars Hand #3549249421: Tournament #18094253, $10+$1 USD Hold\'em No Limit - Level 7 (100/200) - 2017/07/23 21:42:3 ET'
    , 'Table \'18094253 34\' 9-max Seat #9 is the button'
    , 'Seat 9: Ignition-240 (25825 in chips)'
    , 'Seat 1: IgnitionHero (10989 in chips)'
    , 'Seat 2: Ignition-229 (9950 in chips)'
    , 'Seat 3: Ignition-209 (12528 in chips)'
    , 'Seat 4: Ignition-284 (10000 in chips)'
    , 'Seat 5: Ignition-90 (9335 in chips)'
    , 'Seat 6: Ignition-199 (8969 in chips)'
    , 'Seat 7: Ignition-219 (9525 in chips)'
    , 'Seat 8: Ignition-40 (8100 in chips)'
    , 'IgnitionHero: posts small blind 100'
    , 'Ignition-229: posts big blind 200'
    , '*** HOLE CARDS ***'
    , 'Dealt to IgnitionHero [Qh 8c]'
    , 'Ignition-209: folds'
    , 'Ignition-284: raises 600 to 600'
    , 'Ignition-90: folds'
    , 'Ignition-199: calls 600'
    , 'Ignition-219: folds'
    , 'Ignition-40: folds'
    , 'Ignition-240: calls 600'
    , 'IgnitionHero: folds'
    , 'Ignition-229: raises 9750 to 9950 and is all-in'
    , 'Ignition-284: calls 9350'
    , 'Ignition-199: calls 8369 and is all-in'
    , 'Ignition-240: folds'
    , '*** FLOP *** [Qd Tc Jc]'
    , '*** TURN *** [Qd Tc Jc] [6d]'
    , '*** RIVER *** [Qd Tc Jc 6d] [6c]'
    , '*** SHOW DOWN ***'
    , 'Ignition-229: shows [Kc Ah] (straight)'
    , 'Ignition-284: shows [As Ac] (two pair)'
    , 'Ignition-199: shows [9h 9s] (two pair)'
    , 'Ignition-229 collected 1962 from pot'
    , 'Ignition-229 collected 27607 from pot'
    , 'Ignition-199 finished the tournament in 245th place'
    , '*** SUMMARY ***'
    , 'Total pot 29569 | Rake 0'
    , 'Board [Qd Tc Jc 6d 6c]'
    , 'Seat 9: Ignition-240 (button) mucked [Jd Ts]'
    , 'Seat 1: IgnitionHero (small blind) folded on the Flop'
    , 'Seat 2: Ignition-229 (big blind) showed [Kc Ah] and won (29569) with Straight'
    , 'Seat 3: Ignition-209 mucked [8d Jh]'
    , 'Seat 4: Ignition-284 showed [As Ac] and lost with Two pair'
    , 'Seat 5: Ignition-90 mucked [7s Td]'
    , 'Seat 6: Ignition-199 showed [9h 9s] and lost with Two pair'
    , 'Seat 7: Ignition-219 mucked [5h Qc]'
    , 'Seat 8: Ignition-40 mucked [2c 3s]' ])
  t.end()
})
