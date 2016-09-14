'use strict';

app.controller('controller', ['$http', '$window', '$location', function($http, $window, $location){
  var vm = this;
  vm.auth = function(user, password, path){
    var basePath = 'http://localhost:3000';
    var fullPath = basePath + path;

    $http.post(fullPath, {username:user, password:password})
    .then(function(response){
      console.log(response);
      $window.sessionStorage.token = response.data.token;
      vm.message = 'Log in successful!!!';
      $location.url('/admin/welcome');
    })
    .catch(function(err){
      console.log(err);
      delete $window.sessionStorage.token;
      vm.message = 'Log in unsuccessful :-(';
    });
  };

  vm.logout = function(){
    delete $window.sessionStorage.token;
    vm.message = 'Log out successful!!!';
    $location.url('/');
  };

  vm.restricted = function(){
    $http.get('http://localhost:3000/admin/welcome')
    .then(function(response){
      console.log(response);
      vm.restrictedMessage = response.data.first_name + " " + response.data.last_name;
    })
    .catch(function(err){
      vm.restrictedMessage = err.statusText + ": " + err.data.message;
    });
  };

  vm.sessionStorage = $window.sessionStorage;
}]);

app.controller('BookController', ['$http', '$location', function($http, $location){
  var vm = this;
  vm.form = {};
  vm.buttonClick = function(path){
    console.log(vm.form);
    var basePath = 'http://localhost:3000';
    var fullPath = basePath + path;
    $http.post(fullPath, vm.form)
      .then(function(response) {
        console.log(response);
        $location.url('/submit');
      })
      .catch(function(err){
        console.log(err);
      });

  };
}]);
