# Lightweight Liquid Glass WebGL shader

Designed for static hosting such as GitHub Pages. No Three.js or other external libraries are required.

Files:
- `shader/liquid-glass.vert` - vertex shader
- `shader/liquid-glass.frag` - fragment shader
- `js/liquid-glass.js` - WebGL loader/render loop

Run from a web server because the shader files are loaded with `fetch()`.
GitHub Pages works directly.
