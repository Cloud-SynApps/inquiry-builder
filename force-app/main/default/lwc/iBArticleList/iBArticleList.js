import { LightningElement, track, wire, api } from "lwc";
import { getTopics } from "c/iBService";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";
export default class iBArticleList extends LightningElement {
  pageTitle = "";
  appType = "Knowledge";
  errMsg;
  jsonStr;
  jsonData;
  searchTerm;
  @track
  knowledgeTopics = [];
  @track
  IBLightTopics = [];
  knowledgeTopicsListArticle = [];
  searchTerm = "";
  topicTitle;
  subTopicArray = [];

  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener("ibListArticle", this.handleIBListArticle, this);
    
  
    console.log("===== connectedCallback =====");
    
  }
  disconnectedCallback() {
    // unsubscribe from event
    unregisterAllListeners(this);
  }

  handleIBListArticle(article){
    this.topicTitle= article.topicTitle;
    //alert("topic title in article list is " + this.topicTitle);
    if (this.appType) {
      getTopics(this.appType)
        .then((result) => {
          // Success logic...
          console.log("====initData====result: " + result);
          this.jsonStr = result;
          this.jsonData = JSON.parse(result);
          const ttitle = this.topicTitle;
          //console.log("====initData====result: " + this.jsonData);
          this.pageTitle = this.topicTitle;
          //this.pageTitle = this.knowledgeTopics.title;
          this.knowledgeTopicsListArticle = this.jsonData.knowledgeTopics;
          this.knowledgeTopics = this.knowledgeTopicsListArticle.filter(function(temp){
            
            return (temp.title == ttitle);
           
          });
          
          
          //let knowTopic = this.knowledgeTopics;
          
          //alert("knowTopic is"+knowTopic);
          
         
        })
        .catch((error) => {
          // Error logic...
          console.error(JSON.stringify(error));
          this.errMsg = JSON.stringify(error);
        });
    }
  }

  handleKnowledgeSearchTermChange(event) {
    console.log("====== handleKnowledgeSearchTermChange ==== ");
    window.clearTimeout(this.delayTimeout);

    const searchTerm = event.target.value;
    this.delayTimeout = setTimeout(
      function () {
        this.ksearchTerm = searchTerm;
        if (searchTerm == "") {
          this.knowledgeTopics = JSON.parse(this.jsonStr).knowledgeTopics;
        } else {
          console.log("===searchTerm===" + searchTerm);
          // let tempsubtopic = this.jsonData.knowledgeTopics.subtopics;
          let topics = JSON.parse(this.jsonStr).knowledgeTopics;
          let knowledgeTopics = topics.filter(function (item) {
            let subtopicarray = item.subtopics;
            for (let i = 0; i < subtopicarray.length; i++) {
              if (
                subtopicarray[i].title
                  .toUpperCase()
                  .indexOf(searchTerm.toUpperCase()) != -1
              ) {
                return 1;
              }
            }
          });
          if (knowledgeTopics && knowledgeTopics.length > 0) {
            for (var n = 0; n < knowledgeTopics.length; n++) {
              knowledgeTopics[n].subtopics = knowledgeTopics[
                n
              ].subtopics.filter(function (item) {
                return (
                  item.title.toUpperCase().indexOf(searchTerm.toUpperCase()) !=
                  -1
                );
              });
            }

            console.log(knowledgeTopics);
            console.log(this.jsonData.knowledgeTopics);
            this.knowledgeTopics = knowledgeTopics;
          }
        }
      }.bind(this),
      300
    );
  }

  
     
      
    /*
    
    */
  
  /* 
  }*/
  deepCopyFunction = (inObject) => {
    let outObject, value, key;

    if (typeof inObject !== "object" || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key];

      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = deepCopyFunction(value);
    }

    return outObject;
  };
}