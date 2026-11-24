(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var hdr=$('header.top'),bar=$('#progress'),post=$('article.post');
  function onScroll(){
    hdr.classList.toggle('stuck',scrollY>8);
    if(post&&bar){var r=post.getBoundingClientRect(),t=r.height-innerHeight*.6;bar.style.transform='scaleX('+Math.min(1,Math.max(0,-r.top/t))+')'}
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  // article: highlight current section in contents list
  var links=$$('.toc a');
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.hash==='#'+e.target.id)})}})},{rootMargin:'-20% 0px -70% 0px'});
    links.forEach(function(a){var t=$(a.hash);t&&io.observe(t)});
  }
  var copy=$('#copy');
  if(copy)copy.addEventListener('click',function(){
    var done=function(){copy.textContent='Link copied';setTimeout(function(){copy.textContent='Copy link'},2000)};
    navigator.clipboard?navigator.clipboard.writeText(location.href).then(done):done();
  });
  // index: topic filter + search

  document.documentElement.classList.remove('no-js');
  var yr=$('#yr');if(yr)yr.textContent=new Date().getFullYear();
  // scroll reveal
  var rv=$$('.reveal');
  if('IntersectionObserver' in window){var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12});rv.forEach(function(el){ro.observe(el)})}else{rv.forEach(function(el){el.classList.add('in')})}
  // counters
  $$('[data-count]').forEach(function(el){var n=+el.dataset.count,t0=null;function step(t){t0=t0||t;var p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)}setTimeout(function(){requestAnimationFrame(step)},500)});
  // hero parallax
  var pb=$('[data-parallax]');
  if(pb&&!matchMedia('(prefers-reduced-motion:reduce)').matches)addEventListener('scroll',function(){if(scrollY<innerHeight*1.2)pb.style.transform='translateY('+scrollY*.25+'px)'},{passive:true});
  // cursor spotlight on service cards
  $$('.svc').forEach(function(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});
  // areas carousel
  var tr=$('#areas-track');
  if(tr){
    var bs=$$('.car-btn');
    var upd=function(){var max=tr.scrollWidth-tr.clientWidth-2;bs[0].disabled=tr.scrollLeft<=2;bs[1].disabled=tr.scrollLeft>=max};
    bs.forEach(function(b){b.addEventListener('click',function(){tr.scrollBy({left:+b.dataset.dir*tr.clientWidth*.8})})});
    tr.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
  }
  var grid=$('#grid');if(!grid)return;
  var cards=$$('.card',grid),chips=$$('.chips button'),q=$('#q'),none=$('#none'),count=$('#count'),topic='all';
  var PER=4,page=1,pager=$('#pager');
  function apply(keepPage){
    var term=q.value.trim().toLowerCase(),match=[];
    if(!keepPage)page=1;
    cards.forEach(function(c){
      var ok=(topic==='all'||c.dataset.cat===topic)&&(!term||c.textContent.toLowerCase().indexOf(term)>-1);
      c.hidden=true;c.classList.remove('feat');if(ok)match.push(c);
    });
    var pages=Math.max(1,Math.ceil(match.length/PER));page=Math.min(page,pages);
    match.slice((page-1)*PER,page*PER).forEach(function(c,i){c.hidden=false;if(i===0&&page===1&&topic==='all'&&!term)c.classList.add('feat')});
    count.textContent=match.length;none.hidden=match.length>0;
    pager.innerHTML='';pager.hidden=pages<2;
    if(pages<2)return;
    function mk(label,p,opts){var b=document.createElement('button');b.type='button';b.innerHTML=label;opts=opts||{};
      if(opts.aria)b.setAttribute('aria-label',opts.aria);
      if(opts.cur){b.setAttribute('aria-current','page')}
      if(opts.dis)b.disabled=true;
      b.addEventListener('click',function(){page=p;apply(true);var g=$('#guides');g&&g.scrollIntoView({behavior:'smooth'})});
      pager.appendChild(b)}
    mk('&#8249; Prev',page-1,{dis:page===1,aria:'Previous page'});
    for(var p=1;p<=pages;p++)mk(p,p,{cur:p===page,aria:'Page '+p});
    mk('Next &#8250;',page+1,{dis:page===pages,aria:'Next page'});
  }
  chips.forEach(function(b){b.addEventListener('click',function(){
    topic=b.dataset.f;chips.forEach(function(x){x.setAttribute('aria-pressed',x===b)});apply();
  })});
  q.addEventListener('input',function(){apply()});apply();
})();
