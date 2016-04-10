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
    vertPos = vec3(modelViewMatrix * vec4(position,0.0));
    interpolatedNormal = normalize(vec3(modelViewMatrix * vec4(normal, 0.0)));

    L = normalize(lightPosition - vertPos);
    R = normalize(2.0 * interpolatedNormal * max(0.0, dot(interpolatedNormal,L)) - L);
    V = normalize(vec3(cameraPosition) - vertPos);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
