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

app.directive('date', ['$document', function($document){
  return {
    templateUrl: 'partials/datepicker.html',
    link: function(){
      $( "#datepicker" ).datepicker({
          beforeShowDay: function(date) {
          var day = date.getDay();
          //var today = $document[0].getElementByClass("ui-datepicker-today");

          //if(day >= today){
            return [(day !== 0)];
        //  }



            // TODO: make sure client cannot select a past date
        }
      });
    }
  };
}]);

// app.directive('clientcalendar', [function(){
//   $( "#checkavailable" ).click(function() {
//     $( "#clientcalendarshow" ).slideDown( "slow", function() {
//       // Animation complete.
//     });
//   });
// }]);

app.directive('calendar', ['$http', '$document', function($http, $document){
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

        header: {
          left: 'title',
          right: 'prev,today,next,agendaDay,basicWeek,month'
        },

        allDaySlot: false,

        minTime: '06:00:00',

        maxTime: '20:00:00',

        displayEventTime: true,

        displayEventEnd: true,

        editable: true,

        defaultView: 'basicWeek',

        //this.events[i].title =
        //events: [],


        events: 'http://localhost:3000/admin/welcome',

        refetchEvents: 'http://localhost:3000/admin/welcome',

        eventRender: function(event, element) {
                // element.qtip({
                //     content: event.description
                // });
            },

        dayClick: function(date, jsEvent, view) {

          console.log(date.format());
          console.log('doc', $document);
          var client_name = $document[0].getElementById("client_name");
          var starttime_hr = $document[0].getElementById("starttime_hr");
          var starttime_min = $document[0].getElementById("starttime_min");
          var endtime_hr = $document[0].getElementById("endtime_hr");
          var endtime_min = $document[0].getElementById("endtime_min");
          var services = $document[0].getElementById("services");
          var originalContent;

          $("#dialog").dialog({

              width: '75%',
              display: true,
              show: 'fade',
              hide: 'fade',
              open : function(event, ui) {
                originalContent = $("#newDialog-form").html();
              },
              close : function(event, ui) {
                $("#newDialog-form").html(originalContent);
              }

            });

          $("#cancel").click(function(){
            $(this).closest('.ui-dialog-content').dialog('close');

          });

          $("#addEvent").click(function(){
            console.log('Date: ' + date.format());

            if(client_name.value !== '' || starttime_hr.value !== '' || starttime_min.value !== '' || endtime_hr.value !== '' || endtime_min.value !== '' || services.value !== ''){
              $(this).closest('.ui-dialog-content').dialog('close');
              var data = {
                date: date.format(),
                client_name: client_name.value,
                starttime_hr: starttime_hr.value,
                starttime_min: starttime_min.value,
                endtime_hr: endtime_hr.value,
                endtime_min: endtime_min.value,
                services: services.value
              };

              $http.post('http://localhost:3000/admin/welcome', data)
              .then(function(data){
                console.log(data);
                $('#calendar').fullCalendar('refetchEvents');
              }, function(err){
                console.log(err);
              });

            } else {
              $("#fillOutFields").show({display: true}); //displays the validation error
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
