uniform float time;
uniform float Ka;
uniform vec3 ambientColor;
uniform samplerCube TexCube;

 varying vec3 ReflectColor;
varying vec3 vRefract[3];



varying float R;

 
        void main() {
 
 			vec4 col = vec4(1.0,0.0,0.0,1.0);

 			vec4 reflectedColor = textureCube(TexCube, vec3( -ReflectColor.x, ReflectColor.yz ) );

			vec4 refractedColor = vec4( 1.0 );

			refractedColor.r = textureCube( TexCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
			refractedColor.g = textureCube( TexCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
			refractedColor.b = textureCube( TexCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

            //gl_FragColor = vec4(vec3(Ka * ambientColor), 1.0)+vec4(red, green, blue, 1.0);

            //http://http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter07.html
            gl_FragColor = R * vec4(ReflectColor,1.0)+( 1.0 - R)*refractedColor;
        
        }