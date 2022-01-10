export default class browser{
    #target = "_blank";
    #options = "location=no,hidden=yes,beforeload=yes,zoom=no,fullscreen=no";
    #browser ;
    #url;
    #cssList =["./css/includes/site_aditional_style.css"];
    #scriptList =[];
    #css = " ";
    #script = " ";
    constructor(url){
        console.log(url);

        // calling ajax loader
        ajaxloader.show();

        let sheets = this.#cssList.map(async sheet => {
           let response = await fetch(sheet);
           let style = await response.text();
           return style;
        });
        
       
       Promise.all(sheets).then(sheets=>{
        let styles =  sheets.map(sheet=> sheet);
        this.#css = styles.join("\n");
        // console.log(this.#css);
        });



        
        this.#browser = cordova.InAppBrowser.open(url,this.#target,this.#options);
        this.#browser.addEventListener('loadstart', this.#loadstart);

        this.#browser.addEventListener('loadstop', this.#loadstop);

        this.#browser.addEventListener('loaderror', this.#loaderror);

        this.#browser.addEventListener('beforeload', this.#beforeload);

        this.#browser.addEventListener('message', this.#message);

        this.#browser.addEventListener('exit', this.#exit);
    }


    #loadstart = (event)=>{
        console.log("loadStartCallBack:::::::::::::",event);
        ajaxloader.show();
        this.#browser.hide();
    }

    #loadstop = (event)=>{
        console.log("loadStopCallBack:::::::::",event);
        if (this.#browser == undefined) return;
        // this.#cssList.map(sheet=>{
        //     this.#browser.insertCSS({ file: sheet },(e) => console.log(e));
        // })
        this.#browser.insertCSS({ code: this.#css });
    

        //TO.DO

        this.#browser.show();
        ajaxloader.hide();

    }
    #loaderror = (event)=>{
        console.log("loadErrorCallBack:::::::::::::",event)
        this.#browser.hide();
        reloader.show();
    }
    #beforeload = (event,callback)=>{
        console.log(":::::::::::::::::::::::::::before loadCallBack:::::::::",event)
        this.#browser.executeScript({ code: `console.log("before load called")`},this.#executeScriptCallBack);
    //    TO DO 
        ajaxloader.show();
        this.#browser.hide();


        callback(event.url);
    }
    #executeScriptCallBack = (event)=>{
        console.log("executeScriptCallBack:::::::::::::",event)
    }

    #message= (event)=>{
        console.log("messageCallBack:::::::::",event)
    }
    #exit = (event)=>{
        console.log("exitCallback::::::::::::",event);
    }
}