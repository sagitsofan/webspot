var dal         = require('../../panel/classes/dal.js');
var baseDal     = require('../../panel/classes/baseDal.js');
var _           = require('underscore');
var cheerio     = require('cheerio');
var async       = require('async/lib/async.js');

var helper = (function () {
    
    function _getSpecialFilesArray() {

        var arr = ['png', 'jpg', 'gif', 'jpeg'];
        return arr;
    }
    
    function _isItemInArray(arr, name) {
        
        var index = arr.indexOf(name);
        return (index > -1);
    }
    
    function _getSubdomain(domain) {
        
        var subDomain = domain.split('.');
        
        if (subDomain.length > 2) {
            return subDomain[0].split("-").join(" ");
        }

        return "";
    }

    return {
        getSpecialFilesArray: _getSpecialFilesArray,
        isItemInArray: _isItemInArray,
        getSubdomain: _getSubdomain
    };
})();

module.exports = helper;