const fs = require('fs');
const path = require('path');

exports.default = async function afterPack(context) {
    const sandboxPath = path.join(context.appOutDir, 'chrome-sandbox');
    if (fs.existsSync(sandboxPath)) {
        fs.unlinkSync(sandboxPath);
    }
};
