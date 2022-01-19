({
	doInitHelper : function(component, event, helper) {
        
        component.set('v.mycolumns',[{label:'Knowledge Article', fieldName: 'linkTitle', type: 'url',
                                      typeAttributes:{label:{fieldName:'Title'},target:'_blank'}}]);
        var tempvar = component.get("v.titlekeyword");
      //  alert(component.get("v.titlekeyword"));
        var action = component.get("c.getKnowledgeArticles");
        action.setParams({title: tempvar});
        action.setCallback(this,function(response){
            var state = response.getState();
            alert (state);
            alert(JSON.stringify(response.getReturnValue()) );
            if (state === "SUCCESS") {
                alert ("inside the if statement");
                var records = response.getReturnValue();
                records.forEach(function(record){
                    record.linkTitle='/'+record.Id;
                });
                component.set("v.knowledgearticles", records);
            }
        });
        $A.enqueueAction(action);
		
	}
})