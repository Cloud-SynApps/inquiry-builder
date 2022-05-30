public with sharing class interviewsByRecordController {
    @AuraEnabled
    public static List<FlowRecordRelation> getInterviews(String recordId) {
        String inquiry = [SELECT Id
                            FROM CSA_Inquiry__c
                            WHERE Name =: recordId LIMIT 1]?.Id;
        if(String.isNotBlank(inquiry))
        {
            return [ SELECT 
                    ParentId, Parent.InterviewLabel, Parent.PauseLabel, 
                    Parent.CurrentElement, Parent.CreatedDate, Parent.Owner.Name 
                FROM FlowRecordRelation 
                WHERE RelatedRecordId =:inquiry];
        }
        else {
            return NULL;
        }
                                       
        
    }

    @AuraEnabled
    public static FlowInterview deleteInterview(Id interviewId) {
        FlowInterview interview = [Select Id from FlowInterview Where Id = :interviewId];
        delete interview;
        return interview;
    }
}
