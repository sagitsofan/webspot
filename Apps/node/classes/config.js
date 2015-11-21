var Config = (function () {
    var fs = require('fs');
    
    var obj = JSON.parse(fs.readFileSync('C:/Users/USER/Desktop/Sgol/Project/webspot/webspot/apps/node/config/node.json', 'utf8').replace(/^\uFEFF/, ''));
    
    function _appSettings() {
        
        return obj;
    }
    
    return {
        appSettings: _appSettings
    };
})();

module.exports = Config;