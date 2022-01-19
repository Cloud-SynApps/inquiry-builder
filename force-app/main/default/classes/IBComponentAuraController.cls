public without sharing class IBComponentAuraController {
    @AuraEnabled
    public static List<Survey> initData(){
        List<Survey> surveys = new List<Survey>();
        surveys = [SELECT Id, Name, SurveyType, DeveloperName,Description, ActiveVersionId FROM Survey where ActiveVersionId != null];
        return surveys;
    }    

    @AuraEnabled
    public static CaseSurveyDto getCaseSurveyInfo(String surveyId, String surveyName,String inputString){
        Contact con;
        if(String.isNotBlank(inputString)){
            String lastName,firstName,mobilePhone;
            Map<String,Object> input = (Map<String,Object>)JSON.deserialize(inputString, Map<String,Object>.class);
            System.debug('===input===' + input);

            firstName = input.get('firstName') == null ? '' : (String)input.get('firstName');
            lastName = input.get('lastName') == null ? '' : (String)input.get('lastName');
            mobilePhone = (String)input.get('mobilePhone') == null ? '' : (String)input.get('mobilePhone');
            if(String.isNotBlank(lastName)){
                con = new Contact();
                con.firstName = firstName;
                con.lastName = lastName;
                con.mobilePhone = mobilePhone;
                insert con;
            }        
        }   
       
        CaseSurveyDto dto = new CaseSurveyDto();
        //create case 
        Case c = new Case();
        c.Status = 'New';
        c.Origin = 'Web';
        c.Subject = surveyName;
        if(con != null){
            c.ContactId = con.Id;
        }
        
        insert c;
        
        String caseNumber = [select casenumber from case where id =: c.Id].casenumber;

        String url;
        String invitationId;

        List<SurveyInvitation> surveyInvitations = 
        [SELECT Id, CommunityId, InvitationLink 
                FROM SurveyInvitation where SurveyId =: surveyId
                AND CommunityId = :Network.getNetworkId() limit 1];

        
        if(surveyInvitations.size() > 0){
            url = surveyInvitations[0].InvitationLink;
            invitationId = surveyInvitations[0].Id;
        }

        //create survey subject
        SurveySubject ss = new SurveySubject();
        //ss.SurveyId = surveyId;
        ss.ParentId = invitationId;
        ss.SubjectId = c.Id;
        ss.name = surveyName;
        insert ss;
        
        List<SurveySubject> ssList = [SELECT Id, SurveyResponseId FROM SurveySubject where id =: ss.Id];
        
        if(ssList.size() == 1){
            System.debug('====SurveyResponseId==' + ssList[0].SurveyResponseId);
        }
        

        dto.surveyURL = url;
        dto.caseId = c.Id;
        dto.caseNumber = caseNumber;
        return dto;
    }

    @AuraEnabled
    public static Boolean saveContactInfo(String lastName, String firstName, String mobilePhone, String caseId){
        Boolean result = false;
        
        if(String.isNotBlank(lastName)){
            Contact con = new Contact();
            con.firstName = firstName;
            con.lastName = lastName;
            con.mobilePhone = mobilePhone;
            insert con;
            
            if(String.isNotEmpty(caseId)){
                case c = new case();
                c.Id = caseId;
                c.contactId = con.Id;
                update c;
            }
            
            result = true;
        }
      
        return result;
    }

    @AuraEnabled
    public static List<ArticleDto> getKnowledgeArticles(String surveyId, String surveyName){
        //get related articles by survey's topic
        List<ArticleDto> dtos = new List<ArticleDto>();
        ArticleDto dto;
        String q = '%' + surveyName + '%';

        List<Topic> topics = [SELECT Id, NetworkId, Name FROM Topic where name like :q];

        if(topics.size() == 1){

            List<TopicAssignment> assignments = [SELECT Id, EntityId FROM TopicAssignment where topicid =: topics[0].Id];
            List<Id> entities = new List<Id>();

            for(TopicAssignment t : assignments){
                entities.add(t.entityId);
            }

            if(entities.size() > 0){
                List<Knowledge__kav> articles =  [SELECT Id, Title, UrlName, OwnerId, KnowledgeArticleId FROM Knowledge__kav where id in: entities];
               
                for(Knowledge__kav a : articles){
                   dto = new ArticleDto();
                   dto.articleId = a.Id;
                   dto.articleName = a.title;
                   if(IBService.isCommunity()){
                        dto.aritcleURL = IBService.getCurrentEnvURL() + '/article/' + a.UrlName;
                   }else{
                        dto.aritcleURL = IBService.getCurrentEnvURL() + '/' + a.Id;
                   }
                   
                   dtos.add(dto); 
                }
            }
        }
        System.debug(dtos);
        return dtos;
    }

    @AuraEnabled
    public static List<ResourceDto> getResources(String surveyId, String surveyName){
        List<ResourceDto> dtos = new List<ResourceDto>();
        ResourceDto dto;
        String q = '%' + surveyName + '%';

        List<Topic> topics = [SELECT Id, NetworkId, Name FROM Topic where name like :q];

        if(topics.size() == 1){
            List<TopicAssignment> assignments = [SELECT Id, EntityId FROM TopicAssignment where topicid =: topics[0].Id];
            List<Id> entities = new List<Id>();

            for(TopicAssignment t : assignments){
                entities.add(t.entityId);
            }

            if(entities.size() > 0){
                List<IB_Resource__c> resources = [SELECT Id, Name, Type__c, Link__c FROM IB_Resource__c where id in : entities];
                for(IB_Resource__c r : resources){
                        dto = new ResourceDto();
                        dto.Id = r.id;
                        dto.name = r.name;
                        dto.type = r.type__c;
                        dto.URL = r.link__c;
                        dtos.add(dto);
                }
            }
        }   
        System.debug('=== resources === ' + dtos);
        return dtos;
    }

    @AuraEnabled
    public static Boolean isCaseSurveyCompleted(String caseNumber){
        Boolean result = false;
        System.debug('===== caseNumber====' + caseNumber);

        if(String.isNotBlank(caseNumber)){
            result = [select Survey_Completed__c from Case where caseNumber =: caseNumber limit 1].Survey_Completed__c;
        } 
        System.debug('===== isCaseSurveyCompleted====' + result);
        return result;
    }

    public class CaseSurveyDto {
        @AuraEnabled
        public String surveyURL {get;set;}
        @AuraEnabled
        public String caseId {get;set;}
        @AuraEnabled
        public String caseNumber {get;set;}

    }

    public class ArticleDto {
        @AuraEnabled
        public String articleId {get;set;}
        @AuraEnabled
        public String articleName {get;set;}
        @AuraEnabled
        public String aritcleURL {get;set;}
    }
    
    public class ResourceDto {
        @AuraEnabled
        public  string Id  {get; set;}
        @AuraEnabled
        public  string name  {get; set;}
        @AuraEnabled
        public  string type  {get; set;}
        @AuraEnabled
        public  string URL  {get; set;}

    }
}