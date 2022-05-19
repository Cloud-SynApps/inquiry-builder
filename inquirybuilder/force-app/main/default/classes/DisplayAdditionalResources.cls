public with sharing class DisplayAdditionalResources {
    @AuraEnabled
    public static List<CSA_Element_Web_Resource__c> displayResources(string elementId){
        try {

            List<CSA_Element_Web_Resource__c> resources = [SELECT Id,Name,Inquiry_Element__c,Web_Resource__r.Resource_Url__c,Web_Resource__r.Resource_Name__c 
                                                            FROM CSA_Element_Web_Resource__c 
                                                            WHERE Inquiry_Element__c =:elementId];

            return resources;

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}
