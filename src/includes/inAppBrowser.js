export default class browser {
  #target = "_system"; //"_blank";
  #options = "location=no,hidden=yes,beforeload=yes,zoom=no,fullscreen=no";
  #browser;
  #url;
  #cssList = ["./css/includes/site_aditional_style.css"];
  #scriptList = ["./js/includes/additional_site_script.js"];
  #css = " ";
  #script = " ";
  constructor(url) {
    console.log(url);

    // calling ajax loader
    ajaxloader.show();

    let sheets = this.#cssList.map(async (sheet) => {
      let response = await fetch(sheet);
      let style = await response.text();
      return style;
    });

    Promise.all(sheets).then((sheets) => {
      let styles = sheets.map((sheet) => sheet);
      this.#css = styles.join("\n");
      // console.log(this.#css);
    });

    let js = this.#scriptList.map(async (sheet) => {
      let response = await fetch(sheet);
      let style = await response.text();
      return style;
    });

    Promise.all(js).then((sheets) => {
      let styles = sheets.map((sheet) => sheet);
      this.#script = styles.join("\n");
    });

    this.#browser = cordova.InAppBrowser.open(url, this.#target, this.#options);
    this.#browser.addEventListener("loadstart", this.#loadstart);

    this.#browser.addEventListener("loadstop", this.#loadstop);

    this.#browser.addEventListener("loaderror", this.#loaderror);

    this.#browser.addEventListener("beforeload", this.#beforeload);

    this.#browser.addEventListener("message", this.#message);

    this.#browser.addEventListener("exit", this.#exit);
    window.activeBrowser = this;
  }

  #loadstart = (event) => {
    console.log("loadStartCallBack:::::::::::::", event);
    ajaxloader.show();
    this.#browser.hide();
  };

  #loadstop = (event) => {
    console.log("loadStopCallBack:::::::::", event);
    if (this.#browser == undefined) return;
    this.#browser.insertCSS({ code: this.#css });
    this.#browser.executeScript(
      { code: this.#script },
      this.#executeScriptCallBack
    );

    //TO.DO

    this.#browser.show();
    ajaxloader.hide();
  };
  #loaderror = (event) => {
    console.log("loadErrorCallBack:::::::::::::", event);
    this.#browser.hide();
    reloader.show();
  };
  #beforeload = (event, callback) => {
    console.log(
      ":::::::::::::::::::::::::::before loadCallBack:::::::::",
      event
    );
    this.#browser.executeScript(
      { code: `console.log("before load called")` },
      this.#executeScriptCallBack
    );
    //    TO DO
    ajaxloader.show();
    this.#browser.hide();

    callback(event.url);
  };
  #executeScriptCallBack = (event) => {
    console.log("executeScriptCallBack:::::::::::::", event);
  };

  #message = (event) => {
    console.log("messageCallBack:::::::::", event);
    console.log(event?.data?.pageId);
    switch (event?.data?.pageId) {
      case "home":
        // this.#browser?.close();
        this.#browser?.hide();
        window.activeBrowser = null;
        window.activeNavigator.bringPageTop("pages/home.html");
        // this.#browser?.close();
        break;
      case "categoryPage":
        // this.#browser?.close();
        this.#browser?.hide();
        window.activeBrowser = null;
        window.activeNavigator.bringPageTop("pages/catagories.html");
        // this.#browser?.close();
        break;
      case "searchPage":
        // this.#browser?.close();
        this.#browser?.hide();
        window.activeBrowser = null;
        window.activeNavigator.bringPageTop("pages/search.html");
        // this.#browser?.close();
        break;
      case "cart":
        // this.#browser?.close?.();
        this.#browser?.hide();
        window.activeBrowser = null;
        window.activeBrowser = new browser("http://shoper.rf.gd/cart/");
        // this.#browser?.close();
        break;
      case "account":
        // this.#browser?.close?.();
        this.#browser?.hide();
        window.activeBrowser = null;
        window.activeBrowser = new browser("http://shoper.rf.gd/my-account/");
        // this.#browser?.close();
        break;

      default:
        break;
    }
  };
  #exit = (event) => {
    console.log("exitCallback::::::::::::", event);
    window.ajaxloader.hide();
  };

  close() {
    // this.#browser.close();
    this.#browser.hide(); // for some reason closing the inapp browser causing an issue; the tabs will nit open until the variable is assigned with null or other value
  }
  show() {
    this.#browser.show();
  }
  hide() {
    this.#browser.hide();
  }
}
