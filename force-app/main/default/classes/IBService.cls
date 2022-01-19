public without sharing class IBService {

    public Static String getCurrentEnvURL(){
        String url = '';
        Id networkId = Network.getNetworkId();
       if(String.isEmpty(networkId)){
        url = System.URL.getSalesforceBaseUrl().toExternalform();
       }else{
        Network net = [SELECT Id, Name,UrlPathPrefix FROM Network where id =: networkId ];
        if(String.isEmpty(net.UrlPathPrefix)){
            url = System.URL.getSalesforceBaseUrl().toExternalform() + '/s' ;
        }else{
            url = System.URL.getSalesforceBaseUrl().toExternalform() + '/' + net.UrlPathPrefix;
        }
       }
       return url;
    }

    public Static Boolean isCommunity(){
        return  String.isNotEmpty(Network.getNetworkId());
    }
}