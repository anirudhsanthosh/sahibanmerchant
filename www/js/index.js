
import {flexSlider,mockFlexSlider} from "./slider.js";
import {httpGetAsync,androidHttp,getWithBypassAES,getImage} from "./aesBypassing.js";
import {get as httpGet}  from "./aesBypassing.js"  ; 
import {cratecategoryGrid,mockGrid}  from "./categories.js";
import splash from "./includes/splashScreen.js";
import loader from "./includes/loader.js";
import reload from "./includes/reload.js";
import bottomNavigator from "./includes/bottomNavigation.js";


const SITE = "https://shoper.rf.gd";
const API_URL = "http://shoper.rf.gd/wp-json/";
const OFFER_NODE = "mam/v1/offers";
const CATEGORIES_NODE = "wc/store/products/categories";



// loaders
let splashScreen = new splash();    
let ajaxloader = new loader();
let reloader = new reload();
let bottomNav = new bottomNavigator(SITE)
console.log(bottomNav)


document.addEventListener("init", function (event) {
    console.log("init called");
  });

////////////// onsen ready event
  ons.ready(async () => {

    navigator.splashscreen.hide();
    
    // building offer slider and category grid
    buildOfferSlider();
    showCategories()

    reloader.hide();
    ajaxloader.hide(); // hiding loader
    setTimeout(()=>{
    splashScreen.hide(); // hiding splashscreen animation
    },2000);
  });

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

  let categoryShowcase = document.getElementById('catagoriesShowcase');
  let skeltonGridLoader = new mockGrid(categoryShowcase);
  // return;
  let url = API_URL+CATEGORIES_NODE;
  let data =  new httpGet(url);
  data.then((response)=>{
    try{
      let data = JSON.parse(response.data);
      data =  replaceImages(data)
      Promise.all(data).then(data=>{
        let categoriesDisplayer = new cratecategoryGrid(categoryShowcase,data);
        
      })
      
    }catch(e){
      console.log(e)
      reloader.show();
    }
    
  }).catch((e)=>{
    console.log("rejected")
    console.log(e);
    reloader.show();
  })
  
}

// building slider in home page
async function buildOfferSlider(){
      let flexSliderElement ="offerSlider-flex";
      // building skelton loader
      let skeltonLoadwr = new mockFlexSlider(flexSliderElement);
      let bypassGet = new getWithBypassAES();
      let images = await bypassGet.get(API_URL+OFFER_NODE)
      .then(response=> JSON.parse(response.data))
      .catch(err=>{
        console.log("error in index.js",err);
        reloader.show();
      });

      console.log(images);
      images = images.map(async image =>{
        let newUrl = new URL(image);
        newUrl.protocol = "http";
        return newUrl.href;
      })
      
      Promise.all(images).then((images)=>{
        
        let newImages = images.map(async image => {
        let newImage =  new getImage();
        let dataurl = await newImage.get(image);
        return dataurl;
      });
      
      Promise.all(newImages).then((newImages)=>{
        let flexOfferSlider = new flexSlider(newImages,flexSliderElement);
      })
      })
      .catch(err=>{
        console.log(err);
        reloader.show();
      })
      
    }