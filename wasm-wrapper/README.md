## Patch to solve issues with porting some node-modules
- Use browserify `browserify node_modules/<mod></mod> -s <mod> -o <mod>.bundle.js`
- Then copy it in the javy_js folder to use it as a replacement
- This solved the issue with 70-XML