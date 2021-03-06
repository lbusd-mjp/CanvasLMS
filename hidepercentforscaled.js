console.log('Hello world.');
// Determine if this is a student course page from url
// thanks to https://dmitripavlutin.com/parse-url-javascript/
const url = new URL(window.location.href);
/*console.log('Hello url.href = ' + url.href); // https://lbschools.beta.instructure.com/courses/2701/grades
console.log('Hello url.pathname = ' + url.pathname); // /courses/2701/grades */
var pathParts = url.pathname.split('/');
/*console.log('Hello pathParts[0] = ' + pathParts[0]); // js array numbering not 0-based?
console.log('Hello pathParts[1] = ' + pathParts[1]); // courses
console.log('Hello pathParts[2] = ' + pathParts[2]); // 2701
console.log('Hello pathParts[3] = ' + pathParts[3]); // grades*/
if(pathParts[1] ==='login' && pathParts[2] ==='canvas') {
	// observer login, change text
	//$('#coenrollment_link > div.ic-Login__banner-title').text('Parent/Guardian/Observer?');
	$('#coenrollment_link').find('.ic-Login__banner-title').text('Parent/Guardian/Observer?');
}
if(pathParts[1] ==='courses' && pathParts[3] ==='grades') {
	// Get course_id from url
	var requestURL = '/api/v1/courses/' + pathParts[2] + '/settings'

	// Get grading_standard_id from API
	var request = new XMLHttpRequest();
	request.open('GET', requestURL, true);
	request.onload = function () {
		//console.log(this.response);
	  // need to cut 'while(1);' from response
	  var closer = this.response.replace('while(1);','');
		//console.log(closer);
	  // Begin accessing JSON data here
	  var data = JSON.parse(closer);
		//console.log(data);
	  if (request.status >= 200 && request.status < 400) {
			console.log("data.grading_standard_id = " + data.grading_standard_id);
			// 'Elementary Scale Grading (LBUSD)' has id = 5574 was 118
			// 'Secondary Scale Grading (LBUSD)' has id = 2
			if(data.grading_standard_id === 2 || data.grading_standard_id === 5574){
				// Apply css to specific elements
				$('#submission_final-grade .score_holder').hide();
				$('#student-grades-right-content .grade').hide()
				$('tr.group_total span.grade').hide()
				/* The line below hides percentage in the 'Total' row for student grade page
				#submission_final-grade .score_holder {display:none;}*/
				/* The line below hides percentage in the 'Total' grade with letter grade for student grade page
				#student-grades-right-content .grade {display:none;}*/
				/* The line below hides percentage in the summary row for each assignment type for student grade page
				tr.group_total span.grade {display:none;}*/			
			}
	  } else {
			console.log("Gah, it's not working!");
	  }
	}
	request.send();
	
}
/* This test for jquery was positive on the beta site 2020-08-20, 4 PM
window.onload = function() {
    if (window.jQuery) {  
        // jQuery is loaded  
        alert("Yeah!");
    } else {
        // jQuery is not loaded
        alert("Doesn't Work");
    }
}
*/
// Updated Aug 28, 2019
// In Google Analytics you'll need to set up custom dimensions as follows
// Custom Dimension 1 = Canvas User ID --- Scope = User
// Custom Dimension 2 = Archived --- Scope = User
// Custom Dimension 3 = Canvas User Role --- Scope = User
// Custom Dimension 4 = Canvas Course ID --- Scope = Hit
// Custom Dimension 5 = Canvas Course Name --- Scope = Hit
// Custom Dimension 6 = Canvas Sub-Account ID --- Scope = Hit
// Custom Dimension 7 = Canvas Term ID --- = Scope = Hit
// Custom Dimension 8 = Canvas Course Role --- Scope = Hit

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'custom_ga');

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        localStorage.removeItem(key + '_expiresIn');
    } catch (e) {
        console.log('removeStorage: Error removing key [' + key + '] from localStorage: ' + JSON.stringify(e));
        return false;
    }
    return true;
}

function getStorage(key) {
    var now = Date.now(); //epoch time, lets deal only with integer
    // set expiration for storage
    var expiresIn = localStorage.getItem(key + '_expiresIn');
    if (expiresIn === undefined || expiresIn === null) {
        expiresIn = 0;
    }

    if (expiresIn < now) { // Expired
        removeStorage(key);
        return null;
    } else {
        try {
            var value = localStorage.getItem(key);
            return value;
        } catch (e) {
            console.log('getStorage: Error reading key [' + key + '] from localStorage: ' + JSON.stringify(e));
            return null;
        }
    }
}

function setStorage(key, value, expires) {
    if (expires === undefined || expires === null) {
        expires = (24 * 60 * 60); // default: seconds for 6 hours (6*60*60)
    } else {
        expires = Math.abs(expires); //make sure it's positive
    }

    var now = Date.now(); //millisecs since epoch time, lets deal only with integer
    var schedule = now + expires * 1000;
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule);
    } catch (e) {
        console.log('setStorage: Error setting key [' + key + '] in localStorage: ' + JSON.stringify(e));
        return false;
    }
    return true;
}

async function coursesRequest(courseId) {
    // 
    let response = await fetch('/api/v1/users/self/courses?per_page=100');
    let data = await response.text();
    data = data.substr(9);
    data = JSON.parse(data)
    var stringData = JSON.stringify(data)
    setStorage('ga_enrollments', stringData, null)
    var course = parseCourses(courseId, stringData)
    return course
};

function parseCourses(courseId, courseData) {
    if (courseData != undefined) {
        let data = JSON.parse(courseData);
        //console.log(data)
        for (var i = 0; i < data.length; i++) {
            // console.log(data[i]['id'] + " " + courseId)
            if (data[i]['id'] == courseId) {
                return data[i]
            }
        }
    }
    return null
}

function gaCourseDimensions(course) {
    custom_ga('set', 'dimension4', course['id']);
    custom_ga('set', 'dimension5', course['name']);
    custom_ga('set', 'dimension6', course['account_id']);
    custom_ga('set', 'dimension7', course['enrollment_term_id']);
    custom_ga('set', 'dimension8', course['enrollments'][0]['type']);
    custom_ga('send', 'pageview');
    return
}

function googleAnalyticsCode(trackingID) {
    var userId, userRoles, attempts, courseId;
    custom_ga('create', trackingID, 'auto');
    userId = ENV["current_user_id"];
    userRoles = ENV['current_user_roles'];
    custom_ga('set', 'userId', userId);
    custom_ga('set', 'dimension1', userId);
    custom_ga('set', 'dimension3', userRoles);
    courseId = window.location.pathname.match(/\/courses\/(\d+)/);
    if (courseId) {
        courseId = courseId[1];
        attempts = 0;
        try {
            let courses = getStorage('ga_enrollments')
            if (courses != null) {
                var course = parseCourses(courseId, courses);
                if (course === null) {
                    // console.log("course_id not found in cache, retrieving...")
                    coursesRequest(courseId).then(course => {
                        if (course === null) {
                            // console.log("course data not found")
                            custom_ga('set', 'dimension4', courseId);
                            custom_ga('send', 'pageview');
                        } else {
                            gaCourseDimensions(course)
                        }
                    });
                } else {
                    // console.log("course found in cache")
                    gaCourseDimensions(course)
                }
            } else {
                // console.log("cache not found, retrieving cache data")
                coursesRequest(courseId).then(course => {
                    if (course === null) {
                        // console.log("course data not found")
                        custom_ga('set', 'dimension4', courseId);
                        custom_ga('send', 'pageview');
                    } else {
                        gaCourseDimensions(course)
                    }
                });
            }
        } catch (err) {
            attempts += 1;
            if (attempts > 5) {
                custom_ga('set', 'dimension4', courseId);
                custom_ga('send', 'pageview');
                return;
            };
        };
    } else {
        custom_ga('send', 'pageview');
    };
};

googleAnalyticsCode("UA-177590263-1") // replace google analytics tracking id here