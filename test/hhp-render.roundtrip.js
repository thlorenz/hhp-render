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

const files = [
  'actiononall.txt'
, 'allin-preflop.txt'
]

test('\npokerstars roundtrip', function(t) {
  function roundtrip(file) {
    t.comment(file)
    const txt = fs.readFileSync(path.join(fixtures, file), 'utf8')
    const hand = parse(txt)
    const rendered = render(hand)
    spok(t, rendered.trim().split('\n'), txt.trim().split('\n'))
  }
  files.forEach(roundtrip)
  t.end()
})
