
import {flexSlider, slider} from "./slider.js";
import {httpGetAsync,androidHttp,getWithBypassAES,getImage} from "./aesBypassing.js";
import {get as httpGet}  from "./aesBypassing.js"  ; 
import cratecategoryGrid  from "./categories.js";


const SITE = "https://shoper.rf.gd";
const API_URL = "http://shoper.rf.gd/wp-json/";
const OFFER_NODE = "mam/v1/offers";
const CATEGORIES_NODE = "wc/store/products/categories"


document.addEventListener("init", function (event) {
    console.log("init called");
  });

////////////// onsen ready event
  ons.ready(async () => {

    let splashScreen = document.querySelector('.splashScreen');
    splashScreen.onclick = function(e){
      e.target.style.display = "none";
    }
    let loader = document.querySelector('.loader');
    loader.onclick = function(e){
      e.target.style.display = "none";
    }
    fetch('img/main_logo.svg')
    .then(response=>response.text())
    .then(logo=> splashScreen.innerHTML = logo)
    .catch(err=>{
      splashScreen.innerHTML = "Please wait... Loading....!"
    });
    fetch('img/main_icon.svg')
        .then(response=>response.text())
        .then(logo=> loader.innerHTML = logo)
        .catch(err=>{
          loader.innerHTML = "Please wait... Loading....!"
        });
    navigator.splashscreen.hide();
  
    buildOfferSlider();
    showCategories()
  });

  function hideSecondSplashScreen(){
    let splashScreen = document.querySelector('.splashScreen');
    splashScreen .style.display = "none";
  }
// replace images

function replaceImages(data){
  let result = [];
  data.forEach(async function (element) {
    let e =element;
    result.push(new Promise(async (resolve,reject)=>{
      if (element.image) {
        let newUrl = new URL(e.image.src);
        newUrl.protocol = "http";
        let imageGeter = new getImage();
        let imgUrl = await imageGeter.get(newUrl.href);
        element.image.src = imgUrl
        resolve(element);
      } else{
        resolve(element);
      }
    }))
    });
  return result;
}




// showing catagories

async function showCategories(){
  let url = API_URL+CATEGORIES_NODE;
  let data =  new httpGet(url);
  data.then((response)=>{
    console.log("resolved : categories")
    try{
      let data = JSON.parse(response.data);
      console.log("before",data);
      data =  replaceImages(data)
      Promise.all(data).then(data=>{
        console.log("after",data)
        let categoryShowcase = document.getElementById('catagoriesShowcase');
        let categoriesDisplayer = new cratecategoryGrid(categoryShowcase,data);
        // hideSecondSplashScreen();
      })
      
    }catch(e){
      console.log(e)
    }
    
  }).catch((e)=>{
    console.log("rejected")
    console.log(e);
  })
  
}

// building slider in home page
async function buildOfferSlider(){
      let bypassGet = new getWithBypassAES();
      let images = await bypassGet.get(API_URL+OFFER_NODE)
      .then(response=> JSON.parse(response.data))
      .catch(err=>console.log("error in index.js",err));

      console.log(images);
      images = images.map(async image =>{
        let newUrl = new URL(image);
        newUrl.protocol = "http";
        return newUrl.href;
      })
      
      Promise.all(images).then((images)=>{
        
        
        let newImages = images.map(async image => {
        console.log(image);
        let newImage =  new getImage();
        let dataurl = await newImage.get(image);
        return dataurl;
      });
      
      Promise.all(newImages).then((newImages)=>{
        console.log(newImages);
        let flexSliderElement ="offerSlider-flex";
        let flexOfferSlider = new flexSlider(newImages,flexSliderElement);
      })
      })
      
    }