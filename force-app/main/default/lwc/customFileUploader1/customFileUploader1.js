import { LightningElement,api,track } from 'lwc';

export default class CustomFileUploader1 extends LightningElement {
    @api encryptionKey='123c4af94aaea41df904e4060e0da105b23';
    @api aesKey;
    @track encryptionKey1;
    @track fileName = '';
    @track isTrue = false;
    file;
    fileReader;

    // Set up listeners for each button in the UI
    connectedCallback() {
        console.log('SecureWindow',window.crypto.subtle);
        //console.log('videoType',videoType);
    }
    
    handleFilesChange(event) {
        if(event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            this.fileName = event.target.files[0].name;
        }
    }

    handleSave() {
        console.log('handleSave');
        if(this.filesUploaded.length > 0) {
            this.uploadHelper();
        }
        else {
            this.fileName = 'Please select file to upload!!';
        }
    }

    uploadHelper() {
        this.file = this.filesUploaded[0];
       /*if (this.file.size > this.MAX_FILE_SIZE) {
            window.console.log('File Size is to long');
            return ;
        }*/
        //this.showLoadingSpinner = true;
        // create a FileReader object 
        this.fileReader= new FileReader();
        console.log('this.fileReader-->',this.fileReader);
        // set onload function of FileReader object  
        this.fileReader.onloadend = (() => {
            console.log('onloaded');    
            var iv = window.crypto.getRandomValues(new Uint8Array(16));
            console.log('iv',iv);
            console.log('this.fileReader.result',this.fileReader.result);
            window.crypto.subtle.encrypt(
                {name: "AES-CBC", iv: iv},
                aesKey,
                new Uint8Array(this.fileReader.result)
            ).
            then(function(result) {
                var blob = new Blob([iv, new Uint8Array(result)], {type: "application/octet-stream"});
                var blobUrl = URL.createObjectURL(blob);
console.log('blobUrl',blobUrl);
                /*document.getElementById("download-links").insertAdjacentHTML(
                    'beforeEnd',
                    '<li><a href="' + blobUrl + '" download="' + sourceFile.name + '.encrypted">Encryption of ' + sourceFile.name + '</a></li>'
                    );*/
            }).
            catch(function(err) {
                alert("Encryption failed: " + err.message);
            });

            //this.fileContents = this.fileReader.result;
            //let base64 = 'base64,';
            //this.content = this.fileContents.indexOf(base64) + base64.length;
            //this.fileContents = this.fileContents.substring(this.content);
            // call the uploadProcess method 
            //this.saveToFile();
        });
    
        //this.fileReader.readAsDataURL(this.file);
    }

    // Utility functions
    arrayBufferToHexString(arrayBuffer) {
        console.log('inside');
        var byteArray = new Uint8Array(arrayBuffer);
        var hexString = "";
        var nextHexByte;

        for (var i=0; i<byteArray.byteLength; i++) {
            nextHexByte = byteArray[i].toString(16);  // Integer to base 16
            if (nextHexByte.length < 2) {
                nextHexByte = "0" + nextHexByte;     // Otherwise 10 becomes just a instead of 0a
            }
            hexString += nextHexByte;
        }
        return hexString;
    }

    generateAESKey(event) {
        this.encryptionKey = event.target.label;
        var tst;
        window.crypto.subtle.generateKey(
            {name: "AES-CBC", length: 128}, // Algorithm using this key
            true,                           // Allow it to be exported
            ["encrypt", "decrypt"]          // Can use for these purposes
        ).
        then(function(aesKey) {
            window.crypto.subtle.exportKey('raw', aesKey).
            then(aesKeyBuffer => {
                console.log('aesKeyBuffer',aesKeyBuffer);
                tst = CustomFileUploader1.arrayBufferToHexString(aesKeyBuffer);
                console.log(this.template.querySelector('#encKey'));
                this.encryptionKey1 = tst;
            }).
            catch(function(err) {
                alert("Key export failed: " + err.message);
            });
        }).
        catch(function(err) {
            alert("Key generation failed: " + err.message);
        });
        
    }

    encryptFile(event)
    {

    }

    static arrayBufferToHexString(arrayBuffer)
    {
        var byteArray = new Uint8Array(arrayBuffer);
        var hexString = "";
        var nextHexByte;

        for (var i=0; i<byteArray.byteLength; i++) {
            nextHexByte = byteArray[i].toString(16);  // Integer to base 16
            if (nextHexByte.length < 2) {
                nextHexByte = "0" + nextHexByte;     // Otherwise 10 becomes just a instead of 0a
            }
            hexString += nextHexByte;
        }
        console.log('hexString-->',hexString);
        return hexString;
    }

    static hexStringToByteArray(hexString) 
    {/*
        if (hexString.length % 2 !== 0) {
            throw Error("Must have an even number of hex digits to convert to bytes");
        }

        var numBytes = hexString.length / 2;
        var byteArray = new Uint8Array(numBytes);
        for (var i=0; i<numBytes; i++) {
            byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
        }
        return byteArray;
        */
    }

    

    get videoType() {
        return 'video test';
    }
}