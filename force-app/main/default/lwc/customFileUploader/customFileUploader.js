import { LightningElement, track, api } from 'lwc';
//import saveFile from '@salesforce/apex/CustomFileUploadController.saveFile';
//import releatedFiles from '@salesforce/apex/CustomFileUploadController.releatedFiles';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const columns = [
    {label: 'Title', fieldName: 'Title'}
];

export default class CustomFileUploader extends LightningElement {
    @api encryptionKey='6aca2d4bac26cd1166fc1adaf6124535';
    @api recordId = '0016g000009k4MUAAY';
    @track columns = columns;
    @track data;
    @track fileName = '';
    @track UploadFile = 'Upload File';
    @track showLoadingSpinner = false;
    @track isTrue = false;
    selectedRecords;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;

    @track downloadUrl;
    MAX_FILE_SIZE = 1500000;


    connectedCallback() {
        //this.getRelatedFiles();
    }

    // getting file 
    handleFilesChange(event) {
        if(event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            this.fileName = event.target.files[0].name;
        }
    }

    async handleSave() {
        if(this.filesUploaded.length > 0) {
            var uploadResult = this.uploadHelper();
            console.log('uploadResult',uploadResult);
        }
        else {
            this.fileName = 'Please select file to upload!!';
        }
    }

    uploadHelper() {
        var fUrl;
        console.log('first line');
        var aesKeyBytes
        var hexString = '6aca2d4bac26cd1166fc1adaf6124535';
        if (hexString.length % 2 !== 0) {
            throw Error("Must have an even number of hex digits to convert to bytes");
        }

        var numBytes = hexString.length / 2;
        var byteArray = new Uint8Array(numBytes);
        for (var i=0; i<numBytes; i++) {
            byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
        }
        var aesKeyBytes = byteArray;

        console.log('second line',aesKeyBytes);
        var aesKey;
        this.file = this.filesUploaded[0];
       /*if (this.file.size > this.MAX_FILE_SIZE) {
            window.console.log('File Size is to long');
            return ;
        }*/
        //this.showLoadingSpinner = true;
        // create a FileReader object 
        this.fileReader= new FileReader();
        // set onload function of FileReader object  
        this.fileReader.onloadend = (() => {
            console.log('onloadend');
            this.fileContents = this.fileReader.result;
            var iv = window.crypto.getRandomValues(new Uint8Array(16));
            console.log('this.fileContents',this.fileContents);
            console.log('iv--->',iv);
            console.log('aesKeyBytes--->',aesKeyBytes);
            console.log('aesKey--->',aesKey);

            //let base64 = 'base64,';
            //this.content = this.fileContents.indexOf(base64) + base64.length;
            //this.fileContents = this.fileContents.substring(this.content);
            // call the uploadProcess method 
            //this.saveToFile();
            var dUrl = '/tempFileUrl';
            window.crypto.subtle.encrypt(
                {name: "AES-CBC", iv: iv},
                aesKey,
                new Uint8Array(this.fileContents)
            ).
            then(result=> {
                var blob = new Blob([iv, new Uint8Array(result)], {type: "application/octet-stream"});
                var blobUrl =  URL.createObjectURL(blob);
                console.log('blobUrl',blobUrl);
                /*document.getElementById("download-links").insertAdjacentHTML(
                    'beforeEnd',
                    '<li><a href="' + blobUrl + '" download="test.pdf.encrypted">Encryption of test</a></li>'
                    );*/
                    var downloadLink = '<a href="' + blobUrl + '" download="' +this.fileName+ '.encrypted">Encrypted File</a>';
                    console.log('downloadLink',downloadLink);
                    console.log('fileName',this.fileName);
                    //CustomFileUploader.integrateFile(blob,blobUrl);
                    return blobUrl;
                
            }).
            catch(function(err) {
                alert("Encryption failed: " + err.message);
            });

        });
        this.showLoadingSpinner = false;
        //this.fileReader.readAsDataURL(this.file);
        //this.fileReader.readAsArrayBuffer(this.file);
        var fReader = this.fileReader;
        var fFile = this.file;
                // Import the key, and trigger the file reader when it's ready
                window.crypto.subtle.importKey(
                    "raw",
                    aesKeyBytes,
                    {name: "AES-CBC", length: 128},
                    true,
                    ["encrypt", "decrypt"]
                ).
                then(function(importedKey) {
                    aesKey = importedKey;
                    fReader.readAsArrayBuffer(fFile);
                }).
                catch(function(err) {
                    alert("Key import and file read failed: " + err.message);
                });

                return fUrl;
    }

    // Calling apex class to insert the file
    /*saveToFile() {
        saveFile({ idParent: this.recordId, strFileName: this.file.name, base64Data: encodeURIComponent(this.fileContents)})
        .then(result => {
            window.console.log('result ====> ' ,result);
            // refreshing the datatable
            this.getRelatedFiles();

            this.fileName = this.fileName + ' - Uploaded Successfully';
            this.UploadFile = 'File Uploaded Successfully';
            this.isTrue = true;
            this.showLoadingSpinner = false;

            // Showing Success message after file insert
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: this.file.name + ' - Uploaded Successfully!!!',
                    variant: 'success',
                }),
            );

        })
        .catch(error => {
            // Showing errors if any while inserting the files
            window.console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while uploading File',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }*/

    static integrateFile(blob,bloburl)
    {
        this.downloadUrl = bloburl;
        this.fileName = 'test';
        console.log('this.downloadUrl',this.downloadUrl);
        
        const calloutURI = 'https://icanhazdadjoke.com';
        // requires whitelisting of calloutURI in CSP Trusted Sites
        fetch(calloutURI, {
            method: "GET",
            headers: {
                "Accept": "application/json"
              }
        }).then(
            (response) => {
                if (response.ok) {
                    return response.json();
                } 
            }
        ).then(responseJSON => {
            console.log(responseJSON.joke);
        });
    }
    // Getting releated files of the current record
    /*getRelatedFiles() {
        releatedFiles({idParent: this.recordId})
        .then(data => {
            this.data = data;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }

    // Getting selected rows to perform any action
    getSelectedRecords(event) {
        let conDocIds;
        const selectedRows = event.detail.selectedRows;
        conDocIds = new Set();
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            conDocIds.add(selectedRows[i].ContentDocumentId);
        }

        this.selectedRecords = Array.from(conDocIds).join(',');

        window.console.log('selectedRecords =====> '+this.selectedRecords);
    }*/

    hexStringToByteArray(hexString) 
    {
        if (hexString.length % 2 !== 0) {
            throw Error("Must have an even number of hex digits to convert to bytes");
        }

        var numBytes = hexString.length / 2;
        var byteArray = new Uint8Array(numBytes);
        for (var i=0; i<numBytes; i++) {
            byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
        }
        return byteArray;
        
    }

}