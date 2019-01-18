const { join } = require('path');

module.exports = {
    mode: "production",
    entry: join(__dirname, "src", "g2.browser.js"),
    output: {
        path: join(__dirname, 'src'),
        filename: "g2.js",
    }
}
