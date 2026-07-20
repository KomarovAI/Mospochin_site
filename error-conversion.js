/* MOSPOCHIN_ERROR_CONVERSION_LAYER_V1 */
(function(){
  'use strict';
  var body=document.body;
  if(!body || body.dataset.paidCluster!=='parokonvektomat_errors_engineering') return;
  var mode=body.dataset.conversionMode || 'reference';
  var page=body.dataset.pageSlug || location.pathname;
  function track(name,extra){
    var payload=Object.assign({page:location.pathname,error_page:page,conversion_mode:mode,brand:body.dataset.brand||''},extra||{});
    if(typeof window.mospochinTrackSiteEvent==='function') window.mospochinTrackSiteEvent(name,payload);
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push(Object.assign({event:name,engineering_cluster:'parokonvektomat_errors'},payload));
  }
  function init(){
    track('error_conversion_page_view',{priority:body.dataset.conversionPriority||'reference'});
    var block=document.querySelector('[data-error-conversion-block]');
    if(block && 'IntersectionObserver' in window){
      var seen=false;
      var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!seen && entry.isIntersecting && entry.intersectionRatio>=0.35){
            seen=true; track('error_conversion_block_view'); observer.disconnect();
          }
        });
      },{threshold:[0,.35,.75]});
      observer.observe(block);
    }
    var bar=document.querySelector('[data-error-mobile-bar]');
    if(bar){
      var shown=false;
      var request=document.getElementById('request');
      var footer=document.getElementById('footer-container');
      var hero=document.querySelector('.eng-hero');
      function update(){
        var mobile=window.matchMedia('(max-width:640px)').matches;
        var pastHero=!hero || window.scrollY>Math.max(420,hero.offsetTop+hero.offsetHeight-120);
        var requestNear=request && request.getBoundingClientRect().top<window.innerHeight*.82 && request.getBoundingClientRect().bottom>80;
        var footerNear=footer && footer.getBoundingClientRect().top<window.innerHeight;
        var focusInForm=document.activeElement && document.activeElement.closest && document.activeElement.closest('form');
        var visible=mobile && pastHero && !requestNear && !footerNear && !focusInForm;
        bar.classList.toggle('is-visible',!!visible);
        if(visible && !shown){shown=true;track('error_mobile_bar_view');}
      }
      update();
      window.addEventListener('scroll',update,{passive:true});
      window.addEventListener('resize',update);
      document.addEventListener('focusin',update);
      document.addEventListener('focusout',function(){setTimeout(update,0);});
    }
    document.addEventListener('submit',function(e){
      var form=e.target;
      if(!form || !form.matches('.eng-form[data-conversion-mode]')) return;
      track(mode==='call'?'error_callback_submit':'error_photo_submit',{form_id:form.id||'',requested_callback:mode==='call'});
    },true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
