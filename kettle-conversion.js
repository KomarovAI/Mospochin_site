(function(){
  'use strict';
  var body=document.body;
  if(!body||body.dataset.kettleCluster!=='true')return;
  var sent=new Set();
  function clean(v,n){v=String(v||'').trim();return v?v.slice(0,n||256):null;}
  function context(extra){return Object.assign({
    equipment:'cooking_kettle',paid_cluster:'cooking_kettles',page_path:location.pathname,
    page_slug:clean(body.dataset.pageSlug,256),page_role:clean(body.dataset.pageRole,80),
    conversion_mode:clean(body.dataset.conversionMode,32),functional_system:clean(body.dataset.functionalSystem,80),
    brand:clean(body.dataset.brand,80),error_code:clean(body.dataset.errorCode,40)
  },extra||{});}
  function track(name,extra){if(typeof window.mospochinTrackSiteEvent!=='function')return null;return window.mospochinTrackSiteEvent(name,context(extra));}
  function once(key,name,extra){if(sent.has(key))return;sent.add(key);track(name,extra);}
  function linkData(a){return{cta_id:clean(a.dataset.ctaId,160),cta_group:clean(a.dataset.ctaGroup,80),block:clean(a.dataset.block,80),destination:clean(a.getAttribute('href'),512),cta_text:clean(a.textContent,120)};}
  function selectionEvent(a){var href=(a.getAttribute('href')||'').toLowerCase();
    if(/abat-e0|abat-e17|abat-h20/.test(href))return'kettle_code_open';
    if(/remont-pishevarochnyh-kotlov-(abat|kpem|apach|atesy|iterma)/.test(href))return'kettle_brand_select';
    if(/s-meshalkoy|oprokidyvaemyh/.test(href))return'kettle_type_select';
    if(/ne-greet|vybivaet|techet|ne-derzhit|ne-vklyuchaetsya|ne-nabiraet|ne-slivaet|dolgo-greet|suhoy-hod|ne-rabotaet-meshalka|ne-oprokidyvaetsya/.test(href))return'kettle_symptom_select';
    if(/zamena-tena|rubashka|datchik|manometr|klapan|plata|elektrod|kryshka|privoda|ohlazhdenie|slivnogo/.test(href))return'kettle_system_select';
    return null;}
  once('page','kettle_page_view',{page_title:clean(document.title,240)});
  if('IntersectionObserver'in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;if(el.hasAttribute('data-kettle-mobile-bar'))once('mobile','kettle_mobile_bar_view',{block:'mobile_bar'});else once('block:'+((el.dataset.block)||'conversion'),'kettle_conversion_block_view',{block:clean(el.dataset.block,80)});observer.unobserve(el);});},{threshold:.35});
    document.querySelectorAll('[data-kettle-conversion-block],[data-kettle-mobile-bar]').forEach(function(el){observer.observe(el);});
  }
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var href=(a.getAttribute('href')||'').toLowerCase();var payload=linkData(a);
    if(href.indexOf('tel:')===0){track('kettle_call_click',payload);return;}
    if(href.indexOf('wa.me')!==-1||href.indexOf('whatsapp')!==-1){track('kettle_photo_whatsapp_click',payload);return;}
    if(a.hasAttribute('data-kettle-reference-link'))track('kettle_reference_click',payload);
    if(a.hasAttribute('data-kettle-result-open'))return;
    var selected=selectionEvent(a);if(selected)track(selected,payload);
  },true);
  document.addEventListener('mospochin:form-success',function(e){var d=e.detail||{};var form=d.form; if(!form||form.dataset.kettleForm!=='true')return;var id=clean(form.dataset.formId,160)||'kettle_form';once('lead:'+id,'kettle_lead_submit',{form_id:id,form_variant:clean(form.dataset.formVariant,40),lead_id:clean(d.leadId,160),request_id:clean(d.requestId,160)});});
})();
