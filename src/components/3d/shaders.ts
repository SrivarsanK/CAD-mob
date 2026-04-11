
// Vertex Shader for GPGPU Particles
export const particleVertexShader = `
uniform sampler2D uPositions;
uniform float uTime;

varying vec2 vUv;
varying float vDistance;

void main() {
  vUv = uv;
  vec4 posData = texture2D(uPositions, position.xy);
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
uniform vec2 resolution;
uniform float uCausalInfluence;

varying vec2 vUv;

// Simplex 3D Noise 
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.x;
  vec3 x2 = x0 - i2 + 2.0 * C.x;
  vec3 x3 = x0 - 1.0 + 3.0 * C.x;
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xczy + s0.xczy*sh.xxyy ;
  vec4 a1 = b1.xczy + s1.xczy*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  float x = snoise(p + dy).z - snoise(p - dy).z - snoise(p + dz).y + snoise(p - dz).y;
  float y = snoise(p + dz).x - snoise(p - dz).x - snoise(p + dx).z + snoise(p - dx).z;
  float z = snoise(p + dx).y - snoise(p - dx).y - snoise(p + dy).x + snoise(p - dy).x;
  return normalize(vec3(x, y, z));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 pos = texture2D(uPositions, uv);
  float life = pos.w;
  life -= 0.005 * uSpeed;

  vec3 particlePos = pos.xyz;

  if (life <= 0.0) {
     float theta = uv.x * 6.28318 + uTime * 0.1;
     float phi = acos(2.0 * uv.y - 1.0);
     particlePos.x = 1.2 * sin(phi) * cos(theta);
     particlePos.y = 1.2 * sin(phi) * sin(theta);
     particlePos.z = 1.2 * cos(phi);
     life = 1.0;
  } else {
     vec3 flow = curlNoise(particlePos * (2.0 + uCausalInfluence) + uTime * 0.1);
     float r = length(particlePos);
     vec3 toSurface = -particlePos * (r - (1.5 + uCausalInfluence * 0.5)) * 0.5;
     vec3 vel = flow * uSpeed * 0.02 + toSurface * 0.1;
     particlePos += vel;
  }

  gl_FragColor = vec4(particlePos, life);
}
`;
