export default class reload{
    #reloader;
    constructor(element){
        this.#reloader= document.querySelector('.reloader');

        fetch('img/reload_img.svg')
        .then(response=>response.text())
        .then(logo=> {
            let div = document.createElement("div");
            div.innerHTML = logo;
            this.#reloader.appendChild(div);
            this.#addButton();
        })
        .catch(err=>{
            this.#reloader.innerHTML = "Something went wrong...!"
        });
    }

    #addButton(){

        let heading = document.createElement("h5");
        heading.innerText = "Oops, something is not right..!";
        this.#reloader.appendChild(heading);

        let button = document.createElement("ons-button");
        button.onclick = ()=> location.reload();
        this.#reloader.appendChild(button);
        button.innerText = "Reload";
    }

    show(){
        this.#reloader.style.display = "flex";
    }
    hide(){
        this.#reloader.style.display = "none";
    }

}