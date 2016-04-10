varying vec3 interpolatedNormal;
varying vec3 vertPos;

varying vec3 L;
varying vec3 R;
varying vec3 V;

uniform float Ka;
uniform float Kd;
uniform float Ks;
uniform float N;

uniform vec3 lightPosition;

uniform vec3 unlitColor;
uniform vec3 ambientColor;

void main() {
  gl_FragColor = 
  //vec4(vec3(unlitArmadilloColor), 1.0)+ 
  vec4(vec3(Ka * ambientColor), 1.0) +
  vec4(vec3(Kd * unlitColor * max(0.0,dot(interpolatedNormal,L))), 1.0)+
  vec4(vec3(Ks * pow(max(0.0,dot(R,V)),N)), 1.0);
}
