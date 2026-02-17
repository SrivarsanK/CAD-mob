
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
// Fragment Shader for Simulation (Position Update)
export const simulationFragmentShader = `
uniform sampler2D uPositions;
uniform float uTime;
uniform float uSpeed;
uniform vec2 resolution;

varying vec2 vUv;

// Simplex 3D Noise 
// defined by sphere surface or 3D volume
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.x;
  vec3 x2 = x0 - i2 + 2.0 * C.x;
  vec3 x3 = x0 - 1.0 + 3.0 * C.x;

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

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

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  float p_x0 = snoise(p - dx);
  float p_x1 = snoise(p + dx);
  float p_y0 = snoise(p - dy);
  float p_y1 = snoise(p + dy);
  float p_z0 = snoise(p - dz);
  float p_z1 = snoise(p + dz);

  float x = p_y1 - p_y0 - p_z1 + p_z0;
  float y = p_z1 - p_z0 - p_x1 + p_x0;
  float z = p_x1 - p_x0 - p_y1 + p_y0;

  const float divisor = 1.0 / (2.0 * e);
  return normalize(vec3(x, y, z) * divisor);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 pos = texture2D(uPositions, uv); // .w is life
  
  // Life cycle management
  float life = pos.w;
  life -= 0.005 * uSpeed; // Decay life

  vec3 particlePos = pos.xyz;

  if (life <= 0.0) {
     // Respawn
     // Random position on sphere surface
     float theta = uv.x * 6.28318 + uTime * 0.1; // Add time variation to spawn
     float phi = acos(2.0 * uv.y - 1.0);
     
     particlePos.x = 1.2 * sin(phi) * cos(theta);
     particlePos.y = 1.2 * sin(phi) * sin(theta);
     particlePos.z = 1.2 * cos(phi);
     
     life = 1.0;
  } else {
     // Apply Curl Noise Flow
     vec3 flow = curlNoise(particlePos * 2.0 + uTime * 0.1);
     
     // Confinement to sphere surface (approximate)
     // Pull towards radius 1.5
     float r = length(particlePos);
     vec3 toMsg = -particlePos * (r - 1.5) * 0.5; // Spring force to surface
     
     vec3 vel = flow * uSpeed * 0.02 + toMsg * 0.1;
     
     particlePos += vel;
  }

  gl_FragColor = vec4(particlePos, life);
}
`;
