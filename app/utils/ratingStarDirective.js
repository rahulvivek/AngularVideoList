angular.module('Utils.RatingStart', [])
	.directive('starRating', [ '$parse', function($parse) {
		// Directive to show rating stars.
		return {
	        restrict: 'E',
	        require: 'ngModel',
	        template: '<ul class="rating">' +
	            '<li ng-repeat="star in stars" ng-click="selectRating($index)" ng-class="star">' +
	            '\u2605' +
	            '</li>' +
	            '</ul>',
	        replace: true,
	        scope: {
	            ratingValue: '=',
	            max: '=',
	            currentValue: '=',
	            updateparent: '&',
	            canUpdate: "=",
	        },

	        link: function (scope, elem, attrs, ngModel) {
	        	function rederStars(rating) {
	        		scope.stars = [];
		            for (var i = 0; i < scope.max; i++) {
		                scope.stars.push({
		                    filled: i < rating
		                });
		            }
	        	}

	        	rederStars(scope.ratingValue);
	            

	            scope.selectRating = function(index) {
	            	// this method is used to get the user selected 
	            	// rating.

	            	if (scope.canUpdate) {
	            		ngModel.$setViewValue(index + 1);
		            	ngModel.$render();
		            	rederStars(index + 1);
				        scope.updateparent();
	            	}
	            	
	            };
	        }
	    };
	}]);
