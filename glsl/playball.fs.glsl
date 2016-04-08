varying vec3 interpolatedNormal;
varying vec3 vertPos;

varying vec3 L;
varying vec3 R;
varying vec3 V;

uniform float Ka;
uniform float Kd;
uniform float Ks;
uniform float N;

uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;

uniform vec3 litArmadilloColor;
uniform vec3 unlitArmadilloColor;

void main() {
  gl_FragColor = 
  //vec4(vec3(unlitArmadilloColor), 1.0)+ 
  vec4(vec3(Ka * ambientColor), 1.0) +
  vec4(vec3(Kd * unlitArmadilloColor * max(0.0,dot(interpolatedNormal,L))), 1.0)+
  vec4(vec3(Ks * pow(max(0.0,dot(R,V)),N)), 1.0);
}
