
const vertexShader = `
#define PI 3.1415926535897932384626433832795

attribute float aLife;
attribute vec2 aOffset;
varying float vLife;
varying vec2 vOffset;

uniform float uTime;
uniform vec3 uCamera;


void main() {
  vLife = aLife;
  vOffset = aOffset;
  vec3 particlePosition = position * (1.0 + (sin(uTime + vLife*100.0) + 2.0) / 100.0);

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = (sin(length(particlePosition)/30.0*PI + uTime) + 1.1) * 3.0;
//   gl_PointSize = 10.0;
}`;

export default vertexShader;