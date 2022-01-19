public with sharing class IB_QnAWrapper
{
  //method
  @AuraEnabled
  public static wrapper method(){
      List<IB_Question__c> getQuestions = [Select Id, Name FROM IB_Question__c WHERE Id = 'a3k6g000001KEcXAAW'];
      List<IB_Answer__c> getAnswers = [SELECT Id, Name FROM IB_Answer__c WHERE IB_Question__r.Id = 'a3k6g000001KEcXAAW'];
      
      //wrapper call
      wrapper wc = new wrapper();
      wc.questionList = new List<IB_Question__c>(getQuestions);
      wc.answerList = new List<IB_Answer__c>(getAnswers);
      return wc;
  }


  //main wrapper
  public class wrapper{
      @AuraEnabled public List<IB_Question__c> questionList;
      @AuraEnabled public List<IB_Answer__c> answerList;
  }
}









// public NextElementWrapper
// {
// String currentElementId;
// String nextElementId;
// String type;
// }