
export {httpGetAsync,androidHttp,getWithBypassAES,getImage,get}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
      };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.withCredentials = true;
    xmlHttp.send(null);


}

function androidHttp(url,callback) {
    cordova.plugin.http.get(
      url,
      {},
      {},
      function (response) {
        callback(response);
      },
      function (response) {
        console.error(response.error);
      }
    );
  }

  class getWithBypassAES{
      constructor(options={}){
          if(options.lenth !=0){
            //TO DO implement options
              console.log("to do1: ",options);
          }
      }

      get(url,callback){
        if(url=="") throw new Error("unable to create getWithBypassAES, please provide a valid url");
        if( !cordova || !cordova.plugin|| !cordova.plugin.http) throw new Error("unable to create getWithBypassAES, plugin http is not found");
        return new Promise((resolve,reject)=>{
            if(cordova.platformId == "browser") cordova.plugin.http.clearCookies();     
            cordova.plugin.http.get(
                url,
                {},// data parameters in form key:value
                {},// headers
                function (response) {
                
                 try{
                    //  console.log("from try block: ",response.data);
                    let indexOfCheck = response.data.indexOf('function toNumbers(d){var e=[];');
                    if(indexOfCheck == -1) return resolve(response);
                    console.log("errr found!!!! need aesbypass");
                    // throw new Error("need aesBypass");

                    let parser = new DOMParser();
                    let htmlDoc = parser.parseFromString(response.data, "text/html");
                    let script = htmlDoc.querySelectorAll("script");
                    let starting = script[1].innerHTML.indexOf("document.cookie");
                    script[1].innerHTML = script[1].innerHTML.replace(
                      script[1].innerHTML.substring(starting, script[1].innerHTML.length),
                      ""
                    );
                    script[1].innerHTML += "toHex(slowAES.decrypt(c, 2, a, b));";
                    let token = eval(script[1].innerHTML);
                    
                    let host = new URL(url).origin;

                    console.log(host," : ",token)

                    document.cookie = "__test=" + token +"; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
                    document.cookie = "__test=" + token + "; expires=Thu, 31-Dec-37 23:55:55 GMT ;path=/";
                    localStorage.setItem(host,"__test=" + token );
                    if(cordova.platformId !== "browser") cordova.plugin.http.setCookie(host,"__test=" + token,{});
                    let header = cordova.platformId !== "browser"? {} : {};//{Cookie : localStorage.getItem(host)}
                    
                    cordova.plugin.http.get(
                      url,
                      {},// data parameters in form key:value
                      header,// headers
                      (result)=>{
                        resolve(result);
                      },
                      (err)=>{
                        
                        reject(err);
                      }
                    )

                 }catch(e){
                 
                 }
                },
                function (error) {
                  reject(error);
                }
              );
        })

      }
  }

  class getImage{

    constructor(){
      
    }

    get(url){
      return new Promise((resolve,reject)=>{
        cordova.plugin.http.sendRequest(url, this.#options, function(response) {
            
            if(!response.data) reject("unknown error");

            // var bytes = new Uint8Array(response.data);
            var arrayBufferView = new Uint8Array( response.data );
            var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL( blob );

            resolve(imageUrl);
          }, function(response) {
           
           
            reject(response)
          });
      })
    }
    #options = {
      responseType: "arraybuffer",
    }

    #toDataUrl(msg) {
      
      var bytes = new Uint8Array(msg);
      return 'data:image/png;base64,'+encode(bytes);
    };
  };

  class get{
    constructor(url){
      return new Promise((resolve,reject)=>{
        cordova.plugin.http.get(url,{},{},(response)=>{
          resolve(response);
        },(err)=>{
          reject(err);
        })
      })
    }
  }