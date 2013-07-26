var tsession = require("temboo/core/temboosession")
  , Google = require("temboo/Library/Google/Calendar")
  ,	dateFormat = require('dateformat')
  , session = new tsession.TembooSession("fertroya", "nuevatroya", "8d736539-2405-403c-8");

TembooHelper = function(){};

/** ------------------------ TEMBOO & CALENDAR ------------------------*/
TembooHelper.prototype.createEvent = function(eventData, token){

	// You'll need a single TembooSession object in your code, eg:
	

	var createEventChoreo = new Google.CreateEvent(session);

	// Instantiate and populate the input set for the choreo
	var createEventInputs = createEventChoreo.newInputSet();
	createEventInputs.set_AccessToken(token);
	createEventInputs.set_CalendarID(eventData.calendarId);

	var eventComment = eventData.comment || "Ninguna.";
	// Set inputs
	createEventInputs.set_EventTitle(eventData.title);
	createEventInputs.set_EventLocation(eventData.contactInfo);
	createEventInputs.set_EventDescription("CONTACTO:"+eventData.contactInfo+". CONSULTA: "+ eventComment);
	var startDate = new Date(Date.parse(eventData.start))
	var endDate = new Date(Date.parse(eventData.end));
	

	createEventInputs.set_StartDate(dateFormat(startDate,'yyyy-mm-dd'));
	createEventInputs.set_StartTime(dateFormat(startDate,'HH:MM:ss'));
	
	createEventInputs.set_EndDate(dateFormat(endDate,'yyyy-mm-dd'));
	createEventInputs.set_EndTime(dateFormat(endDate,'HH:MM:ss'));

	createEventChoreo.execute(
		createEventInputs,
		function(results){console.log(results.get_CreateEvent());},
		function(error){console.log(error.type); console.log(error.message);}
		);
	// Run the choreo, specifying success and error callback handlers
	/*console.log(dateFormat(startDate,'yyyy-mm-dd'), dateFormat(startDate,'HH:mm:ss'));
	*/
}

TembooHelper.prototype.getAllEvents = function(callback, token){

	var getAllEventsChoreo = new Google.GetAllEvents(session);

	// Instantiate and populate the input set for the choreo
	var getAllEventsInputs = getAllEventsChoreo.newInputSet();

	// Set inputs
	getAllEventsInputs.set_AccessToken(token);
	getAllEventsInputs.set_CalendarID(this.calendarId);

	// Run the choreo, specifying success and error callback handlers
	getAllEventsChoreo.execute(
	    getAllEventsInputs,
	    function(results){callback(results.get_Response())},
	    function(error){console.log(error.type); console.log(error.message);}
	);

}

exports.TembooHelper = TembooHelper;