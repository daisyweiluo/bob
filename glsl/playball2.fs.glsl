uniform float time;
varying vec2 vUv;
varying vec3 interpolatedNormal;
varying vec3 V;

uniform float Ka;

uniform vec3 ambientColor;
 
        void main() {
            vec2 position = -1.0 + 2.0 * vUv;
 
            float red = abs(sin(position.x * position.y + time / 5.0));
            float green = abs(sin(position.x * position.y + time / 4.0));
            float blue = abs(sin(position.x * position.y + time / 3.0 ));

            gl_FragColor = vec4(vec3(Ka * ambientColor), 1.0)+vec4(red, green, blue, 1.0);
        
        }