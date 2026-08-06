(() => {
  "use strict";
  const data = window.COA_LOOT;
  if (!data) throw new Error("Loot data failed to load.");
  const state = { search:"", band:"All", priority:"All", status:"All", slot:"All" };
  const qualityColors = { 2:"#68d989", 3:"#69a8ff", 4:"#b47cff", 5:"#ff9f4a" };
  const statLabels = { spell_power:"SP", intellect:"Int", haste:"Haste", hit:"Hit", crit:"Crit", spirit:"Spirit", mp5:"MP5" };
  const el = {
    search:document.querySelector("#lootSearch"), grid:document.querySelector("#lootGrid"),
    slots:document.querySelector("#slotList"), count:document.querySelector("#lootResultCount"),
    empty:document.querySelector("#lootEmpty"), dialog:document.querySelector("#lootDialog"),
    dialogContent:document.querySelector("#lootDialogContent")
  };
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[character]);
  const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  const slots = [...new Set(data.items.map(item => item.slot))];

  function matches(item, ignoreSlot=false) {
    const query=state.search.trim().toLowerCase();
    const haystack=[item.name,item.slot,item.subtype,item.location,item.priority,item.status,...item.zones,...Object.keys(item.stats).map(key=>statLabels[key])].join(" ").toLowerCase();
    return (!query||haystack.includes(query))
      && (state.band==="All"||item.band===state.band)
      && (state.priority==="All"||item.priority===state.priority)
      && (state.status==="All"||item.status===state.status)
      && (ignoreSlot||state.slot==="All"||item.slot===state.slot);
  }
  function visibleItems() {
    const priorityOrder={"Top target":0,"Strong":1,"Alternative":2};
    return data.items.filter(item=>matches(item)).sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]||b.score-a.score||a.requiredLevel-b.requiredLevel);
  }
  function stats(item) {
    return Object.entries(item.stats).map(([key,value])=>`<span class="stat-pill"><b>+${value}</b> ${statLabels[key]}</span>`).join("") || `<span class="stat-pill">Effect needs manual review</span>`;
  }
  function card(item) {
    const quality=qualityColors[item.quality]||"#aab2bf";
    return `<article class="loot-card" tabindex="0" role="button" data-id="${item.id}" style="--quality:${quality}" aria-label="Open ${escapeHtml(item.name)} details">
      <div class="loot-card-top"><div><h3>${escapeHtml(item.name)}</h3><p class="loot-slot">${escapeHtml(item.slot)} · ${escapeHtml(item.subtype)}</p></div><div class="score-orb"><div>${item.score.toFixed(1)}<small>score</small></div></div></div>
      <span class="priority-badge ${slugify(item.priority)}">${escapeHtml(item.priority)}</span>
      <div class="stat-row">${stats(item)}</div>
      <div class="loot-location"><strong>${escapeHtml(item.zones.join(", ")||"Unknown source")}</strong><span>Requires ${item.requiredLevel} · Item level ${item.itemLevel}</span><span class="source-status ${item.status.toLowerCase()}"><i></i>${escapeHtml(item.status)} location</span></div>
    </article>`;
  }
  function renderSlots() {
    const countFor=slot=>data.items.filter(item=>matches(item,true)&&(slot==="All"||item.slot===slot)).length;
    el.slots.innerHTML=["All",...slots].map(slot=>`<button class="slot-button ${state.slot===slot?"active":""}" data-slot="${escapeHtml(slot)}"><span>${slot==="All"?"All equipment":escapeHtml(slot)}</span><small>${countFor(slot)}</small></button>`).join("");
    el.slots.querySelectorAll(".slot-button").forEach(button=>button.addEventListener("click",()=>{state.slot=button.dataset.slot;render();window.scrollTo({top:document.querySelector(".loot-layout").offsetTop-80,behavior:"smooth"});}));
  }
  function render() {
    const items=visibleItems();
    renderSlots();
    el.grid.innerHTML=items.map(card).join("");
    el.count.textContent=`Showing ${items.length} of ${data.itemCount} recommended targets${state.slot==="All"?"":` for ${state.slot}`}`;
    el.empty.hidden=items.length!==0;
    el.grid.querySelectorAll(".loot-card").forEach(cardEl=>{
      const open=()=>openDialog(Number(cardEl.dataset.id));
      cardEl.addEventListener("click",open);
      cardEl.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();open();}});
    });
  }
  function openDialog(id) {
    const item=data.items.find(candidate=>candidate.id===id);
    const quality=qualityColors[item.quality]||"#aab2bf";
    el.dialogContent.innerHTML=`<div style="--quality:${quality}"><header class="dialog-hero"><div class="class-kicker">${escapeHtml(item.priority)} · ${escapeHtml(item.band)} progression</div><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.slot)} · ${escapeHtml(item.subtype)}</p></header>
      <div class="dialog-body"><div class="stat-row">${stats(item)}</div>
        <section class="detail-block"><h3>Item details</h3><div class="loot-detail-grid"><div><span>Required level</span><strong>${item.requiredLevel}</strong></div><div><span>Item level</span><strong>${item.itemLevel}</strong></div><div><span>Chrono score</span><strong>${item.score.toFixed(2)}</strong></div><div><span>Priority</span><strong>${escapeHtml(item.priority)}</strong></div><div><span>Worldforged</span><strong>${item.worldforged?"Yes":"No"}</strong></div><div><span>Collected</span><strong>${item.collected?"Yes":"No"}</strong></div></div></section>
        <section class="detail-block"><h3>Where to look</h3><div class="location-box">${escapeHtml(item.location)}<span class="source-status ${item.status.toLowerCase()}"><i></i>${escapeHtml(item.status)} LootCollector signal</span></div></section>
        <section class="detail-block"><h3>Static score weights</h3><div class="weight-grid">${Object.entries(data.scoreWeights).map(([name,value])=>`<div><strong>${value.toFixed(2)}</strong><span>${escapeHtml(name)}</span></div>`).join("")}</div></section>
        <section class="detail-block"><h3>Important</h3><div class="evidence-card"><p>This score is a sorting aid, not simulated DPS. Compare within a slot and level band. Proc effects, hit caps, weapon damage, sockets, and set bonuses may change the real choice.</p></div></section>
      </div></div>`;
    el.dialog.showModal();
  }
  function reset() {
    Object.assign(state,{search:"",band:"All",priority:"All",status:"All",slot:"All"});el.search.value="";
    document.querySelectorAll("[data-loot-group]").forEach(group=>group.querySelectorAll(".filter-button").forEach(button=>button.classList.toggle("active",button.dataset.filter==="All")));render();
  }
  document.querySelectorAll("[data-loot-group]").forEach(group=>group.addEventListener("click",event=>{const button=event.target.closest(".filter-button");if(!button)return;state[group.dataset.lootGroup]=button.dataset.filter;group.querySelectorAll(".filter-button").forEach(candidate=>candidate.classList.toggle("active",candidate===button));render();}));
  el.search.addEventListener("input",()=>{state.search=el.search.value;render();});
  document.addEventListener("keydown",event=>{if(event.key==="/"&&document.activeElement!==el.search&&!el.dialog.open){event.preventDefault();el.search.focus();}});
  document.querySelector("#lootReset").addEventListener("click",reset);
  document.querySelector("#lootEmptyReset").addEventListener("click",reset);
  document.querySelector("#lootDialogClose").addEventListener("click",()=>el.dialog.close());
  el.dialog.addEventListener("click",event=>{if(event.target===el.dialog)el.dialog.close();});
  document.querySelector("#lootItemCount").textContent=data.itemCount;
  render();
})();
