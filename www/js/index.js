import home from  "./home.js" ;

document.addEventListener("init", function (event) {
    console.log("init called");
  });

////////////// onsen ready event
  ons.ready(async () => {

    console.log("ons ready");
    let a = new home();
    console.log(a.get());
    });