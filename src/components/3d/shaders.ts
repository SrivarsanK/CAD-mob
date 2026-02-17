
// Vertex Shader for GPGPU Particles
export const particleVertexShader = `
uniform sampler2D uPositions;
uniform float uTime;

varying vec2 vUv;
varying float vDistance;

void main() {
  vUv = uv;
  
  // Read position data from texture using instanceId
  // We need to map instanceId to texture coordinates
  // Texture is N x N
  
  // Actually, for instanced mesh, we usually use an attribute for uv reference or calculate it from gl_InstanceID
  
  // Simplified for this demo: We will assume the geometry has logic or we use a material that handles this.
  // But standard approach: use a reference attribute.
  
  vec4 posData = texture2D(uPositions, position.xy); // Placeholder, requires custom mesh setup
  
  vec3 pos = posData.xyz;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (10.0 / -mvPosition.z);
}
`;

// Fragment Shader for Simulation (Position Update)
export const simulationFragmentShader = `
uniform sampler2D uPositions;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

// Simplex noise function (simplified)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  return 42.0 * dot( m*m, vec3( dot(x0,p.x), dot(x12.xy,p.y), dot(x12.zw,p.z) ) );
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 pos = texture2D(uPositions, uv);
  
  // Move particles
  // Create a flow field effect
  float noise = snoise(pos.xy * 2.0 + uTime * 0.1);
  float angle = noise * 6.28;
  
  vec3 vel = vec3(cos(angle), sin(angle), 0.0) * uSpeed * 0.05;
  
  // Attraction to center (0,0,0)
  vec3 toCenter = -pos.xyz;
  vel += toCenter * 0.02; 
  
  // Add some swirl based on Y position (like a tornado or sphere surface)
  vel.x += -pos.z * 0.1;
  vel.z += pos.x * 0.1;

  pos.xyz += vel;
  
  // Reset if too far or internal life cycle
  if (length(pos.xyz) < 0.1 || length(pos.xyz) > 2.0) {
     // Respawn randomly on sphere surface
     float theta = uv.x * 6.28;
     float phi = acos(2.0 * uv.y - 1.0);
     pos.x = 1.5 * sin(phi) * cos(theta);
     pos.y = 1.5 * sin(phi) * sin(theta);
     pos.z = 1.5 * cos(phi);
  }

  gl_FragColor = pos;
}
`;
