    uniform float time;
    uniform vec3 cameraPos;
    uniform samplerCube TexCube;

    varying float R;

    varying vec3 ReflectColor;
    varying vec3 vRefract[3];

    void main() {

        vec3 worldPos = vec3(modelMatrix * vec4(position,1.0));
    	vec3 interpolatedNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
        vec3 I = vec3(viewMatrix * vec4((worldPos - cameraPosition),1.0));

        ReflectColor = reflect(I, interpolatedNormal);

        //Empirical approximation:R = max(0, min(1, bias + scale * (1.0 + I • N)power))
        float bias = 0.1;
        float power = 2.0;
        float scale = 1.0;
        float refractionRatio = 1.02;

        vRefract[0] = refract( normalize( I ), interpolatedNormal, refractionRatio );
        vRefract[1] = refract( normalize( I ), interpolatedNormal, refractionRatio * 0.99 );
        vRefract[2] = refract( normalize( I ), interpolatedNormal, refractionRatio * 0.98 );

        float R = clamp(bias + scale*pow(1.0+ dot(normalize(I), interpolatedNormal),power),0.0,1.0);
    	//vec3 L = normalize(vec3(viewMatrix * vec4((lightPosition - vertPos),0.0)));
       // vec3 newPosition = position + normal * vec3(sin(time * 0.2) * 3.0);
        gl_Position = projectionMatrix* modelViewMatrix*vec4(position, 1.0);
    }
