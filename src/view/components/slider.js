export { flexSlider, slider, mockFlexSlider };

class simpleSlider {}

class flexSlider {
  #argumentSlides;
  #slider;
  #sliderContainer;
  #dotContainer;
  #slideIndex = 0;
  #slides;
  #controllers;
  #dots;

  constructor(slides = [], elementId = "") {
    if (!Array.isArray(slides) || slides.length === 0) {
      throw new Error(
        "Unable to create slider instance, provide a valid arrray"
      );
    }
    if (elementId.length === 0) {
      throw new Error(
        "Unable to create slider instance, provide a valid element"
      );
    }
    this.#argumentSlides = slides;
    try {
      this.#slider = document.getElementById(elementId);
    } catch (e) {
      throw new Error(
        "Unable to create slider instance, provide a valid element"
      );
    }
    this.#slider.classList.add("flex-slider");
    this.#slides = this.#argumentSlides.map((slide) =>
      this.#createSlides(slide)
    );
    this.#slider.innerHTML = "";
    this.#slides.map((slide) => this.#slider.appendChild(slide));
  }

  #createSlides(config) {
    let slide = document.createElement("div");
    slide.classList.add("flex-slide");
    let image = document.createElement("img", [], { loading: "lazy" });
    // if the image catching is not enabled fall back
    if (config.image) {
      window.fileCacheAdaptor
        .get(config.image)
        .then((url) => (image.src = url))
        .catch(() => (image.src = config.image));
    }

    image.setAttribute("loading", "lazy");
    slide.appendChild(image);
    slide.onclick = () => config.onClick();
    return slide;
  }
}

class mockFlexSlider {
  #slider;
  #slidesCount = 5;
  #slides = [];

  constructor(elementId = "") {
    if (elementId.length === 0) {
      throw new Error(
        "Unable to create slider instance, provide a valid element"
      );
    }

    try {
      this.#slider = document.getElementById(elementId);
    } catch (e) {
      throw new Error(
        "Unable to create slider instance, provide a valid element"
      );
    }

    this.#slider.classList.add("flex-slider");
    for (let i = 0; i < this.#slidesCount; i++) {
      this.#slides.push(this.#createSlides());
    }
    this.#slides.map((slide) => this.#slider.appendChild(slide));
  }

  #createSlides() {
    let slide = document.createElement("div");
    slide.classList.add("flex-slide");
    let image = document.createElement("div");
    let width = "70vw"; //screen.availWidth * 0.7; // 70% of screen width
    let height = "calc((404/720)*70vw)";
    image.style.width = width;
    image.style.height = height;
    image.classList.add("skelton-loader", "img");
    slide.appendChild(image);
    return slide;
  }
}

export default class slider {
  #images;
  #slider;
  #sliderContainer;
  #dotContainer;
  #slideIndex = 0;
  #slides;
  #controllers;
  #dots;

  constructor(images = [], elementId = "") {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error(
        "Unable to create slider instance, provide a valid arrray"
      );
    }
    if (elementId.length === 0) {
      throw new Error(
        "Unable to create slider instance, provide a valid element"
      );
    }
    this.#images = images;
    try {
      this.#slider = document.getElementById(elementId);
    } catch (e) {
      throw new Error(
        "Unable to create slider instance, provide a valid element"
      );
    }

    this.#slider.classList.add("mam-slideshow");

    this.#sliderContainer = document.createElement("div");
    this.#sliderContainer.classList.add("mam-slideshow-container");
    this.#slider.appendChild(this.#sliderContainer);

    this.#dotContainer = document.createElement("div");
    this.#dotContainer.classList.add("mam-dot-container");
    this.#slider.appendChild(this.#dotContainer);

    this.#slides = this.#images.map((img, index) => this.#createSlides(index));
    this.#controllers = this.#createControls();
    this.#dots = this.#createDots();

    this.#slides.map((slide) => this.#sliderContainer.appendChild(slide));
    this.#controllers.map((controller) =>
      this.#sliderContainer.appendChild(controller)
    );
    this.#dots.map((dot) => this.#dotContainer.appendChild(dot));

    this.#render();
  }

  #createSlides(slidenumber) {
    let slideTemplate = `
        
            <div class="mam-numbertext">${slidenumber + 1} / ${
      this.#images.length
    }</div>
            <img src="${this.#images[slidenumber]}" style="width:100%">
            <!--<div class="mam-slider-text">Caption Text</div>-->
        
        `;

    let slide = document.createElement("div");
    slide.classList.add("mam-slides", "mam-fade");
    slide.innerHTML = slideTemplate;
    return slide;
  }

  #createControls() {
    let controlls = ["mam-prev", "mam-next"];
    let controllers = controlls.map((control) => {
      let button = document.createElement("a");
      button.classList.add(control);
      button.innerHTML = control == "mam-prev" ? "&#10094;" : "&#10095;";
      if (control == "mam-prev") button.onclick = () => this.#previous();
      else button.onclick = () => this.#next();

      return button;
    });
    return controllers;
  }

  #createDots() {
    let dots = this.#images.map((img, index) => {
      let dot = document.createElement("span");
      dot.classList.add("mam-slider-dot");
      dot.onclick = () => {
        this.#currentSlide(index);
      };
      return dot;
    });
    return dots;
  }
  create() {}

  #next() {
    this.#slideIndex =
      this.#slideIndex >= this.#images.length - 1 ? 0 : this.#slideIndex + 1;
    this.#render();
  }

  #previous() {
    this.#slideIndex =
      this.#slideIndex <= 0 ? this.#images.length - 1 : this.#slideIndex - 1;
    this.#render();
  }

  #currentSlide(slideNumber) {
    if (slideNumber < 0 || slideNumber > this.#images.length) return false;
    this.#slideIndex = slideNumber;
    this.#render();
  }

  #render() {
    this.#slides.map((slide, index) => {
      if (this.#slideIndex == index) slide.classList.remove("mam-slides");
      else slide.classList.add("mam-slides");
    });

    this.#dots.map((slide, index) => {
      if (this.#slideIndex == index) slide.classList.add("mam-slider-active");
      else slide.classList.remove("mam-slider-active");
    });
  }
}
