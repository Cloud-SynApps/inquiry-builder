trigger SurveyResponseTrigger on SurveyResponse (after insert, after update,before insert) {
    if(Trigger.isAfter){
        if(Trigger.isInsert){
            if(Trigger.new.size() ==1){
                SurveyResponse sr = Trigger.new[0];
                System.debug('=== SurveyResponse====' + sr);
                List<Case> cases = [select id, Survey_Response__c from case where ownerid =: UserInfo.getUserId() order by Id desc limit 1];
                if(cases.size() == 1){
                    System.debug('====' + cases[0]);
                    cases[0].Survey_Response__c = Trigger.new[0].Id;
                    update cases[0];
                }
            }
        }
        if(Trigger.isUpdate){
            List<Id> completedResponseIds = new List<Id>();
            for(SurveyResponse sr : Trigger.new){
                if(sr.Status == 'Completed'){
                    completedResponseIds.add(sr.Id);
                }
            }

            if(completedResponseIds.size() > 0){
                List<Case> cases = [select id,Survey_Completed__c from case where Survey_Response__c in : completedResponseIds];
                for(Case c : cases){
                    c.Survey_Completed__c = true;
                }
                update cases;
            }
        }       
    }
}