'use strict';

app.controller('controller', ['$http', '$window', '$location', function($http, $window, $location){
  var vm = this;
  vm.auth = function(user, password, path){
    var basePath = 'https://lavishsalon.herokuapp.com';
    var fullPath = basePath + path;

    $http.post(fullPath, {username:user, password:password})
    .then(function(response){
      console.log('Are these the droids you are looking for? ', response);
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



  vm.restricted = function(){
    $http.get('https://lavishsalon.herokuapp.com/admin/welcome')
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
  vm.form.services = {};
  vm.showAvailable = false;
  vm.buttonClick = function(path){
    console.log(vm.form);
    var basePath = 'https://lavishsalon.herokuapp.com';
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

app.controller('AdminLoginController', ['$http', '$window', '$location', function($http, $window, $location){
  var vm = this;
  if(!$window.sessionStorage.token){
    $location.url('/admin');
  }

  vm.logout = function(){
    delete $window.sessionStorage.token;
    vm.message = 'Log out successful!!!';
    $location.url('/');
  };

}]);
