({
   //  doinit : function(component, event, helper) {
        //component.set('v.column',[{label:'Knowledge Article', fieldName: 'linkTitle', type: 'url',
                                     // typeAttributes:{label:{fieldName:'Title'},target:'_blank'}}]);
       // var tempvar = component.get("v.titlekeyword");
     //   var action = component.get("c.getKnowledgeArticles");
     //   action.setParams({ title : tempvar});
        
     //   action.setCallback(this, function(response){
      //      alert (response.getstate());
      //      var state = response.getstate();
      //      alert (state);
      //      if (state === "SUCCESS"){
      //          alert("From server: " + response.getReturnValue());

       //         component.set("v.knowledgearticles",response.getReturnValue());
      //      }
     //   });
        
         
  // },
    
    listarticles : function(component,event,helper) {
      
        var titlekeyword = event.getParam("titlekeyword");
        component.set("v.titlekeyword",titlekeyword);
      
        component.set('v.column',[{label:'Knowledge Article', fieldName: 'linkTitle', type: 'url',
                                      typeAttributes:{label:{fieldName:'Title'},target:'_blank'}}]);
        var testtitle = component.get("v.titlekeyword");
        var action = component.get("c.getKnowledgeArticles");
        action.setParams({ title : testtitle});       
        action.setCallback(this,function(response){
           // alert (response.getState());
            var state = response.getState();
          //  alert (state);
            if (state === "SUCCESS"){
              //  alert("From server: " + response.getReturnValue());
              //  alert ("inside the if statement");
                var records = response.getReturnValue();
                records.forEach(function(record){
                    record.linkTitle='/'+record.Id;
                });
                component.set("v.knowledgearticles",records);   
            }});
    $A.enqueueAction(action);
    }    
  //  var action = component.get("c.getKnowledgeArticles");
   //     action.setParams({ title : titlekeyword});       
     //   action.setCallback(this,function(response){
       //     alert (response.getstate());
         //   var state = response.getstate();
           // alert (state);
            //if (state === "SUCCESS"){
              //  alert("From server: " + response.getReturnValue());
                //alert ("inside the if statement");
                //var records = response.getReturnValue();
                //records.forEach(function(record){
                //    record.linkTitle='/'+record.Id;
                //});
                //component.set("v.knowledgearticles",records);   
            //}});
        
   
 } )