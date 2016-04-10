// Luxi Xu, Wei Luo Project 4

var stats;
var instruction="You are smily face playball\n"+"Eat balls with smaller radius, your radius get bigger\n"
        +"Eat balls with bigger radius,  game over\n"
        +"Eat wooden boxes, game over\n"
        +"AWSD to control direction of playball\n"
        +"Left/Right/Up/Down to control the view of camera\n"
        +"Use space to use bullet to shoot bigger balls\n";
alert(instruction);

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
//FPS Window
stats = new Stats();
//stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
//stats.domElement.style.left = '0px';
stats.domElement.style.top = '10px';
stats.domElement.style.left= '10px';

document.body.appendChild( stats.domElement );

// Build a visual axis system
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); 

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}

var length = 100.0;
var shootingrange = 50.0;
// Build axis visuliaztion for debugging.
var x_axis = buildAxis(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( length, 0, 0 ),
      //red
      0xFF0000,
      false
  )
var y_axis = buildAxis(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, length, 0 ),
      //green
      0x00ff00,
      false
  )
var z_axis = buildAxis(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 0, length ),
      //blue
      0x0000FF,
      false
  )



// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({} );
renderer.setClearColor( 0x000000, 0 ); // the default
renderer.autoClear = false;

//renderer.setClearColor(0xFC9E55); // white background colour
// var node = document.createElement("P");                 // Create a <li> node
// var textnode = document.createTextNode("Score");         // Create a text node
// node.appendChild(textnode);                              // Append the text to <li>
// canvas.appendChild(node);
canvas.appendChild(renderer.domElement);
var textureCube;


//SETUP MOUSE
//var mouse = {x:0, y:0};

// SETUP CAMERA
/*player camera */
var camera = new THREE.PerspectiveCamera(30,1,0.1,1600); // view angle, aspect ratio, near, far
scene.add(camera);

// ADDING THE AXIS DEBUG VISUALIZATIONS
// scene.add(x_axis);
// scene.add(y_axis);
// scene.add(z_axis);

//Set up ray caster
var mouse = new THREE.Vector2(), INTERSECTED;
var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;

//SET UP SKYROME BACKGROUND
var bgimage = THREE.ImageUtils.loadTexture('galaxy.jpg');
var skygeometry = new THREE.SphereGeometry(1400, 60, 40);  
var skyuniforms = {  
  texture: { type: 't', value: bgimage}
};

var skymaterial = new THREE.ShaderMaterial( {  
  uniforms:       skyuniforms,
});

skyBox = new THREE.Mesh(skygeometry, skymaterial);  
skyBox.scale.set(-1, 1, 1);  
skyBox.rotation.order = 'XZY';  
skyBox.renderDepth = 1000.0; 
scene.add(skyBox);

//mouse
// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
// window.addEventListener( 'mousedown', onMouseDown, false);
renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

//Set up ground
// var groundGeometry = new THREE.PlaneGeometry(60, 60, 9, 9);
// var groundmaterial = new THREE.MeshLambertMaterial();
// var ground = new THREE.Mesh(groundGeometry, groundmaterial);
// ground.rotation.z+=Math.PI;
// scene.add(ground);

/* Floor  */    
// var geometry = new THREE.PlaneGeometry( 5, 20, 32);
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// var plane = new THREE.Mesh( geometry, material );
// scene.add( plane );

// var floor = new THREE.Mesh( geometry, material );
// floor.material.side = THREE.DoubleSide;
// floor.rotation.x = de2ra(90);
// scene.add( floor );

// SETUP ORBIT CONTROLS OF THE CAMERA
// click on it, able to change its camera
//var controls = new THREE.OrbitControls(camera);
// controls.movementSpeed = 50;
// controls.noFly= true;
// controls.lookVertical=false;


//Added Light
// var light = new THREE.DirectionalLight( 0xffffff );
// light.position.set( 0, 0, 1 );
// scene.add( light );

//Added spot light
spotLight = new THREE.SpotLight( 0xffffbb, 2 );
spotLight.position.set( 0.5, 0, 0.5 );
spotLight.position.multiplyScalar( 700 );
scene.add( spotLight );
spotLight.castShadow = true;
// spotLight.shadowCameraVisible = true;
spotLight.shadowMapWidth = 2048;
spotLight.shadowMapHeight = 2048;
spotLight.shadowCameraNear = 200;
spotLight.shadowCameraFar = 1500;
spotLight.shadowCameraFov = 40;
spotLight.shadowBias = -0.005;

//Spotlight 2:
spotLight2 = new THREE.SpotLight( 0xffffbb, 2 );
spotLight2.position.set( -0.5, 0, -0.5 );
spotLight2.position.multiplyScalar( 100 );
scene.add( spotLight2 );
spotLight2.castShadow = true;
// spotLight.shadowCameraVisible = true;
spotLight2.shadowMapWidth = 2048;
spotLight2.shadowMapHeight = 2048;
spotLight2.shadowCameraNear = 200;
spotLight2.shadowCameraFar = 1500;
spotLight2.shadowCameraFov = 40;
spotLight2.shadowBias = -0.005;

//motion parameters
var motion = {
  position : new THREE.Vector3(), velocity : new THREE.Vector3(),
  forward : new THREE.Vector3(), up : new THREE.Vector3(0,1,0),
  rotation: new THREE.Vector2()
};

//Torso Matrix
//var torsoMatrix = gettransMatrix(45/2,20/2,40/2);
motion.position = new THREE.Vector3(45/2,20/2,40/2);


//add plane
var plane;
plane = new THREE.Mesh(
         new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
         new THREE.MeshBasicMaterial( {visible:false} )
        );
var torsoMatrix = getscaleMatrix(1,1,1);
console.log(plane);
scene.add( plane );

//score and time board
var score=0;
var seconds=29;
var second = 0;
document.getElementById("Time").innerHTML = 30;
interval = setInterval(function() {
  document.getElementById("Time").innerHTML = seconds-second;
        if (second >= seconds) {
             alert("No Time Left! You score is "+score);
            location.reload();
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
var len = [];
var boxes = [];
var faces = [];
var geos =[];
//0=eatable, 1=bad, 2=portion
var type = [];
var ballnumber = 100;
var boxnumber = 10;

//generate randomized radius
for(var r=0; r<ballnumber;  r++){
  rad[r] = getRandomInt(2,5);
  geos[r] = new THREE.IcosahedronGeometry( rad[r], 1);
  //geos[r] = new THREE.SphereGeometry(rad[r],32,32)

}

// game over boxs
for (var i=0; i<boxnumber;  i++){
    len[i] = getRandomInt(2,5);
    boxes[i] = new THREE.BoxGeometry(len[i],len[i],len[i]);
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



//Load balls' textures
var playPic=THREE.ImageUtils.loadTexture('moonbumpmap2.jpg');
var playPic2 = THREE.ImageUtils.loadTexture('moonbumpmap.jpg');
var woodPic = THREE.ImageUtils.loadTexture('woodbump.jpg');
var earthPic = THREE.ImageUtils.loadTexture('earth.jpg');


//random ball's material
var materials = [
new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 } ),
new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true } )
];

var scoreballPic=THREE.ImageUtils.loadTexture('scorePic.png');
var scoreMaterial = new THREE.MeshPhongMaterial( {specular: 0x222222, shininess: 5,shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 ,map:scoreballPic, bumpMap:playPic2, bumpScale:0.45} );

//Add the balls to the scene
var groups = [];
var removed = [];
for(var r=0; r<ballnumber; r++){
  removed[r]="No";
  groups[r]= new THREE.Mesh( geos[r], scoreMaterial );


  groups[r].position.x = (Math.random() < 0.5 ? -1 : 1)*(5+Math.random()*100);
  groups[r].position.y = -2+ rad[r];
  groups[r].position.z = (Math.random() < 0.5 ? -1 : 1)*(5+Math.random()*100);
  scene.add( groups[r] );
}

//position for game over boxes
//random ball's material
var materials = [
new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 } ),
new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true } )
];

var boxPic=THREE.ImageUtils.loadTexture('boxPic.png');
var boxMaterial = new THREE.MeshBasicMaterial( { shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 ,map:boxPic, bumpMap: woodPic, bumpScale:1} );

//Add the balls to the scene
var boxgroups = [];
for(var i=0; i<boxnumber; i++){
  boxgroups[i]= new THREE.Mesh( boxes[i], boxMaterial );
  boxgroups[i].position.x = (Math.random() < 0.5 ? -1 : 1)*(5+Math.random()*100);
  boxgroups[i].position.y = -2+ len[i];
  boxgroups[i].position.z = (Math.random() < 0.5 ? -1 : 1)*(5+Math.random()*100);
  scene.add( boxgroups[i] );
}

//var playPic3 = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/33170/egyptian_friz_2.png');
//var shader = sobelShader;

// LOAD SHADERS
var shaderFiles = [
  'glsl/playball.vs.glsl',
  'glsl/playball.fs.glsl',
  'glsl/playball2.vs.glsl',
  'glsl/playball2.fs.glsl',
  'glsl/fresnel.vs.glsl',
  'glsl/fresnel.fs.glsl',
  'glsl/sky.vs.glsl',
  'glsl/sky.fs.glsl',

];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
   // playMaterial.vertexShader = shaders['glsl/playball.vs.glsl'];
   // playMaterial.fragmentShader = shaders['glsl/playball.fs.glsl'];

   // playMaterial.vertexShader = shaders['glsl/playball2.vs.glsl'];
   // playMaterial.fragmentShader = shaders['glsl/playball2.fs.glsl'];

  //   playMaterial.vertexShader = shaders['glsl/fresnel.vs.glsl'];
  //  playMaterial.fragmentShader = shaders['glsl/fresnel.fs.glsl'];

  // playMaterial.needsUpdate = true;

  skymaterial.vertexShader = shaders['glsl/sky.vs.glsl'];
  skymaterial.fragmentShader = shaders['glsl/sky.fs.glsl'];
  skymaterial.needsUpdate =true;

});

// LIGHTING UNIFORMS
 var lightColor = new THREE.Color(1.0,1.0,1.0);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
// var lightPosition = new THREE.Vector3(70,100,70);

// var litColor = new THREE.Color(0.3,0.4,0.6);
// var unLitColor = new THREE.Color(1.0,1.0,1.0);
// var outlineColor = new THREE.Color(0.04,0.1,0.15);

// var litArmadilloColor = new THREE.Color(0.15,0.6,0.3);
// var unLitArmadilloColor = new THREE.Color(0.04,0.3,0.15);

 var kAmbient = 0.5;
// var kDiffuse = 0.8;
// var kSpecular = 0.8;
// var shininess = 10.0;

//var playMaterial = new THREE.MeshBasicMaterial( { shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 ,map:playPic} );
// var playMaterial = new THREE.ShaderMaterial({
//   // wireframe: true,
// uniforms: {
//             time: { type: "f", value: 0 },
//             TexCube: { type: "t", value: THREE.ImageUtils.loadTextureCube( [ "boxPic.jpg", "boxPic.jpg", // cube texture
//                                                                      "boxPic.jpg", "boxPic.jpg", 
//                                                                      "boxPic.jpg", "boxPic.jpg" ] ) },
//              width: {type: 'f',value: 320.0},
//              height: {type: 'f',value: 240.0},
//              color : {type : 'c' , value:lightColor},
//              cameraPos: {type : 'v3', value: camera.position},

//      //lightColor : {type : 'c', value: litArmadilloColor},
//      ambientColor : {type : 'c', value: ambientColor},
//      // lightPosition : {type: 'v3', value: lightPosition},
//      // litArmadilloColor: {type : 'c', value: litArmadilloColor},
//      // unlitArmadilloColor: {type : 'c', value: unLitArmadilloColor},
//       Ka : {type : 'f', value: kAmbient},
//      // Kd : {type : 'f', value: kDiffuse},
//      // Ks : {type : 'f', value: kSpecular},
//      // N : {type : 'f', value: shininess},
//    },
//     });

var playMaterial =  new THREE.MeshPhongMaterial( {
          //color: 0x552811,
          //color: 0xBC4C42,
          specular: 0x222222,
          shininess: 10,
          map: playPic,
          bumpMap: playPic,
          bumpScale: 0.45
        } );

var playballgeometry = new THREE.SphereGeometry( 3.5, 32, 32 );
playballgeometry.dynamic=true;
playballRad=3.5;
var playball = new THREE.Mesh( playballgeometry, playMaterial );
var playballpositionMatrix = gettransMatrix(0,-2+playballRad,0);
var rotationMatrix = getRotMatrix(0,"x");
var playballMatrix = multiplyHelper(playballpositionMatrix,rotationMatrix);
playball.setMatrix(playballMatrix);


//foot of the playball
var foot = new THREE.SphereGeometry(1, 2, 1, 0, Math.PI * 2, 0, Math.PI / 2);
var footmaterial = new THREE.MeshNormalMaterial();

var leftfeet = new THREE.Mesh(foot, footmaterial);
var rightfeet =  new THREE.Mesh(foot, footmaterial);
leftfeet.parent=playball;
rightfeet.parent=playball;
leftfeet.applyMatrix(gettransMatrix(1.5,-2,0));
leftfeet.rotation.y = Math.PI / 4;
rightfeet.applyMatrix(gettransMatrix(0,-2,1.5));
rightfeet.rotation.y = Math.PI / 4;
// scene.add(leftfeet);
// scene.add(rightfeet);

//camera as a child of playbal5
var transMatrix = gettransMatrix(55,20,50);
var cameraMatrix = multiplyHelper(playballMatrix, transMatrix);
camera.applyMatrix(cameraMatrix);

scene.add( playball );
camera.lookAt(playball.position);

//Glowing playball
var scale = 15;
var spriteMaterial = new THREE.SpriteMaterial( 
  { 
    map: new THREE.ImageUtils.loadTexture( 'glow.png' ), 
    color: 0x0000ff,
    fog: true,
    transparent: false, blending: THREE.AdditiveBlending
  });
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(scale, scale, 1.0);
  playball.add(sprite); // this centers the glow at the playball

//forward
motion.forward.subVectors(playball.position,camera.position);
motion.forward.normalize();

//add bullets
var bulletnumber = 0;
var bullets = [];
var dirs = [];
var bulletleft=5-bulletnumber;
document.getElementById("Bullet").innerHTML = bulletleft;
//adding the shooting line
// var shoot_axis = buildAxis(
//       new THREE.Vector3( playball.position.x, playball.position.y, playball.position.z ),
//       new THREE.Vector3( motion.forward.x, 0, motion.forward.z ),
//       //blue
//       0x0000FF,
//       false
//   )
// scene.add(shoot_axis);

//Listen to mouse
// function onDocumentMouseMove( event ) {
//         event.preventDefault();
//         mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//         mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//       }


function onDocumentMouseMove( event ) {
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    if ( SELECTED ) {

      var intersects = raycaster.intersectObject( plane );

        if ( intersects.length > 0 ) {
            SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
          }             
          return;
        }

        var intersects = raycaster.intersectObjects( groups );
        if ( intersects.length > 0 ) {
          if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
             plane.position.copy( INTERSECTED.position );
             plane.lookAt( camera.position );
          }

          document.body.style.cursor= 'pointer';
        } else {
          if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
          INTERSECTED = null;
           document.body.style.cursor = 'auto';
        }
      }


  function onDocumentMouseDown( event ) {
        event.preventDefault();
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( groups );
        if ( intersects.length > 0 ) {
          //controls.enabled = false;
          SELECTED = intersects[ 0 ].object;
          var intersects = raycaster.intersectObject( plane );
          if ( intersects.length > 0 ) {
            offset.copy( intersects[ 0 ].point ).sub( plane.position );
          }
          document.body.style.cursor = 'move';
        }
    }


function onDocumentMouseUp( event ) {
        event.preventDefault();
        //controls.enabled = true;
        if ( INTERSECTED ) {
          plane.position.copy( INTERSECTED.position );
          SELECTED = null;
        }
        document.body.cursor = 'auto';
}


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var keystep = 10;
var velocity = 6;
var rate = 1.04;

function collision(){
    for (var r=0; r<ballnumber;r++){
          var xPlay = playball.position.x;
          var yPlay = playball.position.y;
          var zPlay = playball.position.z;
        var xBall = groups[r].position.x;
        var yBall = groups[r].position.y;
        var zBall = groups[r].position.z;

        dis=Math.sqrt((xPlay-xBall)*(xPlay-xBall)+(yPlay-yBall)*(yPlay-yBall)+(zPlay-zBall)*(zPlay-zBall));
        radDis= playballRad+ rad[r];
        if (dis<=radDis){
          if (playballRad >= rad[r]){
            scene.remove(groups[r]);

            rad.splice(r,1);
            groups.splice(r,1);
            ballnumber--;

            //make the ball glow more
            scale += 1;
            sprite.scale.set(scale, scale, 1.0);

            var temp = playball.matrix;
            playball.applyMatrix(gettransMatrix(-xPlay, -yPlay, -zPlay));
            playball.applyMatrix(getscaleMatrix(rate,rate,rate));
            playballRad*=rate;
            playball.applyMatrix(gettransMatrix(xPlay, playballRad-2, zPlay));
            playball.geometry.verticesNeedUpdate = true;

            //transMatrix = multiplyHelper(transMatrix, getscaleMatrix(0.99,0.99,0.99));

            var cameratransMatrix = multiplyHelper(temp, transMatrix);
            camera.setMatrix(cameratransMatrix);
            camera.lookAt(playball.position);

            //playballgeometry.sphereGeometry(10,32,32);
            removed[r]="Yes";
            //console.log("collision");
          }
          else {
            alert("eat balls bigger, game over! You score is "+score);
            location.reload();
          }
        }
      }   
      score=0;
      for (var i=0;i<ballnumber;i++){
          if (removed[i]==="Yes"){
            score+=rad[i]*10;
          }
      }
      document.getElementById("Score").innerHTML = score;


       for (var r=0; r<boxnumber;r++){
          var xPlay = playball.position.x;
          var yPlay = playball.position.y;
          var zPlay = playball.position.z;
        var xBox = boxgroups[r].position.x;
        var yBox = boxgroups[r].position.y;
        var zBox = boxgroups[r].position.z;

        boxdis=Math.sqrt((xPlay-xBox)*(xPlay-xBox)+(yPlay-yBox)*(yPlay-yBox)+(zPlay-zBox)*(zPlay-zBox));
        boxDis= playballRad+ len[r]/2;
        if (boxdis<=boxDis){
            alert("eat boxes, game over! You score is "+score);
            location.reload();
          }
        }          
    }


function collisionbullet(obj){

    for (var r=0; r<ballnumber;r++){
        dis=bullets[obj].position.distanceTo(groups[r].position);
        radDis= playballRad+ rad[r];
          if (dis <= rad[r]){
            scene.remove(groups[r]);
            rad.splice(r,1);
            groups.splice(r,1);

            scene.remove(bullets[obj]);
            bullets.splice(obj,1);

            renderer.render(scene,camera);
          }
      }
    }


function onKeyDown(event)
{
  // TO-DO: BIND KEYS TO YOUR CONTROLS    
  if(keyboard.eventMatches(event,"z"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }

 else if (keyboard.eventMatches(event,"w")){
  newtransw=gettransMatrix(motion.forward.x*velocity,0, motion.forward.z*velocity);
  playball.applyMatrix(newtransw);
  playballpositionMatrix=multiplyHelper(playballpositionMatrix,newtransw);
//  console.log(playballpositionMatrix);
var cameratransMatrix = multiplyHelper(playball.matrix, transMatrix);
camera.setMatrix(cameratransMatrix);
camera.lookAt(playball.position);

renderer.render(scene,camera);

 }   

 else if (keyboard.eventMatches(event,"s")){
    newtranss=gettransMatrix(-motion.forward.x*velocity,0, -motion.forward.z*velocity);
  playball.applyMatrix(newtranss);
 playballpositionMatrix=multiplyHelper(playballpositionMatrix,newtranss);
var cameratransMatrix = multiplyHelper(playball.matrix, transMatrix);
camera.setMatrix(cameratransMatrix);
camera.lookAt(playball.position);

renderer.render(scene,camera);
 }

 else if (keyboard.eventMatches(event,"a")) {
  var axis =  new THREE.Vector3(0,-1,0);

  var leftdirection = new THREE.Vector3();

  leftdirection.crossVectors(motion.forward, axis).normalize();
  newtransa=gettransMatrix(leftdirection.x*velocity,0, leftdirection.z*velocity);
  playball.applyMatrix(newtransa);
  playballpositionMatrix=multiplyHelper(playballpositionMatrix,newtransa);

var cameratransMatrix = multiplyHelper(playball.matrix, transMatrix);

camera.setMatrix(cameratransMatrix);

camera.lookAt(playball.position);

motion.forward.subVectors(playball.position,camera.position);
motion.forward.normalize();
motion.forward.y=0;

renderer.render(scene,camera);
 }
  else if (keyboard.eventMatches(event,"d")) {
//collision();
  var axis =  new THREE.Vector3(0,1,0);
  var rightdirection = new THREE.Vector3();
  rightdirection.crossVectors(motion.forward, axis).normalize();
  newtransd=gettransMatrix(rightdirection.x,0, rightdirection.z);
  playball.applyMatrix(newtransd);
  playballpositionMatrix=multiplyHelper(playballpositionMatrix,newtransd);
var cameratransMatrix = multiplyHelper(playball.matrix, transMatrix);
camera.setMatrix(cameratransMatrix);
camera.lookAt(playball.position);

motion.forward.subVectors(playball.position,camera.position);
motion.forward.normalize();
motion.forward.y=0;
renderer.render(scene,camera);
 }
   else if (keyboard.eventMatches(event,"left")) {

    playball.rotation.y+=0.10;
    // var rotObjectMatrix = new THREE.Matrix4();

    // var axis = new THREE.Vector3(0,1,0);

    // var axis = new THREE.Vector3(0,1,0);
    // rotObjectMatrix.makeRotationAxis(axis.normalize(), +1/10);
    // rotObjectMatrix=multiplyHelper(rotObjectMatrix, playball.matrix);
    // playball.setMatrix(rotObjectMatrix);
    // playball.rotation.setFromRotationMatrix(playball.matrix);

    //playball.rotateOnAxis(axis,+1/10);

    var cameraRotMatrix = multiplyHelper(playball.matrix, transMatrix);
    camera.setMatrix(cameraRotMatrix);

    camera.lookAt(playball.position);

    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();
    motion.forward.y=0;


 }
    else if (keyboard.eventMatches(event,"right")) {
    playball.rotation.y-=0.10;
    // var rotObjectMatrix = new THREE.Matrix4();

    // var axis = new THREE.Vector3(0,1,0);

    // var axis = new THREE.Vector3(0,1,0);
    // rotObjectMatrix.makeRotationAxis(axis.normalize(), +1/10);
    // rotObjectMatrix=multiplyHelper(rotObjectMatrix, playball.matrix);
    // playball.setMatrix(rotObjectMatrix);
    // playball.rotation.setFromRotationMatrix(playball.matrix);

    //playball.rotateOnAxis(axis,+1/10);

    var cameraRotMatrix = multiplyHelper(playball.matrix, transMatrix);
    camera.setMatrix(cameraRotMatrix);

    camera.lookAt(playball.position);

    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();
    motion.forward.y=0;


 }

     else if (keyboard.eventMatches(event,"down")) {

      var ball2camera = new THREE.Vector3();
      ball2camera.subVectors(playball.position, camera.position);

      var axis = new THREE.Vector3();

      axis.crossVectors(ball2camera, camera.up).normalize();
      playball.rotateOnAxis(axis, -0.10);
      // var rotObjectMatrix = new THREE.Matrix4();

      // rotObjectMatrix.makeRotationAxis(axis, -1/10);
      // rotObjectMatrix=multiplyHelper(rotObjectMatrix, playball.matrix);
      // playball.setMatrix(rotObjectMatrix);
      // playball.rotation.setFromRotationMatrix(playball.matrix);

      var cameraRotMatrix = multiplyHelper(playball.matrix, transMatrix);
      camera.setMatrix(cameraRotMatrix);

    camera.lookAt(playball.position);

    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();
    motion.forward.y=0;


 }

      else if (keyboard.eventMatches(event,"up")) {
      var ball2camera = new THREE.Vector3();
      ball2camera.subVectors(playball.position, camera.position);

      var axis = new THREE.Vector3();

      axis.crossVectors(ball2camera, camera.up).normalize();
            var axis = new THREE.Vector3();

      axis.crossVectors(ball2camera, camera.up).normalize();
      playball.rotateOnAxis(axis, 0.10);
      // var rotObjectMatrix = new THREE.Matrix4();

      // rotObjectMatrix.makeRotationAxis(axis, +1/10);
      // rotObjectMatrix=multiplyHelper(rotObjectMatrix, playball.matrix);
      // playball.setMatrix(rotObjectMatrix);
      // playball.rotation.setFromRotationMatrix(playball.matrix);

      var cameraRotMatrix = multiplyHelper(playball.matrix, transMatrix);
      camera.setMatrix(cameraRotMatrix);

    camera.lookAt(playball.position);

    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();
    motion.forward.y=0;


 }
  else if (keyboard.eventMatches(event,"space")){
    motion.forward.subVectors(playball.position,camera.position);
    motion.forward.normalize();
    motion.forward.y=0;

    camera.lookAt(playball.position);
    console.log(playball.position);
    if(bulletnumber<=5){
    var obj = createBullet(new THREE.Vector3(playball.position.x, playball.position.y, playball.position.z), motion.forward);
    bulletnumber++;
    bulletleft=5-bulletnumber;
    document.getElementById("Bullet").innerHTML = bulletleft;
    } 
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
var colors=[];
var hsl;
//size of the grid is 150*150
for(i=-150;i<151;i+=7) {
  gridGeometry.vertices.push( new THREE.Vector3(i,-2,-150));
  gridGeometry.vertices.push( new THREE.Vector3(i,-2,150));
   // gridGeometry.vertices.push( new THREE.Vector3(-150,-2,i));
   // gridGeometry.vertices.push( new THREE.Vector3(150,-2,i));
  colors.push( new THREE.Color( 0xffffff ));
  colors[colors.length-1].setHSL( i / 300, 1.0, 0.5 );
    colors.push( new THREE.Color( 0xffffff ));
  colors[colors.length-1].setHSL( -i / 300, 1.0, 0.5 );

}
gridGeometry.colors = colors;
gridGeometry.computeLineDistances();

var gridMaterial = new THREE.LineDashedMaterial({vertexColors: THREE.VertexColors, linewidth: 1, dashSize: 2, gapSize: 0.5});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);
grid_state=true;
scene.add(grid);

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

function createBullet(pos,dir) {
  var bulletMaterial = new THREE.MeshNormalMaterial();
  var bulletgeometry = new THREE.SphereGeometry( 1, 2, 2 );
  var bullet = new THREE.Mesh(bulletgeometry, bulletMaterial);
  bullet.position.x = pos.x;
  bullet.position.y = pos.y;
  bullet.position.z = pos.z;
  console.log(bullet.position);

  bullet.geometry.dynamic=true;
 
  bullets.push(bullet);
  dirs.push(dir);
  scene.add(bullet);
  return bullet;
}


//helper function
// easier to write rotation
function getRotMatrix(p, str){
  switch(str)
  {case "x":
  var obj = new THREE.Matrix4().set(1,        0,         0,        0, 
    0, Math.cos(p),Math.sin(p), 0, 
    0, -Math.sin(p), Math.cos(p), 0,
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
  var obj = new THREE.Matrix4().set(Math.cos(p),       Math.sin(p),         0,        0, 
   -Math.sin(p),       Math.cos(p),          0,        0, 
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


var clock = new THREE.Clock(true);

// SETUP UPDATE CALL-BACK
function update() {
          // //Camera rotation with 0.0001 adjusting speed
          // var timer = 0.0001 * Date.now();
          // camera.position.x = Math.cos( timer ) * 70;
          // camera.position.z = Math.sin( timer ) * 70;
          var delta = clock.getDelta();
          //playMaterial.uniforms.time.value += delta * 10;

      //     for(var b=0; b< bullets.length; b++){
      //       if(Math.abs(bullets[b].position.x)>100 | Math.abs(bullets[b].position.z)>100){
      //       scene.remove(bullets[b]);
      //       bullets.splice(b,1);
      //       }else{
      //     bullets[b].applyMatrix(gettransMatrix(dirs[b].x,dirs[b].y,dirs[b].z));
      //     collisionbullet(b);

      //   }
      // }
      if(Math.abs(playball.position.y)>150){
        alert("You fall into a blackhole");
        location.reload();
      }
      if(Math.abs(playball.position.x)>150 | Math.abs(playball.position.z)>150){
              playball.applyMatrix(gettransMatrix(0,-0.5,0));
              camera.lookAt(playball.position);
              keyboard.destroy();
      }

            collision();
            renderer.render(scene,camera);
            requestAnimationFrame(update);
            stats.update();


  }
//requestAnimationFrame( update );
keyboard.domElement.addEventListener('keydown', onKeyDown );
update();