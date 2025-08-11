(function(){"use strict";
  const state={projects:[],currentIndex:0,currentProject:null,lightboxOpen:false};
  function byId(id){return document.getElementById(id)}
  function setYear(){const y=byId("year");if(y)y.textContent=(new Date).getFullYear()}
  async function loadProjects(){
    try{
      const res=await fetch("./projects.json",{cache:"no-store"});
      if(res.ok)return await res.json();
      throw new Error("fetch not ok")
    }catch(err){
      const el=document.getElementById("projects-data");
      if(el){
        try{return JSON.parse(el.textContent||"")}
        catch(e){}
      }
      return{projects:[]}
    }
  }
  function createCard(p){
    const card=document.createElement("button");
    card.className="card";card.type="button";card.setAttribute("aria-label",p.title);card.dataset.slug=p.slug||"";
    const img=document.createElement("img");
    img.src=p.hero;img.alt=p.title;img.loading="lazy";img.decoding="async";
    const overlay=document.createElement("div");overlay.className="card-overlay";
    const titleEl=document.createElement("span");titleEl.className="card-title";titleEl.textContent=p.title||"";
    const yearEl=document.createElement("span");yearEl.className="card-year";yearEl.textContent=String(p.year||"");
    overlay.appendChild(titleEl);overlay.appendChild(yearEl);
    card.appendChild(img);card.appendChild(overlay);
    card.addEventListener("click",()=>openLightbox(p,0));
    return card
  }
  function renderFeatured(projects){
    const grid=byId("featured-grid");if(!grid)return;grid.innerHTML="";
    const limit=parseInt(grid.dataset.limit||"6",10);
    projects.slice(0,limit).forEach(p=>grid.appendChild(createCard(p)))
  }
  function renderAll(projects){
    const grid=byId("projects-grid");if(!grid)return;grid.innerHTML="";
    projects.forEach(p=>grid.appendChild(createCard(p)))
  }
  function buildLightbox(){
    if(byId("lightbox"))return;
    const overlay=document.createElement("div");overlay.id="lightbox";overlay.className="lightbox";overlay.setAttribute("aria-hidden","true");
    const content=document.createElement("div");content.className="lightbox-content";content.setAttribute("role","dialog");content.setAttribute("aria-modal","true");content.setAttribute("aria-label","Project gallery");
    const prevBtn=document.createElement("button");prevBtn.className="lightbox-btn prev";prevBtn.setAttribute("aria-label","Previous image");prevBtn.dataset.prev="true";prevBtn.textContent="←";
    const imgEl=document.createElement("img");imgEl.id="lightbox-image";
    const nextBtn=document.createElement("button");nextBtn.className="lightbox-btn next";nextBtn.setAttribute("aria-label","Next image");nextBtn.dataset.next="true";nextBtn.textContent="→";
    const closeBtn=document.createElement("button");closeBtn.className="lightbox-btn close";closeBtn.setAttribute("aria-label","Close");closeBtn.dataset.close="true";closeBtn.textContent="×";
    const caption=document.createElement("div");caption.id="lightbox-caption";caption.className="lightbox-caption";
    content.appendChild(prevBtn);content.appendChild(imgEl);content.appendChild(nextBtn);content.appendChild(closeBtn);content.appendChild(caption);
    overlay.appendChild(content);document.body.appendChild(overlay);
    overlay.addEventListener("click",onLightboxClick);document.addEventListener("keydown",onKey)
  }
  function onLightboxClick(e){
    const overlay=byId("lightbox");const t=e.target;
    if(t===overlay||("close"in t.dataset)){
      closeLightbox()
    }else if("prev"in t.dataset){
      showDelta(-1)
    }else if("next"in t.dataset){
      showDelta(1)
    }
  }
  function onKey(e){
    if(!state.lightboxOpen)return;
    if(e.key==="Escape")closeLightbox();
    else if(e.key==="ArrowLeft")showDelta(-1);
    else if(e.key==="ArrowRight")showDelta(1)
  }
  function openLightbox(project,index){
    state.currentProject=project;state.currentIndex=index||0;buildLightbox();
    const lb=byId("lightbox");lb.setAttribute("aria-hidden","false");
    document.body.classList.add("no-scroll");state.lightboxOpen=true;showImage()
  }
  function closeLightbox(){
    const lb=byId("lightbox");if(!lb)return;lb.setAttribute("aria-hidden","true");
    document.body.classList.remove("no-scroll");state.lightboxOpen=false
  }
  function showDelta(d){
    const images=state.currentProject&&state.currentProject.images||[];
    if(images.length===0)return;state.currentIndex=(state.currentIndex+d+images.length)%images.length;showImage()
  }
  function truncate(text,max){
    if(!text)return "";const t=String(text).trim();if(t.length<=max)return t;return t.slice(0,Math.max(0,max-1)).trim()+"…"
  }
  function showImage(){
    const imgEl=byId("lightbox-image");const capEl=byId("lightbox-caption");
    const images=state.currentProject&&state.currentProject.images||[];
    const src=images[state.currentIndex]||state.currentProject.hero;
    imgEl.src=src;imgEl.alt=(state.currentProject.title||"Project")+" image";
    if(capEl){
      const title=state.currentProject.title||"";
      const desc=truncate(state.currentProject.description||"",220);
      capEl.textContent=desc?`${title} — ${desc}`:title;
    }
  }
  async function init(){
    setYear();
    const data=await loadProjects();
    const all=(data&&data.projects)||[];
    state.projects=all.filter(p=>!p.draft);
    renderFeatured(state.projects);
    renderAll(state.projects)
  }
  document.addEventListener("DOMContentLoaded",init)
})();