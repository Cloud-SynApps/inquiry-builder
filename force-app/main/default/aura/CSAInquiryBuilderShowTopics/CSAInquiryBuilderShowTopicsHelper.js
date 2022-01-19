({
	doInitHelper : function(component,event,helper) {
        
        var action=component.get("c.getInquiryTopics");
        action.setParams({});
        action.setCallback(this,function(response){
                           var state = response.getState();
        if (state==="SUCCESS"){
            component.set("v.Topics",response.getReturnValue());
          //  alert(JSON.stringify(component.get("v.Topics")));
        }
                           });
        $A.enqueueAction(action);
        		
	},
    
    changeTopicHelper : function(component,event,helper){
     
    	var seltopc= event.getSource().get("v.value");
        component.set("v.seltopic",seltopc);
   
        var readtopics = component.get("v.Topics");
        var index= readtopics.length;
        for (var i=0;i<index;i++){   
            if(readtopics[i].Name === seltopc){
                
                component.set("v.topicDescription",readtopics[i].Inquiry_Topic_Description__c);
             //   alert(component.get("v.topicDescription"));
                
                
            }
            
        }
      
       var appEvent=$A.get("e.c:CSAInquiryBuilderApplEvent");
      //  alert(component.get("v.seltopic"));
        appEvent.setParams({"displaytopicdescription" : component.get("v.topicDescription"),"titlekeyword" : component.get("v.seltopic")});
        appEvent.fire(); 
        
    }
})