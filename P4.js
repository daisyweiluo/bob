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

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
//camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

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
  
}


update();