console.log('Hello world.');
// Determine if this is a student course page from url
// Get course_id from url
// Get grading_standard_id from API
/*
	$.getJSON("/api/v1/courses/:courseID/pages", function(data) { x = data; });

		  for (i in x) {

							console.log(x[i]["title"] + " - " + x[i]["published"]);

	}
$.getJSON("/api/v1/courses/18/settings", function(data) { x = data; });

      for (i in x) {

                        console.log("grading_standard_id = " + x[i]["grading_standard_id"]);

}
const userAction = async () => {
  const response = await fetch('/api/v1/courses/18/settings');
  const myJson = await response.json(); //extract JSON from the http response
  // do something with myJson
	console.log(myJson);
}
*/
var request = new XMLHttpRequest();
request.open('GET', '/api/v1/courses/18/settings', true);
request.onload = function () {
	console.log(this.response);
  // need to cut 'while(1);' from response
  var closer = this.response.replace('while(1);','');
	console.log(closer);
  // Begin accessing JSON data here
  var data = JSON.parse(closer);
	console.log(data);
  if (request.status >= 200 && request.status < 400) {
 		console.log("data.grading_standard_id = " + data.grading_standard_id);
  } else {
		console.log("Gah, it's not working!");
  }
}
request.send();
// Apply css to specific elements