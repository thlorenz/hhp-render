'use strict'

const MlBase = require('./ml-base')

class Html extends MlBase {
  color_(hex) {
    return this._append(`<font color="${hex}">`)
  }

  _color() {
    return this._append('</font>')
  }

  bold_() { return this._append('<b>') }

  _bold() { return this._append('</b>') }

  italic_() { return this._append('<i>') }

  _italic() { return this._append('</i>') }

  spoiler_() { return this._append('<details><summary>Results below</summary>') }
  _spoiler() { return this._append('</details>') }

  newline() {
    return this._append('<br>')
  }

  card(c) {
    const [ r, s ] = c
    const suit = this.suits[s]
    return this
      .color_(suit.color)
        ._append(`${r}${suit.symbol}`)
      ._color(suit.color)
  }
}

/**
 * Renders an hhp parsed + hha anazlyzed + scripted and then summarized hand
 * to HTML format.
 *
 * @name renderHtml
 * @param {Object} $0 the configuration of the renderer
 * @param {String} [$0.text=''] text to start with
 * @param {Object} $0.summary the parsed then analyzed, scripted and summarized
 * @param {Boolean} [$0.amountAsBB=false] show all amounts in big blind dominatians
 * @param {Boolean} [$0.showHeroCards=true] show hero cards as part of hands (i.e. don't hide in spoilers)
 * @returns {String} the rendered hand
 */
module.exports = function renderHtml(opts) {
  return new Html(opts).render()
}
