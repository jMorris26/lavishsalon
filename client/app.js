'use strict';

var app = angular.module('lavish', ['ngRoute']);


app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home.html'
  })
  .when('/ourstory', {
    templateUrl: 'partials/ourstory.html'
  })
  .when('/contact', {
    templateUrl: 'partials/contact.html'
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
  })
  .when('/admin', {
    templateUrl: 'partials/admin/adminlogin.html',
    controller: 'AdminLoginController',
    controllerAs: 'alc'
  })
  .when('/admin/welcome', {
    templateUrl: 'partials/admin/welcome.html'
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
    scope: {
      datethingy: '='
    },
    link: function(scope, element, attrs, ngModel){

      var dateToday = new Date();
      $( "#datepicker" ).datepicker({
          onSelect: updateDate,
          minDate: dateToday,
          beforeShowDay: function(date) {
          var day = date.getDay();

            return [(day !== 0)];

            // TODO: make sure client cannot select a past date
        }

      });

      function updateDate(date) {
        scope.$apply(function(){
          console.log(date);
          scope.datethingy.date = date;
        });

      }


    }
  };
}]);

app.directive('clientcalendar', [function(){

  return {
    templateUrl: 'partials/bookcal.html',
    link: function(){
      $('#clientcalendarshow').fullCalendar({

        businessHours:
              {
                  dow: [ 1, 2, 3, 4, 5, 6 ], // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
                  start: '09:00', // 9am
                  end: '17:00' // 5pm
              },

        header: {
          left: 'title',
          right: 'prev,today,next'
        },

        allDaySlot: false,

        minTime: '09:00:00',

        maxTime: '17:00:00',

        // displayEventTime: true,
        //
        // displayEventEnd: true,

        defaultView: 'agendaWeek',


        events: 'https://lavishsalon.herokuapp.com/book',

        color: 'rgba(66, 72, 76, 0.5)',     // an option!
        textColor: 'yellow',

        refetchEvents: 'https://lavishsalon.herokuapp.com/book',


      });

    }
  };
}]);

app.directive('calendar', ['$http', '$document', function($http, $document){
  return {
    templateUrl: 'partials/admin/calendar.html',
    link: function(scope){

      scope.currentCalendarEvent = {};
      scope.newDate;

      if(scope.currentCalendarEvent.client_name !== null){
        scope.addNewEventHandler = function(){
          // console.log(e);
          //e.stopPropagation();
          scope.currentCalendarEvent.date = scope.newDate;
          console.log('current Cal Date', scope.currentCalendarEvent.date);


          // TODO: throw an error if the fields are empty

          //$(e.target).attr('disabled', 'disabled');


          // if(scope.currentCalendarEvent.client_name && scope.currentCalendarEvent.starttime_hr && scope.currentCalendarEvent.starttime_min && scope.currentCalendarEvent.endttime_hr && scope.currentCalendarEvent.endttime_min){

            console.log('You are trying to create a new event', scope.currentCalendarEvent);
            $http.post('https://lavishsalon.herokuapp.com/admin/welcome', scope.currentCalendarEvent)
            .then(function(data){
              console.log('this data', data);
              $('#calendar').fullCalendar('refetchEvents');

            }, function(err){
              console.log(err);
            });
            $("#dialog").closest('.ui-dialog-content').dialog('close');
            console.log('Scope Obj:', scope.currentCalendarEvent);


          // } else if(!scope.currentCalendarEvent.client_name || !scope.currentCalendarEvent.starttime_hr || !scope.currentCalendarEvent.starttime_min || !scope.currentCalendarEvent.endttime_hr || !scope.currentCalendarEvent.endttime_min){
          //
          //   $("#fillOutFields").css({"display": "block"});
          //   console.log('current object? ', scope.currentCalendarEvent);
          //   scope.addAppt.$setPristine();
          // }


        };
      }


      // scope.resetForm = function(){
      //   $("#client_name").val(null);
      //   $("#starttime_hr").val(null);
      //   $("#starttime_min").val(null);
      //   $("#endtime_hr").val(null);
      //   $("#endtime_min").val(null);
      //   $("#services").val(null);
      //   scope.addAppt.$setPristine();
      // };

      scope.editEventHandler = function(){
        console.log(scope.currentCalendarEvent);
        $('#edit-dialog').dialog({
            width: '75%',
            display: true,
            show: 'fade',
            hide: 'fade',
          });
        $('#view-dialog').closest('.ui-dialog-content').dialog('close');
      };

      scope.actuallyEditEventHandler = function(){
        console.log('you are trying to edit');
        console.log('this is the current scope: ', scope.currentCalendarEvent);

        $http.post('https://lavishsalon.herokuapp.com/admin/welcome/'+ scope.currentCalendarEvent.id, scope.currentCalendarEvent)
        .then(function(data){
          console.log(data);
          $('#calendar').fullCalendar('refetchEvents');
        }, function(err){
          console.log(err);
        });

        $('#editEventButton').closest('.ui-dialog-content').dialog('close');

      };

      scope.closeAddEventHandler = function(){
        $("#cancel").closest('.ui-dialog-content').css({"display": "none", "hide": "fade"});
        //console.log('are you getting here');
      };

      scope.closeViewEventHandler = function(){
        $('#close').closest('.ui-dialog-content').dialog('close');
      };

      scope.closeEditEventHandler = function(){
        $("#close_edit").closest('.ui-dialog-content').dialog('close');
      };

      scope.closeDeleteEventHandler = function(){
        $("#close_delete").closest('.ui-dialog-content').dialog('close');
      };

      scope.deleteEventHandler = function(){
        console.log('is it working');
        console.log('id of deleted: ', scope.currentCalendarEvent.id);
        $http.delete('https://lavishsalon.herokuapp.com/admin/welcome/'+ scope.currentCalendarEvent.id)
        .then(function(data){
          console.log(data);
          $('#calendar').fullCalendar('refetchEvents');
        }, function(err){
          console.log(err);
        });

        $("#deleteEvent").closest('.ui-dialog-content').dialog('close');

      };




      //TODO create button handlers

      $('#calendar').fullCalendar({

        header: {
          left: 'title',
          right: 'prev,today,next,agendaDay,agendaWeek,month'
        },

        allDaySlot: false,

        minTime: '07:00:00',

        maxTime: '19:00:00',

        displayEventTime: true,

        displayEventEnd: true,

        defaultView: 'agendaWeek',

        eventClick: function(calEvent, jsEvent) {

          jsEvent.stopPropagation();

          scope.$apply(function(){
            scope.currentCalendarEvent = calEvent;
          });


          if($("#view-dialog").dialog({display: true})){
            $(".fc-state-active").css({"z-index":"-10"});
          }

            $('#view-dialog').dialog({
              width: '75%',
              display: true,
              show: 'fade',
              hide: 'fade'
            });

          setTimeout(function(){
            $("#editEvent").removeAttr('disabled');
          }, 1000);

          setTimeout(function(){
            $("#close").removeAttr('disabled');
          }, 1000);

          setTimeout(function(){
            $("#youaresure_delete").removeAttr('disabled');
          }, 1000);


            $("#youaresure_delete").click(function(){
              // TODO: this button needs to delete the event in the database

              $(this).closest('.ui-dialog-content').dialog('close');
              $('#areyousure-dialog').dialog({
                width: '75%',
                display: true,
                show: 'fade',
                hide: 'fade',
              });

          });

        },

        events: 'https://lavishsalon.herokuapp.com/admin/welcome',

        refetchEvents: 'https://lavishsalon.herokuapp.com/admin/welcome',

        dayClick: function(date, jsEvent, view) {

          console.log(jsEvent);

          jsEvent.stopPropagation();

          if($("dialog").dialog({display: true})){
            $(".fc-state-active").css({"z-index":"-10"});
          }

          //TODO this isn't doing what you think
          scope.$apply(function(){
            scope.newDate = date.format();
            scope.currentCalendarEvent = {};
          });


        //  console.log('scope date', scope.newDate);

          var originalContent;

          $("#dialog").dialog({

              width: '75%',
              display: true,
              show: 'fade',
              hide: 'fade',
              // open : function(event, ui) {
              //
              //     // originalContent = $("#newDialog-form").html();
              //
              // },
              // close : function(event, ui) {
              //
              //     // $("#newDialog-form").html(originalContent);
              //
              // }

            });

            // setTimeout(function(){
            //   console.log('hey der barb');
            //   $("#addEvent").removeAttr('disabled');
            // }, 1000);

            setTimeout(function(){
              $("#cancel").removeAttr('disabled');
            }, 1000);

            //
            // $("#client_name").val("");
            // $("#starttime_hr").val("");
            // $("#starttime_min").val("");
            // $("#endtime_hr").val("");
            // $("#endtime_min").val("");
            // $("#services").val("");

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
