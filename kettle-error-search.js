(() => {
  const root = document.querySelector('[data-kettle-error-search]');
  const push = (event, params={}) => typeof window.mospochinTrackSiteEvent === 'function' ? window.mospochinTrackSiteEvent(event, Object.assign({equipment:'cooking_kettle',paid_cluster:'cooking_kettles'},params)) : null;
  if (!root) return;
  const payload = window.KETTLE_ERROR_SEARCH_DATA || {};
  const data = Array.isArray(payload.codes) ? payload.codes : [];
  const q=root.querySelector('[data-kettle-query]'), brand=root.querySelector('[data-kettle-brand]'), family=root.querySelector('[data-kettle-family]'), system=root.querySelector('[data-kettle-system]'), impact=root.querySelector('[data-kettle-impact]'), button=root.querySelector('[data-kettle-submit]'), results=root.querySelector('[data-kettle-results]');
  const esc=(value='')=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const norm=(value='')=>String(value).toLowerCase().replace(/ё/g,'е').replace(/[е]/g,'e').replace(/[н]/g,'h').replace(/[оo]/g,'0').replace(/ошибка|error|err|код/gi,' ').replace(/[^a-zа-я0-9]+/gi,' ').trim();
  const optionHtml=(values, first)=>first+[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru')).map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
  const updateFamilies=()=>{ const current=family.value; const vals=data.filter(x=>(!brand.value||x.brand===brand.value)&&(!system.value||x.system===system.value)).map(x=>x.family); family.innerHTML=optionHtml(vals,'<option value="">Все семейства</option>'); if([...family.options].some(o=>o.value===current)) family.value=current; };
  const updateHash=()=>{ const p=new URLSearchParams(); if(q.value.trim())p.set('q',q.value.trim()); if(brand.value)p.set('brand',brand.value); if(family.value)p.set('family',family.value); if(system.value)p.set('system',system.value); if(impact.value)p.set('impact',impact.value); try { history.replaceState(null,'',p.toString()?`#${p.toString()}`:location.pathname); } catch (_) {} };
  const render=()=>{
    const query=norm(q.value), sb=brand.value, sf=family.value, ss=system.value, si=impact.value;
    const matched=data.filter(item=>{ const hay=norm([item.code,item.code_display,(item.aliases||[]).join(' '),item.brand,item.family,item.model_scope,item.confirmed_meaning,item.system_label,item.impact_label].join(' ')); return(!query||hay.includes(query))&&(!sb||item.brand===sb)&&(!sf||item.family===sf)&&(!ss||item.system===ss)&&(!si||item.operational_impact===si); });
    updateHash(); push('kettle_error_search_use',{query:q.value,brand:sb,family:sf,functional_system:ss,impact:si,result_count:matched.length,page_path:location.pathname});
    if(!matched.length){ results.innerHTML='<div class="eng-empty">Совпадение не найдено. Не угадывайте значение по похожим символам — пришлите фото полного сообщения и шильдика.</div>'; return; }
    results.innerHTML=`<div class="eng-result-summary"><strong>Найдено: ${matched.length}</strong><span>Показаны только записи с зафиксированной областью применимости.</span></div>`+matched.map(item=>`<article class="eng-result"><div class="eng-result-top"><span class="eng-code-chip">${esc(item.code_display)}</span><span class="eng-status ${esc(item.severity_class||'eng-status-info')}">${esc(item.severity_label)}</span></div><div class="eng-result-tags"><span>${esc(item.system_label)}</span><span>${esc(item.family)}</span></div><h3>${esc(item.brand)} ${esc(item.code_display)}</h3><p>${esc(item.confirmed_meaning)}</p><p class="eng-result-blocked"><strong>Влияние:</strong> ${esc(item.impact_label)}. <strong>Ограничение:</strong> ${esc((item.limitations||[])[0]||'Требуется точная модель.')}</p><a href="/${esc(item.page_url)}" data-kettle-result-open="${esc(item.code)}">Открыть инженерную карточку →</a></article>`).join('');
  };
  brand.innerHTML=optionHtml(data.map(x=>x.brand),'<option value="">Все производители</option>');
  system.innerHTML='<option value="">Все контуры</option>'+Object.entries(payload.systems||{}).map(([v,x])=>`<option value="${esc(v)}">${esc(x.label)}</option>`).join('');
  updateFamilies();
  try { const hp=new URLSearchParams(location.hash.replace(/^#/,'')); if(hp.get('q'))q.value=hp.get('q'); if(hp.get('brand'))brand.value=hp.get('brand'); if(hp.get('system'))system.value=hp.get('system'); updateFamilies(); if(hp.get('family'))family.value=hp.get('family'); if(hp.get('impact'))impact.value=hp.get('impact'); } catch (_) {}
  render(); push('kettle_error_search_open',{record_count:data.length,page_path:location.pathname});
  [brand,system].forEach(el=>el.addEventListener('change',()=>{updateFamilies();render();})); family.addEventListener('change',render); impact.addEventListener('change',render); button.addEventListener('click',render); q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();render();}});
  results.addEventListener('click',e=>{const a=e.target.closest('[data-kettle-result-open]');if(a){push('kettle_error_search_result_open',{error_code:a.dataset.kettleResultOpen,page_path:location.pathname});push('kettle_code_open',{error_code:a.dataset.kettleResultOpen,page_path:location.pathname,source:'error_search'});}});
})();
