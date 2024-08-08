
//This is a demo how to use font face observer to make font load faster and using FOUT
var fontMontserrat = new FontFaceObserver('Montserrat');
var fontRubik = new FontFaceObserver('Rubik');

var html = document.documentElement;

html.classList.add('fonts-loading');

Promise.all([fontMontserrat.load(), fontRubik.load()]).then(function(){
html.classList.remove('fonts-loading');
html.classList.add('fonts-loaded');
}).catch(function () {
html.classList.remove('fonts-loading');
html.classList.add('fonts-failed');
});