public with sharing class CSAInquiryBuilderGetKnowledgeArticles {
    @AuraEnabled
    public static list<Knowledge__kav> getKnowledgeArticles(string title){
        
        string s = '%'+title+'%';
        list<Knowledge__kav> articles =  [select id, title, UrlName from knowledge__kav where title LIKE :s  AND PublishStatus = 'Online'];
        //system.debug(articles[1]);
        return articles;        
    }
    @AuraEnabled
    public static list<CSA_Inquiry_Topics__c> getInquiryTopics(){
        list<CSA_Inquiry_Topics__c> InquiryTopics = [select id, Name, Inquiry_Topic_Description__c from CSA_Inquiry_Topics__c where active__c = true];
        return InquiryTopics;
    }
    
    @AuraEnabled
    public static list<CSA_Inquiry_Sub_Topics__c> getInquirySubTopics(string Inquirytopic, string subtopic, integer level){
       // system.debug(subtopic);
        if (subtopic==null){
            list<CSA_Inquiry_Sub_Topics__c> SubTopics = [select id, Name, CSA_Inquiry_Topics__r.Name, Level__c, Next__c, 
                                                    Steps__c,
                                                     Sub_Topic_Description__c, Sub_Topics__c 
                                                     FROM CSA_Inquiry_Sub_Topics__c
                                                     WHERE CSA_Inquiry_Topics__r.Name =: Inquirytopic
                                                     AND Level__c =: level
                                                     AND Active__c = true];
        return SubTopics;
        } else{
            list<CSA_Inquiry_Sub_Topics__c> SubTopics = [select id, Name, CSA_Inquiry_Topics__r.Name, Level__c, Next__c, 
                                                    Steps__c,
                                                     Sub_Topic_Description__c, Sub_Topics__c 
                                                     FROM CSA_Inquiry_Sub_Topics__c
                                                     WHERE CSA_Inquiry_Topics__r.Name =: Inquirytopic
                                                     AND Sub_Topics__c =: subtopic
                                                     AND Level__c =: level
                                                     AND Active__c = true];
        return SubTopics;
        }
       
    }
    
    //@AuraEnabled
   // public static list<CSA_Inquiry_Step_Detail__C> getstepdetail (string stepId){
        
    //    list<CSA_Inquiry_Step_Detail__c> stepdetail = [select id, Name, Step_Detail_Description__c, Step_Detail_Description_Text_Area__c,
       //                                               Step_Type__c FROM CSA_Inquiry_Step_Detail__c 
       //                                              WHERE CSA_Inquiry_Steps__r.Name =: stepId
      //                                                AND Active__c = true];
      //  return stepdetail;
   // }
}