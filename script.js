/** Local no-dependency isometric rendering sketch. No services, trackers, credentials or external data. */
(() => {
  'use strict';
  const canvas = document.querySelector('#world');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const GRID = 12, TILE_W = 62, TILE_H = 30, ORIGIN_X = 480, ORIGIN_Y = 46;
  const explorer = { x: 5, y: 5, goalX: 5, goalY: 5 };
  let hovered = null;
  const rand = (x, y) => {
    const q = Math.sin((x + 17) * 127.1 + (y + 4) * 311.7) * 43758.5453123;
    return q - Math.floor(q);
  };
  const project = (x, y) => ({x: ORIGIN_X + (x-y) * TILE_W / 2, y: ORIGIN_Y + (x+y) * TILE_H / 2});
  const path = (x, y) => {ctx.beginPath();ctx.moveTo(x, y);ctx.lineTo(x+TILE_W/2,y+TILE_H/2);ctx.lineTo(x,y+TILE_H);ctx.lineTo(x-TILE_W/2,y+TILE_H/2);ctx.closePath();};
  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bg = ctx.createLinearGradient(0,0,0,540); bg.addColorStop(0,'#122831');bg.addColorStop(1,'#07151c'); ctx.fillStyle=bg;ctx.fillRect(0,0,960,540);
    ctx.strokeStyle='#24404b';ctx.lineWidth=1;
    for(let i=-900;i<1500;i+=48){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+250,540);ctx.stroke();}
    for(let i=-300;i<1500;i+=48){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i-250,540);ctx.stroke();}
    ctx.fillStyle='#0a151c';ctx.beginPath();ctx.ellipse(480,405,405,69,0,0,Math.PI*2);ctx.fill();
    for (let z=0; z<GRID*2-1; z++) {
      for (let x=0; x<GRID; x++) {
        const y=z-x;if(y<0||y>=GRID)continue;
        const p=project(x,y),r=rand(x,y);let fill=r<.14?'#285460':r<.3?'#395d59':r<.67?'#3e6350':'#49684d';
        if ((x===explorer.goalX && y===explorer.goalY))fill='#739782';
        path(p.x,p.y);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#15333b';ctx.lineWidth=1.3;ctx.stroke();
        if(hovered && hovered.x===x && hovered.y===y){ctx.fillStyle='#ccffc129';ctx.fill();ctx.strokeStyle='#cbffcf';ctx.stroke();}
        if (r>.81 && !((x===Math.round(explorer.x))&&(y===Math.round(explorer.y)))) {
          const px=p.x,py=p.y+6;ctx.fillStyle='#11251d88';ctx.beginPath();ctx.ellipse(px+8,py+14,13,5,0,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#234f3c';ctx.beginPath();ctx.moveTo(px,py-24);ctx.lineTo(px-12,py+7);ctx.lineTo(px+12,py+7);ctx.closePath();ctx.fill();
          ctx.fillStyle='#5b9970';ctx.beginPath();ctx.moveTo(px,py-38);ctx.lineTo(px-10,py-5);ctx.lineTo(px+10,py-5);ctx.closePath();ctx.fill();
        }
      }
    }
    explorer.x+=(explorer.goalX-explorer.x)*.14;explorer.y+=(explorer.goalY-explorer.y)*.14;
    const p=project(explorer.x,explorer.y);const bob=Math.sin(time/310)*2;
    ctx.fillStyle='#1018189e';ctx.beginPath();ctx.ellipse(p.x,p.y+14,15,7,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ceefbc';ctx.beginPath();ctx.arc(p.x,p.y-7+bob,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#e8ffe1';ctx.beginPath();ctx.arc(p.x-2,p.y-9+bob,3,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#b4f8ae';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(p.x,p.y+13,18,8,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#a6bcbf';ctx.font='12px ui-monospace, monospace';ctx.fillText('EXPLORER // '+Math.round(explorer.x)+','+Math.round(explorer.y),22,516);
    ctx.fillText('TERRAIN STUDY  001',790,516);
    requestAnimationFrame(draw);
  }
  function clickTile(event) {
    const bounds=canvas.getBoundingClientRect();const px=(event.clientX-bounds.left)*(canvas.width/bounds.width);const py=(event.clientY-bounds.top)*(canvas.height/bounds.height);
    let best=null,bestD=Infinity;
    for(let x=0;x<GRID;x++)for(let y=0;y<GRID;y++){const p=project(x,y);const dx=(px-p.x)/(TILE_W/2),dy=(py-p.y-TILE_H/2)/(TILE_H/2);const d=dx*dx+dy*dy;if(d<bestD){bestD=d;best={x,y};}}
    return bestD<=1.2?best:null;
  }
  canvas.addEventListener('pointermove', e=>{hovered=clickTile(e)});
  canvas.addEventListener('pointerleave',()=>{hovered=null});
  canvas.addEventListener('click',e=>{const t=clickTile(e);if(t){explorer.goalX=t.x;explorer.goalY=t.y;}});
  window.addEventListener('keydown', e=>{
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
    const movements={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]};
    const m=movements[e.code];if(!m)return;
    if(e.code.startsWith('Arrow'))e.preventDefault();
    explorer.goalX=Math.max(0,Math.min(GRID-1,explorer.goalX+m[0]));
    explorer.goalY=Math.max(0,Math.min(GRID-1,explorer.goalY+m[1]));
  });
  requestAnimationFrame(draw);
})();
