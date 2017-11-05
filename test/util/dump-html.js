'use strict'

const path = require('path')
const fs = require('fs')

module.exports = function dumpHtml(rendered, pre = true) {
  const style = pre ? '<style>body{white-space: pre;}</style>' : ''
  const s = `
<body>
${rendered}
</body>
${style}
`
  fs.writeFileSync(path.join(__dirname, '..', '..', 'tmp', 'result.html'), s, 'utf8')
}
