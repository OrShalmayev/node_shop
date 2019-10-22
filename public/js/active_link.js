let links = document.querySelectorAll('.nav-link');
Array.from(links).forEach( e => {
  let t = e.getAttribute('href').split('/');
  let l = t.length - 1;
  let re = new RegExp(`${t[l]}$`,'g');
  if(window.location.href.match(re)){
    e.classList.add('active');
  }
});