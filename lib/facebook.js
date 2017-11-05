'use strict'

const MlBase = require('./ml-base')

class Facebook extends MlBase {
  // no color support it seems
  color_(hex) {
    return this
  }

  _color() {
    return this
  }

  bold_() { return this._append('<b>') }
  _bold() { return this._append('</b>') }

  italic_() { return this._append('<i>') }
  _italic() { return this._append('</i>') }

  // no real way to hide things (no spoiler tag nor colors)
  spoiler_() { return this._append('Results below:').newline() }
  _spoiler() { return this }

  newline() {
    return this._append('\n')
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
 * to facebook format.
 *
 * @name renderFacebook
 * @param {Object} $0 the configuration of the renderer (same as `renderHtml`)
 * @returns {String} the rendered hand
 */
module.exports = function renderFacebook(opts) {
  return new Facebook(opts).render()
}
