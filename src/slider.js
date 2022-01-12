export {flexSlider,slider,mockFlexSlider};

class flexSlider{
    #images;
    #slider;
    #sliderContainer;
    #dotContainer;
    #slideIndex = 0;
    #slides;
    #controllers;
    #dots;


    constructor(images = [],elementId = ""){
        
        if(!Array.isArray(images) || images.length ===0){
            throw new Error('Unable to create slider instance, provide a valid arrray');
        }
        if(elementId.length ===0){
                    throw new Error('Unable to create slider instance, provide a valid element');
                }
        this.#images = images;
        try{
            this.#slider = document.getElementById(elementId);
        }
        catch(e){
            throw new Error('Unable to create slider instance, provide a valid element');
        }
        this.#slider.classList.add("flex-slider");
        this.#slides = this.#images.map(imgSrc => this.#createSlides(imgSrc));
        this.#slider.innerHTML = "";
        this.#slides.map(slide=> this.#slider.appendChild(slide))

    }

    #createSlides(imgSrc){
        let slide = document.createElement('div');
        slide.classList.add('flex-slide');
        let image = document.createElement('img');
        image.src = imgSrc;
        slide.appendChild(image);
        return slide;
    }
}

class mockFlexSlider{
    #slider;
    #slidesCount = 5;
    #slides = [];


    constructor(elementId = ""){
        
        
        if(elementId.length ===0){
                    throw new Error('Unable to create slider instance, provide a valid element');
                }
        
        try{
            this.#slider = document.getElementById(elementId);
        }
        catch(e){
            throw new Error('Unable to create slider instance, provide a valid element');
        }

        this.#slider.classList.add("flex-slider");
        for(let i=0; i<this.#slidesCount; i++){
           this.#slides.push(this.#createSlides())
        }
        this.#slides.map(slide=> this.#slider.appendChild(slide))

    }

    #createSlides(){
        let slide = document.createElement('div');
        slide.classList.add('flex-slide');
        let image = document.createElement('div');
        let width = screen.availWidth * 0.7; // 70% of screen width
        let height = 404/720*width;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        image.classList.add('skelton-loader',"img");
        slide.appendChild(image);
        return slide;
    }
}

export default class slider{
    #images;
    #slider;
    #sliderContainer;
    #dotContainer;
    #slideIndex = 0;
    #slides;
    #controllers;
    #dots;
    
    constructor(images = [],elementId = "") {
        if(!Array.isArray(images) || images.length ===0){
            throw new Error('Unable to create slider instance, provide a valid arrray');
        }
        if(elementId.length ===0){
                    throw new Error('Unable to create slider instance, provide a valid element');
                }
        this.#images = images;
        try{
            this.#slider = document.getElementById(elementId);
        }
        catch(e){
            throw new Error('Unable to create slider instance, provide a valid element');
        }

        this.#slider.classList.add('mam-slideshow');

        this.#sliderContainer = document.createElement('div');
        this.#sliderContainer.classList.add('mam-slideshow-container');
        this.#slider.appendChild(this.#sliderContainer);

        this.#dotContainer = document.createElement('div');
        this.#dotContainer.classList.add('mam-dot-container');
        this.#slider.appendChild(this.#dotContainer);

        this.#slides = this.#images.map((img,index)=> this.#createSlides(index));
        this.#controllers = this.#createControls();
        this.#dots = this.#createDots();

        
        this.#slides.map(slide => this.#sliderContainer.appendChild(slide));
        this.#controllers.map(controller => this.#sliderContainer.appendChild(controller))
        this.#dots.map(dot=>this.#dotContainer.appendChild(dot));

        this.#render();
        
 
    }

    #createSlides(slidenumber){
        
        let slideTemplate = `
        
            <div class="mam-numbertext">${slidenumber+1} / ${this.#images.length}</div>
            <img src="${this.#images[slidenumber]}" style="width:100%">
            <!--<div class="mam-slider-text">Caption Text</div>-->
        
        `;

        let slide = document.createElement('div');
        slide.classList.add('mam-slides','mam-fade');
        slide.innerHTML = slideTemplate
        return slide;
    }

    #createControls(){
        let controlls = ["mam-prev","mam-next"];
        let controllers = controlls.map(control=>{
            let button = document.createElement('a');
            button.classList.add(control);
            button.innerHTML = control == "mam-prev" ? "&#10094;" : "&#10095;";
            if(control == "mam-prev") button.onclick = ()=> this.#previous();
            else button.onclick = ()=> this.#next();

            return button;
        })
       return controllers;
    }

    #createDots(){
        let dots = this.#images.map((img,index)=>{
            let dot = document.createElement('span');
            dot.classList.add('mam-slider-dot')
            dot.onclick = ()=>{this.#currentSlide(index)}
            return dot;
        });
        return dots;
    }
    create(){
        
    }

    #next(){
        this.#slideIndex = this.#slideIndex >= this.#images.length-1 ?  0: this.#slideIndex+1 ;
        this.#render();
    }

    #previous(){
        this.#slideIndex = this.#slideIndex<= 0 ?  this.#images.length-1 : this.#slideIndex-1;
        this.#render();
    }

    #currentSlide(slideNumber){
        if(slideNumber<0 || slideNumber> this.#images.length) return false;
        this.#slideIndex = slideNumber;
        this.#render();
    }

    #render(){
        
        this.#slides.map((slide,index)=>{
            
            if(this.#slideIndex== index) slide.classList.remove('mam-slides');
            else slide.classList.add('mam-slides');
        })

        this.#dots.map((slide,index)=>{
            
            if(this.#slideIndex== index) slide.classList.add('mam-slider-active');
            else slide.classList.remove('mam-slider-active');
        })
    }



}

