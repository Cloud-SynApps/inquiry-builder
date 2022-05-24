public with sharing class InquiryBuilderGetRecords {

    @AuraEnabled
    public static List<CSA_Inquiry_Template__c> getCategory() {

        try {
            
        List<CSA_Inquiry_Template__c> category = [SELECT Id,Category_Name__c,Help_Text__c
                                                   FROM CSA_Inquiry_Template__c];

        return category;

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
}
