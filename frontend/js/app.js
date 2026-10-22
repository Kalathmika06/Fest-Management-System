/* ===== Fest Volunteer — AngularJS app module ===== */
var festApp = angular.module('festApp', []);

// Base URL of the backend API (same origin since Express serves the frontend too)
festApp.constant('API_URL', '/api');

// Attach JWT token to every outgoing request automatically
festApp.factory('authInterceptor', ['$window', function ($window) {
  return {
    request: function (config) {
      var token = $window.localStorage.getItem('festToken');
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
  };
}]);

festApp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);

// ---------- Auth service: login/register/logout/session helpers ----------
festApp.service('AuthService', ['$http', '$window', 'API_URL', function ($http, $window, API_URL) {
  this.registerVolunteer = function (data) {
    return $http.post(API_URL + '/auth/register', data);
  };

  this.loginVolunteer = function (identifier, password) {
    return $http.post(API_URL + '/auth/login', { identifier: identifier, password: password });
  };

  this.loginAdmin = function (email, password) {
    return $http.post(API_URL + '/auth/admin-login', { email: email, password: password });
  };

  this.saveSession = function (token, user) {
    $window.localStorage.setItem('festToken', token);
    $window.localStorage.setItem('festUser', JSON.stringify(user));
  };

  this.getUser = function () {
    var raw = $window.localStorage.getItem('festUser');
    return raw ? JSON.parse(raw) : null;
  };

  this.logout = function () {
    $window.localStorage.removeItem('festToken');
    $window.localStorage.removeItem('festUser');
    $window.location.href = 'login.html';
  };

  this.isLoggedIn = function () {
    return !!$window.localStorage.getItem('festToken');
  };

  this.requireVolunteer = function () {
    var user = this.getUser();
    if (!this.isLoggedIn() || !user || user.role !== 'volunteer') {
      $window.location.href = 'login.html';
    }
  };

  this.requireAdmin = function () {
    var user = this.getUser();
    if (!this.isLoggedIn() || !user || user.role !== 'admin') {
      $window.location.href = 'login.html';
    }
  };
}]);

// ---------- Generic API service for all REST resources ----------
festApp.service('ApiService', ['$http', 'API_URL', function ($http, API_URL) {
  this.getOpportunities = function () { return $http.get(API_URL + '/opportunities'); };
  this.createOpportunity = function (data) { return $http.post(API_URL + '/opportunities', data); };
  this.deleteOpportunity = function (id) { return $http.delete(API_URL + '/opportunities/' + id); };

  this.applyToOpportunity = function (opportunityId) {
    return $http.post(API_URL + '/applications', { opportunity: opportunityId });
  };
  this.getMyApplications = function () { return $http.get(API_URL + '/applications/mine'); };
  this.getApplicationsForVolunteer = function (volunteerId) {
    return $http.get(API_URL + '/applications/volunteer/' + volunteerId);
  };
  this.updateApplicationStatus = function (id, status) {
    return $http.put(API_URL + '/applications/' + id, { status: status });
  };

  this.getAnnouncements = function () { return $http.get(API_URL + '/announcements'); };
  this.createAnnouncement = function (data) { return $http.post(API_URL + '/announcements', data); };
  this.deleteAnnouncement = function (id) { return $http.delete(API_URL + '/announcements/' + id); };

  this.getAllVolunteers = function () { return $http.get(API_URL + '/volunteers'); };
  this.getVolunteer = function (id) { return $http.get(API_URL + '/volunteers/' + id); };
  this.getMyProfile = function () { return $http.get(API_URL + '/volunteers/me/profile'); };
  this.updateMyProfile = function (data) { return $http.put(API_URL + '/volunteers/me/profile', data); };
  this.getAdminStats = function () { return $http.get(API_URL + '/volunteers/stats/admin'); };
  this.getMyStats = function () { return $http.get(API_URL + '/volunteers/stats/mine'); };

  this.getAllRoleAllocations = function () { return $http.get(API_URL + '/role-allocation'); };
  this.getMyRoleAllocations = function () { return $http.get(API_URL + '/role-allocation/mine'); };
  this.assignRole = function (data) { return $http.post(API_URL + '/role-allocation', data); };
}]);
