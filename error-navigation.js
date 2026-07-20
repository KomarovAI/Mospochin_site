(() => {
  const push=(event,params={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...params});try{if(typeof ym==='function')ym(103480864,'reachGoal',event,params);}catch(_){}};
  const filterGroups=[...document.querySelectorAll('.error-nav-systems')];
  const desktopFilters=window.matchMedia('(min-width:900px)');
  let syncingFilters=false;
  const syncFilterGroups=()=>{
    syncingFilters=true;
    filterGroups.forEach(el=>{
      if(desktopFilters.matches){
        if(!el.open){el.open=true;el.dataset.autoDesktopOpen='1';}
      }else if(el.dataset.autoDesktopOpen==='1'){
        el.open=false;delete el.dataset.autoDesktopOpen;
      }
    });
    syncingFilters=false;
  };
  filterGroups.forEach(el=>el.addEventListener('toggle',()=>{
    if(!syncingFilters) push('error_nav_filters_toggle',{open:el.open,page:location.pathname});
  }));
  syncFilterGroups();
  if(desktopFilters.addEventListener) desktopFilters.addEventListener('change',syncFilterGroups);
  else if(desktopFilters.addListener) desktopFilters.addListener(syncFilterGroups);
  const nav=document.querySelector('.error-cluster-nav');
  if(nav&&'IntersectionObserver'in window){let sent=false;new IntersectionObserver(entries=>{if(!sent&&entries.some(x=>x.isIntersecting)){sent=true;push('error_nav_view',{page:location.pathname,type:document.body.dataset.conversionMode||'reference'});}}, {threshold:.35}).observe(nav);}
})();
