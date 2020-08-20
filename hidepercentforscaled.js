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
			// 'Elementary Scale Grading (LBUSD)' has id = 118
			// 'Secondary Scale Grading (LBUSD)' has id = 2
			if(data.grading_standard_id === 2 || data.grading_standard_id === 118){
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
