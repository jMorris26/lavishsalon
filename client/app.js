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
    templateUrl: 'partials/admin/adminlogin.html',
    controller: 'AdminLoginController',
    controllerAs: 'alc'
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
          //var today = $document[0].getElementByClass("ui-datepicker-today");
          //if(day >= today){
            return [(day !== 0)];
        //  }

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


        events: 'http://localhost:3000/book',

        color: 'rgba(66, 72, 76, 0.5)',     // an option!
        textColor: 'yellow',

        refetchEvents: 'http://localhost:3000/book',


      });
      // $( "#checkavailable" ).click(function() {
      //   $( "#clientcalendarshow" ).slideDown( "slow", function() {
      //     // Animation complete.
      //   });
      // });
    }
  };
}]);

app.directive('calendar', ['$http', '$document', function($http, $document){
  return {
    templateUrl: 'partials/admin/calendar.html',
    link: function(scope){

      scope.currentCalendarEvent = {};
      scope.newDate;

      //var dialog = $document[0].getElementById("#dialog");


      scope.addNewEventHandler = function(){
        scope.currentCalendarEvent.date = scope.newDate;
        console.log('current Cal Date', scope.currentCalendarEvent.date);


        // TODO: throw an error if the fields are empty


        //if(scope.currentCalendarEvent.client_name !== null){

          console.log('You are trying to create a new event', scope.currentCalendarEvent);
          $http.post('http://localhost:3000/admin/welcome', scope.currentCalendarEvent)
          .then(function(data){
            console.log(data);
            $('#calendar').fullCalendar('refetchEvents');
          }, function(err){
            console.log(err);
          });
          $("#dialog").closest('.ui-dialog-content').dialog('close');
        //   } else {
        //   $("#fillOutFields").show({display: true});
        // }


      };

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

        $http.post('http://localhost:3000/admin/welcome/'+ scope.currentCalendarEvent.id, scope.currentCalendarEvent)
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
        console.log('are you getting here');
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
      // scope.closeNewEvent = function(){
      //   $("#cancel").closest('.ui-dialog-content').dialog('close');
      //   console.log('close the new event');
      // };

      scope.deleteEventHandler = function(){
        console.log('is it working');
        console.log('id of deleted: ', scope.currentCalendarEvent.id);
        $http.delete('http://localhost:3000/admin/welcome/'+ scope.currentCalendarEvent.id)
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
        // businessHours:
        //       {
        //           dow: [ 1, 2, 3, 4, 5, 6 ], // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
        //           start: '09:00', // 9am
        //           end: '17:00' // 5pm
        //       },

        header: {
          left: 'title',
          right: 'prev,today,next,agendaDay,agendaWeek,month'
        },

        allDaySlot: false,

        minTime: '07:00:00',

        maxTime: '19:00:00',

        displayEventTime: true,

        displayEventEnd: true,

        //editable: true,

        defaultView: 'agendaWeek',

        eventClick: function(calEvent) {
          scope.$apply(function(){
            scope.currentCalendarEvent = calEvent;
          });


          if($("#view-dialog").dialog({display: true})){
            $(".fc-state-active").css({"z-index":"-10"});
          }
          //   console.log('eventClick', calEvent.id);
          //   // console.log('Client: ' + calEvent.title);
          //   // console.log('Date: ' + calEvent.date);
          //   // console.log('End: ' + calEvent.end);
          //
            $('#view-dialog').dialog({
              width: '75%',
              display: true,
              show: 'fade',
              hide: 'fade'
            });


          //
          //
          //   var viewClient = $document[0].getElementById('view-client-name');
          //   viewClient.innerHTML = calEvent.title;
          //   var viewDate = $document[0].getElementById('view-client-date');
          //   viewDate.innerHTML = calEvent.date;
          //   var viewService = $document[0].getElementById('view-client-service');
          //   viewService.innerHTML = calEvent.services;
          //   var viewStart = $document[0].getElementById('view-client-starttime');
          //   viewStart.innerHTML = calEvent.justtimestart;
          //   var viewEnd = $document[0].getElementById('view-client-endtime');
          //   viewEnd.innerHTML = calEvent.justtimeend;
          //
          //   $("#close").click(function(){
          //     $(this).closest('.ui-dialog-content').dialog('close');
          //   });
          //
            $("#youaresure_delete").click(function(){
              // TODO: this button needs to delete the event in the database

              $(this).closest('.ui-dialog-content').dialog('close');
              $('#areyousure-dialog').dialog({
                width: '75%',
                display: true,
                show: 'fade',
                hide: 'fade',
              });
          //
          //
          //
          //
          //     $("#deleteEvent").click(function(){
          //
          //     //console.log('calEvent: ', calEvent._id);
          //     var data = {
          //       id: calEvent.id
          //     };
          //     $http.delete('http://localhost:3000/admin/welcome/'+ data.id, data)
          //     .then(function(data){
          //       console.log(data);
          //       $('#calendar').fullCalendar('refetchEvents');
          //     }, function(err){
          //       console.log(err);
          //     });
          //     $(this).closest('.ui-dialog-content').dialog('close');
          //   });
          });

            // $('#editEvent').click(function(){
            //   console.log('#editEvent', calEvent.id);
            //   $(this).closest('.ui-dialog-content').dialog('close');
            //   $('#edit-dialog').dialog({
            //     width: '75%',
            //     display: true,
            //     show: 'fade',
            //     hide: 'fade',
            //   });
            //
            //   var clientEditName = $document[0].getElementById('client_name_edit');
            //   clientEditName.value = calEvent.title;
            //   var clientEditService = $document[0].getElementById('edit_services');
            //   clientEditService.value = calEvent.services;
            //   var clientEditStartHr = $document[0].getElementById('edit_starttime_hr');
            //   clientEditStartHr.value = calEvent.starttime_hr;
            //   var clientEditStartMin = $document[0].getElementById('edit_starttime_min');
            //   clientEditStartMin.value = calEvent.starttime_min;
            //   var clientEditEndHr = $document[0].getElementById('edit_endtime_hr');
            //   clientEditEndHr.value = calEvent.endtime_hr;
            //   var clientEditEndMin = $document[0].getElementById('edit_endtime_min');
            //   clientEditEndMin.value = calEvent.endtime_min;
            //
            //   var clientEditDate = $document[0].getElementById('edit-client-date');
            //   clientEditDate.value = calEvent.date;
            //
            //   $("#cancel").click(function(){
            //     $(this).closest('.ui-dialog-content').dialog('close');
            //   });
            //
            //   $("#close_edit").click(function(){
            //     $(this).closest('.ui-dialog-content').dialog('close');
            //   });
            //
            //   $('#editEventButton').click(function(){
            //     //TODO: this button needs to edit the event in the database
            //     console.log('#editEventButton', calEvent.id);
            //
            //     var data = {
            //       id: calEvent.id,
            //       date: $document[0].getElementById('edit-client-date').value,
            //       client_name: $document[0].getElementById('client_name_edit').value,
            //       starttime_hr: $document[0].getElementById('edit_starttime_hr').value,
            //       starttime_min: $document[0].getElementById('edit_starttime_min').value,
            //       endtime_hr: $document[0].getElementById('edit_endtime_hr').value,
            //       endtime_min: $document[0].getElementById('edit_endtime_min').value,
            //       services: $document[0].getElementById('edit_services').value
            //     };
            //     $http.post('http://localhost:3000/admin/welcome/'+ data.id, data)
            //     .then(function(data){
            //       console.log(data);
            //       $('#calendar').fullCalendar('refetchEvents');
            //     }, function(err){
            //       console.log(err);
            //     });
            //     $(this).closest('.ui-dialog-content').dialog('close');
            //   });
            //
            //
            // });

        },

        events: 'http://localhost:3000/admin/welcome',

        refetchEvents: 'http://localhost:3000/admin/welcome',

        dayClick: function(date, jsEvent, view) {

          if($("dialog").dialog({display: true})){
            $(".fc-state-active").css({"z-index":"-10"});
          }


          scope.newDate = date.format();
          console.log('scope date', scope.newDate);
          // console.log(date.format());
          // console.log('doc', $document);
          // var client_name = $document[0].getElementById("client_name");
          // var starttime_hr = $document[0].getElementById("starttime_hr");
          // var starttime_min = $document[0].getElementById("starttime_min");
          // var endtime_hr = $document[0].getElementById("endtime_hr");
          // var endtime_min = $document[0].getElementById("endtime_min");
          // var services = $document[0].getElementById("services");
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

            $("#client_name").val("");
            $("#starttime_hr").val("");
            $("#starttime_min").val("");
            $("#endtime_hr").val("");
            $("#endtime_min").val("");
            $("#services").val("");


          // $("#cancel").click(function(){
          //   $(this).closest('.ui-dialog-content').dialog('close');
          //
          // });

          // $("#addEvent").click(function(){
          //   console.log('Date: ' + date.format());

            // if(client_name.value !== '' || starttime_hr.value !== '' || starttime_min.value !== '' || endtime_hr.value !== '' || endtime_min.value !== '' || services.value !== ''){
            //   $(this).closest('.ui-dialog-content').dialog('close');
            //   var data = {
            //     date: date.format(),
            //     client_name: client_name.value,
            //     starttime_hr: starttime_hr.value,
            //     starttime_min: starttime_min.value,
            //     endtime_hr: endtime_hr.value,
            //     endtime_min: endtime_min.value,
            //     services: services.value
            //   };

              // $http.post('http://localhost:3000/admin/welcome', data)
              // .then(function(elephant){
              //   console.log(elephant);
              //   $('#calendar').fullCalendar('refetchEvents');
              // }, function(err){
              //   console.log(err);
              // });

            // } else {
            //   $("#fillOutFields").show({display: true}); //displays the validation error
            // }

          //});
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
