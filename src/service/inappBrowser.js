import { SITE, API_URL, LOGIN_NODE } from "../config";
import userModal from "../modal/user/userModal";

export default class Browser {
  #target = "_blank";
  #url;
  #resolve;
  #reject;
  #headers;
  #options =
    "location=no,hidden=yes,beforeload=yes,zoom=no,fullscreen=no,hardwareback=no"; //clearcache=yes
  #logoutOptions =
    "location=no,hidden=yes,beforeload=yes,zoom=no,fullscreen=no,clearcache=yes";
  #browser;
  #userLoggedIn = false;
  #userTryToPay = false;
  #paymentSuccess = false;
  #errorOccuredWhileLoading = false;
  #loadErrorMessage = "";

  constructor({ url, headers }) {
    this.#url = url;
    this.#headers = headers;
  }
  init() {
    this.#browser = cordova.InAppBrowser.open(
      this.#url,
      this.#target,
      this.#options
    );

    this.#browser.addEventListener("loadstart", this.#loadstart);

    this.#browser.addEventListener("loadstop", this.#loadstop);

    this.#browser.addEventListener("loaderror", this.#loaderror);

    this.#browser.addEventListener("beforeload", this.#beforeload);

    this.#browser.addEventListener("message", this.#message);

    this.#browser.addEventListener("exit", this.#exit);

    window.activeBrowser = this;

    return new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  #loadstart = (event) => {
    console.log("loadStartCallBack:::::::::::::", event);
    ajaxloader.show();
    this.#browser.hide();
  };

  #loadstop = (event) => {
    console.log("loadStopCallBack:::::::::", event);
    if (this.#browser == undefined) return;
    // this.#browser.insertCSS({ code: this.#css });
    this.#browser.executeScript(
      { code: this.#script() },
      this.#executeScriptCallBack
    );
    // this.#browser.show();
  };

  #loaderror = (event) => {
    console.log("loadErrorCallBack:::::::::::::", event);
    this.#errorOccuredWhileLoading = true;
    this.#loadErrorMessage = event.message;
    this.#browser.close();
  };

  #beforeload = (event, callback) => {
    console.log(
      ":::::::::::::::::::::::::::before loadCallBack:::::::::",
      event
    );

    callback(event.url); // we can direct user to any url with this
  };

  #executeScriptCallBack = (event) => {
    console.log("executeScriptCallBack:::::::::::::", event);
    // ajaxloader.hide();
  };

  #message = (event) => {
    console.log("messageCallBack:::::::::", event);

    // actions
    switch (event?.data?.action) {
      case "exit":
        return this.close();
        break;
      case "show":
        return this.#browser.show();
        break;
      case "hide":
        return this.#browser.hide();
        break;

      default:
        break;
    }

    // sates
    switch (event?.data?.state) {
      case "loggedIn":
        this.#userLoggedIn = true;
        break;
      case "tryToPay":
        this.#userTryToPay = true;
        break;
      case "paymentSuccess":
        this.#paymentSuccess = true;
        break;

      default:
        break;
    }
  };

  #exit = (event) => {
    console.log("exitCallback::::::::::::", event);
    this.#resolve({ success: "set" });
  };

  close() {
    this.#browser.close();
    this.#browser.hide(); // for some reason closing the inapp browser causing an issue; the tabs will nit open until the variable is assigned with null or other value
  }

  show() {
    this.#browser.show();
  }

  hide() {
    this.#browser.hide();
  }

  //this script willl inject auth data to the iab  at login page and and force a login form submission
  // so that the request will be sent to the server and auth cookies will be set
  //after successfull authentication we can move to phase 2 aka checkout
  // the context of this script will be a new activity in the iab
  #script() {
    return `
  // setting url and auth

    const url = ${JSON.stringify(SITE + "my-account/")};// my-account/
    const auth = ${JSON.stringify(userModal.getAuth())};
    const userId = '${JSON.stringify(userModal.get().userId)}';

    function fillData(data){
      if(!isHomeSite()) return show(); // if this is not homesite then show iab
      if(isLogged()) return goToCheckout();
      // if not logged in then fill the data
      if(window.location.pathname.indexOf('/my-account') < 0) return exit();
      const {username,password} = data;
      document.querySelector('#username').value = username;
      document.querySelector('#password').value = password;
      document.querySelector('#rememberme').checked = true;
      document.querySelector('button[name=login][type=submit]').click();
  
    }

    fillData(auth);


    // find we are logged in or not if logged in then move to checkout

    function  isLogged(){
       return (  document.querySelector('#activeUser').innerText.trim() === userId);
    }
    
    // got to checkout
    function goToCheckout(){
      if(!isHomeSite()) return show();
      if(isCheckout()) return show();
      if(isCart()) exit();
      window.location.replace(${JSON.stringify(SITE + "checkout/")});
    }
    

    function isCheckout(){
      return window.location.pathname.indexOf('/checkout') > -1;
    }

    function isCart(){
      return window.location.pathname.indexOf('/cart') > -1;
    }

    // check we are on shopping site not at payment gatway
    function isHomeSite(){
      const url = new URL('${SITE}');
      const host = url.host;
      return (window.location.toString().indexOf(host) > -1) 
    }

    function message(msg){
      let stringifiedMessageObj = JSON.stringify(msg);
      webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);
    }

    function  isOrderRecieved(){
      return window.location.pathname.indexOf('checkout/order-received') > -1;
    }

    function exit(){
      console.log('exit')
      const msg ={
        action : "exit",
    }
      message(msg);
    }

    function show(){
      const msg ={
        action : "show",
      }
      message(msg);
    }
    function hide(){
      const msg ={
        action : "hide",
      }
      message(msg);
    }


  
  `;
  }
}
