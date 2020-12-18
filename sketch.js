//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogIMG, happyDogIMG;
var database;
var changingGameState, readingGameState;
var garden ,washroom, bedroom;
var fedTime, lastFed;
var gameState="Hungry";
var currentTime;
//var x;
var foodObj;
var feed, addFood;

function preload()
{
  //load images here
  dogIMG=loadImage("dogImg.png");
  happyDogIMG=loadImage("dogImg1.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
  bedroom=loadImage("Bed Room.png");
}

function setup() {
  createCanvas(1000, 800);
  database=firebase.database();

  dog=createSprite(250, 450, 10,10);
	dog.addImage(dogIMG);
  dog.scale=0.2;
  
  foodObj=new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value", (data) => {
    lastFed=data.val();
  });

  feed=createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

   readState=database.ref('gameState');
   readState.on("value", function(data){
     gameState=data.val();
  })
 
}


function draw() {  
   background(46, 139, 87);
   foodObj.display();

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

foodObj.getFoodStock();




  fill("white");
  stroke("white");
  if (lastFed>=12){
    text("Last Fed: "+lastFed%12 + "PM", 350, 30);
  } else if (lastFed==0){
    text("Last Feed: 12 Am", 350,30)
  } else {
    text("Last Feed: "+lastFed+ "AM", 350,30);
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(dogIMG);
  }

  drawSprites();
  //add styles here

  textSize(20);
  fill("white");
  stroke("white");
  text("Press 'add food' to feed Drago milk", 50,100);
  
  fill("white");
  stroke("white");
  text("Food left:" +foodS, 500,150);

 
}
//mine

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

 if (x<0){
   x=0;
 } 
 else{
   x=x-1;
 }

  database.ref('/').update({
    Food:x
  });
}
function feedDog(){
  dog.addImage(happyDogIMG);
  
  console.log("happyDog");

  //console.log(foodObj.getFoodStock());
  foodObj.updateFoodStock(foodObj.foodStock-1);
  database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour(),
    gameState:"Hungry"
  })
}
function addFoods(){
  foodObj.foodStock++;
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}

//update gameState
function update(state){
  database.ref('/').update({
    'gameState':state
  })
}
