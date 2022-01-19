public with sharing class IB_AnswerHandler {
    
    @AuraEnabled(cacheable = true)
    public static List<IB_Answer__c> getAnswers(string recordId) {
        return [SELECT Id, Name 
                FROM IB_Answer__c 
                WHERE Id =: recordId];
    }
}