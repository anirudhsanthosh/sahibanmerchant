export default class loader{
    #loader;
    visible = false;

    constructor(){
         this.#loader= document.querySelector('.loader');

        fetch('img/main_icon.svg')
        .then(response=>response.text())
        .then(logo=> {
            this.#loader.innerHTML = logo;
            this.hide()

        })
        .catch(err=>{
            this.#loader.innerHTML = "Please wait... Loading....!"
            this.hide()
        });
    }

    show(){
        this.#loader.style.display = "flex";
        this.visible = true;
    }
    hide(){
        this.#loader.style.display = "none";
        this.visible = false;
    }
}

