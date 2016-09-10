'use strict';

var app = angular.module('lavish', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home.html'
    // controller: 'HomeController',
    // controllerAs: 'hc'
  })
  .when('/ourstory', {
    templateUrl: 'partials/ourstory.html'
    // controller: 'OurStoryController',
    // controllerAs: 'osc'
  })
  .when('/contact', {
    templateUrl: 'partials/contact.html'
    // controller: 'ContactController',
    // controllerAs: 'cc'
  })
  .when('/book', {
    templateUrl: 'partials/book.html'
    // controller: 'BookController',
    // controllerAs: 'bc'
  })
  .when('/services', {
    templateUrl: 'partials/services.html'
    // controller: 'ServicesController',
    // controllerAs: 'sc'
  })
  .when('/admin', {
    templateUrl: 'partials/admin/adminlogin.html'
    // controller: 'AdminLoginController',
    // controllerAs: 'alc'
  })
  .otherwise({
    redirectTo: '/'
  });
});


app.directive('slider', [function(){
  return {
    templateUrl: 'partials/slideshow.html',
    link: function(){
      $("#slideshow > div").hide();
      setInterval(function() {
        $('#slideshow > div:first')
          .fadeOut(1000)
          .next()
          .fadeIn(1000)
          .end()
          .appendTo('#slideshow');
        },  3000);
    }
  };
}]);

app.directive('date', [function(){
  return {
    templateUrl: 'partials/datepicker.html',
    link: function(){
      $( "#datepicker" ).datepicker();
    }
  };
}]);
