'use strict'

const fs = require('fs')
const path = require('path')

function padRight(val, num, str = ' ') {
  const diff = num - val.length
  return val + str.repeat(diff)
}

const fileNameMap = new Map([
    [ 'full-contact-poker', 'full-contact' ]
  , [ 'intellipoker-discussion-forum', 'intellipoker' ]
])

const allTextFileLines = fs
  .readdirSync(__dirname)
  .filter(x => path.extname(x) === '.txt')
  .sort()
  .map(x => path.join(__dirname, x))
  .reduce((map, x) => {
    let name = path.basename(x).slice(0, -4)
    if (fileNameMap.has(name)) name = fileNameMap.get(name)
    const src = fs.readFileSync(x, 'utf8')
    const lines = src.split('\n')
    map.set(name, lines)
    return map
  }, new Map())

const interestingLines = new Map([
    [ 'MP2', 4 ]
  , [ 'Hero MP3', 5 ]
  , [ 'Hero\'s M', 13 ]
  , [ 'Preflop Hero', 15 ]
  , [ 'Preflop', 16 ]
  , [ 'Flop', 18 ]
  , [ 'Turn', 20 ]
  , [ 'River', 22 ]
  , [ 'Total pot', 24 ]
  , [ 'Results', 26 ]
  , [ 'Results SB', 27 ]
  , [ 'Results BB', 28 ]
  , [ 'Outcome', 29 ]
])

const LEN = 15

for (const [ header, idx ] of interestingLines) {
  console.log(`\n## ${header}\n`)
  console.log('```txt')
  for (const [ name, lines ] of allTextFileLines) {
    console.log(`${padRight(name, LEN)}: ${lines[idx - 1]}`)
  }
  console.log('```')
}
