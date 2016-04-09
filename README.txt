README

Luxi Xu 32479115 z4j8
Wei Luo 51129120 c5n8

• what: a high level description of what you’ve created, including an explicit list of the advanced functionality items
		We create a eating balls game, colorful playball can move around eat balls with smaller radius, and playball can become bigger.
		When collide with boxes, you will game over. Can move score balls around, shooting balls.

• how: mid-level description of the algorithms and data structures that you’ve used
		 Use array to store score balls and obstacle boxes
		 Compare the distance between objects and sum of their radius to decide they collide or not
		 Use different photos as texture to make the enviorment more real
		 Use raycaster to do picking, so balls can be dragged to another position.


• howto: detailed instructions of the low-level mechanics of how to actually play (keyboard controls, etc)
         You are smily face playball  
         Eat balls with smaller radius, your radius get bigger  
         Eat balls with bigger radius,  game over  
         Drag balls to change it position  
         Eat wooden boxes, game over  
         AWSD to control direction of playball  
         Left/Right/Up/Down to control the view of camera  
         Use space to use bullet to shoot bigger balls  


• sources: sources of inspiration and ideas (especially any source code you looked at for inspiration on the Internet)
		 We take a look of raycaster online, so we can apply picking


Part Luxi worked on:
1.
2.
3.
4.
5.

Part Wei worked on:
1. Collision of balls, change of score
2. Texture of balls
3. Picking, move score balls to another position
4. create Obstacle balls
5. FPS window, instruction and warning
6. ground