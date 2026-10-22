/* ===== Admin-side controllers ===== */

festApp.controller('AdminLoginCtrl', ['$scope', 'AuthService', '$window', function ($scope, AuthService, $window) {
  $scope.creds = { email: '', password: '' };
  $scope.error = '';
  $scope.showPw = false;
  $scope.togglePw = function () { $scope.showPw = !$scope.showPw; };

  $scope.submit = function () {
    $scope.error = '';
    AuthService.loginAdmin($scope.creds.email, $scope.creds.password).then(
      function (res) {
        AuthService.saveSession(res.data.token, res.data.user);
        $window.location.href = 'dashboard.html';
      },
      function (err) {
        $scope.error = (err.data && err.data.message) || 'Login failed.';
      }
    );
  };
}]);

festApp.controller('AdminDashboardCtrl', ['$scope', 'AuthService', 'ApiService', function ($scope, AuthService, ApiService) {
  AuthService.requireAdmin();
  $scope.user = AuthService.getUser();
  $scope.stats = {};
  $scope.recentActivities = [
    { text: 'Renu applied for Technical activies', date: '14 may26' },
    { text: 'Arun Allocated to hospitality team', date: '26 may26' },
    { text: 'New opportunity for stage Crew', date: '21 may26' },
  ];

  ApiService.getAdminStats().then(function (res) { $scope.stats = res.data; });

  $scope.logout = AuthService.logout;
}]);

festApp.controller('AdminVolunteersCtrl', ['$scope', 'ApiService', 'AuthService', '$window', function ($scope, ApiService, AuthService, $window) {
  AuthService.requireAdmin();
  $scope.user = AuthService.getUser();
  $scope.volunteers = [];
  $scope.search = '';

  ApiService.getAllVolunteers().then(function (res) { $scope.volunteers = res.data; });

  $scope.openVolunteer = function (v) {
    $window.location.href = 'volunteer-detail.html?id=' + v._id;
  };

  $scope.logout = AuthService.logout;
}]);

festApp.controller('AdminVolunteerDetailCtrl', ['$scope', 'ApiService', 'AuthService', '$window', '$location', function ($scope, ApiService, AuthService, $window, $location) {
  AuthService.requireAdmin();
  $scope.user = AuthService.getUser();
  $scope.volunteer = {};
  $scope.applications = [];

  var params = new URLSearchParams($window.location.search);
  var volunteerId = params.get('id');

  if (volunteerId) {
    ApiService.getVolunteer(volunteerId).then(function (res) { $scope.volunteer = res.data; });
    ApiService.getApplicationsForVolunteer(volunteerId).then(function (res) { $scope.applications = res.data; });
  }

  $scope.badgeClass = function (status) {
    if (status === 'Selected') return 'badge-selected';
    if (status === 'Rejected') return 'badge-rejected';
    return 'badge-review';
  };

  $scope.setStatus = function (app, status) {
    ApiService.updateApplicationStatus(app._id, status).then(function (res) {
      app.status = res.data.status;
    });
  };

  $scope.goBack = function () { $window.location.href = 'volunteers.html'; };
  $scope.logout = AuthService.logout;
}]);

festApp.controller('AdminRoleAllocationCtrl', ['$scope', 'ApiService', 'AuthService', function ($scope, ApiService, AuthService) {
  AuthService.requireAdmin();
  $scope.user = AuthService.getUser();
  $scope.volunteers = [];
  $scope.form = { volunteer: '', volunteerRole: 'Technical Role', teamArea: '', startDate: '', endDate: '' };
  $scope.roles = ['Technical Role', 'Event Management Role', 'Hospitality Role', 'Media & PR Role'];
  $scope.successMsg = '';

  ApiService.getAllVolunteers().then(function (res) { $scope.volunteers = res.data; });

  $scope.assign = function () {
    $scope.successMsg = '';
    ApiService.assignRole($scope.form).then(function () {
      $scope.successMsg = 'Role assigned successfully!';
      $scope.form = { volunteer: '', volunteerRole: 'Technical Role', teamArea: '', startDate: '', endDate: '' };
    });
  };

  $scope.logout = AuthService.logout;
}]);

festApp.controller('AdminOpportunitiesCtrl', ['$scope', 'ApiService', 'AuthService', function ($scope, ApiService, AuthService) {
  AuthService.requireAdmin();
  $scope.user = AuthService.getUser();
  $scope.opportunities = [];
  $scope.newOpp = { title: '', description: '', openings: 1, icon: '🎪', category: 'General' };
  $scope.showForm = false;

  function load() { ApiService.getOpportunities().then(function (res) { $scope.opportunities = res.data; }); }
  load();

  $scope.addOpportunity = function () {
    ApiService.createOpportunity($scope.newOpp).then(function () {
      $scope.newOpp = { title: '', description: '', openings: 1, icon: '🎪', category: 'General' };
      $scope.showForm = false;
      load();
    });
  };

  $scope.removeOpportunity = function (opp) {
    ApiService.deleteOpportunity(opp._id).then(load);
  };

  $scope.logout = AuthService.logout;
}]);

festApp.controller('AdminAnnouncementsCtrl', ['$scope', 'ApiService', 'AuthService', function ($scope, ApiService, AuthService) {
  AuthService.requireAdmin();
  $scope.user = AuthService.getUser();
  $scope.announcements = [];
  $scope.newAnn = { title: '', message: '' };
  $scope.showForm = false;

  function load() { ApiService.getAnnouncements().then(function (res) { $scope.announcements = res.data; }); }
  load();

  $scope.addAnnouncement = function () {
    ApiService.createAnnouncement($scope.newAnn).then(function () {
      $scope.newAnn = { title: '', message: '' };
      $scope.showForm = false;
      load();
    });
  };

  $scope.removeAnnouncement = function (a) {
    ApiService.deleteAnnouncement(a._id).then(load);
  };

  $scope.logout = AuthService.logout;
}]);

festApp.controller('AdminReportsCtrl', ['$scope', 'ApiService', 'AuthService', function ($scope, ApiService, AuthService) {
  AuthService.requireAdmin();
  $scope.user = AuthService.getUser();
  $scope.stats = {};
  $scope.roleAllocations = [];

  ApiService.getAdminStats().then(function (res) { $scope.stats = res.data; });
  ApiService.getAllRoleAllocations().then(function (res) { $scope.roleAllocations = res.data; });

  $scope.logout = AuthService.logout;
}]);
