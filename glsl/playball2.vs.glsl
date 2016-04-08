    uniform float time;
    varying vec2 vUv;
    varying vec3 interpolatedNormal;
	varying vec3 V;
	uniform vec3 cameraPos;
 
    void main() {
        vUv = uv;

        vec3 vertPos = vec3(modelViewMatrix * vec4(position,0.0));
    	vec3 interpolatedNormal = normalize(vec3(normalMatrix * normal));

    	//vec3 L = normalize(vec3(viewMatrix * vec4((lightPosition - vertPos),0.0)));
    	vec3 V = normalize(vec3(viewMatrix * vec4((cameraPos - vertPos),0.0)));
       // vec3 newPosition = position + normal * vec3(sin(time * 0.2) * 3.0);
        gl_Position = projectionMatrix* modelViewMatrix*vec4(position, 1.0);
    }
