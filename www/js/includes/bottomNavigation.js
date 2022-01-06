export default class bottomNavigator{
    #element = document.getElementById("bottomNav-container");
    #baseUrl;
    #buttons=[
        {
            name : "home",
            icon : "md-home",
            active:true,
            onclick: ()=>{
                console.log("clicked");
            }
        },
        {
            name : "categories",
            icon : "md-apps",
            active:false,
            onclick: ()=>{
                console.log("clicked");
            }
        },
        {
            name : "cart",
            icon : "md-shopping-cart",
            active:false,
            onclick: ()=>{
                console.log("clicked");
            }
        },
        {
            name : "account",
            icon : "md-account-circle",
            active:false,
            onclick: ()=>{
                console.log("clicked");
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
            Array.from(this.#element.children).map(button => button.classList.remove("active"))
            button.classList.add("active");
            data.onclick();
        }

        this.#element.appendChild(button);

    }
}