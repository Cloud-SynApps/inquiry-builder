({
	resumeInquiry : function(component) {
        var action = component.get("c.getInterviews");
        action.setParams({
            recordId: component.get("v.accessCode")
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
			console.log('sdfsdf',response);
            if (state === "SUCCESS") {
				console.log('--->',response.getReturnValue());
				console.log('--->1',response.getReturnValue()[0].Id);
				console.log('--->2',response.getReturnValue()[0].ParentId);
				var flowId = response.getReturnValue()[0].ParentId;	
				this.handleShowModal(component,flowId);
                //var recordRelations = response.getReturnValue();
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.log(errors);
            }
        }));
        $A.enqueueAction(action);
    },

	handleShowModal: function (component,flowId) {
		console.log('inside showmodal');
        // On resume, render the interview in a modal
        $A.createComponent("lightning:flow", {"onstatuschange": component.get("c.statusChange")},
            function (content, status) {
				console.log('inside function' +status);
                if (status == "SUCCESS") {
					console.log('inside if');
					console.log('flowId111',flowId);
                    component.find('overlayLib').showCustomModal({
                        body: content,
                        showCloseButton: true,
                        closeCallback: function () {
                            $A.get('e.force:refreshView').fire();
                        }
                    }).then(function(overlay) {
                        // Use to close the modal later
                        component.set("v.overlay", overlay);
                    });
					console.log('flowId',flowId);
                    content.resumeFlow(flowId);
					
                }
            });
    },
})