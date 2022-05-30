({
	init : function(component, event, helper) {
		helper.populateTable(component, event, helper);
	 },
	  
	 handleMenuSelect: function(component, event, helper) {
		// Figure out which action was selected
		var interviewAction = event.getParam("value").split(".");
		if(interviewAction.includes("resume")) {
		   helper.handleShowModal(component, interviewAction[0]);
		} else if(interviewAction.includes("delete")) {
		   helper.handleDelete(component, event, helper, interviewAction[0]);
		}
	 },
	 
	 statusChange: function(component, event) {
		// When the interview finishes, close the overlay
		if(event.getParam("status").includes("FINISHED")) {
		   component.get("v.overlay").close();
		}
	 },


	 handleClick: function(component,event){

		var accessCode = component.get("v.accessCode");
		var access = 'test';
		console.log('Access code' +accessCode);
		console.log('Access code' +access);

	 }
})