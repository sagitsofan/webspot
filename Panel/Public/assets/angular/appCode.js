var arrBlockEditor = ["png", "jpg", "jpeg"];
var ctrlCode = angular.module("ctrlCode", ['treeControl', 'mc.resizer', 'ngNotify', 'ui.bootstrap.modal', 'ui.bootstrap', 'flow']);

ctrlCode.config(['flowFactoryProvider', function (flowFactoryProvider) {
        flowFactoryProvider.defaults = {
            target: function (FlowFile, FlowChunk, isTest) {
                return "/code/upload/?parent=" + FlowFile.parent
            },
            //target: '/code/upload',
            testChunks: false,
            permanentErrors: [500, 501],
            maxChunkRetries: 1,
            chunkRetryInterval: 5000,
            simultaneousUploads: 4
        };
        flowFactoryProvider.on('catchAll', function (event) {
            console.log('catchAll', arguments);
        });
    }]);


ctrlCode.factory('DataModel', ['$http', function ($http) {
        
        var data = {};
        
        data.getTree = function (tempID) {
            
            return $http.post('/code/tree' , {
                userid: tempID
            });
        }
        
        data.manage = function (userid, data, action) {
            
            return $http.post('/code/manage' , {
                userid: userid,
                data: data,
                action: action
            });
        }
        
        return data;
    }]);

ctrlCode.controller('codeController', ['$scope', '$timeout', '$sce', '$http', 'ngNotify', 'DataModel',
    function ($scope, $timeout, $sce, $http, ngNotify, DataModel) {
        
        $scope.treeOptions = {
            nodeChildren: "childrens",
            allowDeselect: false,
            dirSelectable: false,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        }
        
        $scope.arrTabs = [];
        $scope.isAutoSave = true;
        $scope.isFileOpened = false;
        $scope.fileLastSaved = new Date();
        $scope.currentNode = {};
        var websiteUrl = "http://myfirstwebsite.dev-webspot.io";
        var tempID = "55fb0bbcca62f8b82759032f"; //temp current user id //JSON.parse(localStorage.getItem("PanelUser"))._id
        var tempRootID = "560a84aeb9d25e5f2b1ff4d5"; //temp root id in mongo
        
        $scope.uploader = {};

        //scoped methods
        $scope.init = function () {
            DataModel.getTree(tempID).success(function (results, status, headers, config) {
                
                $scope.flatTree = results.root;
                $scope.treeData = buildTree(results.root);
                $scope.showSelectedFile($scope.treeData[$scope.treeData.length-1])
                $scope.$apply;
            });
        }
        
        //set active tab
        $scope.setActiveTab = function (tab) {
            _.each($scope.arrTabs, function (item, i) {
                item.isActiveTab = false;
            });
            tab.isActiveTab = true;
        }
        
        $scope.tabChange = function (node) {
            console.log("about to change tab to ", node.name)

            if (!containsObject(node, $scope.arrTabs)) {
                console.log("this tab was closed, ignore tab change to ", node.name)
                return;
            }
            $scope.setActiveTab(node);
            $scope.currentNode = node;
            
            if (isAllowEditor(node)) {
                var editor = ace.edit("editor_" + node._id);
                editor.focus();
                editor.resize();
            }
            
        }
        
        $scope.select = function () {
            console.log("fuck");
        }
        
        $scope.closeTab = function (e, tabIndex, tab, curTab) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log("about to close", tab.name);
            var relevantTab = null;
            
            if ($scope.currentNode == tab) {
                //if closing selected tab - select prev file if has or close editor if not.
                console.log("closing cur tab")
                if ($scope.arrTabs.length > 0) {
                    if (tabIndex > 0){
                        relevantTab = $scope.arrTabs[tabIndex - 1];
                        console.log("selecting prev tab");

                    } else {
                        relevantTab = $scope.arrTabs[1];
                        console.log("selecting tab[1]");

                    }

                } else {
                    console.log("no more tabs");
                    relevantTab = null;
                }
            } else {
                //if closing not selcted tab - keep the current tab live
                console.log("closing **not** cur tab. will show",curTab.name)
                relevantTab = curTab;
            }
            console.log("relevant tab is:", relevantTab);
            
            
            $timeout(function () {
                //update the right tab if has one or clear currentNode
                if (relevantTab != null) {
                    //$scope.showSelectedFile(relevantTab);
                    $scope.currentNode = relevantTab;
                    $scope.setActiveTab(relevantTab);
                } else {
                    $scope.currentNode = {};
                }
                //remove tab from array
                $scope.arrTabs.splice(tabIndex, 1);

            }, 50);
        }
        
        function containsObject(obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (list[i].name == obj.name) {
                    return true;
                }
            }
            
            return false;
        }
        
        function isEventIsRightClick(e){
            var isRightMB;
            
            try {
                
                
            e = e || window.event;
            
            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                isRightMB = e.which == 3;
            else if ("button" in e)  // IE, Opera 
                isRightMB = e.button == 2;
            } catch(x) {

            }

            return isRightMB;
        }
        
        function isAllowEditor(file){
            var fileExt = $scope.getNodeType(file.name);
            return jQuery.inArray(fileExt, arrBlockEditor) == -1;
        }
        
        $scope.addTab = function (tab) {
            if (tab.type == "folder") {
                return;
            }

            if (containsObject(tab, $scope.arrTabs)) {
                console.log("this tab is already opened. no need to addTab",$scope.arrTab)
                $scope.tabChange(tab);
                return;
            }
            
            $scope.arrTabs.push(tab);
            $scope.setActiveTab(tab);
            console.log($scope.arrTabs);
            
            var fileExt = $scope.getNodeType(tab.name);
            setTimeout(function () {
                if (!isAllowEditor(tab)) {
                    //show preview instead of editor
                    var ifrm = $("<iframe>").attr({
                        src: getFileFullPath(tab),
                        style: "width:100%;height:100%;min-height:300px;border:0px;",
                        frameBorder:0
                    });
                    $("#editor_" + tab._id).after(ifrm).remove();

                    console.log("about to show preview instead of editor", tab);
                } else {
                    var editor = ace.edit("editor_" + tab._id);
                    editor.$blockScrolling = Infinity;
                    editor.setTheme("ace/theme/github");
                    editor.getSession().setMode("ace/mode/javascript");
                    editor.getSession().setTabSize(2);
                    editor.setShowPrintMargin(false);
                    
                    switch (fileExt) {
                
                        case "js":
                            {
                                editor.getSession().setMode("ace/mode/javascript");
                                break;
                            }
                        case "html":
                            {
                                editor.getSession().setMode("ace/mode/html");
                                break;
                            }
                        case "css":
                            {
                                editor.getSession().setMode("ace/mode/css");
                                break;
                            }
                    }
                    
                    console.log("about to set data to editor", tab.name);
                    editor.setValue(tab.content);
                    editor.gotoLine(0, 0, true);
                    editor.focus();
                    
                    editor.getSession().on('change', function (e) {
                        if (tab.isDirty !== true) {
                            tab.isDirty = true;
                            $scope.$apply();
                        }
                        if ($scope.isAutoSave) {
                            deSave();
                        }
                    });

                    var deSave = _.debounce(function () {
                        $scope.save();
                    }, 2000);
                }
            }, 20);

        }
        
        $scope.getNodeType = function (name) {
            //get file extention
            var arr = name.split('.');
            
            if (arr.length > 1)
                return arr[arr.length - 1];
            else
                return "folder";
        }
        
        $scope.getCurrentNodeUrl = function () {
            if (typeof $scope.currentNode.name === "undefined" || $scope.currentNode.name.length == 0) {
                return $sce.trustAsResourceUrl('');
            }
            if ($scope.getNodeType($scope.currentNode.name) == "html" && $scope.currentNode.name != "master.html") {
                var url = getFileFullPath($scope.currentNode);
                return $sce.trustAsResourceUrl(url);
            }
        }
        
        $scope.reloadPreview = function () {
            //var element = document.getElemenyById('ifrmPreview');
            var element = angular.element(document.querySelector('#ifrmPreview'));
            console.log("tring to preview", element);
            
            element.attr('src', element.attr('src'));

        }
        
        $scope.treeRightClick = function () {
            var file = $scope.getContextMenuFile();
            $scope.currentNode = file;
            $scope.showSelectedFile(file);
        }
        
        $scope.treeDblClick = function (id) {
            $scope.contextMenuItemId = id;
            $scope.openFile();
        }
        
        $scope.showToggle = function (node, expanded, $parentNode, $index, $first, $middle, $last, $odd, $even) {
            ComponentsContextMenu.init();
        };
        
        $scope.enlargeBottomTab = function () {
            console.log("dbl clicked");
        }
        
        $scope.showSelectedFile = function (node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even) {
            if (isEventIsRightClick($even)) {
                console.log("this is right click, byey bye from show selected ");
                return;
            }
                

            console.log("showSelectedFile", node.name);
            if (containsObject(node, $scope.arrTabs)) {
                console.log("this tab was is already opened", node.name);
                $scope.tabChange(node);
                return;
            }

            $scope.isFileOpened = true;
            $scope.currentNode = node;
            $scope.addTab(node);
        }
        
        $scope.getContextMenuFile = function () {
            return _.filter($scope.flatTree, function (item, i) {
                return (item._id === $scope.contextMenuItemId);
            })[0];
        }
        
        //context menu actions
        $scope.delete = function () {
            
            var file = $scope.getContextMenuFile();
             
            //prepare object for sending
            var data = {};
            data.rootId = tempRootID;
            data.id = file._id;
            
            DataModel.manage(tempID, data, "delete").success(function (results, status, headers, config) {
                
                //update UI
                $scope.flatTree = _.reject($scope.flatTree, function (item, i) {
                    return (item._id === file._id);
                });
                $scope.treeData = buildTree($scope.flatTree);
                
                $scope.deleteModal = false;
                
                //show confirmation
                ngNotify.set('Deleted ok', { type: 'info' });
            });
        }
        
        $scope.openFile = function () {
            
            var file = $scope.getContextMenuFile();
            if (file.type != "folder") {
                window.open(getFileFullPath(file));
            }
            
        };
        
        function getFileFullPath(file){
            return websiteUrl + "/" + file.name;
            //return "/code/view/" + tempID + "/" + file.name;
        }
        
        $scope.showRenameModal = function () {
            
            $scope.renameModal = true;
            var file = $scope.getContextMenuFile();
            $scope.fileToRename = file.name;
        }
        
        $scope.showUploadModal = function () {
            
            $scope.uploadModal = true;
        }

        $scope.uploadFiles = function () {
            
            //update all files "parent" prop
            for (var i = 0; i < $scope.uploader.flow.files.length; i++) {
                
                var fileParent = "";

                if ($scope.currentNode.type == "folder") {
                    fileParent = $scope.currentNode._id;
                }

                $scope.uploader.flow.files[i].parent = fileParent
            }

            $scope.uploader.flow.upload();
            $scope.uploader.flow.files = [];
            $scope.uploadModal = false;
        }
        
        $scope.handleFile = function ($file, $message, $flow) {
            
            //update UI
            var newFile = angular.fromJson($message);

            $scope.flatTree.push(newFile);
            $scope.treeData = buildTree($scope.flatTree);

            ngNotify.set('Uploaded successfully', { type: 'info' });
        }

        $scope.renameFile = function () {
            
            if ($scope.fileToRename == undefined || $scope.fileToRename == "") {
                
                ngNotify.set('Field required', { type: 'error' });
                return;
            }
            
            //prepare object for sending
            var data = {};
            data.rootId = tempRootID;
            data.id = $scope.contextMenuItemId;
            data.name = $scope.fileToRename;
            
            DataModel.manage(tempID, data, "rename").success(function (results, status, headers, config) {
                
                //update UI
                $scope.flatTree = _.reject($scope.flatTree, function (item, i) {
                    if (item._id === $scope.contextMenuItemId)
                        item.name = $scope.fileToRename;
                });
                $scope.treeData = buildTree($scope.flatTree);
                
                //close dialog
                $scope.renameModal = false;
                
                //show confirmation
                ngNotify.set('Renamed ok', { type: 'info' });
            });
        }
        
        $scope.addNewFile = function () {
            
            if ($scope.newFile == undefined || $scope.newFile == "") {
                
                ngNotify.set('Field required', { type: 'error' });
                return
            }
            
            if ($scope.newFile.indexOf(".") == -1) {
                
                ngNotify.set('Bad file name', { type: 'error' });
                return;
            }
            
            var file = $scope.getContextMenuFile();
            
            //prepare object for sending
            var data = {};
            data._id = null;
            data.name = $scope.newFile;
            data.type = "file";
            if (file.type == "folder")
                data.parent = file._id;
            else
                data.parent = "";
            
            data.content = "";
            
            DataModel.manage(tempID, data, "add").success(function (results, status, headers, config) {
                
                //update UI
                $scope.flatTree.push(results);
                $scope.treeData = buildTree($scope.flatTree);
                
                $scope.newFile = "";
                
                //close dialog
                $scope.addFileModal = false;
                
                ngNotify.set('Added ok', { type: 'info' });
            });
        }
        
        $scope.addNewFolder = function () {
            
            if ($scope.newFolder == undefined || $scope.newFolder == "") {
                
                ngNotify.set('Field required', { type: 'error' });
                return;
            }
            
            if ($scope.newFolder.indexOf(".") != -1) {
                
                ngNotify.set('Bad folder name', { type: 'error' });
                return;
            }
            
            var file = $scope.getContextMenuFile();
            
            //prepare object for sending
            var data = {};
            data._id = null;
            data.name = $scope.newFolder;
            data.type = "folder";
            if (file.type == "folder")
                data.parent = file._id;
            else
                data.parent = "";
            data.content = "";
            
            DataModel.manage(tempID, data, "add").success(function (results, status, headers, config) {
                
                //update UI
                $scope.flatTree.push(results);
                $scope.treeData = buildTree($scope.flatTree);
                
                $scope.newFolder = "";
                
                //close dialog
                $scope.addFolderModal = false;
                
                ngNotify.set('Added ok', { type: 'info' });
            });
        }
        
        $scope.save = function () {
            if (!isAllowEditor($scope.currentNode)) {
                return;
            }

            //prepare object for sending
            var data = {};
            data.rootId = tempRootID;
            data.id = $scope.currentNode._id;
            
            var editor = ace.edit('editor_' + $scope.currentNode._id);
            
            data.content = editor.getValue();
            
            DataModel.manage(tempID, data, "update").success(function (results, status, headers, config) {
                
                $scope.reloadPreview();
                
                $scope.currentNode.isDirty = false;
                $scope.fileLastSaved = new Date();
                
                //update tree
                $scope.currentNode.content = editor.getValue();
            });
        }
        
        //general methods
        var buildTree = function (data) {
            var tree = [];
            var parent = "";
            
            function buildChildrens(tree, parent) {
                
                //get relevant children
                var items = _.filter(data, function (node, i) {
                    return node.parent == parent;
                });
                
                //quit if didn't find children
                if (!items && items.length == 0) {
                    return;
                }
                
                _.each(items, function (item, j) {
                    var leaf = {
                        "_id": item._id,
                        "content": item.content,
                        //"ext": item.ext,
                        "name": item.name,
                        "type": item.type,
                        "childrens": []
                    };
                    if (item.type == "folder") {
                        buildChildrens(leaf.childrens, item._id);
                    }
                    tree.push(leaf);
                });
                
                return tree.reverse();
            }
            
            buildChildrens(tree, parent);
            
            ComponentsContextMenu.init();
            return tree;
        }
    }
]);