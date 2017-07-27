var ocat = require('ocat')
ocat.opts = {
  prefix: '  spok(t, txt.trim().split(\'\\n\'),\n',
  suffix: ')',
  indent: '   ',
  depth: 5
}

module.exports = ocat
