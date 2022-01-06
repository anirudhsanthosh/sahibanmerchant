export default class loader{
    #loader;

    constructor(){
         this.#loader= document.querySelector('.loader');

        fetch('img/main_icon.svg')
        .then(response=>response.text())
        .then(logo=> this.#loader.innerHTML = logo)
        .catch(err=>{
            this.#loader.innerHTML = "Please wait... Loading....!"
        });
    }

    show(){
        this.#loader.style.display = "flex";
    }
    hide(){
        this.#loader.style.display = "none";
    }
}

