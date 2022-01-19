public with sharing class IB_WrapperClass {
    @AuraEnabled(cacheable = true)
    public static List<wrapperClass> getWrapperClassList() {
        List<wrapperClass> wrapperList = new List<wrapperClass>();
        
        Map<Id, IB_Question__c> questionMap = new Map<Id, IB_Question__c>([SELECT Id, IB_Content__c FROM IB_Question__c]);
        // Map<Id, IB_Question__c> mapOfQuestions = new Map<Id, IB_Question__c>([SELECT Id, IB_Content__c
        //                                                                         FROM IB_Question__c]);  
        
                                                                                
        Map<Id, List<IB_Answer__c>> AnsOfMap = new Map<Id, List<IB_Answer__c>>();
        
        List<IB_Answer__c> listOfAnswers = [SELECT Id, Name, IB_Question__r.Id, IB_Question__r.IB_Content__c
        FROM IB_Answer__c 
        WHERE IB_Question__r.Id 
        IN :questionMap.keyset()];
        
                                                                                System.debug('listOfAnswers==='+listOfAnswers);
                                                                                
                   for(IB_Answer__c ans : listOfAnswers){
                    if(questionMap.containsKey(ans.IB_Question__c)){

                        questionMap.get(ans.IB_Question__c);
                        questionMap.put(ans.IB_Question__c,listOfAnswers);
                        
                        }else{
                        
                        // questionMap.put(ans.IB_Question__r.Id, new List<IB_Answer__c>{ ans });
                        
                        }
                   }
                  Id ids = IB_Question__r.Id;
                   for(Id qid : questionMap.keySet()){
                    
                    wrapperClass w = new wrapperClass();
                       w.questionId = qid;
                       w.questionCon = questionMap.get(qid).IB_Content__c;
                       
                       List<AnsWrapper> ansList = new List<AnsWrapper>();
                       for(IB_Answer__c ans : questionMap.get(qid)){
                       
                       AnsWrapper aw = new AnsWrapper();
                       aw.answerID = ans.Id;
                       aw.ansContent = ans.Name;
                       ansList.add(aw);
                       
                    }

                    w.ansList = ansList;
                    wrapperList.add(w);

                }
                    

                //    for(IB_Answer__c answer : listOfAnswers){
                //         wrapperClass wc = new wrapperClass();
                //         wc.questionId =  answer.IB_Question__r.Id;
                //         wc.questionContent = answer.IB_Question__r.IB_Content__c;
                //         wc.answerId = answer.Id;
                //         wc.answerName = answer.Name;
                //         wrapperList.add(wc);
				// }

    			    return wrapperList;
         }                                
                                                
            public class wrapperClass{
                @AuraEnabled
                public String questionId;
                @AuraEnabled
                public String questionContent;
                public List<AnsWrapper> answer = new List<AnsWrapper>();        
            }
            public class AnsWrapper{
                @AuraEnabled
                public String answerId;
                @AuraEnabled
                public String answerName;

            }                                    
    }