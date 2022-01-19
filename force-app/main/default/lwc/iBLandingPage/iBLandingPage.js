import { LightningElement, track } from "lwc";
import { getTopics } from "c/iBService";
import iBArticleListPage from "./iBLandingPage.html";

export default class iBLandingPage extends LightningElement {
  pageTitle = "";
  appType = "Knowledge";
  errMsg;
  jsonStr;
  jsonData;
  ksearchTerm = "";
  @track
  knowledgeTopics = [];
  @track
  IBLightTopics = [];
  searchTerm = ""; 
  @track
  moreArticles = [];//list of all articles to be displayed on alternate UI when see more is clicked
  moreArticlesRef = [];
  moreArticleRefId;
  showmorearticlesflag = false;//flag set to true when See More button is clicked
  sortByViewTopics = [];
  disableseemore = true; //flag for disabling See More button for Inquiry
  viewbycount = true; //flag for viewing top two articles based on count by view

  connectedCallback() {
    console.log("===== connectedCallback =====");
    if (this.appType) {
      getTopics(this.appType)
        .then((result) => {
          // Success logic...
          console.log("====initData====result: " + result);
          this.jsonStr = result;
          this.jsonData = JSON.parse(result);

          //console.log("====initData====result: " + this.jsonData);
          this.pageTitle = this.jsonData.pageTitle;
          this.knowledgeTopics = this.jsonData.knowledgeTopics;
          this.IBLightTopics = this.jsonData.IBLightTopics;
          this.sortByViewTopics = this.jsonData.sortedKnowledgeTopics;
         
        })
        .catch((error) => {
          // Error logic...
          console.error(JSON.stringify(error));
          this.errMsg = JSON.stringify(error);
        });
    }
  }

  showMoreArticles(event){
    const subtopicId = event.detail; 
    this.moreArticleRefId = subtopicId;   
    this.moreArticles = this.jsonData.knowledgeTopics.filter(function(item) {  
      return (item.Id == subtopicId);     
        });
        
    if(this.moreArticles.length>0){
      this.showmorearticlesflag = true;
    }
    this.viewbycount = false;
  }

  handleBack(event){
    this.showmorearticlesflag = event.detail;
    this.viewbycount = true;
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

 /* handleMoreArticlesSearchTermChange(event){
    console.log("====== handleMoreArticlesSearchTermChange ==== ");
    window.clearTimeout(this.delayTimeout);

    const searchTerm = event.target.value;
   
    this.delayTimeout = setTimeout(
      function () {
        this.ksearchTerm = searchTerm;
        
        if (searchTerm == "") {
          alert("ID is" +moreArticleRefId);
          this.moreArticles = this.jsonData.knowledgeTopics.filter(function(item) {  
            return (item.Id == moreArticleRefId);     
              });
        } else {
          console.log("===searchTerm===" + searchTerm);
          // let tempsubtopic = this.jsonData.knowledgeTopics.subtopics;
          let topics = this.moreArticles;
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
            this.moreArticles = knowledgeTopics;
          }
        }
      }.bind(this),
      300
    );
  }*/

  handleInquirySearchTermChange(event) {
    console.log("====== handleInquirySearchTermChange ==== ");
    window.clearTimeout(this.delayTimeout);

    const searchTerm = event.target.value;
    this.delayTimeout = setTimeout(
      function () {
        this.searchTerm = searchTerm;
        if (searchTerm == "") {
          this.IBLightTopics = JSON.parse(this.jsonStr).IBLightTopics;
        } else {
          console.log("===searchTerm===" + searchTerm);
          let topics = JSON.parse(this.jsonStr).IBLightTopics;
          let IBLightTopics = topics.filter(function (item) {
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
          if (IBLightTopics && IBLightTopics.length > 0) {
            for (var n = 0; n < IBLightTopics.length; n++) {
              IBLightTopics[n].subtopics = IBLightTopics[
                n
              ].subtopics.filter(function (item) {
                return (
                  item.title.toUpperCase().indexOf(searchTerm.toUpperCase()) !=
                  -1
                );
              });
            }

            console.log(IBLightTopics);
            console.log(this.jsonData.IBLightTopics);
            this.IBLightTopics = IBLightTopics;
          }
        }
      }.bind(this),
      300
    );
    /*
    console.log("====== handleInquirySearchTermChange ==== ");
    window.clearTimeout(this.delayTimeout);

    const searchTerm = event.target.value;
    this.delayTimeout = setTimeout(() => {
      this.searchTerm = searchTerm;
      if (searchTerm == "") {
        this.IBLightTopics = this.jsonData.IBLightTopics;
      } else {
        console.log("===searchTerm===" + searchTerm);
        this.IBLightTopics = this.jsonData.IBLightTopics.filter(function (
          item
        ) {
          let subtopicarray = item.subtopics;
          for (let i = 0; i < subtopicarray.length; i++) {
            if (
              subtopicarray[i].title
                .toUpperCase()
                .indexOf(searchTerm.toUpperCase()) != -1
            ) {
              return 0;
            }
          }
        });
        console.log(this.IBLightTopics);
      }
    }, 300);
    */
  }
  /* handleSearchTermChange(event) {
    console.log("====== handleSearchTermChange ==== ");
    window.clearTimeout(this.delayTimeout);

    const searchTerm = event.target.value;
    this.delayTimeout = setTimeout(() => {
      this.searchTerm = searchTerm;
      if (searchTerm == "") {
        this.topics = this.jsonData.Topics;
      } else {
        console.log("===searchTerm===" + searchTerm);
        this.topics = this.jsonData.Topics.filter(function(item) {
          return (
            item.title.toUpperCase().indexOf(searchTerm.toUpperCase()) != -1
          );
        });
        console.log(this.topics);
      }
    }, 300);
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