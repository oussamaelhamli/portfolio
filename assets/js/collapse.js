/* ═══ Little Game: Klick auf die Karte → das Portfolio stürzt ein (Matter.js) ═══ */
var collapsed=false;
function collapsePortfolio(fromFace){
  if(collapsed)return;collapsed=true;
  var M=Matter,W=window.innerWidth,H=window.innerHeight;
  var layer=document.createElement('div');layer.id='cl-layer';document.body.appendChild(layer);
  var msg=document.createElement('div');msg.id='cl-msg';msg.innerHTML='<span>Gravity</span><span>wins.</span>';layer.appendChild(msg);
  var hint=document.createElement('div');hint.id='cl-hint';hint.textContent='Grab. Throw.';layer.appendChild(hint);
  var parts=[];

  // 1) Ring-Karten als flache Platten übernehmen
  ring.querySelectorAll('.slot').forEach(function(slot){
    if(parseFloat(slot.style.opacity||1)<0.5)return;
    var f=slot.querySelector('.face');var r=f.getBoundingClientRect();
    if(r.width<30||r.right<0||r.left>W)return;
    var c=document.createElement('div');c.className='cl-card';
    c.style.width=r.width+'px';c.style.height=r.height+'px';c.style.background=f.style.background;
    var media=f.querySelector('video,img.active,img.face-img,img');
    if(media){var m=media.cloneNode(true);m.removeAttribute('class');m.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';if(m.tagName==='VIDEO'){m.muted=true;m.autoplay=true;m.loop=true;m.playsInline=true;}c.appendChild(m);if(m.play)m.play().catch(function(){});}
    parts.push({el:c,r:r,isFrom:f===fromFace});
  });
  // 2) Schrift: Name, Info, Uhr, Footer
  ['#nameLink','#infoLink','#clock','.f-left p','.f-left a','.f-right a'].forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(n){
      var r=n.getBoundingClientRect();if(r.width<4||r.height<4)return;
      var cs=getComputedStyle(n);var c=document.createElement('div');c.className='cl-txt';c.textContent=n.childNodes[0]?n.childNodes[0].textContent:n.textContent;
      c.style.cssText='width:'+r.width+'px;height:'+r.height+'px;font-family:'+cs.fontFamily+';font-size:'+cs.fontSize+';font-weight:'+cs.fontWeight+';letter-spacing:'+cs.letterSpacing+';text-transform:'+cs.textTransform+';line-height:'+r.height+'px;';
      parts.push({el:c,r:r});
    });
  });
  // Originale verstecken
  document.getElementById('scene').style.visibility='hidden';
  document.querySelector('nav').style.visibility='hidden';document.querySelector('footer').style.visibility='hidden';
  cur.style.zIndex='10001';

  // Physik
  var engine=M.Engine.create();engine.gravity.y=1.25;
  var wall={isStatic:true,render:{visible:false}};
  M.Composite.add(engine.world,[
    M.Bodies.rectangle(W/2,H+40,W*3,80,wall),
    M.Bodies.rectangle(-40,H/2,80,H*6,wall),
    M.Bodies.rectangle(W+40,H/2,80,H*6,wall)
  ]);
  var origin=fromFace?fromFace.getBoundingClientRect():{left:W/2,top:H/2,width:0,height:0};
  var ox=origin.left+origin.width/2,oy=origin.top+origin.height/2;
  parts.forEach(function(p){
    layer.appendChild(p.el);
    var cx=p.r.left+p.r.width/2,cy=p.r.top+p.r.height/2;
    var b=M.Bodies.rectangle(cx,cy,p.r.width,p.r.height,{restitution:.3,friction:.5,frictionAir:.012,chamfer:{radius:2},density:p.el.className==='cl-card'?0.002:0.0008});
    var dx=cx-ox,dy=cy-oy,d=Math.max(80,Math.sqrt(dx*dx+dy*dy));
    var kick=p.isFrom?0:9;
    M.Body.setVelocity(b,{x:dx/d*kick+(Math.random()-.5)*4,y:dy/d*kick-6-Math.random()*6});
    M.Body.setAngularVelocity(b,(Math.random()-.5)*0.18);
    p.b=b;p.w=p.r.width;p.h=p.r.height;
    M.Composite.add(engine.world,b);
  });
  var mouse=M.Mouse.create(layer);mouse.pixelRatio=1;
  var mc=M.MouseConstraint.create(engine,{mouse:mouse,constraint:{stiffness:.18,damping:.1}});
  M.Composite.add(engine.world,mc);
  layer.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';});

  // Blitz + Wackler
  document.body.classList.add('cl-shake');setTimeout(function(){document.body.classList.remove('cl-shake');},500);
  var last=performance.now();
  (function loop(now){
    if(!document.body.contains(layer))return;
    M.Engine.update(engine,Math.min(32,now-last));last=now;
    parts.forEach(function(p){p.el.style.transform='translate('+(p.b.position.x-p.w/2)+'px,'+(p.b.position.y-p.h/2)+'px) rotate('+p.b.angle+'rad)';});
    requestAnimationFrame(loop);
  })(last);

  setTimeout(function(){msg.classList.add('on');},900);
  setTimeout(function(){hint.classList.add('on');},1800);
  setTimeout(function(){
    var bar=document.createElement('div');bar.id='cl-bar';
    bar.innerHTML='<button id="cl-rebuild">Rebuild</button><button id="cl-zoom">Endless zoom &rarr;</button>';
    layer.appendChild(bar);
    bar.querySelectorAll('button').forEach(function(btn){btn.addEventListener('mouseenter',function(){cur.classList.add('link');});btn.addEventListener('mouseleave',function(){cur.classList.remove('link');});});
    document.getElementById('cl-rebuild').onclick=function(){
      // Teile fliegen zurück an ihren Platz, dann ist alles wie vorher
      M.Composite.remove(engine.world,mc);
      parts.forEach(function(p){M.Body.setStatic(p.b,true);});
      var t0=performance.now();var start=parts.map(function(p){return {x:p.b.position.x,y:p.b.position.y,a:p.b.angle};});
      layer.classList.add('cl-back');
      (function back(now){
        var k=Math.min(1,(now-t0)/900);var e=1-Math.pow(1-k,3);
        parts.forEach(function(p,i){var s=start[i];var tx=p.r.left+p.w/2,ty=p.r.top+p.h/2;
          M.Body.setPosition(p.b,{x:s.x+(tx-s.x)*e,y:s.y+(ty-s.y)*e});M.Body.setAngle(p.b,s.a*(1-e));});
        if(k<1)requestAnimationFrame(back);else restore();
      })(t0);
    };
    document.getElementById('cl-zoom').onclick=function(){restore();openProject(PROJECTS.find(function(x){return x.id==='little-game';}),null);};
  },2800);
  function restore(){
    layer.remove();collapsed=false;
    document.getElementById('scene').style.visibility='';
    document.querySelector('nav').style.visibility='';document.querySelector('footer').style.visibility='';
    cur.style.zIndex='';cur.classList.remove('link');
  }
}
