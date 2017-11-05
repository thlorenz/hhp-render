/* global FileReader */
'use strict'

const hhp = require('hhp')
const { extractHands } = hhp
const parse = hhp

const hha = require('hha')
const analyze = hha
const { script, summary } = hha

const renderHtml = require('../lib/html')

window.localStorage.debug = '*'
function createMainDiv() {
  // makes React happy
  document.body.innerHTML = ''
  const el = document.createElement('div')
  document.body.appendChild(el)
  return el
}

const mainDiv = createMainDiv()
const tableString = `
  <input id="hand-history-file" name="hand-history-file" type="file">
  <table id="hand-history-table" class="hand-history-table">
    <thead>
      <tr><td>Text</td><td>Rendered</td></tr>
    </thead>
    <tbody>
      <tr><td>Load Hand</td><td>To show stuff</td></tr>
    </tbody>
  </table>
`
mainDiv.innerHTML = tableString

const historyFileEl = document.getElementById('hand-history-file')
historyFileEl.addEventListener('change', onhistoryFile)

const historyTableEl = document.getElementById('hand-history-table')

function readFile(file, cb) {
  const fileReader = new FileReader()
  fileReader.readAsText(file, 'utf-8')
  fileReader.onload = function onload(err) {
    cb(err, fileReader.result)
  }
}

function onhistoryFile(e) {
  var file = e.target.files[0]
  if (!file) return
  readFile(file, onreadHandHistory)
}

function render(summary) {
  try {
    return renderHtml({ summary, showHeroCards: true, amountAsBB: true })
  } catch (e) {
    return `<p>ERROR: ${e.message}</p>`
  }
}

function onreadHandHistory(e) {
  const txt = e.target.result
  const hands = extractHands(txt)
  const parsedHands = hands.map(parse)
  const analyzedHands = parsedHands.map(analyze)
  const scriptedHands = analyzedHands.map(script)
  const summarizedHands = scriptedHands.map(summary)
  const renderedHands = summarizedHands.map(render)

  const results = []
  for (var i = 0; i < renderedHands.length; i++) {
    results.push({
        text: hands[i].join('\n')
      , parsed: parsedHands[i]
      , analyzed: analyzedHands[i]
      , scripted: scriptedHands[i]
      , rendered: renderedHands[i]
    })
  }
  updateUI(results)
}

function updateUI(results) {
  var existingRowCount = historyTableEl.rows.length
  // append to existing rows
  for (const res of results) {
    const rowCount = historyTableEl.rows.length
    const row = historyTableEl.insertRow(rowCount)
    const txtCell = row.insertCell(0)
    const renderedCell = row.insertCell(1)
    txtCell.innerHTML = res.text
    txtCell.classList.add('txt-cell')
    renderedCell.innerHTML = res.rendered
    renderedCell.classList.add('rendered-cell')
  }
  // remove previously existing rows
  for (var i = 1; i < existingRowCount; i++) {
    historyTableEl.deleteRow(i)
  }
}
