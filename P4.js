// Luxi Xu, Wei Luo Project 4

var instruction="Here is the instruction of the BOB game:"+"\n"+
                 "You have a limited of 10 seconds, you are ranked by the score(depends on the radius of the colorful playball).\n"
                 +"You can only eat score balls whose radius is samller and playball become larger, otherwise, game over.\n"
                 + "AWSD to control direction of playball and left/right/up/down to control the view of camera.\n"
                 + "Enjoy the game!";
alert(instruction);
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ alpha: true } );
renderer.setClearColor( 0x000000, 0 ); // the default
//renderer.setClearColor(0xFC9E55); // white background colour
// var node = document.createElement("P");                 // Create a <li> node
// var textnode = document.createTextNode("Score");         // Create a text node
// node.appendChild(textnode);                              // Append the text to <li>
// canvas.appendChild(node);
canvas.appendChild(renderer.domElement);
var textureCube;

//SETUP MOUSE
var mouse = {x:0, y:0};

// SETUP CAMERA
/*player camera */
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
// click on it, able to change its camera
//var controls = new THREE.OrbitControls(camera);
// controls.movementSpeed = 50;
// controls.noFly= true;
// controls.lookVertical=false;

//Added Light
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, 1 );
scene.add( light );

//motion parameters
var motion = {
  position : new THREE.Vector3(), velocity : new THREE.Vector3(),
  forward : new THREE.Vector3(), up : new THREE.Vector3(0,1,0)
};

//Torso Matrix
var torsoMatrix = gettransMatrix(45/2,20/2,40/2);
motion.position = new THREE.Vector3(45/2,20/2,40/2);

//Set direction
motion.forward.subVectors(motion.position,camera.position);
motion.forward.normalize();
//console.log(motion.forward);

// add background
var urlPrefix = "images/";
var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
    urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
    urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];

var textureCube = THREE.ImageUtils.loadTextureCube(urls);


var shader = THREE.ShaderLib['cube'];
var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
uniforms['tCube'].value= textureCube; // textureCube has been init before
var material = new THREE.ShaderMaterial({
    fragmentShader    : shader.fragmentShader,
    vertexShader  : shader.vertexShader,
    uniforms  : uniforms,
    depthWrite: false,
    side: THREE.DoubleSide
});

// build the skybox Mesh 
skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 500, 500, 500, 1, 1, 1, null, true ), material );
skyboxMesh.doubleSided = true;
scene.add(skyboxMesh);


//score and time board
var score=0;
var seconds=9;
var second = 0;
document.getElementById("Time").innerHTML = 10;
interval = setInterval(function() {
  document.getElementById("Time").innerHTML = seconds-second;
        if (second >= seconds) {
        //alert("Game Over");
        clearInterval(interval);
        }
        second++;
    }, 1000);
document.getElementById("Score").innerHTML = score;

//add random balls
var color;
var p;
var vertexIndex;
var faceIndices = [ 'a', 'b', 'c' ];
var rad = [];
var faces = [];
var geos =[];
var ballnumber = 10;

//generate randomized radius
for(var r=0; r<ballnumber;  r++){
  rad[r] = getRandomInt(0.5,5);
  geos[r] = new THREE.IcosahedronGeometry( rad[r], 1 );

}

//Geometry for each ball
var geometry = geos[0];

for ( var i = 0; i < geometry.faces.length; i ++ ) {
  for(var b=0; b<ballnumber; b++){
    faces[b] = geos[b].faces[i];
    for( var j = 0; j < 3; j++ ) {
      vertexIndex = faces[0][ faceIndices[ j ] ];
      p = geometry.vertices[ vertexIndex ];
      /*ball option 1*/
      // color = new THREE.Color( 0xffffff );
      // color.setHSL( ( p.y / rad[j] + 1 ) / 2, 1.0, 0.5 );
      /*ball option 2*/
      // color = new THREE.Color( 0xffffff );
      // color.setHSL( 0.125 * vertexIndex/geometry.vertices.length, 1.0, 0.5 );
      /*ball option 3*/
      color = new THREE.Color( 0xffffff );
      color.setHSL( 0.0, ( p.y / rad[j] + 1 ) / 2, 0.5 );
      faces[b].vertexColors[ j ] = color;
    }
  }
}

//random ball's material
var materials = [
new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 } ),
new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true } )
];

//Add the balls to the scene
var groups = [];
for(var r=0; r<ballnumber; r++){
  groups[r] = THREE.SceneUtils.createMultiMaterialObject( geos[r], materials );

  groups[r].position.x = Math.random()*(Math.round(Math.random())*2-1)*20;
  groups[r].position.y = Math.random()*(Math.round(Math.random())*2-1)*20;
  groups[r].position.z = Math.random()*(Math.round(Math.random())*2-1)*20;
  scene.add( groups[r] );
}

//add play balls
var normalMaterial = new THREE.MeshNormalMaterial();
//var playbalmatrix = gettransMatrix(0,0,1); 
// playbalmatrix.applyMatrix(torsoMatrix);
var playballgeometry = new THREE.SphereGeometry( 2, 32, 32 );
playballRad=2;
var playball = new THREE.Mesh( playballgeometry, normalMaterial );
playball.position = motion.position;
playball.up= motion.up;
scene.add( playball );
camera.lookAt(playball.position);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var keystep = 10;

function collision(){
    var xPlay = playball.position.x;
    var yPlay = playball.position.y;
    var zPlay = playball.position.z;

    for (var r=0; r<ballnumber;r++){
        var xBall = groups[r].position.x;
        var yBall = groups[r].position.y;
        var zBall = groups[r].position.z;
        dis=Math.sqrt((xPlay-xBall)*(xPlay-xBall)+(yPlay-yBall)*(yPlay-yBall)+(zPlay-zBall)*(zPlay-zBall));
        radDis= playballRad+ rad[r];
        if (dis<=radDis){
          if (playballRad >= rad[r]){
          scene.remove(groups[r]);
          //playballRad=playballRad+rad[r];
          console.log("collision");
          }
          else {
            alert("eat balls bigger, game over");
            location.reload();
          }
      }
    }
}

collision();

function onKeyDown(event)
{
  // TO-DO: BIND KEYS TO YOUR CONTROLS    
  if(keyboard.eventMatches(event,"z"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }

 else if (keyboard.eventMatches(event,"w")){
  //collision();
playball.position.x = playball.position.x+motion.forward.x;
playball.position.y = playball.position.y+motion.forward.y;
playball.position.z = playball.position.z+motion.forward.z;
//console.log(playball.position);
camera.fov+=10;
camera.lookAt(playball.position);
renderer.render(scene,camera);

 }   

 else if (keyboard.eventMatches(event,"s")){
    //collision();
playball.position.x = playball.position.x-motion.forward.x;
playball.position.y = playball.position.y-motion.forward.y;
playball.position.z = playball.position.z-motion.forward.z;
//console.log(playball.position);
camera.lookAt(playball.position);
renderer.render(scene,camera);
 }

 else if (keyboard.eventMatches(event,"a")) {
  //collision();
playball.applyMatrix(gettransMatrix(0,0,1));
camera.lookAt(playball.position);
renderer.render(scene,camera);
 }
  else if (keyboard.eventMatches(event,"d")) {
      //collision();
    playball.applyMatrix(gettransMatrix(0,0,-1));
camera.lookAt(playball.position);
renderer.render(scene,camera);
 }
   else if (keyboard.eventMatches(event,"left")) {

    rotObjectMatrix = new THREE.Matrix4();

    var xAxis = new THREE.Vector3(0,1,0);

    //playball self orbit
    // rotObjectMatrix.makeRotationAxis(xAxis.normalize(), 0.1/10);
    // rotObjectMatrix.multiply(playball.matrix);
    // playball.matrix = rotObjectMatrix;
    // playball.rotation.setFromRotationMatrix(playball.matrix);

    //camera orbit
    var rotateV = getRotMatrix(-0.1,"y");
    var cameraRot=multiplyHelper(camera.matrix,rotateV);
    var cameraRott=multiplyHelper(rotateV,cameraRot);
    camera.setMatrix(cameraRott);

    // var forwardMatrix = vec3toMatrix(motion.forward);
    // var forwardRot=multiplyHelper(forwardMatrix ,rotateV);
    // var forwardRott=multiplyHelper(rotateV,forwardRot);
    // motion.forward.applyAxisMatrix(xAis, 0.1);

    camera.lookAt(playball.position);
    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();

 }
    else if (keyboard.eventMatches(event,"right")) {

    rotObjectMatrix = new THREE.Matrix4();

    var xAxis = new THREE.Vector3(0,1,0);

    var rotateV = getRotMatrix(+0.1,"y");
    var cameraRot=multiplyHelper(camera.matrix,rotateV);
    var cameraRott=multiplyHelper(rotateV,cameraRot);
    camera.setMatrix(cameraRott);

    // var forwardMatrix = vec3toMatrix(motion.forward);
    // var forwardRot=multiplyHelper(forwardMatrix ,rotateV);
    // var forwardRott=multiplyHelper(rotateV,forwardRot);
    // motion.forward.applyAxisMatrix(xAis, -0.1);

    camera.lookAt(playball.position);

    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();

 }

     else if (keyboard.eventMatches(event,"down")) {

    rotObjectMatrix = new THREE.Matrix4();

    var xAxis = new THREE.Vector3(1,0,0);

    var rotateV = getRotMatrix(-0.1,"x");
    var cameraRot=multiplyHelper(camera.matrix,rotateV);
    var cameraRott=multiplyHelper(rotateV,cameraRot);
    camera.setMatrix(cameraRott);

    // var forwardMatrix = vec3toMatrix(motion.forward);
    // var forwardRot=multiplyHelper(forwardMatrix ,rotateV);
    // var forwardRott=multiplyHelper(rotateV,forwardRot);
    // motion.forward.applyAxisMatrix(xAis, -0.1);

    camera.lookAt(playball.position);

    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();

 }

      else if (keyboard.eventMatches(event,"up")) {

    rotObjectMatrix = new THREE.Matrix4();

    var xAxis = new THREE.Vector3(1,0,0);

    var rotateV = getRotMatrix(0.1,"x");
    var cameraRot=multiplyHelper(camera.matrix,rotateV);
    var cameraRott=multiplyHelper(rotateV,cameraRot);
    camera.setMatrix(cameraRott);

    // var forwardMatrix = vec3toMatrix(motion.forward);
    // var forwardRot=multiplyHelper(forwardMatrix ,rotateV);
    // var forwardRott=multiplyHelper(rotateV,forwardRot);
    // motion.forward.applyAxisMatrix(xAis, -0.1);

    camera.lookAt(playball.position);

    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();

 }
}

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
 window.scrollTo(0,0);
}

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
  gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
  gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
  gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
  gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

// MATERIALS
// Note: Feel free to be creative with this! 
//var normalMaterial = new THREE.MeshNormalMaterial( {color: 0xB7612C, transparent: true, blending: THREE.AdditiveBlending });
var normalMaterial = new THREE.MeshNormalMaterial(  {color: 0xffaa00, wireframe: true});
//{ shading: THREE.SmoothShading }

// function drawCube()
// Draws a unit cube centered about the origin.
// Note: You will be using this for all of your geometry
function makeCube() {
  var unitCube = new THREE.BoxGeometry(1,1,1);
  return unitCube;
}


//helper function
// easier to write rotation
function getRotMatrix(p, str){
  switch(str)
  {case "x":
  var obj = new THREE.Matrix4().set(1,        0,         0,        0, 
    0, Math.cos(p),-Math.sin(p), 0, 
    0, Math.sin(p), Math.cos(p), 0,
    0,        0,         0,        1);
  return obj;
  break;

  case "y":
  var obj = new THREE.Matrix4().set(Math.cos(p),        0,         -Math.sin(p),         0, 
    0,        1,        0,                      0, 
    Math.sin(p),         0,         Math.cos(p),          0,
    0,        0,         0,                     1);
  return obj;
  break;

  case "z":
  var obj = new THREE.Matrix4().set(Math.cos(p),       -Math.sin(p),         0,        0, 
   Math.sin(p),       Math.cos(p),          0,        0, 
   0,                    0,        1,        0,
   0,                    0,        0,        1);
  return obj;
  break;


  default:
  break;

}

}

//helper function
// easier to write scale
function getscaleMatrix(x,y,z){
  var obj = new THREE.Matrix4().set(x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1);
  return obj;
}

//helper function
// easier to write translation
function gettransMatrix(x,y,z){
  var obj = new THREE.Matrix4().set(1,0,0,x, 0,1,0,y, 0,0,1,z, 0,0,0,1);
  return obj;
}

//helper function
// helper to do mutiplication
function multiplyHelper(m1,m2){
  var obj = new THREE.Matrix4().multiplyMatrices(m1,m2);
  return obj;
}

function vec3toMatrix(v){
  var obj = new THREE.Matrix4().set(v.x,0,0,0, 0,v.y,0,0, 0,0,v.z,0, 0,0,0,1);
  return obj;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
keyboard.domElement.addEventListener('keydown',function(event){

});

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {

          // //Camera rotation with 0.0001 adjusting speed
          // var timer = 0.0001 * Date.now();
          // camera.position.x = Math.cos( timer ) * 70;
          // camera.position.z = Math.sin( timer ) * 70;
          
            requestAnimationFrame(update);
            renderer.render(scene,camera);
            collision();
  }

keyboard.domElement.addEventListener('keydown', onKeyDown );
update();