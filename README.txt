README

Luxi Xu 32479115 z4j8
Wei Luo 51129120 c5n8

• what: a high level description of what you’ve created, including an explicit list of the advanced functionality items
 We create a ball-eating game, the playball(a white dwarf) can move around eat other balls(planets) with smaller radius, and it can become bigger by eating. When collide with wooden boxes or bigger balls or fall out of the boundary, the game is over. 

Advanced functionality:
-Mouse picking using the ray-caster library to place the unwanted ball wherever you want

-used sprite material to create a non-shader glowing effect on the white dwarf thanks to its parallelism to the camera. Glowing effect grows as you eat more balls

-Kept track of the ever changing forward direction by calculating the camera to ball vector and drop the y due to its 2D movement

-Implemented the left, right movement relative to the forward direction by calculating the cross product of camera’s up vector and ball’s position to camera

-Build obstacles with textures and bumpy maps to make the scene more realistic

-Fresnel shader implemented using an approximation of the Fresnel Equation
		

• how: mid-level description of the algorithms and data structures that you’ve used

-Use array to store score balls and obstacle boxes for easy accessing when detecting collision
-Compare the distance between objects and sum of their radius to decide they collide or not
-Use raycaster to implement picking so the planets are draggable


• howto: detailed instructions of the low-level mechanics of how to actually play (keyboard controls, etc)
         You are the white dwarf star, 
         Eat other planets with smaller radius, your radius get bigger  
         Eat ones with bigger radius,  game over  
         Drag balls to change it position  
         Eat wooden boxes, game over  
         AWSD to control movement  
         Left/Right/Up/Down to control the view of camera  


• sources: sources of inspiration and ideas (especially any source code you looked at for inspiration on the Internet)
-Picking: ray-caster(Three.js ray caster library)
-Non-shader simple glow(stemkoski.github.io/Three.js/Simple-Glow.html)
-Colorful lines(github.com/mrdoob/three.js/blob/master/examples/webgl_lines_colors.html)
-Bumpy map for planets(chimera.labs.oreilly.com/books/1234000000802/ch04.html#adding_realism_with_multiple_textures)
-Fresnel Shader(mrdoob.github.io/three.js/examples/#webgl_materials_shaders_fresnel, http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter07.html)
-Skybox(http://www.ianww.com/blog/2014/02/17/making-a-skydome-in-three-dot-js/)
-IcosahedronGeometry for planets(icosahedronGeometry example on Threejs.org)

Part Luxi worked on:
1. Skybox background
2. Planets(random position,geometry and material)
3. Keyboard control(AWSD,left,right, up, down)
4. Shaders, light, bump-map and glowing effect 
5. Color-lines, platform boundary

Part Wei worked on:
1. Collision of balls, change of score
2. Texture of balls
3. Picking, move score balls to another position
4. create Obstacle balls
5. FPS window, instruction and warning
6. ground