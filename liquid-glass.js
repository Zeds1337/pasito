(function(){
  'use strict';
  const canvas=document.createElement('canvas');
  canvas.className='liquid-glass-shader';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'9990'});
  document.body.appendChild(canvas);

  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true});
  if(!gl)return;

  const load=(type,url)=>fetch(url).then(r=>r.text()).then(src=>{
    const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  });

  Promise.all([
    load(gl.VERTEX_SHADER,'shader/liquid-glass.vert'),
    load(gl.FRAGMENT_SHADER,'shader/liquid-glass.frag')
  ]).then(([vs,fs])=>{
    const program=gl.createProgram(); gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,'a_position'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);

    const uRes=gl.getUniformLocation(program,'u_resolution');
    const uTime=gl.getUniformLocation(program,'u_time');
    const uPointer=gl.getUniformLocation(program,'u_pointer');
    const uIntensity=gl.getUniformLocation(program,'u_intensity');
    const uOpacity=gl.getUniformLocation(program,'u_opacity');
    let px=.5,py=.5, intensity=1.0, opacity=.75;

    function resize(){const d=Math.min(devicePixelRatio||1,1.5); canvas.width=innerWidth*d; canvas.height=innerHeight*d; gl.viewport(0,0,canvas.width,canvas.height);}
    addEventListener('resize',resize,{passive:true}); resize();
    addEventListener('pointermove',e=>{px=e.clientX/innerWidth;py=1-e.clientY/innerHeight},{passive:true});

    const start=performance.now();
    function frame(now){
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes,canvas.width,canvas.height);
      gl.uniform1f(uTime,(now-start)/1000);
      gl.uniform2f(uPointer,px,py);
      gl.uniform1f(uIntensity,intensity);
      gl.uniform1f(uOpacity,opacity);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }).catch(console.error);
})();
