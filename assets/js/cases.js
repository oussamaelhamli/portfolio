/* ═══ Projektseiten 10/2026 ═══
   Rahmen bleibt die Sprache der Seite (Weiß, Raleway 100 Versal mit Grauverlauf, 9px-Labels).
   Inhalte zeigen die Sprache des jeweiligen Projekts (Georgia: Schwarz, Instrument Serif). */

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function chapter(no,name,extra){return el('div','cs-chap','<span class="ov-lbl">'+no+' — '+name+'</span>'+(extra||''));}
function hoverLinks(root){root.querySelectorAll('a,button').forEach(function(a){a.addEventListener('mouseenter',function(){cur.classList.add('link');});a.addEventListener('mouseleave',function(){cur.classList.remove('link');});});}
function vid(src,cls){var v=document.createElement('video');v.src=src;v.muted=true;v.loop=true;v.autoplay=true;v.playsInline=true;v.setAttribute('playsinline','');if(cls)v.className=cls;return v;}
function img(src,cls){var i=document.createElement('img');i.src=src;i.loading='lazy';i.alt='';if(cls)i.className=cls;return i;}

/* ── GEORGIA BAR: Case in Kapiteln ─────────────────────────────── */
function brand(n){return 'assets/images/gb/brand/'+n+'.jpg';}
function gbImg(p){var i=img('assets/images/gb/'+p);i.loading='eager';return i;} // in 3D-Bühnen greift lazy loading nicht
function fig(n,cls,cap){var f=el('figure','gb-f '+(cls||''));f.appendChild(img(brand(n)));if(cap)f.appendChild(el('figcaption','',cap));return f;}

// Wand mit driftenden Spalten (für Posts und RA)
function driftWall(items,cols,render,height){
  var wall=el('div','cs-wall');wall.style.height=(height||300)+'vh';
  var st=el('div','cs-wall-sticky');st.style.gridTemplateColumns='repeat('+cols+',1fr)';wall.appendChild(st);
  var colEls=[];for(var k=0;k<cols;k++){var ce=el('div','cs-col');st.appendChild(ce);colEls.push(ce);}
  items.forEach(function(it,i){colEls[i%cols].appendChild(render(it,i));});
  var speeds=colEls.map(function(_,i){return 0.55+((i*37)%5)*0.12;});
  ovScrollFns.push(function(){
    var p=progressOf(wall);
    colEls.forEach(function(ce,i){var max=Math.max(0,ce.scrollHeight-window.innerHeight*0.9);ce.style.transform='translateY('+(-max*Math.min(1,p*speeds[i]*1.25))+'px)';});
  });
  return wall;
}

// Objekt mit Vorder- und Rückseite, dreht sich beim Scrollen (Karte)
function objectStage(front,back,ratio,cls,cap){
  var stg=el('div','ob-stage '+(cls||''));var sk=el('div','ob-sticky');stg.appendChild(sk);
  var obj=el('div','ob');obj.style.aspectRatio=ratio;
  var f=el('div','ob-face');f.appendChild(gbImg(front));var b=el('div','ob-face ob-back');b.appendChild(gbImg(back));
  var gl=el('div','ob-gloss');var gl2=el('div','ob-gloss');
  f.appendChild(gl);b.appendChild(gl2);
  ['ob-edge ob-r','ob-edge ob-l','ob-edge ob-t','ob-edge ob-bm'].forEach(function(c){obj.appendChild(el('div',c));});
  obj.appendChild(f);obj.appendChild(b);sk.appendChild(obj);
  var sh=el('div','ob-shadow');sk.appendChild(sh);
  if(cap)sk.appendChild(el('div','ob-cap',cap));
  ovScrollFns.push(function(){
    var p=progressOf(stg);var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    var ry=-28+e*208, rx=14-e*10, rz=-6+e*8, y=(1-e)*4;
    obj.style.transform='translateY('+y+'vh) rotateX('+rx+'deg) rotateY('+ry+'deg) rotateZ('+rz+'deg)';
    var g=((ry%360)+360)%360;var light=Math.cos(g*Math.PI/180);
    gl.style.background=gl2.style.background='linear-gradient('+(110+ry*.4)+'deg,rgba(255,255,255,0) 30%,rgba(255,255,255,'+(0.10+0.08*Math.abs(light))+') 50%,rgba(255,255,255,0) 70%)';
    sh.style.transform='translateX(-50%) scaleX('+(0.55+0.45*Math.abs(Math.cos(ry*Math.PI/180)))+')';
  });
  return stg;
}

// Flache Druckstücke als Objekte, die der Maus folgen
function tiltObjects(srcs,cls){
  var row=el('div','tl-row '+(cls||''));
  var cards=srcs.map(function(s,i){var c=el('div','tl');c.appendChild(gbImg(s));c.style.setProperty('--r',((i-(srcs.length-1)/2)*6)+'deg');row.appendChild(c);return c;});
  row.addEventListener('mousemove',function(e){var r=row.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    cards.forEach(function(c,i){c.style.transform='rotate(var(--r)) rotateY('+(x*24)+'deg) rotateX('+(-y*18)+'deg) translateZ('+(i===Math.round((x+.5)*(srcs.length-1))?40:0)+'px)';});});
  row.addEventListener('mouseleave',function(){cards.forEach(function(c){c.style.transform='';});});
  return row;
}


function postcardStage(pairs){
  var stg=el('div','pc-stage');var sk=el('div','pc-sticky');stg.appendChild(sk);
  var objs=pairs.map(function(pr,i){
    var o=el('div','ob pc');o.style.aspectRatio='303.3/425.2';
    var f=el('div','ob-face');f.appendChild(gbImg(pr[0]));var b=el('div','ob-face ob-back');b.appendChild(gbImg(pr[1]));
    ['ob-edge ob-r','ob-edge ob-l','ob-edge ob-t','ob-edge ob-bm'].forEach(function(c){o.appendChild(el('div',c));});
    o.appendChild(f);o.appendChild(b);sk.appendChild(o);return o;});
  sk.appendChild(el('div','ob-cap','Postcards — A6, front / back'));
  ovScrollFns.push(function(){
    var p=progressOf(stg);var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    objs.forEach(function(o,i){var dir=i?-1:1;
      o.style.transform='translateY('+((i?-1:1)*(1-e)*6)+'vh) rotateX('+(10-e*6)+'deg) rotateY('+(dir*(-18+e*198))+'deg) rotateZ('+(dir*(-5+e*7))+'deg)';});
  });
  return stg;
}
function buildGeorgiaCase(proj){
  var weeks={};GB_WEEKS.forEach(function(p){weeks[p.w]=1;});
  var nWeeks=Object.keys(weeks).length;
  var c=contentEl(proj,'<div class="cs-stats">'
    +'<div><div class="tt-num" data-n="'+nWeeks+'">0</div><span class="ov-lbl">Weeks</span></div>'
    +'<div><div class="tt-num" data-n="'+GB_WEEKS.length+'">0</div><span class="ov-lbl">Line-up posts</span></div>'
    +'<div><div class="tt-num" data-n="76">0</div><span class="ov-lbl">Story films</span></div>'
    +'<div><div class="tt-num" data-n="39">0</div><span class="ov-lbl">RA events</span></div></div>');
  ovEl.appendChild(c);
  setTimeout(function(){c.querySelectorAll('[data-n]').forEach(function(x){countUp(x,+x.dataset.n);});},400);
  var wrap=el('div','cs-wrap');ovEl.appendChild(wrap);

  // 01 Identität aus den Originaldateien
  wrap.appendChild(chapter('01','Identity'));
  var id=el('div','id-grid');
  id.innerHTML='<div class="id-logo"><img src="assets/images/gb/id/logo.svg" alt="Georgia symbol"></div>'
    +'<div class="id-full"><img src="assets/images/gb/id/fulllogo.jpg" alt="Georgia Bar wordmark"></div>'
    +'<div class="id-coin"><img src="assets/images/gb/id/coin.svg" alt="Georgia coin"></div>'
    +'<div class="id-font"><img src="assets/images/gb/id/font.png" alt="Typeface"></div>'
    +'<div class="id-sym"><img src="'+brand('symbole')+'" alt="Pattern family"></div>'
    +'<div class="id-pal">'+[['#081c1a','Night green'],['#050533','Deep blue'],['#cf330f','Signal red'],['#f2ebe8','Bone']].map(function(c){return '<div style="background:'+c[0]+';color:'+(c[0]==='#f2ebe8'?'#2a2a2a':'#f2ebe8')+'"><span>'+c[1]+'</span><span>'+c[0].toUpperCase()+'</span></div>';}).join('')+'</div>';
  wrap.appendChild(id);
  var gr=el('div','id-grad');[1,2,3,4,5,6].forEach(function(n){var d=el('div');d.appendChild(gbImg('id/verlauf_'+n+'.jpg'));gr.appendChild(d);});
  wrap.appendChild(gr);

  // 02 Raum + Lichtwand
  wrap.appendChild(chapter('02','Space'));
  var rm=el('div','rm');['raum_01','raum_04','raum_05'].forEach(function(n,i){var f=el('div','rm-'+i);f.appendChild(gbImg('print/'+n+'.jpg'));rm.appendChild(f);});
  wrap.appendChild(rm);
  var lw=el('div','gb-wall');var lws=el('div','gb-wall-sticky');lw.appendChild(lws);
  lws.appendChild(vid('assets/images/gb/special/beautyful.mp4'));
  lws.appendChild(el('div','gb-wall-cap','<span>BEAUTYFUL</span><span>Animated light wall above the bar</span>'));
  wrap.appendChild(lw);

  // 03 Karte als Objekt
  wrap.appendChild(chapter('03','Menu','<p class="ov-desc cs-txt">A3, double-sided — cover and full drinks list.</p>'));
  wrap.appendChild(objectStage('karte/karte-1.jpg','karte/karte-2.jpg','1207.56/858.9','ob-karte','Georgia Bar — Menu 2026'));

  // 04 Print: Postkarten, Schild, Plakate, Merch
  wrap.appendChild(chapter('04','Print','<p class="ov-desc cs-txt">Postcards, signage and posters for the room.</p>'));
  wrap.appendChild(postcardStage([['print/pk_tattoo-1.jpg','print/pk_tattoo-2.jpg'],['print/pk_disco-1.jpg','print/pk_disco-2.jpg']]));
  var pr=el('div','pr-grid');
  pr.innerHTML='<figure class="pr-a"><img loading="lazy" src="assets/images/gb/print/schild.jpg" alt=""><figcaption>Lost &amp; Found — poster</figcaption></figure>'
    +'<figure class="pr-b"><img loading="lazy" src="assets/images/gb/print/schild_varianten.jpg" alt=""><figcaption>Lost &amp; Found — sign 20 × 20 cm</figcaption></figure>'
    +'<figure class="pr-c"><img loading="lazy" src="assets/images/gb/print/plakat_amowia.jpg" alt=""><figcaption>Party poster</figcaption></figure>'
    +'<figure class="pr-d"><img loading="lazy" src="assets/images/gb/print/plakat_varianten.jpg" alt=""><figcaption>Lost &amp; Found — material variants</figcaption></figure>';
  wrap.appendChild(pr);
  var mc=el('div','mc');['hoodie','caps','shirts','banner'].forEach(function(n){var f=el('div','mc-i mc-'+n);f.appendChild(img(brand(n)));mc.appendChild(f);});
  wrap.appendChild(mc);

  // 05 Wochensystem: Post-Wand, Stories mittendrin
  wrap.appendChild(chapter('05','The weekly system','<p class="ov-desc cs-txt">Every week the line-up becomes feed posts, stories and event flyers — one typographic system (D · M · Y, hour, address line), '+nWeeks+' weeks so far.</p>'));
  var items=[],si=0;GB_WEEKS.slice().reverse().forEach(function(p,i){if(i>0&&i%7===3&&si<GB_STORIES.length)items.push({story:GB_STORIES[si++]});items.push(p);});
  var cols=window.innerWidth<=600?3:6;
  wrap.appendChild(driftWall(items,cols,function(p){
    var f=el('figure','cs-post'+(p.story?' cs-story':''));
    if(p.story){f.appendChild(vid(p.story));f.appendChild(el('figcaption','','Story <span>9:16</span>'));return f;}
    var pi=img(p.s);pi.loading='eager';pi.decoding='async';f.appendChild(pi);
    f.appendChild(el('figcaption','',esc(p.n)+' <span>'+p.w.slice(8,10)+'.'+p.w.slice(5,7)+'</span>'));return f;
  },300));

  // 06 Resident Advisor: alle Flyer auf einmal, Spalten driften
  wrap.appendChild(chapter('06','Resident Advisor','<p class="ov-desc cs-txt">Every night gets its own event page — front and back flyer from the same system.</p>'));
  wrap.appendChild(driftWall(GB_RA,window.innerWidth<=600?2:4,function(pair){
    var f=el('figure','cs-post ra-pair');
    pair.forEach(function(s){var i=img(s);i.loading='eager';i.decoding='async';f.appendChild(i);});
    f.appendChild(el('figcaption','','Front / back'));return f;
  },260));

  // 07 Art Direction: nur gepostete
  wrap.appendChild(chapter('07','Art direction','<p class="ov-desc cs-txt">Posts without DJs — mood pieces from the room itself.</p>'));
  var art=el('div','cs-art');
  GB_ART.forEach(function(s,i){var f=el('div','cs-art-i ov-grid-item cs-a'+(i%5));f.appendChild(img(s));art.appendChild(f);});
  wrap.appendChild(art);

  // 08 Website als echte Aufnahme
  wrap.appendChild(chapter('08','Website','<p class="ov-desc cs-txt">Concept, design and build — <a href="https://www.georgiabar.de" target="_blank" rel="noopener noreferrer" style="color:inherit">georgiabar.de &#8599;</a></p>'));
  var ws=el('div','ws');
  ws.innerHTML='<div class="ws-desk"><div class="ws-bar"><i></i><i></i><i></i><span>georgiabar.de</span></div><video src="assets/images/gw/web_home.mp4" muted loop autoplay playsinline></video></div>'
    +'<div class="ws-side"><div class="ws-ph"><video src="assets/images/gw/web_mob.mp4" muted loop autoplay playsinline></video></div></div>'
    +'<div class="ws-art"><div class="ws-bar"><i></i><i></i><i></i><span>georgiabar.de/art</span></div><video src="assets/images/gw/web_art.mp4" muted loop autoplay playsinline></video></div>';
  wrap.appendChild(ws);
  hoverLinks(wrap);
}

/* ── GEORGIA WEBSITE: in der Sprache der Seite (Schwarz, Instrument Serif) ── */
function buildGeorgiaWeb(proj){
  var w=el('div','gw2');ovEl.appendChild(w);
  w.innerHTML=
    '<div class="gw2-top"><span>Georgia Bar — Website</span><span>Concept, design &amp; build — 2026</span><a href="https://www.georgiabar.de" target="_blank" rel="noopener noreferrer">georgiabar.de &#8599;</a></div>'
   +'<h1 class="gw2-h"><span>Zwischen</span><span><i>Exzess</i> und</span><span>Ästhetik</span></h1>'
   +'<div class="gw2-marq"><div>'+Array(8).join('Kontakt? &nbsp;&nbsp; Kontakt! &nbsp;&nbsp; Georgia &nbsp;&nbsp; ')+'</div></div>'
   +'<div class="gw2-intro"><p>'+proj.body.replace(/<a[^>]*>.*?<\/a>/,'')+'</p><div class="gw2-meta"><span>Instrument Serif</span><span>Black / Off-white</span><span>Squarespace</span><span>DE / EN</span></div></div>';
  // Scroll durch die echte Seite in einem Rahmen
  var scr=el('div','gw2-scroll');var ss=el('div','gw2-scroll-sticky');scr.appendChild(ss);
  var frame=el('div','gw2-frame');var strip=img('assets/images/gw/home_strip.jpg','gw2-strip');strip.loading='eager';frame.appendChild(strip);ss.appendChild(frame);
  var side=el('div','gw2-side','<span>01</span><span>Home — scroll</span>');ss.appendChild(side);
  w.appendChild(scr);
  ovScrollFns.push(function(){
    var p=progressOf(scr);var max=Math.max(0,strip.offsetHeight-frame.offsetHeight);
    strip.style.transform='translateY('+(-max*p)+'px)';
  });
  // Einzelne Momente groß, Editorial-Raster
  var ed=el('div','gw2-ed');
  ed.innerHTML='<figure class="e1"><img loading="lazy" src="assets/images/gw/home_v00.jpg" alt=""><figcaption>Hero — the bar at night</figcaption></figure>'
    +'<figure class="e2"><img loading="lazy" src="assets/images/gw/home_v03.jpg" alt=""><figcaption>Kontakt? Kontakt!</figcaption></figure>'
    +'<p class="e3">A hybrid space for the senses.</p>'
    +'<figure class="e4"><img loading="lazy" src="assets/images/gw/home_v05.jpg" alt=""><figcaption>Weekly line-up, live on the site</figcaption></figure>'
    +'<figure class="e5"><img loading="lazy" src="assets/images/gw/home_v04.jpg" alt=""><figcaption>Georgenstraße 194</figcaption></figure>';
  w.appendChild(ed);
  // Handy: drei Streifen, laufen unterschiedlich schnell
  var mob=el('div','gw2-mob');var ms=el('div','gw2-mob-sticky');mob.appendChild(ms);
  var phones=['mob_strip','mobart_strip','mob_strip'].map(function(n,i){var ph=el('div','gw2-ph');var im=img('assets/images/gw/'+n+'.jpg');im.loading='eager';ph.appendChild(im);ms.appendChild(ph);return im;});
  ms.appendChild(el('p','gw2-mob-t','Mobile first.<br><i>Same night, smaller screen.</i>'));
  w.appendChild(mob);
  ovScrollFns.push(function(){
    var p=progressOf(mob);
    phones.forEach(function(im,i){var max=Math.max(0,im.offsetHeight-im.parentNode.offsetHeight);var q=i===1?p:(i===0?p*0.7:p*0.45);im.style.transform='translateY('+(-max*q)+'px)';});
  });
  // Kunstgalerie
  var gal=el('div','gw2-gal','<h2 class="gw2-h2"><i>Art</i> — the gallery of works hanging in the bar</h2>');
  var gi=el('div','gw2-gal-i');gi.innerHTML='<img loading="lazy" src="assets/images/gw/art_v00.jpg" alt=""><img loading="lazy" src="assets/images/gw/art_v01.jpg" alt="">';
  gal.appendChild(gi);w.appendChild(gal);
  hoverLinks(w);
}

/* ── VISUAL EXPERIENCE: LED-Wand, Scrollen schaltet hart um ─────── */
function buildVisualWall(proj){
  ovEl.appendChild(contentEl(proj));
  var vids=proj.media.filter(function(m){return m.type==='video';});
  var st=el('div','vx');st.style.height=(vids.length*90+100)+'vh';
  var sk=el('div','vx-sticky');st.appendChild(sk);
  var els=vids.map(function(m,i){var v=vid(m.src,'vx-v');if(i)v.style.opacity=0;sk.appendChild(v);return v;});
  var hud=el('div','vx-hud','<span class="vx-n">01 / 0'+vids.length+'</span><span>LED loop — bar wall</span><span>scroll</span>');sk.appendChild(hud);
  ovEl.appendChild(st);
  var last=-1;
  ovScrollFns.push(function(){
    var p=progressOf(st);var i=Math.min(vids.length-1,Math.floor(p*vids.length));
    if(i===last)return;last=i;
    els.forEach(function(v,k){v.style.opacity=k===i?1:0;});
    hud.querySelector('.vx-n').textContent='0'+(i+1)+' / 0'+vids.length;
    sk.classList.remove('flash');void sk.offsetWidth;sk.classList.add('flash');
  });
}

/* ── GRAPHIC SELECTION: Plakate fliegen nacheinander über den Bildschirm ── */
function buildGrafikFly(proj){
  ovEl.appendChild(contentEl(proj));
  var imgs=proj.media.filter(function(m){return m.type==='img';});
  var st=el('div','gf');st.style.height=(imgs.length*55+100)+'vh';
  var sk=el('div','gf-sticky');st.appendChild(sk);
  var els=imgs.map(function(m){var i=img(m.src,'gf-p');i.loading='eager';sk.appendChild(i);return i;});
  var cnt=el('div','gf-n');sk.appendChild(cnt);
  ovEl.appendChild(st);
  // Übersicht danach
  var idx=el('div','gf-index');imgs.forEach(function(m){var f=el('div','ov-grid-item');f.appendChild(img(m.src));idx.appendChild(f);});
  ovEl.appendChild(chapter('—','Index'));ovEl.appendChild(idx);
  ovScrollFns.push(function(){
    var p=progressOf(st)*imgs.length;var shown=1;
    els.forEach(function(e,i){
      var t=p-i; // -1..0 kommt an, 0..1 fliegt durch
      if(t<-1||t>1){e.style.opacity=0;return;}
      var s,o,y;
      if(t<0){s=0.25+0.75*(1+t);o=1+t;y=(-t)*20;} else {s=1+t*2.2;o=1-t*1.1;y=-t*10;}
      e.style.opacity=Math.max(0,o);
      e.style.transform='translate(-50%,-50%) translateY('+y+'vh) scale('+s+')';
      e.style.zIndex=String(100-i);
      if(t>-0.5&&t<0.5)shown=i+1;
    });
    cnt.textContent=String(shown).padStart(2,'0')+' / '+String(imgs.length).padStart(2,'0');
  });
}

/* ── DANGEROUS WEBSITE: Platzhalter, bis der Stand da ist ───────── */
function buildDangerousWeb(proj){
  var c=contentEl(proj);ovEl.appendChild(c);
  var ph=el('div','dg-ph','<span class="ov-lbl">In progress</span><p class="ov-desc">Design and build ongoing. The case follows when the site is live.</p>');
  ovEl.appendChild(ph);
}

/* ═══ LITTLE GAME: drei Level ═══ */
var LG_IMGS=[1,2,3,4,5,6,7,8,9].map(function(i){return 'assets/images/little-game/little-game_0'+i+'.jpg';});
function buildLittleGame(proj){
  var g=el('div','lg');ovEl.appendChild(g);
  var stopFn=null;
  function stopLevel(){if(stopFn){stopFn();stopFn=null;}ovScrollFns=ovScrollFns.filter(function(f){return !f._lg;});}
  function menu(){
    stopLevel();
    g.innerHTML='<div class="lg-menu"><span class="ov-lbl">Little Game</span><h1 class="ov-title in"><span class="ln"><span>Three small</span></span><span class="ln"><span>tricks</span></span></h1>'
      +'<p class="ov-desc">Three short experiments about looking.</p>'
      +'<div class="lg-levels">'
      +'<button data-l="1"><span>01</span>Dark room<em>they only move when you don\'t look</em></button>'
      +'<button data-l="2"><span>02</span>Endless zoom<em>there is always another picture</em></button>'
      +'<button data-l="3"><span>03</span>Anamorphosis<em>chaos, until it isn\'t</em></button></div></div>';
    g.querySelectorAll('button').forEach(function(b){b.onclick=function(){level(+b.dataset.l);};});
    hoverLinks(g);
  }
  function level(n){
    stopLevel();g.innerHTML='';ovEl.scrollTop=0;
    stopFn=[null,lgDark,lgZoom,lgAnamorph][n](g,function(){level(n<3?n+1:1);},menu);
  }
  level(2); // Endless Zoom (Wunsch 21.10.: kein Dark Room, keine Anamorphose)
}
function lgBar(root,n,name,next,menu,dark){
  var b=el('div','lg-bar'+(dark?' dark':''),'<span></span><span>'+name+'</span><span></span>');
  root.appendChild(b);
}

// 01 · Dark Room: Taschenlampe. Was im Licht ist, erstarrt. Was im Dunkeln ist, kommt näher.
function lgDark(root,next,menu){
  lgBar(root,1,'Dark room',next,menu,true);
  var st=el('div','lg-dark');root.appendChild(st);
  var room=el('div','lg-room');st.appendChild(room);
  var shade=el('div','lg-shade');st.appendChild(shade);
  var msg=el('div','lg-msg','Move the light.');st.appendChild(msg);
  var btn=el('button','lg-lights','Lights on');st.appendChild(btn);hoverLinks(st);
  var W=st.clientWidth,H=st.clientHeight,R=Math.max(110,Math.min(W,H)*0.16);
  var lx=W/2,ly=H/2,moved=false,t0=performance.now(),lit=false;
  var items=LG_IMGS.map(function(s,i){
    var d=el('div','lg-it');var im=img(s);im.loading='eager';d.appendChild(im);room.appendChild(d);
    var a=i/LG_IMGS.length*Math.PI*2;
    return {el:d,x:W/2+Math.cos(a)*W*0.42,y:H/2+Math.sin(a)*H*0.40,r:(Math.random()-.5)*20,seenFor:0};
  });
  function pos(e){var r=st.getBoundingClientRect();var p=e.touches?e.touches[0]:e;lx=p.clientX-r.left;ly=p.clientY-r.top;moved=true;}
  st.addEventListener('mousemove',pos);st.addEventListener('touchmove',function(e){pos(e);if(e.cancelable)e.preventDefault();},{passive:false});
  st.addEventListener('touchstart',pos,{passive:true});
  btn.onclick=function(){lit=!lit;st.classList.toggle('lit',lit);btn.textContent=lit?'Lights off':'Lights on';
    msg.textContent=lit?'They were closer than you thought.':'Move the light.';};
  var aid,last=performance.now();
  function loop(now){
    if(!document.body.contains(st))return;
    var dt=Math.min(50,now-last);last=now;
    shade.style.background='radial-gradient(circle '+R*1.6+'px at '+lx+'px '+ly+'px, rgba(5,5,5,0) 0, rgba(5,5,5,0) '+R*0.55+'px, rgba(5,5,5,.94) '+R+'px, #050505 '+R*1.6+'px)';
    if(!lit){
      var gathered=0;
      items.forEach(function(it){
        var dx=lx-it.x,dy=ly-it.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<R*1.05){it.seenFor+=dt;} // im Licht: erstarrt
        else{ // im Dunkeln: kriecht zum Rand des Lichts
          var target=R*1.25+(it.el.offsetWidth*0.35);
          if(d>target){var sp=0.035*dt*(1+Math.min(2,(now-t0)/20000));it.x+=dx/d*sp;it.y+=dy/d*sp;}
          it.r+=(Math.atan2(dy,dx)*57.3*0.08-it.r)*0.02;
        }
        if(d<R*2.2)gathered++;
        it.el.style.transform='translate('+(it.x-it.el.offsetWidth/2)+'px,'+(it.y-it.el.offsetHeight/2)+'px) rotate('+it.r+'deg)';
      });
      if(moved&&now-t0>4000&&gathered>=5)msg.textContent='Something keeps getting closer.';
      if(now-t0>14000)btn.classList.add('on');
    }
    aid=requestAnimationFrame(loop);
  }
  aid=requestAnimationFrame(loop);
  return function(){cancelAnimationFrame(aid);};
}

// 02 · Endloser Zoom: Rad/Finger zoomt, es hört nie auf
function lgZoom(root,next,menu){
  lgBar(root,2,'Endless zoom',next,menu);
  var list=[].concat(GB_ART,LG_IMGS,GB_WEEKS.slice(-12).map(function(p){return p.s;}),PROJECTS.filter(function(p){return !p.preview&&p.id!=='dangerous-web'&&p.id!=='little-game';}).map(function(p){return p.cover;}));
  var st=el('div','lg-zoom-st');root.appendChild(st);
  var hint=el('div','lg-hint on','scroll — it never ends');st.appendChild(hint);
  var Z=4.0,POOL=5,t=0,v=0;
  var pool=[];for(var i=0;i<POOL;i++){var d=el('div','lg-z');var im=document.createElement('img');im.alt='';d.appendChild(im);st.appendChild(d);pool.push({d:d,im:im,k:null});}
  function render(){
    var base=Math.floor(t);
    pool.forEach(function(p,j){
      var k=base-1+j;var idx=((k%list.length)+list.length)%list.length;
      if(p.k!==k){p.k=k;p.im.src=list[idx];}
      var s=Math.pow(Z,t-k);
      p.d.style.zIndex=String(10+j);
      p.d.style.visibility=(s>30||s<0.01)?'hidden':'visible';
      p.d.style.transform='translate(-50%,-50%) scale('+s+')';
    });
    // innere Bilder liegen im Rahmen des äußeren: Index rückwärts → Zoom hinein
  }
  function wheel(e){e.preventDefault();v+=e.deltaY*0.0016;}
  var ty=null;function ts(e){ty=e.touches[0].clientY;}function tm(e){if(ty==null)return;var y=e.touches[0].clientY;v+=(ty-y)*0.006;ty=y;if(e.cancelable)e.preventDefault();}
  st.addEventListener('wheel',wheel,{passive:false});st.addEventListener('touchstart',ts,{passive:true});st.addEventListener('touchmove',tm,{passive:false});
  var aid,auto=0.0016;
  function loop(){if(!document.body.contains(st))return;
    t+=v+auto;v*=0.9;render();aid=requestAnimationFrame(loop);}
  // Größere Zahl = tiefer hinein: das jeweils nächste Bild sitzt im Rahmen des aktuellen
  render();aid=requestAnimationFrame(loop);
  return function(){cancelAnimationFrame(aid);};
}

// 03 · Anamorphose: Punkte liegen in der Tiefe verstreut – nur aus einem Blickwinkel ergeben sie den Namen
function lgAnamorph(root,next,menu){
  lgBar(root,3,'Anamorphosis',next,menu);
  var st=el('div','lg-stage');st.style.height='420vh';var sk=el('div','lg-sticky');st.appendChild(sk);
  var cv=document.createElement('canvas');cv.className='lg-cv';sk.appendChild(cv);
  var hint=el('div','lg-hint','scroll slowly');sk.appendChild(hint);
  root.appendChild(st);
  var W=sk.clientWidth||window.innerWidth,H=window.innerHeight;
  var rdr=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});rdr.setPixelRatio(Math.min(2,window.devicePixelRatio));rdr.setSize(W,H,false);
  var scn=new THREE.Scene();var cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  // Zielbild: Name als Pixelmaske
  var tc=document.createElement('canvas');tc.width=600;tc.height=260;var tx=tc.getContext('2d');
  tx.fillStyle='#000';tx.font='100 118px Raleway, sans-serif';tx.textAlign='center';tx.textBaseline='middle';
  tx.fillText('OUSSAMA',300,70);tx.fillText('EL HAMLI',300,190);
  var data=tx.getImageData(0,0,600,260).data,pts=[];
  for(var y=0;y<260;y+=3)for(var x=0;x<600;x+=3){if(data[(y*600+x)*4+3]>128)pts.push([x/600*2-1,1-y/260*2]);}
  var ref=new THREE.Vector3(0,0,14);var refCam=new THREE.PerspectiveCamera(50,W/H,0.1,200);refCam.position.copy(ref);refCam.lookAt(0,0,0);refCam.updateMatrixWorld();refCam.updateProjectionMatrix();
  var sx=0.8,sy=sx*(W/H)*(260/600);if(sy>0.62){var kk=0.62/sy;sx*=kk;sy*=kk;}
  var pos=new Float32Array(pts.length*3);
  pts.forEach(function(p,i){
    var q=new THREE.Vector3(p[0]*sx,p[1]*sy,0.5).unproject(refCam); // Punkt auf dem Sehstrahl der Referenzkamera
    var dir=q.sub(ref).normalize();var d=6+Math.random()*16;q=ref.clone().add(dir.multiplyScalar(d));
    pos[i*3]=q.x;pos[i*3+1]=q.y;pos[i*3+2]=q.z;
  });
  var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  var mat=new THREE.PointsMaterial({color:0x2a2a2a,size:2.2,sizeAttenuation:false});
  scn.add(new THREE.Points(geo,mat));
  var aid;function render(){if(!document.body.contains(cv)){rdr.dispose();return;}var p=progressOf(st);var a=(p-0.55)*2.6;var e=(p-0.55)*1.4;
    cam.position.set(Math.sin(a)*14,Math.sin(e)*5,Math.cos(a)*14);cam.lookAt(0,0,0);
    hint.textContent=Math.abs(p-0.55)<0.03?'there it is':'scroll slowly';hint.classList.toggle('on',Math.abs(p-0.55)<0.03);
    rdr.render(scn,cam);aid=requestAnimationFrame(render);}
  render();
  return function(){cancelAnimationFrame(aid);rdr.dispose();geo.dispose();mat.dispose();};
}

