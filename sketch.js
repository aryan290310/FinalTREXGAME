var treximage, trexsprite;
var groundimage, groundsprite;
var invisibleground;
var cloudimage, cloudsprite;
var ob1, ob2, ob3, ob4, ob5, ob6;
var obstacle_sprite;
var obgroup;
var cloudgroup;
var game_state = "play";
var score = 0;
var game_over_image, game_over_sprite;
var game_restart_image, game_restart_sprite;
var checkpoint_sound;
var die_sound;
var jump_sound;
var trex_collided;

function preload() {
  treximage = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  game_over_image = loadImage("gameOver.png");
  game_restart_image = loadImage("restart.png");
  checkpoint_sound = loadSound("checkPoint.mp3");
  die_sound = loadSound("die.mp3");
  jump_sound = loadSound("jump.mp3");
  trex_collided = loadAnimation("trex_collided.png");
}

function setup() {
  createCanvas(600, 200);
  trexsprite = createSprite(30, 150, 20, 20);
  trexsprite.addAnimation("imagesoftrex", treximage);
  trexsprite.addAnimation("imagesoftrexcollided", trex_collided);
  trexsprite.scale = 0.5;

  groundsprite = createSprite(300, 175, 600, 10);
  groundsprite.addImage("imageofground", groundimage);

  invisibleground = createSprite(300, 185, 600, 10);
  invisibleground.visible = false;

  game_over_sprite = createSprite(300, 100);
  game_over_sprite.addImage("imageofgameovertext", game_over_image);
  game_over_sprite.scale = 0.7;

  game_restart_sprite = createSprite(300, 125);
  game_restart_sprite.addImage("imageofrestartbutton", game_restart_image);
  game_restart_sprite.scale = 0.4;

  obgroup = createGroup();
  cloudgroup = createGroup();
}

function draw() {
  background("black");
  textSize(20);
  text("Score=" + score, 505, 35);
  if (game_state == "play") {
    trexsprite.changeAnimation("imagesoftrex", treximage);
    if (frameCount % 30 == 0) {
      score = score + 1;
    }
    game_over_sprite.visible = false;
    game_restart_sprite.visible = false;
    if (keyDown("space") && trexsprite.y > 149) {
      trexsprite.velocityY = -15;
      jump_sound.play();
    }
    trexsprite.velocityY = trexsprite.velocityY + 1;
    groundsprite.velocityX = -5;
    if (groundsprite.x < 0) {
      groundsprite.x = 300;
    }
    generate_clouds();
    generate_obstacles();
    if (trexsprite.isTouching(obgroup)) {
      game_state = "end";
      die_sound.play();
    }
    if (score % 50 == 0 && score > 0) {
      checkpoint_sound.play();
    }
  }
  if (game_state == "end") {
    trexsprite.changeAnimation("imagesoftrexcollided", trex_collided);
    groundsprite.velocityX = 0;
    obgroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    obgroup.setLifetimeEach(-5);
    cloudgroup.setLifetimeEach(-5);
    game_over_sprite.visible = true;
    game_restart_sprite.visible = true;

    if (mousePressedOver(game_restart_sprite)) {
      restart_the_game();
    }
  }

  drawSprites();
  trexsprite.collide(invisibleground);
}

function generate_clouds() {
  if (frameCount % 60 == 0) {
    cloudsprite = createSprite(600, 10);
    cloudsprite.addImage("imageofcloud", cloudimage);
    cloudsprite.velocityX = -5;
    cloudsprite.y = random(10, 60);
    cloudsprite.lifetime = 130;
    cloudgroup.add(cloudsprite);
  }
}

function generate_obstacles() {
  if (frameCount % 60 == 0) {
    obstacle_sprite = createSprite(580, 160, 20, 20);
    obstacle_sprite.scale = 0.55;
    obstacle_sprite.lifetime = 100;
    obstacle_sprite.velocityX = -6;
    var r = Math.round(random(1, 6));
    switch (r) {
      case 1:
        obstacle_sprite.addImage("imageofobstacle", ob1);
        break;
      case 2:
        obstacle_sprite.addImage("imageofobstacle", ob2);
        break;
      case 3:
        obstacle_sprite.addImage("imageofobstacle", ob3);
        break;
      case 4:
        obstacle_sprite.addImage("imageofobstacle", ob4);
        break;
      case 5:
        obstacle_sprite.addImage("imageofobstacle", ob5);
        break;
      case 6:
        obstacle_sprite.addImage("imageofobstacle", ob6);
        break;
    }
    obgroup.add(obstacle_sprite);
  }
}

function restart_the_game() {
  game_state = "play";
  obgroup.destroyEach();
  cloudgroup.destroyEach();
  score = 0;
}
