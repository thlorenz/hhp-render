'use strict'

const MlBase = require('./ml-base')

class ForumBase extends MlBase {
  color_(hex) {
    return this._append(`[color=${hex}]`)
  }

  _color() {
    return this._append('[/color]')
  }

  bold_() { return this._append('[b]') }
  _bold() { return this._append('[/b]') }

  italic_() { return this._append('[i]') }
  _italic() { return this._append('[/i]') }

  spoiler_() { return this._append('Results below: [spoiler]') }
  _spoiler() { return this._append('[/spoiler]') }

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

module.exports = ForumBase
