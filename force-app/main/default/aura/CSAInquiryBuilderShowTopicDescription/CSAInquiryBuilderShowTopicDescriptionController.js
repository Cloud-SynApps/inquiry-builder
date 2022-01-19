({  
	component2Event : function(component, event, helper) {
        //show.showHelper(component,event,helper);
       // component.set("v.topicdescription", "");
      var desc= event.getParam("displaytopicdescription");
       // alert(desc);
        
            component.set("v.topicdescription",desc);
        
        
      //  alert(JSON.stringify(component.get("v.topicdescription")));
    }
})