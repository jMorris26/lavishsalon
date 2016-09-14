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
    templateUrl: 'partials/book.html',
    controller: 'BookController',
    controllerAs: 'bc'
  })
  .when('/submit', {
    templateUrl: 'partials/submit.html'
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
  .when('/admin/welcome', {
    templateUrl: 'partials/admin/welcome.html'
    //resolve
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
      $( "#datepicker" ).datepicker({
          beforeShowDay: function(date) {
          var day = date.getDay();
          return [(day !== 0)];
        }
      });
    }
  };
}]);

app.directive('calendar', [function(){
  return {
    templateUrl: 'partials/admin/calendar.html',
    link: function(){
      $('#calendar').fullCalendar({

        // businessHours:
        //       {
        //           dow: [ 1, 2, 3, 4, 5, 6 ], // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
        //           start: '09:00', // 9am
        //           end: '17:00' // 5pm
        //       },

        events: [
                {
                    title: 'My Event',
                    start: '2016-09-02T12:30:00',
                    description: 'This is a cool event'
                },
                {
                    title: 'My Other Event',
                    start: '2016-09-02T13:30:00',
                    description: 'This is a cool event'
                }
                // more events here
            ],
        eventRender: function(event, element) {
                // element.qtip({
                //     content: event.description
                // });
            },

        dayClick: function(date, jsEvent, view) {
          console.log(date.format());
          $("#dialog").dialog({ width: '75%', display: true, show: 'fade', hide: 'fade' });
          $("#cancel").click(function(){
            $(this).closest('.ui-dialog-content').dialog('close');
          });

          $("#addEvent").click(function(){
            console.log('Date: ' + date.format());
            var clientName = document.getElementById("clientName");
            var startTime = document.getElementById("startTime");
            var endTime = document.getElementById("endTime");
            var serviceList = document.getElementById("serviceList");

            console.log('Client Name: ' + clientName.value);
            console.log('Start Time: ' + startTime.value);
            console.log('End Time: ' + endTime.value);
            console.log('Services: ' + serviceList.value);

            if(clientName.value !== '' || startTime.value !== '' || endTime.value !== '' || serviceList.value !== ''){
              $(this).closest('.ui-dialog-content').dialog('close');
            } else {
              $("#fillOutFields").show({display: true});
            }

          });
        //  alert('Clicked on: ' + date.format());
         //
        //  alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
         //
        //  alert('Current view: ' + view.name);

        //change the day's background color just for fun
         //$(this).css('background-color', 'red');
       }
     });
   }
 };
}]);


app.factory('authInterceptor', ['$q', '$window', '$location', function($q, $window, $location){
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function(response){
      if(response.status === 401) {
        //handle the case where the user is not authenticated
        $location.url('/');
      }
      return response || $q.when(response);
    }
  };
}]);

app.config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push('authInterceptor');
}]);




// events: [
//             {
//                 title  : 'event1',
//                 start  : '2016-09-01T12:30:00',
//                 end    : '2016-09-01T13:15:00'
//             },
//             {
//                 title  : 'event2',
//                 start  : '2016-09-05',
//                 end    : '2016-09-07'
//             },
//             {
//                 title  : 'event3',
//                 start  : '2016-09-09T12:30:00',
//                 //allDay : false // will make the time show
//             }
//         ]

// header: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'month,agendaWeek,agendaDay'
//      },
//      editable: true,
//      droppable: true
//
//    });
