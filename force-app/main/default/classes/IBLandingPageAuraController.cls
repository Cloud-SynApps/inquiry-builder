public with sharing class IBLandingPageAuraController {

    @AuraEnabled
    public static string initData(String appType){

        if(String.isEmpty(appType)){
            throw new IBLandingPageAuraControllerException('Application Type is required.');
        }else if(!'Knowledge'.contains(appType) ){
            throw new IBLandingPageAuraControllerException('Application Type is a not valid type.');
        }


        String jsonStr = '';
       
        DataDto dto = new DataDto();
        dto.pageTitle = 'Citizen Inquiries';

        List<TopicDto> topics = new List<TopicDto>();
        List<TopicDto> sortedtopics = new List<TopicDto>(); //akrati 3rd june
       // List<SubtopicDto> sortedsubtopics = new List<SubtopicDto>(); //akrati 3rd june
        List<SubtopicDto> subtopics = new List<SubtopicDto>();
        TopicDto topic = new TopicDto();
//start of change to add knowledge topics dynamically based on data category --akrati       
        List<Topics__mdt> mdTopic = 
        [SELECT Label, Icon__c, TopicId__c, DataCategory__c FROM Topics__mdt Where IB__c = 'IB' and isActive__c = true];
        
        if(mdTopic.isEmpty()){
            //do nothing
        }else{
            for(Topics__mdt t: mdTopic){
               topics.add(getKnowledgeTopics(t.TopicId__c, t.Label, t.Icon__c, t.DataCategory__c));
            }           
        }
//end of change to add knowledge topics dynamically based on data category--akrati       
       // sortedtopics = topics.clone(); //akrati 3rd june
        for(TopicDto t: topics){
            TopicDto sortt = new TopicDto();
            sortt.id = t.id;
            sortt.title = t.title;
            sortt.icon = t.icon;
           list<SubTopicDto> sortedsubtopics = new list<SubTopicDto>();
           integer i = 0;
            for(SubTopicDto st:t.subtopics){
                if(i<2){
                    sortedsubtopics.add(getSortTopics(st.Id, st.title, st.link));
                    i++;
                }
            }
            sortt.subtopics = sortedsubtopics;
            sortedtopics.add(sortt);
        }
        
        
        
        
        dto.knowledgeTopics = topics;
        dto.sortedKnowledgeTopics = sortedtopics;
        

        topics = new List<TopicDto>();
        topics.add(getSurveysTopic());

        dto.IBLightTopics = topics;

        jsonStr = JSON.serializePretty(dto);

        System.debug('===jsonStr===' + jsonStr);

        return jsonStr;
    }


    @AuraEnabled
    public static TopicDto getSurveysTopic(){
        TopicDto topic = new TopicDto();
        topic.Id = '126';
        topic.title = 'Covid-19 Checklist';
        topic.icon = 'standard:question_feed';
        topic.type = 'IBLight';
        List<SubtopicDto> subtopics = new List<SubtopicDto>();
        List<Survey> surveys  = [SELECT Id, Name, SurveyType, DeveloperName,Description, ActiveVersionId FROM Survey where ActiveVersionId != null];
        SubtopicDto sd;
        List<String> needContactInfoTopicList = new List<String>();
         
        for(Topics__mdt t : [SELECT Label FROM Topics__mdt Where IB__c = 'IBLight' and Need_Contact_Info__c = true]){
            needContactInfoTopicList.add(t.label);
        }
        
        for(Survey s: surveys){

            sd = new SubtopicDto(s.Id, s.Name,'','IBLight',needContactInfoTopicList.contains(s.Name));
            subtopics.add(sd);
        }
        topic.subtopics = subtopics;
        return topic;
    }
//--begin of dynamic addition of sub-topic based on knowledge record type and data category --akrati
@AuraEnabled
public static TopicDto getKnowledgeTopics(string TopicId, string TopicName, string TopicIcon, string DataCat){
    TopicDto topic = new TopicDto();
    topic.Id = TopicId;
    topic.title = TopicName;
    topic.icon = TopicIcon;
    
    List<SubtopicDto> subtopics = new List<SubtopicDto>();

    List<Knowledge__kav> Knowledge  = Database.Query('SELECT Id, Title, ArticleTotalViewCount, UrlName FROM Knowledge__kav where publishstatus=\'Online\' AND RecordTypeId=\'0126g000001EQipAAG\' WITH DATA CATEGORY IB_KNOWLEDGE_ARTICLES__c AT ' + DataCat + '__c '+ 'ORDER BY ARTICLETOTALVIEWCOUNT desc');
    SubtopicDto sd;
    if(Knowledge.isEmpty()){
       // return topic;
    }else{
        for(Knowledge__kav k: Knowledge){
            if(IBService.isCommunity()){
                k.UrlName = IBService.getCurrentEnvUrl() + '/article/' + k.UrlName;
            }
            else{
                k.UrlName = IBService.getCurrentEnvUrl() + '/' + k.Id;
            }      
        // k.UrlName = 'https://csainquirybuilder-dev-ed.lightning.force.com/lightning/r/Knowledge__kav/'+k.Id+'/view';
            sd = new SubtopicDto(k.Id, k.Title, k.UrlName);
            subtopics.add(sd);
        } 
    }
    topic.subtopics = subtopics;
    return topic;
}

@AuraEnabled
        public static SubTopicDto getSortTopics(string subtopicid, string subtopictitle, string subtopiclink){
          
                   
              SubTopicDto sd = new SubTopicDto(subtopicid, subtopictitle, subtopiclink);
                    
              return sd;
        }

   
//End of addition --akrati

    public class DataDto{
        @AuraEnabled
        public String pageTitle {get;set;}
        @AuraEnabled
        public List<TopicDto> knowledgeTopics {get;set;}
        @AuraEnabled
        public List<TopicDto> IBLightTopics {get;set;}
        @AuraEnabled
        public List<TopicDto> sortedKnowledgeTopics {get;set;}
        
    }

    public class TopicDto{
        @AuraEnabled
        public String Id {get;set;}
        @AuraEnabled
        public String title {get;set;}
        @AuraEnabled
        public String icon {get;set;}
        @AuraEnabled
        public String type {get;set;}
        @AuraEnabled
        public List<SubtopicDto> subtopics {get;set;}

    }

    public class SubtopicDto {
        @AuraEnabled
        public String Id {get;set;}
        @AuraEnabled
        public String title {get;set;}
        @AuraEnabled
        public String link {get;set;}
        @AuraEnabled
        public String type {get;set;}
        @AuraEnabled
        public Boolean needContactInfo {get;set;}
        
        public SubtopicDto (String id, String title, String link ){
            this.Id = id;
            this.title = title;
            this.link = link;
            this.type = 'Knowledge';
            this.needContactInfo = false;
        }
        public SubtopicDto (String id, String title, String link, String type, Boolean needContactInfo ){
            this.Id = id;
            this.title = title;
            this.link = link;
            this.type = type;
            this.needContactInfo = needContactInfo;
        }
    }


    public class IBLandingPageAuraControllerException extends Exception {}
}