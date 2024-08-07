const fragmentShader = `
varying float vLife;
varying vec2 vOffset;
uniform sampler2D myTex;

vec4 mixThreeColors(vec4 color1, vec4 color2, vec4 color3, float t) {
    vec4 color = color1;
    color = mix(color, color2, smoothstep(0.2, 0.5, t));
    color = mix(color, color3, smoothstep(0.5, 1.0, t));
    return color;
}

void main() {
    
    // Map the noisy value to fire colors
    vec4 color = mixThreeColors(vec4(0.0,0.0,0.0, 0.0), vec4(20.0, 20.0, 20.0, 1.0), vec4(0.0,0.0,0.0, 0.0), vLife);
    
    // Output the color
    gl_FragColor = texture2D(myTex, gl_PointCoord/2.0 + vOffset) * color;
  // gl_FragColor = texture2D(myTex, gl_PointCoord/2.0 + vOffset) * vec4(0.01,0.01,0.01, vLife);
  // gl_FragColor = texture2D(myTex, gl_PointCoord) * vec4(1.0, 1.0, 1.0, vLife);
}`;

export default fragmentShader;