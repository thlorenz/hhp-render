'use strict'

const ForumBase = require('./forum-base')

class Forum2Plus2 extends ForumBase {}

class PocketFives extends ForumBase {

  spoiler_() {
    return this
      ._append('Results below: ')
      .color_('#ffffff')
  }
  _spoiler() { return this._color() }
}

/**
 * Renders an hhp parsed + hha anazlyzed + scripted and then summarized hand
 * to 2+2 forum format.
 *
 * @name forums.renderTwoPlusTwo
 * @param {Object} $0 the configuration of the renderer (same as `renderHtml`)
 * @returns {String} the rendered hand
 */
function renderTwoPlusTwo(opts) {
  return new Forum2Plus2(opts).render()
}

/**
 * Renders an hhp parsed + hha anazlyzed + scripted and then summarized hand
 * to pocket fives forum format
 * PokerXFactor, CardRunners, IntelliPoker formats are identical.
 *
 * @name forums.renderPocketFives
 * @param {Object} $0 the configuration of the renderer (same as `renderHtml`)
 * @returns {String} the rendered hand
 */
function renderPocketFives(opts) {
  return new PocketFives(opts).render()
}

module.exports = {
    renderTwoPlusTwo
  , renderPocketFives
}
