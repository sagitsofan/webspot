var ComponentsContextMenu = function () {

    var createContextMenu = function() {
        $('.treeItem').contextmenu({
            target: '#context-menu',
            before: function (e) {
                // This function is optional.
                // Here we use it to stop the event if the user clicks a span
                
                //console.log("context menu open with id =",e.target.id);
                var scope = angular.element(
                    document.
                  getElementById("appCodeController")).
                  scope();
                
                scope.contextMenuItemId = e.target.id;
                
                
                scope.treeRightClick();

                //e.preventDefault();
                //if (e.target.tagName == 'SPAN') {
                //    e.preventDefault();
                //    this.closemenu();
                //    return false;
                //}

                //this.getMenu().find("li").eq(2).find('a').attr("ng-click","fire()");

                return true;
            }
        });
    }


    return {
        //main function to initiate the module
        
        init: function () {
            setTimeout(function () {
                createContextMenu();
            }, 500);
            
        }

    };

}();
