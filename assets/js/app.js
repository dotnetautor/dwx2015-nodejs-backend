(function(){
  var todoApp = angular.module("todoApp",["ngMaterial",,"ngSails", "restangular"]);

  todoApp.factory("DataService",["Restangular", function(rest){

    return {

      getAllTodos : function(){
        return rest.all('todo').getList();                                
      },

      addTodo : function(todo){
        return rest.all('todo').post(todo);                                
      },


    }
  }]);

  todoApp.controller("TodoController",["$scope","$sails", "$log", function($scope, $sails, $log){ 
    $scope.todos = [];
    $scope.todoText = "";

    function findIndexByPropertyValue(arr, property, value) {
      var index = null;
      for (var i in arr) {
        if (arr[i][property] == value) {
          index = i;
          break;
        }
      }
      return index;
    }

    $sails.get('/todo').then(function(response) {
      $scope.todos = response.data;
      $log.debug('sailsSocket::/todo', response);
    });

    
     $sails.on("todo", function(data) {
      $log.debug('New comet message received :: ', data);

      switch(data.verb) {
        case 'created':
          $scope.todos.unshift(data.data);
          break;

        case 'destroyed':
          var deleteIndex = findIndexByPropertyValue($scope.todos, 'id', data.id);
          if (deleteIndex !== null)
            $scope.todos.splice(deleteIndex, 1);
          break;

        case 'updated':
          var updateIndex = findIndexByPropertyValue($scope.todos, 'id', data.id);
          if (updateIndex !== null) {
            angular.extend($scope.todos[updateIndex], data.data);
          }
          break;
      }
      
    });
    
    $scope.itemChanged = function(todo){
       $sails.put('/todo/' + todo.id, todo).then(function(data){ 
          $log.debug('sailsSocket::/todo', data);
       });
    }

    $scope.addTodo = function() {

       $sails.post('/todo', { title: $scope.todoText, isComplete: false}).then(function(data){
             $scope.todos.unshift(data.data);
          });

      $scope.todoText = "";
    }

    $scope.archive = function() {
      $scope.todos.forEach(function(todo, index){
        if (todo.isComplete) {
           $sails.delete('/todo/' + todo.id).then(function(data){
          var deleteIndex = findIndexByPropertyValue($scope.todos, 'id', data.data.id);
          if (deleteIndex !== null)
            $scope.todos.splice(deleteIndex, 1);
        });
        }
      });
    }

  }]);

  todoApp.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/');
  });

  todoApp.config(function($mdThemingProvider, $mdIconProvider){

    $mdIconProvider
      .icon("menu"       , "./svg/menu.svg"         , 24)
      .icon("add"        , "./svg/add.svg"          , 48)

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('red');

  });
})()