export default class browser{
    #target = "_blank";
    #options = "location=no,hidden=yes,beforeload=yes,zoom=no,fullscreen=no";
    #browser ;
    #url;
    constructor(url){
        this.#browser = cordova.InAppBrowser.open(url,this.#target,this.#options);
    }
}