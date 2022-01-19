public without sharing class InquiryBuilderController {
    public InquiryBuilderController() {

    }

    @AuraEnabled(cacheable=true)
    public String getElementLst() {
        //return [SELECT Id, Name, Question_Content__c FROM CSA_Inquiry_Question__c LIMIT 100];
        return 'test';
    }

    @AuraEnabled(cacheable=true)
public static Inquiry getQuestions(){    
    Inquiry inq = New Inquiry();
    Map<Id,CSA_Inquiry_Question__c> questionMap  = new Map<Id,CSA_Inquiry_Question__c>(
        [SELECT Id,
        Question__c,
        Question_Content__c,
            (SELECT 
            Id,
            CSA_Inquiry_Answer__c,
            CSA_Inquiry_Answer__r.Type__c,
            CSA_Inquiry_Answer__r.Answer__c,
            CSA_Inquiry_Question__c,
            Next_CSA_Inquiry_Question__c 
            FROM CSA_Inquiry_Question_Answer_Association__r LIMIT 100) 
        FROM CSA_Inquiry_Question__c 
        WHERE Active__c = true 
        LIMIT 100]);

    List<Question> questions = New List<Question>();
    for(CSA_Inquiry_Question__c questionMapItem : questionMap.values())
    {
        List<Answer> answers = New List<Answer>();
        Map<Id,CSA_Inquiry_Question_Answer_Association__c> quesAnsAssocLst =  new Map<Id,CSA_Inquiry_Question_Answer_Association__c>(questionMapItem.CSA_Inquiry_Question_Answer_Association__r);
        for(CSA_Inquiry_Question_Answer_Association__c quesAnsAssocItem: quesAnsAssocLst.values())
        {
            Answer answerItem = New Answer();
            answerItem.value = quesAnsAssocItem.CSA_Inquiry_Answer__r.Answer__c;
            answerItem.Id = quesAnsAssocItem.CSA_Inquiry_Answer__r.Id;
            answerItem.next = quesAnsAssocItem.Next_CSA_Inquiry_Question__c;
            answers.add(answerItem);
        }

        Question questionItem = New Question();
        questionItem.value = questionMapItem.Question__c;
        questionItem.Id = questionMapItem.Id;
        questionItem.answers = answers;
        questions.add(questionItem);
    }
   
    /*for(CSA_Inquiry_Question__c questionItem : [SELECT Id,Question__c,Question_Content__c,(SELECT Id,CSA_Inquiry_Answer__c,CSA_Inquiry_Answer__r.Type__c,CSA_Inquiry_Answer__r.Answer__c,CSA_Inquiry_Question__c FROM CSA_Inquiry_Question_Answer_Association__r) FROM CSA_Inquiry_Question__c WHERE Active__c = true LIMIT 100])
    {
        Question quesItem = New Question();
        quesItem.Id = questionItem.Id;
        System.debug('question Id'+questionItem.Id);
        System.debug('answerType Id'+questionItem.CSA_Inquiry_Question_Answer_Association__r.Type__c);
    }*/
    system.debug('questions-->'+questions);
    inq.questions = questions;
    return inq;
}

@AuraEnabled(cacheable=true)
public static Question getQuestion(String questionId){    

    if(String.isBlank(questionId))
    {
        throw new InquiryBuilderControllerException('questionId is a required attribute, it cannot be blank');
    }    
    //questionId = 'a3b6g000001AtsqAAC';
    List<CSA_Inquiry_Question__c> questionItemLst  = 
        [SELECT Id,
        Question__c,
        Question_Content__c,
            (SELECT 
            Id,
            CSA_Inquiry_Answer__c,
            CSA_Inquiry_Answer__r.Type__c,
            CSA_Inquiry_Answer__r.Answer__c,
            CSA_Inquiry_Question__c,
            Next_CSA_Inquiry_Question__c 
            FROM CSA_Inquiry_Question_Answer_Association__r LIMIT 100) 
        FROM CSA_Inquiry_Question__c 
        WHERE Id = :questionId
        LIMIT 100];

        CSA_Inquiry_Question__c questionItem = New CSA_Inquiry_Question__c();
        if(!questionItemLst.isEmpty())
        {
            questionItem = questionItemLst.get(0);
        }
        else {
            throw new InquiryBuilderControllerException('Question configuration does not exist for the given Id');
        }
        List<Answer> answers = New List<Answer>();
        List<Option> options = New List<Option>();
        Map<Id,CSA_Inquiry_Question_Answer_Association__c> quesAnsAssocLst =  new Map<Id,CSA_Inquiry_Question_Answer_Association__c>(questionItem.CSA_Inquiry_Question_Answer_Association__r);
        for(CSA_Inquiry_Question_Answer_Association__c quesAnsAssocItem: quesAnsAssocLst.values())
        {
            Answer answerItem = New Answer();
            answerItem.value = quesAnsAssocItem.CSA_Inquiry_Answer__r.Answer__c;
            answerItem.Id = quesAnsAssocItem.CSA_Inquiry_Answer__r.Id;
            answerItem.next = quesAnsAssocItem.Next_CSA_Inquiry_Question__c;
            Option optionItem = New Option();
            optionItem.label = quesAnsAssocItem.CSA_Inquiry_Answer__r.Answer__c;
            optionItem.value = quesAnsAssocItem.Id;
            options.add(optionItem);
            answers.add(answerItem);
        }

        Question qItem = New Question();
        qItem.value = questionItem.Question__c;
        qItem.Id = questionItem.Id;
        qItem.answers = answers;
        qItem.options = options;
        return qItem;

    }


   @AuraEnabled(cacheable=true)
    public static Question getNextAction(String selectedOption){
        Question nextQuestion = New Question();
        List<CSA_Inquiry_Question_Answer_Association__c> quesAnsAssoc = [SELECT Id,
                                                                        Name,
                                                                        CSA_Inquiry_Question__c,
                                                                        Next_CSA_Inquiry_Question__c,
                                                                        CSA_Inquiry_Result__c 
                                                                        FROM CSA_Inquiry_Question_Answer_Association__c
                                                                        WHERE Id=:selectedOption
                                                                        LIMIT 100];
        if(!quesAnsAssoc.isEmpty())
        {
            if(String.isNotBlank(quesAnsAssoc.get(0).CSA_Inquiry_Result__c))
            {
                nextQuestion = NULL;
            }
            else{
                nextQuestion = InquiryBuilderController.getQuestion(quesAnsAssoc.get(0).Next_CSA_Inquiry_Question__c);
            }
        }                                                                 
        return nextQuestion;
    }
    

    public class Inquiry{
        @AuraEnabled
        public List<Question> questions {get;set;}

    }

    public class Question{
        @AuraEnabled
        public String Id {get;set;}
        @AuraEnabled
        public String title {get;set;}
        @AuraEnabled
        public String value {get;set;}
        @AuraEnabled
        public List<Answer> answers {get;set;}
        @AuraEnabled
        public List<Option> options{get; set;}

    }

    public class Answer{
        @AuraEnabled
        public String Id {get;set;}
        @AuraEnabled
        public String title {get;set;}
        @AuraEnabled
        public String type {get;set;}
        @AuraEnabled
        public String value {get;set;}
        @AuraEnabled
        public string next{get; set;}
    }

    public class Option{
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public String value {get;set;}
    }

    public class InquiryBuilderControllerException extends Exception {}
}