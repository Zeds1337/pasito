precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_intensity;
uniform float u_opacity;

varying vec2 v_uv;

float hash21(vec2 p){
  p = fract(p*vec2(123.34,456.21));
  p += dot(p,p+45.32);
  return fract(p.x*p.y);
}

float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
             mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
}

void main(){
  vec2 uv=v_uv;
  vec2 p=uv*2.0-1.0;
  p.x*=u_resolution.x/u_resolution.y;

  vec2 pointer=u_pointer*2.0-1.0;
  pointer.x*=u_resolution.x/u_resolution.y;
  float d=length(p-pointer);

  float n=noise(uv*5.0+u_time*0.08);
  float ripple=sin(d*18.0-u_time*2.0)*exp(-d*2.6);

  vec2 flow=vec2(
    sin(uv.y*9.0+u_time*0.7+n*2.0),
    cos(uv.x*8.0-u_time*0.55+n*2.0)
  )*0.5;

  float edge=pow(1.0-min(1.0,length(p)),2.0);
  float fresnel=0.25+0.75*edge;

  float highlight=pow(max(0.0,1.0-length((p-pointer)*0.72)),5.0);
  float shimmer=0.5+0.5*sin((uv.x+uv.y)*18.0+u_time*1.2+n*4.0);

  vec3 base=vec3(0.72,0.88,1.0);
  vec3 tint=base*(0.72+0.28*n);
  tint+=vec3(0.20,0.28,0.38)*ripple*0.10*u_intensity;
  tint+=vec3(1.0)*highlight*0.28*u_intensity;

  float alpha=(0.10+0.12*fresnel+0.06*shimmer)*u_opacity;
  alpha+=highlight*0.18*u_intensity;
  alpha=clamp(alpha,0.0,0.55);

  gl_FragColor=vec4(tint,alpha);
}
