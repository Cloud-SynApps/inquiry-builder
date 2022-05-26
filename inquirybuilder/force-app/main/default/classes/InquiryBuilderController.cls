public with sharing class InquiryBuilderController {

    @AuraEnabled
    public static List<CSA_Inquiry_Category__c> getCategory() {

        try {
            
        List<CSA_Inquiry_Category__c> category = [SELECT Id,Name
                                                   FROM CSA_Inquiry_Category__c];

        return category;

        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

    }

    @AuraEnabled
    public static List<CSA_Inquiry_Template__c> getTemplate() {

        try {
            
        List<CSA_Inquiry_Template__c> template = [SELECT Id,Name,Default_Outcome__c,Help_Text__c,Inquiry_Category__c
                                                   FROM CSA_Inquiry_Template__c];

        return template;

        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

    }

    @AuraEnabled
    public static List<CSA_Element_Web_Resource__c> getWebResource(string elementId){
        try {

            List<CSA_Element_Web_Resource__c> resources = [SELECT Id,Name,Inquiry_Element__c,Web_Resource__r.Resource_Url__c,Web_Resource__r.Resource_Name__c 
                                                            FROM CSA_Element_Web_Resource__c 
                                                            WHERE Inquiry_Element__c =:elementId];
            
            System.debug('print');
            return resources;

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<CSA_Inquiry_Response__c> getVisitedInformation(string InquiryId) {

        try {
            
        List<CSA_Inquiry_Response__c> visitedInformation = [SELECT Id,Response_Information__c
                                                   FROM CSA_Inquiry_Response__c
                                                   WHERE Inquiry__c= :InquiryId
                                                   AND Response_Information__c!=NULL];
        System.debug('Visited Information'+visitedInformation);

        return visitedInformation;

        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

    }

    @AuraEnabled
    public static List<CSA_Inquiry_Response__c> getVisitedResources(string InquiryId) {

        try {
            
        List<CSA_Inquiry_Response__c> visitedInformation = [SELECT Id,Resources__c
                                                   FROM CSA_Inquiry_Response__c
                                                   WHERE Inquiry__c= :InquiryId
                                                   AND Resources__c!=NULL];
        System.debug('Visited Information'+visitedInformation);

        return visitedInformation;

        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

    }
}
