#!/usr/bin/env node
import {load,read,failIf} from './dishwasher-fault-lib.mjs';
const c=load('dishwasher-intent-boundaries.json'), errors=[];
function visible(html){return html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').toLowerCase()}
for(const [role,x] of Object.entries({restaurant:c.restaurant,household:c.household})){
 const text=visible(read(x.page));
 for(const term of x.requiredTerms||[])if(!text.includes(term.toLowerCase()))errors.push(`${x.page}: required ${role} term missing: ${term}`);
 const primary=(read(x.page).match(/<title>[\s\S]*?<\/title>|<h1[\s\S]*?<\/h1>/gi)||[]).join(' ').replace(/<[^>]+>/g,' ').toLowerCase();
 for(const term of x.forbiddenPrimaryTerms||[])if(primary.includes(term.toLowerCase()))errors.push(`${x.page}: forbidden primary term: ${term}`);
}
if(c.ventilationAdjacency?.role!=='external_adjacent_not_cluster_member')errors.push('ventilation adjacency role must stay external');
failIf(errors,'Dishwasher restaurant/household intent boundaries passed')
