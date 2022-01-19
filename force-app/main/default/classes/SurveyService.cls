public class SurveyService {
    //List<Survey> surverys  = [select id from survey];
    //SurveyService.shareSurvey(surverys);
    
    public static void shareSurvey(List<Survey> surveys){
        List<SurveyShare> shares = new List<SurveyShare>();
        SurveyShare ss;
        Group surveyGroup  = [select id,name,developername from group where developername = 'Survey_Share' limit 1];
        for(Survey s : surveys){
            ss = new SurveyShare();
                                ss.ParentId = s.Id;
                                    ss.RowCause = 'Manual';
                                ss.UserOrGroupId = surveyGroup.Id;
                                ss.AccessLevel = 'Read';
                                shares.add(ss);   
                               }   
        
        if(shares.size() > 0){
            insert shares;
        }        
    }
}