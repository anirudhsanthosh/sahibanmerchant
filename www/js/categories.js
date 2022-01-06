 
 export{mockGrid,cratecategoryGrid}

 const materialColors = [
  "#D32F2F",
  "#C2185B",
  "#880E4F",
  "#4A148C",
  "#D500F9",
  "#3949AB",
  "#1976D2",
  "#1565C0",
  "#0D47A1",
];

 export default class cratecategoryGrid{
  element;
  list;
  categoryTiles;
  defaultImg = 'img/main_icon.svg';
  container;
  constructor(element,data){
    this.element = element;
    this.list = data;
    let container = document.createElement('div');
    container.classList.add('categoryGrid');
    this.container = container;
    
    this.categoryTiles = this.list.map((category)=>{
    
      let ancher = document.createElement('a');
      ancher.href = category.permalink;
      
      let cell = document.createElement('div')
      ancher.appendChild(cell);
      
      cell.classList.add('categoryCell');
      let card = document.createElement('div');
      card.classList.add('categoryCard');
      cell.appendChild(card);
      let img;
      if(category.image){
        let src = category.image.src;
        img = document.createElement('img');
        img.src= src;
      }else{
         img = document.createElement('div');
         img.classList.add("img","imgAlt");
         img.innerHTML = category.name.substring(0,2);
         img.style.background = materialColors[Math.round(Math.random()*(materialColors.length-1))];
      }
      
      card.appendChild(img);
      
      let cardText = document.createElement('div');
      
      cardText.classList.add('categoryHero')
      card.appendChild(cardText);
      cardText.textContent = category.name
      
      container.appendChild(ancher);
      
      
    });
    

    this.element.innerHTML ='';
    this.element.appendChild(this.container)
    
    
    
  }
}

class mockGrid{
  #gridCount = 9;
  #categoryTiles;
  #element;
  #container;
  constructor(element){
    this.#element = element;
    let container = document.createElement('div');
    this.#container = container;
    container.classList.add('categoryGrid');
    // this.categoryTiles
    for(let i=0;i<this.#gridCount;i++){
      let ancher = document.createElement('div');
      ancher.classList.add("a");
      
      let cell = document.createElement('div')
      ancher.appendChild(cell);
      
      cell.classList.add('categoryCell');
      let card = document.createElement('div');
      card.classList.add('categoryCard');
      cell.appendChild(card);
      let img = document.createElement('div');
      img.classList.add('img',"skelton-loader");
      
      card.appendChild(img);
      
      let cardText = document.createElement('div');
      
      cardText.classList.add('categoryHero-skelton',)
      card.appendChild(cardText);


      let cardTextSpan = document.createElement('span');
      cardTextSpan.classList.add('categoryHero-skelton-span',"skelton-loader")
      cardText.appendChild(cardTextSpan);

      container.appendChild(ancher);
      
    }

    this.#element.innerHTML ='';
    this.#element.appendChild(this.#container)
  }

}