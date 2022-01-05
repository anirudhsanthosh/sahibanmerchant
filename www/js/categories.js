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
      let src = category.image? category.image.src : this.defaultImg;
      let img = document.createElement('img');
      img.src= src;
      
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