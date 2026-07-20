(() => {
  const root = document.querySelector('[data-error-search]');
  const push = (event, params={}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({event,...params}); try { if (typeof ym==='function') ym(103480864,'reachGoal',event,params); } catch (_) {} };
  document.addEventListener('click', e => { const link=e.target.closest('[data-error-event]'); if(!link)return; push(link.dataset.errorEvent,{code:link.dataset.errorCode||'',brand:link.dataset.errorBrand||'',page:location.pathname}); });
  if(!root)return;
  const q=root.querySelector('[data-error-query]'), brand=root.querySelector('[data-error-brand]'), family=root.querySelector('[data-error-family]'), system=root.querySelector('[data-error-system]'), impact=root.querySelector('[data-error-impact]'), button=root.querySelector('[data-error-submit]'), results=root.querySelector('[data-error-results]');
  let data=[];
  const norm=(value='')=>value.toLowerCase().replace(/[ё]/g,'е').replace(/[оo](?=\d)/g,'0').replace(/service|ошибка|error|err|код/gi,' ').replace(/[^a-zа-я0-9]+/gi,' ').trim();
  const options=(items,first)=>first+[...new Set(items.filter(Boolean))].sort().map(x=>`<option>${x}</option>`).join('');
  const updateFamilies=()=>{const current=family.value;const vals=data.filter(x=>(!brand.value||x.brand===brand.value)&&(!system.value||x.system===system.value)).map(x=>x.family);family.innerHTML=options(vals,'<option value="">Все серии</option>');if([...family.options].some(x=>x.value===current))family.value=current;};
  const render=()=>{const query=norm(q.value), sb=brand.value, sf=family.value, ss=system.value, si=impact.value;const matched=data.filter(item=>{const hay=norm([item.code,item.code_display,(item.aliases||[]).join(' '),item.brand,item.family,item.meaning,item.system_label,(item.blocked_functions||[]).join(' ')].join(' '));return(!query||hay.includes(query))&&(!sb||item.brand===sb)&&(!sf||item.family===sf)&&(!ss||item.system===ss)&&(!si||item.operational_impact===si);});const active=Boolean(query||sb||sf||ss||si);const limit=active?(window.innerWidth<640?24:40):(window.innerWidth<640?6:12);const filtered=matched.slice(0,limit);push('error_search_use',{query:q.value,brand:sb,family:sf,system:ss,impact:si,count:matched.length,shown:filtered.length});if(!filtered.length){results.innerHTML='<div class="eng-empty">Совпадение не найдено. Не угадывайте расшифровку: пришлите фото дисплея и шильдика.</div>';return;}const summary=`<div class="eng-result-summary"><strong>${active?'Найдено':'Стартовая выборка'}: ${matched.length}</strong><span>${active?(matched.length>limit?`Показаны первые ${limit}. Уточните код или серию.`:'Показаны все совпадения.'):`Показаны ${limit} из ${data.length}. Введите код или выберите контур.`}</span></div>`;results.innerHTML=summary+filtered.map(item=>`<article class="eng-result"><div class="eng-result-top"><span class="eng-code-chip">${item.code_display}</span><span class="eng-status ${item.severity_class||'eng-status-info'}">${item.severity_label}</span></div><div class="eng-result-tags"><span>${item.system_label||'Система не указана'}</span><span>${item.family}</span></div><h3>${item.brand}</h3><p>${item.meaning}</p><p class="eng-result-blocked"><strong>Ограничение:</strong> ${(item.blocked_functions||[]).join('; ')||'уточняется по исполнению'}</p><a href="/${item.page_url}" data-error-event="error_search_result_open" data-error-code="${item.code}" data-error-brand="${item.brand}">Открыть инженерную карточку →</a></article>`).join('');};
  const activate=(payload,source)=>{data=(payload&&payload.codes)||[];if(!data.length)throw new Error('empty error-code payload');brand.innerHTML=options(data.map(x=>x.brand),'<option value="">Все производители</option>');system.innerHTML='<option value="">Все контуры</option>'+[...new Map(data.map(x=>[x.system,x.system_label])).entries()].sort((a,b)=>a[1].localeCompare(b[1])).map(([v,l])=>`<option value="${v}">${l}</option>`).join('');updateFamilies();
    try {
      const hp=new URLSearchParams(location.hash.replace(/^#/,''));
      const hv=(k)=>decodeURIComponent(hp.get(k)||'');
      if(hv('q'))q.value=hv('q');
      if(hv('brand')&&[...brand.options].some(o=>o.value===hv('brand')))brand.value=hv('brand');
      if(hv('system')&&[...system.options].some(o=>o.value===hv('system')))system.value=hv('system');
      updateFamilies();
      if(hv('family')&&[...family.options].some(o=>o.value===hv('family')))family.value=hv('family');
      if(hv('impact')&&[...impact.options].some(o=>o.value===hv('impact')))impact.value=hv('impact');
    } catch (_) {}
    render();push('error_search_open',{page:location.pathname,records:data.length,data_source:source});};
  const embedded=window.MOSPOCHIN_ERROR_SEARCH_DATA;
  if(embedded&&Array.isArray(embedded.codes)&&embedded.codes.length){
    try{activate(embedded,'root_js_asset');}catch(_){results.innerHTML='<div class="eng-empty">Справочник временно не загрузился. Отправьте фото кода через форму ниже.</div>';}
  }else{
    fetch('/data/parokonvektomat-error-codes.json').then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}).then(payload=>activate(payload,'legacy_json_fallback')).catch(()=>{results.innerHTML='<div class="eng-empty">Справочник временно не загрузился. Отправьте фото кода через форму ниже.</div>';});
  }
  [brand,system].forEach(el=>el.addEventListener('change',()=>{updateFamilies();render();}));family.addEventListener('change',render);impact.addEventListener('change',render);button.addEventListener('click',render);q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();render();}});
})();
