'use strict'

const fs = require('fs')
const parse = require('hhp')
const analyze = require('hha')
const { script, summary } = require('hha')

module.exports = function getSummary(file) {
  const txt = fs.readFileSync(file, 'utf8')
  const parsed = parse(txt)
  const analyzed = analyze(parsed)
  const scripted = script(analyzed)
  return summary(scripted)
}
