export default class splashScreen{
    #splashScreen;

    constructor(){
         this.#splashScreen= document.querySelector('.splashScreen');

        fetch('img/main_logo.svg')
        .then(response=>response.text())
        .then(logo=> this.#splashScreen.innerHTML = logo)
        .catch(err=>{
            this.#splashScreen.innerHTML = "Please wait... Loading....!"
        });
    }

    show(){
        this.#splashScreen.style.display = "flex";
    }
    hide(){
        this.#splashScreen.style.display = "none";
    }
}

