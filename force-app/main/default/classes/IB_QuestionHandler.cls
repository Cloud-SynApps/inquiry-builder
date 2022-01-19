public class IB_QuestionHandler{
    @AuraEnabled(cacheable=true)
    public static IB_Question__c[] getQuestionsWithRelatedAnswers(){
        return [
            SELECT Id, Name, IB_Content__c, (SELECT Id, Name FROM IB_Answers__r) FROM IB_Question__c
        ];
    }
}