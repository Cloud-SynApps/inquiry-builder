public with sharing class Href {

    @AuraEnabled(cacheable=true)
    public static List<IB_Resource__c> getHref(String questionId) {

        return [SELECT Id,Name,IB_URL__c FROM IB_Resource__c WHERE IB_Question__c =: questionId LIMIT 10];
    }

}