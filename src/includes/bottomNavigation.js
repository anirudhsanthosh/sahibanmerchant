
import browser from "./inAppBrowser.js";

export default class bottomNavigator{
    #element = document.getElementById("bottomNav-container");
    #baseUrl;
    #buttons=[
        {
            name : "home",
            icon : "md-home",
            id: "home",
            active:true,
            indication :true,
            onclick: ()=>{
                // window.activeBrowser?.close?.();
                window.activeBrowser?.hide();
                window.activeBrowser = null;
                window.activeNavigator = window.activeNavigator ?? document.getElementById("navigator");
                window.activeNavigator.bringPageTop('pages/home.html').then((event)=>{
                    console.log("page has pushed to top",event);
                });
            }
        },
        {
            name : "categories",
            icon : "md-apps",
            id: "catagoriesPage",
            active:false,
            indication :true,
            onclick: ()=>{
                // window.activeBrowser?.close?.();
                window.activeBrowser?.hide();
                window.activeBrowser = null;
                window.activeNavigator = window.activeNavigator ?? document.getElementById("navigator");
                window.activeNavigator.bringPageTop('pages/catagories.html').then((event)=>{
                document.getElementById("search-input").focus();
                });
            }
        },
        {
            name : "search",
            icon : "fa-search",//"md-shopping-cart",
            id: "searchPage",
            active:false,
            indication :true,
            postpush : ()=>{
                document.getElementById("search-input").focus();
            },
            onclick: ()=>{
                // window.activeBrowser?.close?.();
                // window.activeBrowser?.hide();
                // window.activeBrowser = null;
                window.activeNavigator = window.activeNavigator ?? document.getElementById("navigator");
                window.activeNavigator.bringPageTop('pages/search.html').then((event)=>{
                    console.log("page has pushed to top",event);
                });
            }
        },

        {
            name : "cart",
            icon : "fa-shopping-basket",//"md-shopping-cart",
            active:false,
            indication :false,
            onclick: ()=>{
                // window.activeBrowser?.close?.();
                window.activeBrowser?.hide();
                window.activeBrowser = null;
                window.activeBrowser = new browser("https://shoper.rf.gd/cart/");
            }
        },
        {
            name : "account",
            icon : "fa-user",//"md-account-circle",
            active:false,
            indication :false,
            onclick: ()=>{
                // window.activeBrowser?.close?.();
                window.activeBrowser?.hide();
                window.activeBrowser = null;
                window.activeBrowser = new browser("https://shoper.rf.gd/my-account/");
            }
        },

    ];

    constructor(baseurl){
        this.#baseUrl = baseurl;
        this.#buttons.map(button =>this.#createButton(button))

    }

    #createButton(data){

        let button = document.createElement("div");
        if(data.active) button.classList.add("active");
        button.classList.add("bottomNav-btn");

        let icon = document.createElement("ons-icon");
        icon.setAttribute("icon",data.icon);
        
        let text = document.createElement("span");
        text.textContent = data.name;

        button.append(icon,text);
        button.onclick = ()=>{
            // if(data.indication){
            //     Array.from(this.#element.children).map(button => button.classList.remove("active"))
            //     button.classList.add("active");
            // }
            data.onclick();
        }

        document.addEventListener("postpush",(event)=>{
            
            if(event.enterPage.id == data.id){
                if(data.indication){
                    Array.from(this.#element.children).map(button => button.classList.remove("active"))
                    button.classList.add("active");
                }
            }
            data?.postpush?.();
          })

        document.addEventListener("postpop",(event)=>{
            console.log(event);
            if(event.navigator.topPage.id == data.id){
                if(data.indication){
                    Array.from(this.#element.children).map(button => button.classList.remove("active"))
                    button.classList.add("active");
                }
            }
          })


        this.#element.appendChild(button);

    }

    show(){
        this.#element.parentElement.style.display=""
    }

    hide(){
        this.#element.parentElement.style.display="none"
    }
}