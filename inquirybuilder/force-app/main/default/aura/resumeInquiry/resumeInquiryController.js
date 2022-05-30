({
	init : function(component, Id) {
		helper.resumeInquiry(component, Id);
	 },

	 statusChange: function(component, event) {
		// When the interview finishes, close the overlay
		if(event.getParam("status").includes("FINISHED")) {
		   component.get("v.overlay").close();
		}
	 },


	handleClick: function(component,event,helper){

		var accessCode = component.get("v.accessCode");
		console.log('Access code' +accessCode);
		helper.resumeInquiry(component);
		

	}
})