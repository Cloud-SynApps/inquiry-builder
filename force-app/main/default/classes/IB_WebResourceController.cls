public with sharing class IB_WebResourceController {
    @AuraEnabled(cacheable=true)
    public static List<IB_Resource__c> webResource(String questionId) {
        return [SELECT Id,Name,IB_Label__C,IB_URL__c FROM IB_Resource__c WHERE IB_Question__c =: questionId];
    }
}