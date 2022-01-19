public with sharing class IB_Container2Wrapper {
    @AuraEnabled(cacheable = true)
    public static List<wrapperClass> getWrapperClassList() {
        List<wrapperClass> wrapperList = new List<wrapperClass>();
                
        Map<Id, IB_Question__c> mapOfQuestions = new Map<Id, IB_Question__c>([SELECT Id, IB_Content__c
                                                                                FROM IB_Question__c]);  

        List<IB_Answer__c> listOfAnswers = [SELECT Id, Name, IB_Question__r.Id, IB_Question__r.IB_Content__c
                                            FROM IB_Answer__c 
                                            WHERE IB_Question__r.Id 
                                            IN :mapOfQuestions.keyset()]; 
   
                   for(IB_Answer__c answer : listOfAnswers){
                        wrapperClass wc = new wrapperClass();
                        wc.questionId =  answer.IB_Question__r.Id;
                        wc.questionContent = answer.IB_Question__r.IB_Content__c;
                        wc.answerId = answer.Id;
                        wc.answerName = answer.Name;
                        wrapperList.add(wc);
				}

    			    return wrapperList;
         }                                
                                                
            public class wrapperClass{
                @AuraEnabled
                public String questionId;
                @AuraEnabled
                public String questionContent;
                @AuraEnabled
                public String answerId;
                @AuraEnabled
                public String answerName;
            }
                
                                                
            
                
                            
}