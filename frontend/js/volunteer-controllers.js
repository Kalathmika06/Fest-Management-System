/* ===== Volunteer-side controllers ===== */

festApp.controller('VolLoginCtrl', ['$scope', 'AuthService', '$window', function ($scope, AuthService, $window) {
  $scope.creds = { identifier: '', password: '' };
  $scope.error = '';
  $scope.showPw = false;

  $scope.togglePw = function () { $scope.showPw = !$scope.showPw; };

  $scope.submit = function () {
    $scope.error = '';
    if (!$scope.creds.identifier || !$scope.creds.password) {
      $scope.error = 'Please enter your email/register number and password.';
      return;
    }
    AuthService.loginVolunteer($scope.creds.identifier, $scope.creds.password).then(
      function (res) {
        AuthService.saveSession(res.data.token, res.data.user);
        $window.location.href = 'dashboard.html';
      },
      function (err) {
        $scope.error = (err.data && err.data.message) || 'Login failed. Please try again.';
      }
    );
  };
}]);

festApp.controller('VolRegisterCtrl', ['$scope', 'AuthService', '$window', function ($scope, AuthService, $window) {
  $scope.data = { fullName: '', registerNo: '', department: '', email: '', password: '', confirmPassword: '' };
  $scope.departments = ['Information Technology', 'Computer Science', 'ECE', 'EEE', 'Mechanical', 'Civil'];
  $scope.agree = false;
  $scope.error = '';

  $scope.submit = function () {
    $scope.error = '';
    if (!$scope.agree) { $scope.error = 'Please agree to the terms & conditions.'; return; }
    if ($scope.data.password !== $scope.data.confirmPassword) {
      $scope.error = 'Passwords do not match.'; return;
    }
    AuthService.registerVolunteer($scope.data).then(
      function (res) {
        AuthService.saveSession(res.data.token, res.data.user);
        $window.location.href = 'dashboard.html';
      },
      function (err) {
        $scope.error = (err.data && err.data.message) || 'Registration failed.';
      }
    );
  };
}]);

festApp.controller('VolDashboardCtrl', ['$scope', 'AuthService', 'ApiService', function ($scope, AuthService, ApiService) {
  AuthService.requireVolunteer();
  $scope.user = AuthService.getUser();
  $scope.stats = {};
  $scope.announcements = [];

  ApiService.getMyStats().then(function (res) { $scope.stats = res.data; });
  ApiService.getAnnouncements().then(function (res) { $scope.announcements = res.data.slice(0, 3); });

  $scope.logout = AuthService.logout;
}]);

festApp.controller('VolOpportunitiesCtrl', ['$scope', 'AuthService', 'ApiService', function ($scope, AuthService, ApiService) {
  AuthService.requireVolunteer();
  $scope.user = AuthService.getUser();
  $scope.opportunities = [];
  $scope.appliedIds = [];
  $scope.search = '';
  $scope.category = 'All Categories';
  $scope.categories = [];

  function loadData() {
    ApiService.getOpportunities().then(function (res) {
      $scope.opportunities = res.data;
      var seen = {};
      $scope.categories = [];
      res.data.forEach(function (o) {
        if (o.category && !seen[o.category]) { seen[o.category] = true; $scope.categories.push(o.category); }
      });
    });
    ApiService.getMyApplications().then(function (res) {
      $scope.appliedIds = res.data.map(function (a) { return a.opportunity._id; });
    });
  }
  loadData();

  $scope.hasApplied = function (oppId) { return $scope.appliedIds.indexOf(oppId) !== -1; };

  $scope.apply = function (opp) {
    ApiService.applyToOpportunity(opp._id).then(function () {
      $scope.appliedIds.push(opp._id);
    });
  };

  $scope.logout = AuthService.logout;
}]);

festApp.controller('VolApplicationsCtrl', ['$scope', 'AuthService', 'ApiService', function ($scope, AuthService, ApiService) {
  AuthService.requireVolunteer();
  $scope.user = AuthService.getUser();
  $scope.applications = [];

  ApiService.getMyApplications().then(function (res) { $scope.applications = res.data; });

  $scope.badgeClass = function (status) {
    if (status === 'Selected') return 'badge-selected';
    if (status === 'Rejected') return 'badge-rejected';
    return 'badge-review';
  };

  $scope.logout = AuthService.logout;
}]);

festApp.controller('VolProfileCtrl', ['$scope', 'AuthService', 'ApiService', function ($scope, AuthService, ApiService) {
  AuthService.requireVolunteer();
  $scope.user = AuthService.getUser();
  $scope.profile = {};
  $scope.editing = false;

  ApiService.getMyProfile().then(function (res) { $scope.profile = res.data; });

  $scope.startEdit = function () { $scope.editing = true; };
  $scope.saveProfile = function () {
    ApiService.updateMyProfile($scope.profile).then(function (res) {
      $scope.profile = res.data;
      $scope.editing = false;
    });
  };

  $scope.logout = AuthService.logout;
}]);

festApp.controller('VolAnnouncementsCtrl', ['$scope', 'AuthService', 'ApiService', function ($scope, AuthService, ApiService) {
  AuthService.requireVolunteer();
  $scope.user = AuthService.getUser();
  $scope.announcements = [];

  ApiService.getAnnouncements().then(function (res) { $scope.announcements = res.data; });

  $scope.logout = AuthService.logout;
}]);
