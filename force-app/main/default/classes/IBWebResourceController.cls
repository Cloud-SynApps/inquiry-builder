public with sharing class IBWebResourceController {

    @AuraEnabled(cacheable=true)
    public static List<IB_Resource__c> iBWebResource(String questionId) {

        List<IB_Resource__c> resourceList = [SELECt Id,Name,IB_URL__c,IB_Label__c 
                                            FROM IB_Resource__c 
                                            WHERE IB_Question__c =: questionId 
                                            LIMIT 10];

        return resourceList;

    }
}