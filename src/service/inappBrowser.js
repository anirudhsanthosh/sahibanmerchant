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
  #failedPayment = false;

  constructor({ url, headers }) {
    this.#url = url;
    this.#headers = headers;
  }
  init() {
    return new Promise((resolve, reject) => {
   
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

    
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  #loadstart = (event) => {
    // console.log("loadStartCallBack:::::::::::::", event);
    this.#browser.hide();
  };

  #loadstop = (event) => {
    // console.log("loadStopCallBack:::::::::", event);
    if (this.#browser == undefined) return;
    // this.#browser.insertCSS({ code: this.#css });
    this.#browser.executeScript(
      { code: this.#script() },
      this.#executeScriptCallBack
    );
  };

  #loaderror = (event) => {
    // console.log("loadErrorCallBack:::::::::::::", event);
    this.#errorOccuredWhileLoading = true;
    this.#loadErrorMessage = event.message;
    this.#browser.close();
  };

  #beforeload = (event, callback) => {
    // console.log(
    //   ":::::::::::::::::::::::::::before loadCallBack:::::::::",
    //   event
    // );

    callback(event.url); // we can direct user to any url with this
  };

  #executeScriptCallBack = (event) => {
    // console.log("executeScriptCallBack:::::::::::::", event);
    // ajaxloader.hide();
  };

  #message = (event) => {
    console.log("messageCallBack:::::::::", event);
    console.log(event?.data);
    // actions - used to manage visual state of iab
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

    // sates-used to manage the payment state of checkout
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
      case "failedPayment":
        this.#failedPayment = true;
        break;

      default:
        break;
    }
  };

  /**
   * thsis will be get called when iab is clossed
   * @param {*} event
   * @returns status of payment
   */
  #exit = (event) => {
    // console.log("exitCallback::::::::::::", event);

    const template = {
      error: true,
      success: false,
      message: "Checkout aborted.",
      code: "checkout_aborted",
    };

    if (this.#paymentSuccess) {
      template.success = true;
      template.error = false;
      template.message = "Payment Successful.";
      template.code = "payment_success";
      return this.#resolve(template);
    }
    // payment failed
    if (this.#failedPayment) {
      template.message = "payment failed";
      template.code = "payment_faild";
      return this.#reject(template);
    }

    // load error may be network error or server error
    if (this.#errorOccuredWhileLoading) {
      template.message = this.#loadErrorMessage;
      template.code = "load_error";
      return this.#reject(template);
    }

    // user is unable to authenticate at checkout
    if (!this.#userLoggedIn) {
      template.message = "Checkout has aborted, failed to authenticate.";
      template.code = "failed_to_authenticate";
      return this.#reject(template);
    }
    // either user has canceled or some other reasons the user was unable to pay after reaching the payment page
    if (this.#userTryToPay && !this.#failedPayment) {
      template.message = "Checkout has aborted from pament page.";
      template.code = "checkout_aborted_from_payment_page";
      return this.#reject(template);
    }

    // user has canceled the payment
    return this.#reject(template);
  };

  close() {
    this.#browser.hide(); // for some reason closing the inapp browser causing an issue; the tabs will nit open until the variable is assigned with null or other value
    setTimeout(() => this.#browser.close(), 200);
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

    const url = ${JSON.stringify(SITE + "my-account/")};
    const auth = ${JSON.stringify(userModal.getAuth())};
    const userId = '${JSON.stringify(userModal.get().userId)}';
    const triedToPay = ${JSON.stringify(this.#userTryToPay)};
    
    //fill data in the login form
    function fillData(data){
      const {username,password} = data;
      document.querySelector('#username').value = username;
      document.querySelector('#password').value = password;
      document.querySelector('#rememberme').checked = true;
      document.querySelector('button[name=login][type=submit]').click();
  
    }
    // validate current page and set state 
    function validateSite(){
      if(!isHomeSite()) return show(); // if this is not homesite then show iab

      if(isLogged()) {
        loggedIn(); // send user is logged in message back to app
        if(isOrderRecieved()) orderRecieved();// send order recieved to app
        if(isOrderPaymentStage()) orderPaymentStage();// send user has reached payment page to app
        if(isPaymentFailed()) return paymentFailed(); // check the payment has faild or not befor returning true for checkout
        return goToCheckout(); // hence the user is logged in mve location to checkout
      }

      // if not logged in then fill the data
      // once again confirm user is on my-account page
      if(window.location.pathname.indexOf('/my-account') < 0) return exit();
      // filll data in the login form
      fillData(auth);
    }
    validateSite();

    // find we are logged in or not if logged in then move to checkout

    function  isLogged(){
       return (  document.querySelector('#activeUser').innerText.trim() === userId);
    }
    
    // got to checkout
    function goToCheckout(){

      if(!isHomeSite()) return show(); // if this is not homesite then show iab
     
      if(isCheckout()) return show();// if user is already on checkout page then show iab
      if(isCart()) exit();// if user is on cart page then exit iab wich means the user cart is empty of user failed to login
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

    function  isOrderRecieved(){
      return window.location.pathname.indexOf('checkout/order-received') > -1;
    }
    function  isOrderPaymentStage(){
      return window.location.pathname.indexOf('checkout/order-pay/') > -1;
    }

    function isPaymentFailed(){
      return (window.location.pathname.match(/\\/checkout\\/$/gm) && triedToPay)
    }

    function message(msg){
      let stringifiedMessageObj = JSON.stringify(msg);
      webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);
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

    function orderRecieved(){
      const msg ={
        state : "paymentSuccess",
      }
      message(msg);
      setTimeout(()=>{exit()},2000); // exit iab after 2s;
    }
    function orderPaymentStage(){
      const msg ={
        state : "tryToPay",
      }
      message(msg);
    }
    function loggedIn(){
      const msg ={
        state : "loggedIn",
      }
      message(msg);
    }

    function  paymentFailed(){
      const msg ={
        state : "failedPayment",
      }
      message(msg);
      setTimeout(()=>{exit()},2000); // exit iab after 2s;
    }


  
  `;
  }
}
