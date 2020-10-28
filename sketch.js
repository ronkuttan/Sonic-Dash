var sonic, sonicImg, sonic_collided, sonic_collidedImg;
var ground;
var ring, ringImg, ringGrp, throwCoin, throwCoinImg, coinGrp;
var missile, missileImg, missileGrp;
var woodbox, boxImg, boxGroup;
var score;
var back, backImg;
var timeSurvived;
var gameOver, gameOverImg, restart, restartImg;
var checkpointSound, jumpSound, ringSound, collideSound, whooshSound, overSound;
var gameState = "Play";
localStorage["HighestScore"] = 0;

function preload() {
  //loading the images and animations
  sonicImg = loadAnimation("sonic1.png", "sonic2.png", "sonic3.png", "sonic4.png", "sonic5.png", "sonic6.png", "sonic7.png", "sonic8.png");

  ringImg = loadImage("gold_ring-removebg-preview.png")
  missileImg = loadImage("missile-removebg-preview.png")
  throwCoinImg = loadImage("coin-removebg-preview.png")
  boxImg = loadImage("wood-removebg-preview.png")
  backImg = loadImage("background.png")
  gameOverImg = loadImage("gameover.png")
  sonic_collidedImg = loadImage("sonickuttan.png")
  restartImg = loadImage("restart-removebg-preview(1).png")

  //loading the sounds
  checkpointSound = loadSound("checkpoint (1).mp3");
  jumpSound = loadSound("jump.mp3")
  ringSound = loadSound("26f8b9_sonic_ring_sound_effect.mp3")
  collideSound = loadSound("air-bubble.mp3")
  whooshSound = loadSound("cartoon-whoosh1.mp3")
  overSound = loadSound("game-over.mp3")

}

function setup() {
  //creating a canvas
  createCanvas(430, 500)

  //creating sonic
  sonic = createSprite(80, 400, 10, 10);
  sonic.addAnimation("run", sonicImg);

  //creating a ground 
  ground = createSprite(100, 430, 500, 5)
  ground.x = ground.width / 2;

  //creating a background and adding specific properties to it
  back = createSprite(175, 250, 10, 10)
  back.addImage(backImg)
  back.scale = 1.9
  back.velocityX = -4.5;
  back.x = back.width / 2;

  //creating gameover 
  gameOver = createSprite(215, 250, 20, 20)
  gameOver.addImage(gameOverImg)

  //creating restart
  restart = createSprite(215, 280, 20, 20)
  restart.addImage(restartImg)
  restart.scale = 0.3

  //creating another sonic image
  sonic_collided = createSprite(215, 150, 10, 10)
  sonic_collided.addImage(sonic_collidedImg)
  sonic_collided.scale = 0.2
  
  //creating new groups
  ringGrp = new Group();
  missileGrp = new Group();
  coinGrp = new Group();
  boxGroup = new Group();

  sonic.setCollider("rectangle", 0, 0, sonic.width - 20, sonic.height -20)
  sonic.debug = false;

  //initialising score and time survived
  score = 0;
  timeSurvived = 0;

}

function draw() {
  background("white");
  //console.log(sonic.y)

  if (gameState === "Play") {
    //moving the background
    if(back.x < 0) {
      back.x = back.width / 2;
    }
    
    //making sonic jump when space is pressed
    if(keyDown("space") && sonic.y > 370) {
      sonic.velocityY = -10;
      jumpSound.play();
    }
    
    //adding sound after reacing certain time 
    if(timeSurvived > 0 && timeSurvived % 100 === 0) {
      checkpointSound.play();
    }
   
    //making the ground move
    if(ground.x < 0) {
      ground.x = ground.width / 2;
    }
   
    //adding velocity
    ground.velocityX = -(4 + 3 * timeSurvived / 100)
    
    //adding gravity
    sonic.velocityY = sonic.velocityY + 0.2;
    
    //releasing a ring when right key is pressed
    if (keyDown("right_arrow")&& score >0) {
      throwing();
      whooshSound.play();
      score = score - 1
    }
    
    //destroying the missiles when releasing rings
    if(missileGrp.isTouching(coinGrp)) {
      coinGrp.destroyEach();
      missileGrp.destroyEach();
      collideSound.play();
    }
    
    //claiming the ring
    if (ringGrp.isTouching(sonic)) {
      score = score + 1
      ringGrp.destroyEach();
      ringSound.play();
    }
    
    //increasing the game speed after certain time
    if (timeSurvived > 500 && timeSurvived < 1000 )  {
      missileGrp.setVelocityXEach(-10)
      ringGrp.setVelocityXEach(-7)
    }

    //increasing the game speed after certain time
    if (timeSurvived > 1000) {
      missileGrp.setVelocityXEach(-13)
      ringGrp.setVelocityXEach(-9)
      boxGroup.setVelocityXEach(-8)
    }

    //increasing the size after certain time
    switch (timeSurvived) {
      case 100: sonic.scale = 1.5
        break;
      case 200: missileGrp.scale = 0.2;
        break;
      case 300: sonic.scale = 1.7
        break;
      case 400: boxGroup.scale = 0.2;
        break;
      case 500: sonic.scale = 2
        break;
      case 600: missileGrp.scale = 0.32;
        break;
      case 700: sonic.scale = 2.2;
        break;
      default: break;
    }
    //calling the functions
    coin();
    missssile();
    wood();
    //adding specific properties
    sonic.scale = 1.3;
    sonic.visible = true;
    ground.visible = false;
    restart.visible = false;
    gameOver.visible = false;
    sonic_collided.visible = false;
    
    //creating the time surviving
    timeSurvived = timeSurvived + Math.round(getFrameRate() / 60);
    //creating high score
    text("HighScore: " + localStorage["HighestScore"], 100, 50);
    
    //making the gamestate end when sonic touches missile or wooden box
    if (boxGroup.isTouching(sonic) || missileGrp.isTouching(sonic)) {
      gameState = "End";
      overSound.play();
    }

  }

  if (gameState === "End") {
    //ading specific prpeties when game state is end
    back.velocityX = 0;
    ground.velocityX = 0;
    ringGrp.setVelocityXEach(0)
    missileGrp.setVelocityXEach(0)
    boxGroup.setVelocityXEach(0);

    ringGrp.setLifetimeEach(-1);
    missileGrp.setLifetimeEach(-1);
    boxGroup.setLifetimeEach(-1);

    ringGrp.visible = false;
    missileGrp.visible = false;
    boxGroup.visible = false;
    coinGrp.visible = false;
    gameOver.visible = true;
    sonic.visible = false;
    sonic_collided.visible = true;
    restart.visible = true;

    //resetting the game when the cursor touches the restart image
    if (mousePressedOver(restart) && restart.visible === true) {
      reset();
      timeSurvived = 0;
      overSound.stop();
    }

  }

  //adjusting the depths
  ground.depth = back.depth;
  ground.depth = ground.depth + 1
  sonic.depth = back.depth;
  sonic.depth = sonic.depth + 1

  //making the player collide with the ground
  sonic.collide(ground)

  //drawing the sprites
  drawSprites();

  //creating texts
  stroke("yellow");
  textSize(17);
  fill("yellow");
  text("GOLD RINGS : " + score, 270, 37);

  stroke("black");
  textSize(16);
  fill("black");
  text("TIME SURVIVING : " + timeSurvived, 25, 37);

  stroke("black");
  textSize(17);
  fill("white");
  text("HIGHSCORE : " + localStorage["HighestScore"], 26, 60);

}

function coin() {
  //creating rings
  if (frameCount % 90 === 0) {
    ring = createSprite(510, Math.round(random(100, 300)), 10, 10)
    ring.addImage(ringImg)
    ring.velocityX = -4.7;
    ring.scale = 0.15;
    ring.lifetime = -50;
    ring.visible = true;

    //adding the rings to a group
    ringGrp.add(ring)
  }

}

function missssile() {
  //creating a missile
  if (frameCount % 200 === 0) {
    missile = createSprite(510, Math.round(random(100, 350)), 10, 10)
    missile.addImage(missileImg);
    missile.velocityX = -7;
    missile.scale = 0.15;
    missile.lifetime = -50;
    missile.visible = true;
    missile.setCollider("rectangle", 0, 0, 55, 35)
    missile.debug = false;

    //adding the missiles to a group
    missileGrp.add(missile)
  }
}

function throwing() {
  throwCoin = createSprite(100, sonic.y, 10, 10)
  throwCoin.addImage(throwCoinImg)
  throwCoin.velocityX = 5;
  throwCoin.scale = 0.15;
  throwCoin.lifetime = 550;
  throwCoin.visible = true;
  throwCoin.setCollider("rectangle", 0, 0, 15, 35)
  throwCoin.debug = false;

  coinGrp.add(throwCoin)
}

function wood() {
  //creating wooden boxes
  if (frameCount % 300 === 0) {
    woodbox = createSprite(510, 410, 10, 10)
    woodbox.addImage(boxImg)
    woodbox.velocityX = -4.5;
    woodbox.scale = 0.1;
    woodbox.collide(ground)
    woodbox.lifetime = -50
    woodbox.visible = true;

    //adding the wooden boxes to a group
    boxGroup.add(woodbox)
  }

}

function reset() {
  gameState = "Play"
  gameOver.visible = false;
  sonic.visible = true;
  sonic_collided.visible = false;
  restart.visible = false;
  sonic.y = 400
  score = 0;
  ringGrp.destroyEach()
  missileGrp.destroyEach()
  boxGroup.destroyEach();
  back.velocityX = -4.5;

  if (localStorage["HighestScore"] < timeSurvived) {
    localStorage["HighestScore"] = timeSurvived;
  }
  console.log(localStorage["HighestScore"]);

}
