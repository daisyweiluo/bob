// Luxi Xu, Wei Luo Project 4

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFC9E55); // white background colour
canvas.appendChild(renderer.domElement);

//SETUP MOUSE
var mouse = {x:0, y:0};

// SETUP CAMERA
/*player camera */
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
// click on it, able to change its camera
var controls = new THREE.OrbitControls(camera);
// controls.movementSpeed = 50;
// controls.noFly= true;
// controls.lookVertical=false;

//Added Light
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, 1 );
scene.add( light );

//Torso Matrix
var torsoMatrix = gettransMatrix(45/2,20/2,40/2);


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
var playball = new THREE.Mesh( playballgeometry, normalMaterial );
playball.applyMatrix(torsoMatrix);
playball.applyMatrix(gettransMatrix(0,0,0));
scene.add( playball );
camera.lookAt(playball.position);


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var keystep = 10;

function onKeyDown(event)
{
  // TO-DO: BIND KEYS TO YOUR CONTROLS    
  if(keyboard.eventMatches(event,"z"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }

 else if (keyboard.eventMatches(event,"w")){
playball.position.x = playball.position.x-1;
playball.position.y = playball.position.y-1;
playball.position.z = playball.position.z-1;

camera.lookAt(playball.position);
renderer.render(scene,camera);

 }   

 else if (keyboard.eventMatches(event,"s")){
playball.position.x = playball.position.x+1;
playball.position.y = playball.position.y+1;
playball.position.z = playball.position.z+1;


camera.lookAt(playball.position);
renderer.render(scene,camera);
 }

 else if (keyboard.eventMatches(event,"a")) {

playball.applyMatrix(gettransMatrix(0,0,1));
camera.lookAt(playball.position);
renderer.render(scene,camera);
 }
  else if (keyboard.eventMatches(event,"d")) {
    playball.applyMatrix(gettransMatrix(0,0,-1));
camera.lookAt(playball.position);
renderer.render(scene,camera);
 }
   else if (keyboard.eventMatches(event,"m")) {
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
        }

keyboard.domElement.addEventListener('keydown', onKeyDown );
update();