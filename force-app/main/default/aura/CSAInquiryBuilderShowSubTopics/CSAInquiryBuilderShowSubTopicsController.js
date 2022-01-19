({
    doInit : function(component, event, helper) {
        var action=component.get("c.getInquirySubTopics");
        action.setParams({Inquirytopic: component.get("v.InquiryTopic"), subtopic: component.get("v.subtopic"), level: component.get("v.level")});
        action.setCallback(this,function(response){
            var state = response.getState();
           // alert(state + "subtopicinitfunction");
            if (state==="SUCCESS"){
               // alert(JSON.stringify(response.getReturnValue()));
                component.set("v.subtopiclist",response.getReturnValue());
                var readsubtopic = component.get("v.subtopiclist");
                var index = readsubtopic.length;
                var radiooptions = [];
                for(var i=0;i<index;i++){
                    radiooptions.push({label: readsubtopic[i].Name, value: readsubtopic[i].Name});
                }
                component.set("v.options",radiooptions);
               // alert(JSON.stringify(component.get("v.options")));
            }
        });
        $A.enqueueAction(action);
    },
    
    handlechange : function(component,event,helper){
    
        var changevalue = event.getParam("value");
       // alert(changevalue + "is the new sub topic");
       component.set("v.seltopic",changevalue);
       var readsubtopic = component.get("v.subtopiclist");
        var index = readsubtopic.length;
        for(var i=0;i<index;i++){
            if(readsubtopic[i].Name===changevalue){
               component.set("v.topicDescription",readsubtopic[i].Sub_Topic_Description__c) ;
               component.set("v.nexttopicenabled",readsubtopic[i].Next__c); 
               component.set("v.subtopic",readsubtopic[i].Id);
               component.set("v.stepid",readsubtopic[i].Steps__c);
            }
        } 
       // alert(component.get("v.subtopic")+ "SUBTOPIC IS")
        var appEvent=$A.get("e.c:CSAInquiryBuilderApplEvent");
      //  alert(component.get("v.seltopic"));
        appEvent.setParams({"displaytopicdescription" : component.get("v.topicDescription"),"titlekeyword" : component.get("v.seltopic")});
        appEvent.fire(); 
}
})