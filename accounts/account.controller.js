﻿  (function () {
    'use strict';


    angular
    .module('app')
    .controller('AccountController', AccountController)
    .controller('AccountEditController', AccountEditController)
    .controller('AccountDeleteController', AccountDeleteController)

  // .controller('RowAccountEditCtrl', RowAccountEditCtrl)

  // .service('RowAccountEditor', RowAccountEditor);
  AccountController.$inject = ['$rootScope','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
  function AccountController($rootScope,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
    var vm = this;
    // $scope.nextv = false;
    $rootScope.shownav=true;
    $scope.search = '';
    $rootScope.rootAccess =  $cookieStore.get("rootAccess");
    $rootScope.pmAccess =  $cookieStore.get("pmAccess");
          // vm.clickHandlers = RowAccountEditor.editAccountRow;
    vm.saveaccount = saveaccount;
    vm.getaccount = getaccount;
    vm.getServices = getServices;
    vm.convertForecast = convertForecast;
    vm.toggle = toggle;
    // vm.callCurrencyAPI = callCurrencyAPI;
    var rowIndexTemp = 0;
    var colKeyTemp = '';
    var availOrgan ='';
    var availableStatus = "";
    var availableManagers = "";  
    //clickHandlers = RowAccountEditor.editAccountRow;
    $rootScope.availableStatus =  [
    {id: 'Confirmed', name: 'Confirmed'},
    {id: 'Tentative', name: 'Tentative'}
    ];
    $scope.datepickerPopupConfig = {
      datepickerPopup: "MMM d, yyyy",
      closeOnDateSelection: true,
      appendToBody: false,
      showButtonBar: false
    };
    $scope.accountmodel= [];
    $scope.accountFilterModel= [];
    $scope.accountFilteredModel= [];
          $scope.accountsettings = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'attribute_value',
            idProp:'id',
            selectionLimit: 1,
            externalIdProp:'',
            buttonClasses:"smbutton btn btn-default",
            smartButtonMaxItems: 1,
            showUncheckAll :false,

          };
          $scope.accountFilteredSettings = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'account_name',
            idProp:'id',
            selectionLimit: 1,
            externalIdProp:'',
            buttonClasses:"smbutton btn btn-default",
            smartButtonMaxItems: 1,
            showUncheckAll :false,

          };
          $scope.resetfilter = function(){
            $scope.search = '';
            $scope.sortType = false;
            $scope.sortReverse = false;
            $scope.accountmodel = '';
            $scope.accountFilterModel = '';
            // console.log($scope.search);
          };
          $scope.accountFilterEvents = {
            onItemSelect: function(item) {
              $scope.filterByAccount = false;
              $scope.filterByManager = false;
              $scope.filterByRegion = false;
              $scope.filterBySalesStage = false;
              $scope.filterByOwner = false;
              $scope.filterByMarketSize = false;
              $scope.filterByECM = false;
              $scope.filterByACM = false;
              if(item.attribute_value == "Account Name"){
                $scope.filterByAccount = true;
              }else if(item.attribute_value == "Delivery Manager"){
                $scope.filterByManager = true;
              }else if(item.attribute_value == "Region"){
                $scope.filterByRegion = true;
              }else if(item.attribute_value == "Sales Stage"){
                $scope.filterBySalesStage = true;
              }else if(item.attribute_value == "Owner"){
                $scope.filterByOwner = true;
              }else if(item.attribute_value == "Market Size"){
                $scope.filterByMarketSize = true;
              }else if(item.attribute_value == "Expected Close Month"){
                $scope.filterByECM = true;
              }else if(item.attribute_value == "Actual Close Month"){
                $scope.filterByACM = true;
              }
             },
          }
          $scope.accountEvents = {
             onItemSelect: function(item) {
              if(item.attribute_value == "Account Name"){
                $scope.sortType = 'account_name';
                // $scope.sortReverse = 'account_name';
              }else if(item.attribute_value == "Delivery Manager"){
                $scope.sortType = 'manager';
              }else if(item.attribute_value == "Region"){
                $scope.sortType = 'region';
              }else if(item.attribute_value == "Sales Stage"){
                $scope.sortType = 'sales_stage';
              }else if(item.attribute_value == "Owner"){
                $scope.sortType = 'owner';
              }else if(item.attribute_value == "Market Size"){
                $scope.sortType = 'market_size';
              }else if(item.attribute_value == "Expected Close Month"){
                $scope.sortType = 'expected_close_month';
              }else if(item.attribute_value == "Actual Close Month"){
                $scope.sortType = 'actual_close_month';
              }
             },
             onItemDeselect: function(item) {
              $scope.sortType = null;
              },
           };
    function toggle(){
      $scope.variable = !$scope.variable
      console.log($scope.variable);
    }

    $scope.keylength = function(a) {
     var count = 0;
     var i;

     for (i in a) {
        if (a.hasOwnProperty(i)) {
          count++;
        }
      }
     return count;
    }
    $scope.fill = function(a) {
     var count = 0;
     var i;
     var keys = Object.keys(a);
     vm.service=angular.copy(vm.ser[keys[0]]);
    }
    $scope.open = function() {
      $scope.opened = true;
    };
$scope.dateOptions = {
    // dateDisabled: disabled,
    showWeeks: false,
    formatYear: 'yy',
    // maxDate: new Date(2020, 5, 22),
    // minDate: new Date(),
    startingDay: 1
  };
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];
  $scope.serEvents = {
   onItemSelect: function(item) {
    $scope.popup1[item.id] = {
      opened:false
    };
    $scope.popup2[item.id] = {
      opened:false
    };
  },
  onItemDeselect: function(item) {
    if(vm.ser[item.id]){
      if(confirm("Are you sure you want to remove the mapping")){
        delete vm.ser[item.id];
      }else{
        $scope.sermodel.push(item);
      }
    }
  },
};
$scope.open1 = function() {
  $scope.popup1.opened = true;
};
$scope.next = function() {
  $scope.nextv = true;
};
$scope.back = function() {
  $scope.nextv = false;
};
$scope.addaccount = function() {

  $scope.nextv = false;
  vm.ser=[];
  vm.service="";
  $scope.sermodel=[];
  $scope.serIndModel={};
  $scope.cellValue ='';
  $scope.service.accountrangeDates = [];
  $scope.accountrange;
};
$scope.callCurrencyAPI = function() {
  var base="";
  var symbol="";
  if(vm.service && vm.service.anticipated_value_currency == "INR"){
    base="INR";
    symbol="USD";
  }else{
    base="USD";
    symbol="INR";
  }
  UserService.callCurrencyAPI(base,symbol)
  .then(function (response) {
    if(vm.service && vm.service.anticipated_value_currency == "INR"){
      vm.service.anticipated_usd_value = response.data.rates.USD * vm.service.anticipated_value;
      vm.service.actual_usd_value = response.data.rates.USD * vm.service.actual_value;
    }else{
      vm.service.anticipated_value = response.data.rates.INR * vm.service.anticipated_usd_value;
      vm.service.actual_value = response.data.rates.INR * vm.service.actual_usd_value;
    }

  });
};
$scope.popup1={};

$scope.open2 = function() {
  $scope.popup2.opened = true;
};
$scope.popup2={};
$scope.open3 = function() {
  $scope.popup3.opened = true;
};
$scope.popup3={};
$scope.open4 = function() {
  $scope.popup4.opened = true;
};
$scope.popup4={};
$scope.open5 = function() {
  $scope.popup5.opened = true;
};
$scope.popup5={};
$scope.open6 = function() {
  $scope.popup6.opened = true;
};
$scope.popup6={};
$scope.open7 = function() {
  $scope.popup7.opened = true;
};
$scope.popup7={};
$scope.open8 = function() {
  $scope.popup8.opened = true;
};
$scope.popup8={};
$scope.open9 = function() {
  $scope.popup9.opened = true;
};
$scope.popup9={};

$scope.add = function(serdet,ser) {
  vm.ser[ser.id]=angular.copy(serdet);
}
$scope.currencycheck = function() {
  if (typeof vm.service.anticipated_value_currency === "undefined") {
    $scope.USDcur = false;
  }else{
    if(vm.service && vm.service.anticipated_value_currency == "USD"){
      $scope.USDcur = false;
    }else{
      $scope.USDcur = true;
    }
  }

}

  // $scope.popup1[1].opened=false;
  
  // $scope.popup1 = {
  //   opened: false
  // };

  $scope.datepickerConfig = {
    formatDay: 'dd',
    formatMonth: 'MMMM',
    formatYear: 'yyyy',
    formatDayHeader: 'EEE',
    formatDayTitle: 'MMMM yyyy',
    formatMonthTitle: 'yyyy',
    datepickerMode: 'day',
    minMode: 'day',
    maxMode: 'year',
    showWeeks: false,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null
  };
  function convertForecast(){
    if(vm.account.annual_forecast){
          var base="";
          var symbol="";
          if(vm.account.currency == "INR"){
              base="INR";
              symbol="USD";
            }else{
              base="EUR";
              symbol="USD";
            }
          
            
          if(vm.account.currency != "USD"){
            UserService.callCurrencyAPI(base,symbol)
            .then(function (response) {
                $scope.converted_forecast  = response.data.rates.USD * vm.account.annual_forecast;
            });
          }else{
              $scope.converted_forecast  =  vm.account.annual_forecast;
          }
    }
  }
  $scope.changeSowStatus = function () {
    // Change Status to Confirmed or Pending
    if(vm.service.sow_signed_date){
        // this.service.sow_status = '';
        vm.service.sow_status = 'Confirmed';
    }
  }
  $scope.changeTimeZone = function(){
    if(vm.account.region == "APAC"){
      vm.account.time_zone = 'IST';
      vm.account.currency = 'INR';
    }else if(vm.account.region == "EMEA"){
      vm.account.time_zone = 'CET';
      vm.account.currency = 'EUR';
    }else{
      vm.account.time_zone = 'PST';
      vm.account.currency = 'USD';
    }
    convertForecast();
  }
  
  
  $rootScope.availableReqTypes =  [
  {id: 'IMPLEMENTATION', name: 'IMPLEMENTATION'},
  {id: 'CAMPAIGN SERVICES', name: 'CAMPAIGN SERVICES'},
  {id: 'ADD-ONS', name: 'ADD-ONS'}
  ];
   UserService.getAccountMetadata().then(function(response){
    $scope.availableRegionTypes =  response.data.region;
    $scope.availableSalesStage =  response.data.sales_stage;
    $scope.availableProbability =  response.data.closure_probability;
    $scope.availableOwner =  response.data.owner;
    $scope.availableMarketSize =  response.data.market_size;
    $scope.availableCurrency =  response.data.currency;
    $scope.availableTimeZone =  response.data.timezone;
    $scope.availableSowType =  response.data.sow_type;
    $scope.availableSowStatus=  response.data.sow_status;
    $scope.availableAccountSort=  response.data.account_sort;
    
    // $scope.data.availableRegionTypes = $rootScope.availableRegionTypes;
  });
  // $rootScope.availableRegionTypes =  [
  // {id: 'APAC', name: 'APAC'},
  // {id: 'EMEA', name: 'EMEA'},
  // {id: 'US', name: 'US'},
  // {id: 'ALL', name: 'ALL'},
  // ];
  $rootScope.availableContactType =  [
  {id: 'Customer', name: 'Customer'},
  {id: 'Oracle', name: 'Oracle'},
  {id: 'IBM', name: 'IBM'},
  {id: 'Agency', name: 'Agency'},
  ];

  var filtered = [];
  angular.forEach($rootScope.availableContactType, function(item) {
    filtered.push(item);
  });
  filtered.sort(function (a, b) {
    return (a.name > b.name? 1 : -1);
  });
  $rootScope.availableContactType=filtered;

  $rootScope.availableSowStatus =  [
  {id: 'Lead', name: 'Lead'},
  {id: 'SOW Signed', name: 'SOW Signed'},
  {id: 'SOW Not Signed', name: 'SOW Not Signed'},
  {id: 'Closed', name: 'Closed'},
  {id: 'Execution', name: 'Execution'},
  ];

  var filtered = [];
  angular.forEach($rootScope.availableSowStatus, function(item) {
    filtered.push(item);
  });
  filtered.sort(function (a, b) {
    return (a.name > b.name? 1 : -1);
  });
  $rootScope.availableSowStatus=filtered;

  $rootScope.availableAnticipatedValueCurrency =  [
  {id: 'INR', name: 'INR',selected:0},
  {id: 'USD', name: 'USD',selected:1},
  ];

  var d=new Date();
  vm.gridOptions = {
    rowHeight: 30,
    enableHorizontalScrollbar: 2, 
    enableVerticalScrollbar:2,
    columnDefs: [
    { name: 'id',  name: 'E/D', cellTemplate:'<div class="ui-grid-cell-contents"><a href="#/account/edit/{{row.entity.id}}"><button type="button" class="btn btn-xs btn-primary"  ><i class="fa fa-edit"></i></button></a>&nbsp<a href="#/account/delete/{{row.entity.id}}"  ><button type="button" class="btn btn-xs danger-class"  ><i  class="fa fa-trash"></i></button></a></div>', width: 70 },
    { name: 'account_name',minWidth: 260, enableCellEdit: true},
    { name: 'organisational_unit_code' ,displayName:'OU Code',minWidth: 130},
    { name: 'services' ,minWidth: 260},
        // {  name: 'resource_needed',minWidth: 180 },
        { name: 'owner' ,minWidth: 130},
        { name: 'sales_stage' ,minWidth: 130},
        { name: 'manager' ,minWidth: 260},
        { name: 'status',minWidth: 180 },
        { name: 'account_contact' ,minWidth: 400},
        // { name: 'start_date' ,minWidth: 180},
        // { name: 'end_date'  ,minWidth: 180},
        // { name: 'resource_allocated'  ,minWidth: 200},
        // { name: 'request_type' ,minWidth: 260},
        { name: 'region' ,minWidth: 160},
        { name: 'time_zone' ,minWidth: 130},
        { name: 'market_size' ,minWidth: 130},
        { name: 'currency' ,minWidth: 130},
        { name: 'annual_forecast' ,minWidth: 400},
        { name: 'closure_probability' ,minWidth: 400},
        { name: 'weighted_forecast' ,minWidth: 400},
        { name: 'expected_close_month' ,minWidth: 400},
        { name: 'expected_close_date' ,minWidth: 400},
        { name: 'actual_close_month' ,minWidth: 400},
        { name: 'actual_close_date' ,minWidth: 400},
        

        // { name: 'contract_type' ,minWidth: 160},
        // { name: 'customer_contact' ,minWidth: 260},
        // { name: 'other_persons' ,minWidth: 260},
        // { name: 'other_sales_email' ,minWidth: 260},
        // { name: 'sow_status' ,minWidth: 260},
        { name: 'comments' ,minWidth: 400},
        // { name: 'account_lob' ,minWidth: 400},
        // { name: 'overall_health' ,minWidth: 400},
        
        // { name: 'csm_contact' ,minWidth: 400},
        // { name: 'sales_contact' ,minWidth: 400},
        // { name: 'anticipated_value' ,minWidth: 160},
        ],
        enableGridMenu: true,
        enableCellEdit: false,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterCsvFilename: 'OMC_Accounts_'+d.toDateString().split(' ').join('_')+'.csv',
        // exporterPdfDefaultStyle: {fontSize: 9},
        // exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
        // exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
        // exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
        // exporterPdfFooter: function ( currentPage, pageCount ) {
        //   return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        // },
        // exporterPdfCustomFormatter: function ( docDefinition ) {
        //   docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        //   docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        //   return docDefinition;
        // },
        // exporterPdfOrientation: 'portrait',
        // exporterPdfPageSize: 'LETTER',
        // exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function(gridApi){
          $scope.gridApi = gridApi;
        }

      };
      $scope.getTableHeight = function() {
       var rowHeight = 30; // your row height
       var headerHeight = 50; // your header height
       return {
        height: (vm.gridOptions.data.length * rowHeight + headerHeight) + "px"
      };
    };
    // $timeout(function () {
      UserService.getUnits()
      .then(function (response) {
        $rootScope.availOrgan = response.data;
        $scope.data.availableOptions= $rootScope.availOrgan;

        // var filtered = [];
        // angular.forEach($scope.data.availableOptions, function(item) {
        //   filtered.push(item);
        // });
        // filtered.sort(function (a, b) {
        //   return (a.unit_name > b.unit_name? 1 : -1);
        // });
        // $scope.data.availableOptions=filtered;

                            //$scope.data.selectedOption: {id: '1'} 
                            vm.account={};
                             // var strid=String($rootScope.availOrgan[0].id);
                             // vm.account.organisational_unit_id= {id :strid,unit_code: "OMC"};
                             vm.account.organisational_unit_id = $scope.data.availableOptions[0].id;
                             if(vm.account.organisational_unit_id){
                              var oid=vm.account.organisational_unit_id;
                               if(oid !== null){
                                  vm.account.organisational_unit_id = String(oid);
                                }
                              getServices();
                            }
                          });
                         // },3000);
    // $timeout(function () {
      UserService.getManagers()
      .then(function (response) {
        $rootScope.availableManagers = response.data.success;
        $scope.data.availableManagerOptions = $rootScope.availableManagers;
                            //$scope.resdata = response.data;
                          });
                         // },3000);
                         UserService.getAccounts()
                         .then(function (response) {
                           vm.gridOptions.data = response.data;
                         });
                         $scope.account=[];
                         $scope.service=[];
                         $scope.sermodel=[];
                         $scope.serIndModel={};
                         $scope.cellValue ='';
                         $scope.service.accountrangeDates = [];
                         $scope.accountrange;
                         var oldItem="";
                         $scope.serIndEvents = {
                           onItemSelect: function(item) {
                            if(oldItem){
                              vm.ser[oldItem]=angular.copy(vm.service);
                            }
                            oldItem=item.id;
                            vm.service=angular.copy(vm.ser[item.id]);
                          }};
                          $scope.reload = function () {
                            $scope.selectRange = 1;
                            $scope.minEndDate=Math.min.apply(Math, $scope.accountrangeDates);
                            $scope.maxEndDate=Math.max.apply(Math, $scope.accountrangeDates);
                          };
      // function removeaccount() {
      //   alert("sdsd");
      // };
      $scope.removeaccount = function(id) {
        alert(id);
      }; 
      vm.ser=[];
      $rootScope.sersettings  = $scope.sersettings  = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        displayProp:'service_code',
        idProp:'id',
        externalIdProp:'',
        closeOnBlur:true
      };
      $rootScope.serIndsettings  = $scope.serIndsettings  = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        displayProp:'service_code',
        idProp:'id',
        externalIdProp:'',
        closeOnBlur:true,
        selectionLimit: 1,
      };
      function getServices(){
        if(vm.account){
          if (vm.account.organisational_unit_id){
            UserService.getServices(vm.account.organisational_unit_id)
            .then(function (response) {
              if (response.data.success) {
                $scope.serdata = response.data.success;
                var filtered = [];
                angular.forEach($scope.serdata, function(item) {
                  filtered.push(item);
                });
                filtered.sort(function (a, b) {
                  return (a.service_code > b.service_code? 1 : -1);
                });
                $scope.serdata=filtered;
              } 
            });
          }
        }
        
      }
      
      function saveaccount() {

        if($scope.serIndModel){
          if($scope.serIndModel.id){
            vm.ser[$scope.serIndModel.id]=angular.copy(vm.service);            
          }
        }
        vm.dataLoading = true;
        var newserv=[];
        var count=0;
        angular.forEach($scope.sermodel, function (obj) {
                                  if (vm.ser.hasOwnProperty(obj.id)) {
                                    // console.log(obj.id);
                                   vm.ser[obj.id].id=obj.id;
                                 }else{
                                  vm.ser[obj.id] = {};
                                  vm.ser[obj.id].id=obj.id;
                                 }
                                 newserv.push(vm.ser[obj.id]);
                          });
       //  for (var k in vm.ser){
       //    if (vm.ser.hasOwnProperty(k)) {
       //     vm.ser[k].id=k;
       //     newserv.push(vm.ser[k]);
       //     count++;
       //   }
       // }
       if(vm.account.account_name && vm.account.account_code){

        // if(count==$scope.sermodel.length){
          // Checks whether the details of services has been entered for the services selected
          vm.account.services=newserv;
          // vm.account.organisational_unit_id=vm.account.organisational_unit_id.id;
          vm.account.weighted_forecast = $scope.weighted_forecast;
          UserService.saveAccount(vm.account)
          .then(function (response) {
            console.log(response.data.errors);
            var len = Object.keys(response.data.errors).length;
            if (!len) {
             var file = vm.account.accountFile;
             if(file){
              UserService.saveimage(vm.account.account_code,"A",file)
              .then(function (response) {
              });
            }
            FlashService.Success('Save successful', true);
            vm.dataLoading = false;
            $state.go("account", {}, {reload: true});
          } else {
            var key = Object.keys(response.data.errors)
            var str = key[0].split("_").join(" ");
            FlashService.Error(str + " " + response.data.errors[key],true);
            vm.dataLoading = false;
                          // FlashService.Error(response.data.errors);
                          // vm.dataLoading = false;
                        }
                      });
        // }else{
        //   FlashService.Error("Fill all the details for selected services");
        // }
      }else{
        FlashService.Error("Fill Account Name and Account Code");
      }
    }
    function getaccount(aid) {
     UserService.getAccounts()
     .then(function (response) {
       vm.gridOptions.data = response.data;
     });

   }

   $scope.IsVisible = false;
   $scope.ShowHide = function () {
                  //If DIV is visible it will be hidden and vice versa.
                  $scope.IsVisible = $scope.IsVisible ? false : true;
                }
                $scope.data = {
                  repeatSelect: null,
                  statusSelect: null,
                  managerSelect: null,
                  availableOptions: $rootScope.availOrgan,
                  availableStatusOptions: $rootScope.availableStatus,
                  availableManagerOptions: $rootScope.availableManagers,
                  availableReqTypes: $rootScope.availableReqTypes,
                  availableRegionTypes: $rootScope.availableRegionTypes,
                  availableContactType: $rootScope.availableContactType,
                  availableSowStatus: $rootScope.availableSowStatus,
                  availableAnticipatedValueCurrency: $rootScope.availableAnticipatedValueCurrency,
                };
                $scope.message = 'Look! I am an Account page.';

              }


              AccountEditController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
              function AccountEditController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
                var vm=this;
                vm.service="";
                vm.saveaccount = saveaccount;
                vm.getServices=getServices;
                vm.account = [];
                $scope.next = function() {
                   $scope.nextv = true;
                 };
                 $scope.back = function() {
                   $scope.nextv = false;
                 };
                 $scope.changeSowStatus = function () {
                    // Change Status to Confirmed or Pending
                    if(vm.service.sow_signed_date){
                        // this.service.sow_status = '';
                        vm.service.sow_status = 'Confirmed';
                    }
                  }
                var splits=$location.url().toString().split("/");
                UserService.getAccount(splits[splits.length - 1])
                .then(function (response) {
    //               $scope.next = function() {
    //   $scope.nextv = true;
    // };
    // $scope.back = function() {
                  $scope.nextv = false;
    // };
                  if (response.data) {
                    vm.account = response.data;
                    var oid=vm.account.organisational_unit_id;
                     if(oid !== null){
                        vm.account.organisational_unit_id = String(oid);
                      }
                    // vm.account.organisational_unit_id.id =  oid;
                    // vm.account.organisational_unit_id.id =  oid;

                    if(vm.account.anticipated_value){
                      var sp=vm.account.anticipated_value.split(" ");
                      vm.account.anticipated_value=sp[0];
                      vm.account.anticipated_value_currency=sp[1];
                    }
                    UserService.getServices(vm.account.organisational_unit_id)
                    .then(function (response) {
                      if (response.data.success) {
                        $scope.serdata = response.data.success;
                        UserService.getAccountServices(splits[splits.length - 1])
                        .then(function (response) {
                          $scope.sermodel=response.data.service_id;
                          vm.ser = {};
                          angular.forEach(response.data.services, function (obj) {
                            vm.ser[obj[0].service_id]=obj[0];
                          });
                                      // console.log(vm.ser.keys().length);

                                    });
                      } 
                    });
                    UserService.getManagers()
                    .then(function (response) {
                      $rootScope.availableManagers = response.data.success;
                      $scope.data.availableManagerOptions = $rootScope.availableManagers;
                      var rid=vm.account.resource_id;
                      if(rid !== null){
                        vm.account.resource_id = String(rid);
                      }

                            // vm.account.resource_id = {id : rid};
                          });
                  } 
                });

                var oldItem="";
                $scope.serIndEvents = {
                 onItemSelect: function(item) {
                  if(oldItem){
                    vm.ser[oldItem]=angular.copy(vm.service);
                  }
                  oldItem=item.id;
                  vm.service=angular.copy(vm.ser[item.id]);
                },
              };


              function saveaccount() {
               if($scope.serIndModel){
                if($scope.serIndModel.id){
                  vm.ser[$scope.serIndModel.id]=angular.copy(vm.service);            
                }
              }
              vm.dataLoading = true;
              var newserv=[];
              var count=0;
              angular.forEach($scope.sermodel, function (obj) {
                                  if (vm.ser.hasOwnProperty(obj.id)) {
                                    // console.log(obj.id);
                                   vm.ser[obj.id].id=obj.id;
                                 }else{
                                  vm.ser[obj.id] = {};
                                  vm.ser[obj.id].id=obj.id;
                                 }
                                 newserv.push(vm.ser[obj.id]);
                          });
             if(vm.account.account_name && vm.account.account_code){
                vm.account.services=newserv;
                vm.account.weighted_forecast = $scope.weighted_forecast;
              UserService.editAccount(splits[splits.length - 1],vm.account)
              .then(function (response) {
                if (response.data.success) {
                  var file = vm.account.accountFile;
                  if(file){
                    UserService.saveimage(vm.account.account_code,"A",file)
                    .then(function (response) {
                    });
                  }
                  FlashService.Success('Save successful', true);
                  vm.dataLoading = false;
                  $state.go("account", {}, {reload: true});
                } else {
                  if (response.data.errors) {
                    console.log(response.data.errors[0])
                          // var key = Object.keys(response.data.errors)
                          // var str = key[0].split("_").join(" ");
                          FlashService.Error(response.data.errors,true);
                        } else {
                          // FlashService.Error("Error in saving",true);
                          FlashService.Error("Account Code has already been taken",true);
                        }
                        vm.dataLoading = false;
                      }
                    });
            // }else{
            //   FlashService.Error("Fill all the details for selected services");
            // }
          }else{
            FlashService.Error("Fill Account Name and Account Code");
          }
        }
        $scope.currencycheck = function() {
          if (typeof vm.service.anticipated_value_currency === "undefined") {
            $scope.USDcur = false;
          }else{
            if(vm.service && vm.service.anticipated_value_currency == "USD"){
              $scope.USDcur = false;
            }else{
              $scope.USDcur = true;
            }
          }

        }
        $scope.callCurrencyAPI = function() {
          var base="";
          var symbol="";
          if(vm.service && vm.service.anticipated_value_currency == "INR"){
            base="INR";
            symbol="USD";
          }else{
            base="USD";
            symbol="INR";
          }
          UserService.callCurrencyAPI(base,symbol)
          .then(function (response) {
            if(vm.service && vm.service.anticipated_value_currency == "INR"){
              vm.service.anticipated_usd_value = response.data.rates.USD * vm.service.anticipated_value;
              vm.service.actual_usd_value = response.data.rates.USD * vm.service.actual_value;
            }else{
              vm.service.anticipated_value = response.data.rates.INR * vm.service.anticipated_usd_value;
              vm.service.actual_value = response.data.rates.INR * vm.service.actual_usd_value;
            }

          });
        };
        $scope.add = function(serdet,ser) {
          vm.ser[ser.id]=angular.copy(serdet);
        }

        $scope.keylength = function(a) {
         var count = 0;
         var i;

         for (i in a) {
          if (a.hasOwnProperty(i)) {
            count++;
          }
        }
        return count;
      }
      $scope.fill = function(a) {
       var count = 0;
       var i;
       var keys = Object.keys(a);
       vm.service=angular.copy(vm.ser[keys[0]]);
     }


      //     function getServices(){
      //   UserService.getServices(vm.account.organisational_unit_id.id)
      //             .then(function (response) {
      //                 if (response.data.success) {
      //                   $scope.serdata = response.data.success;
      //                 } 
      //             });
      // }
      function getServices(){
        if(vm.account){
          if (vm.account.organisational_unit_id){
            UserService.getServices(vm.account.organisational_unit_id)
            .then(function (response) {
              if (response.data.success) {
                $scope.serdata = response.data.success;
                var filtered = [];
                angular.forEach($scope.serdata, function(item) {
                  filtered.push(item);
                });
                filtered.sort(function (a, b) {
                  return (a.service_code > b.service_code? 1 : -1);
                });
                $scope.serdata=filtered;
              } 
            });
          }
        }
        
      }
      

    }



    AccountDeleteController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
    function AccountDeleteController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
      var vm=this;
      vm.deleteaccount = deleteaccount;

      var splits=$location.url().toString().split("/");
      $scope.deltext="";
      UserService.deleteDependency({"type":"account","data":splits[splits.length - 1]})
      .then(function (response) {
        if(response.data){
          $scope.deltext="The data you are trying to delete has a dependency and will be deleted if you proceed";
        }
      });                       
      function deleteaccount() {
        vm.dataLoading = true;
        UserService.deleteAccount(splits[splits.length - 1])
        .then(function (response) {
          if (response.status==204) {
            FlashService.Success('Delete successful', true);
            vm.dataLoading = false;
            $state.go("account", {}, {reload: true});
          } else {
            FlashService.Error(response.message);
            vm.dataLoading = false;
          }
        });
      }
    }

  }
  )();