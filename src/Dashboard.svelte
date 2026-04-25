<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);

  const API = '/api';
  const PALETTE = ['#003087','#e31837','#00205b','#4169a0','#1b3a6b','#4a6e8e','#003399','#1a237e','#8B4513','#4a0080','#c8860a','#8b0000','#006400','#2e4057','#1a6e8e','#c9a84c'];
  const SHIP_COLS = [['Ship Name','Ship Name'],['CruiseLine','Line'],['YearBuilt','Built'],['GT','GT'],['PassengerCapacity','Pax'],['CrewCount','Crew'],['DWT','DWT']];
  const LINE_COLS = [['CruiseLine','Cruise Line'],['shipCount','Ships'],['totalPax','Total Pax'],['totalCrew','Crew'],['avgYear','Avg Built'],['totalDWT','Total DWT']];

  let ships = $state([]), search = $state(''), selectedLine = $state('All');
  let sortKey = $state('PassengerCapacity'), sortDir = $state(-1);
  let lineSortKey = $state('totalPax'), lineSortDir = $state(-1);
  let selectedShip = $state(null), activeTab = $state('fleet'), groupBy = $state('Ship');

  let chartView = $state('raw'), chartFilter = $state('None');
  let chartDate = $state('2019-05-09'), chartStart = $state('2019-05-01'), chartEnd = $state('2019-05-31');
  let chartShip = $state(''), chartLine = $state('');
  let chartLoading = $state(false), chartError = $state(''), chartCanvas = $state(null);
  let chartInst = null;

  $effect(() => { if (chartFilter === 'Ship Name'  && !chartShip && shipNames.length) chartShip = shipNames[0]; });
  $effect(() => { if (chartFilter === 'Cruise Line' && !chartLine && lines.length > 1) chartLine = lines[1]; });

  const lc  = (l) => { const i = lines.indexOf(l); return i > 0 ? PALETTE[(i-1) % PALETTE.length] : '#4a5880'; };
  const dot = (l, s=8) => `background:${lc(l)};width:${s}px;height:${s}px;border-radius:50%;display:inline-block;margin-right:6px;flex-shrink:0`;
  const sum = (a, k) => a.reduce((t, x) => t + (x[k]||0), 0);
  const cmp = (dir, key) => (a, b) => typeof a[key]==='string' ? dir*a[key].localeCompare(b[key]||'') : dir*((a[key]||0)-(b[key]||0));
  const toggleSort = (k, line=false) => line
    ? (lineSortKey===k ? lineSortDir=-lineSortDir : (lineSortKey=k, lineSortDir=-1))
    : (sortKey===k     ? sortDir=-sortDir         : (sortKey=k,     sortDir=-1));

  onMount(async () => {
    const data = await (await fetch(`${API}/initialize`)).json();
    ships = data
      .filter(s => s.ShipName && s.ShipName !== 'Ship Name' && s.DWT)
      .map(s => ({
        'Ship Name': s.ShipName, CruiseLine: s.CruiseLine||'',
        DWT: s.DWT||0, GT: s.GT||0, YearBuilt: s.YearBuilt||0,
        PassengerCapacity: s.PassengerCapacity||0, CrewCount: s.CrewCount||0
      }));
  });

  // ── AIS Chart
  async function updateChart() {
    if (!chartCanvas) return;
    chartLoading = true; chartError = '';
    try {
      const base = chartView === 'raw'
        ? `${API}/raw?date=${chartDate}`
        : `${API}/summary?start=${chartStart}&end=${chartEnd}`;
      const filter = chartFilter === 'Ship Name' && chartShip   ? `&ship_name=${encodeURIComponent(chartShip)}`
                   : chartFilter === 'Cruise Line' && chartLine ? `&cruise_line=${encodeURIComponent(chartLine)}`
                   : '';
      const res = await fetch(base + filter);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderChart(Array.isArray(data) ? data : Object.values(data).flat());
    } catch(e) { chartError = String(e); }
    finally { chartLoading = false; }
  }

  function renderChart(data) {
    if (!data.length) { chartError = 'No data returned.'; return; }
    if (chartInst) { chartInst.destroy(); chartInst = null; }
    let labels, datasets;
    if (chartView === 'raw') {
      const hasShip = 'ShipName' in data[0] || 'ship_name' in data[0];
      if (hasShip) {
        const grp = {};
        data.forEach(d => {
          const sh = d.ShipName||d.ship_name;
          if (!sh) return;
          const t = (d.BaseDateTime||'').slice(11,19);
          if (!grp[sh]) grp[sh] = {};
          grp[sh][t] = d.momentum ?? 0;
        });
        labels   = [...new Set(data.map(d => (d.BaseDateTime||'').slice(11,19)))].sort();
        datasets = Object.keys(grp).map((sh, i) => ({
          label:sh, data:labels.map(t => grp[sh][t] ?? null),
          borderColor:PALETTE[i%PALETTE.length], backgroundColor:PALETTE[i%PALETTE.length]+'33',
          borderWidth:2, pointRadius:2, spanGaps:true
        }));
      } else {
        labels   = data.map(d => (d.BaseDateTime||'').slice(11,19));
        datasets = [{ label: chartFilter==='Ship Name'?chartShip:'Momentum', data:data.map(d=>d.momentum??0), borderColor:PALETTE[0], backgroundColor:PALETTE[0]+'33', borderWidth:2, pointRadius:3 }];
      }
    } else {
       // Group summary data by ShipName (ship_daily rows only)
      const shipGroups = {};
      data.forEach(d => {
        if (d.row_type !== "ship_daily") return;   // ignore cruise/global rows
        const sh = d.ShipName;
        if (!sh) return;
        if (!shipGroups[sh]) shipGroups[sh] = [];
        shipGroups[sh].push({
          date: d.date,
          value: d.ship_avg_momentum ?? d.avg_momentum ?? d.momentum ?? 0
        });
      });

      // Build labels from the first ship (all ships share same dates)
      const firstShip = Object.keys(shipGroups)[0];
      labels = shipGroups[firstShip]?.map(x => x.date) ?? [];

      // Build one dataset per ship
      datasets = Object.keys(shipGroups).map((sh, i) => ({
        label: sh + " — Avg",
        data: shipGroups[sh].map(x => x.value),
        borderColor: PALETTE[i % PALETTE.length],
        backgroundColor: PALETTE[i % PALETTE.length] + '33',
        borderWidth: 2,
        pointRadius: 3
      }));
    }
    chartInst = new Chart(chartCanvas, {
      type: 'line', data: { labels, datasets },
      options: { responsive:true, plugins:{ legend:{ position:'top', labels:{ color:'#e8eaf0' } } },
        scales: { x:{ ticks:{color:'#8890b0'}, grid:{color:'#1a2140'}, title:{display:true, text:chartView==='raw'?'Time':'Date', color:'#8890b0'} },
                  y:{ ticks:{color:'#8890b0'}, grid:{color:'#1a2140'}, title:{display:true, text:'Momentum kg·m/s', color:'#8890b0'} } } }
    });
  }

  // ── Derived
  const lines        = $derived(['All', ...[...new Set(ships.map(s=>s.CruiseLine).filter(Boolean))].sort()]);
  const shipNames    = $derived([...new Set(ships.map(s=>s['Ship Name']).filter(Boolean))].sort());
  const baseFiltered = $derived(ships.filter(s => (selectedLine==='All'||s.CruiseLine===selectedLine) && (!search||s['Ship Name'].toLowerCase().includes(search.toLowerCase()))));
  const filtered     = $derived([...baseFiltered].sort(cmp(sortDir, sortKey)));
  const lineGroups   = $derived.by(() =>
    Object.values(baseFiltered.reduce((g, s) => {
      const r = g[s.CruiseLine] ??= { CruiseLine:s.CruiseLine, shipCount:0, totalPax:0, totalCrew:0, totalYear:0, totalDWT:0 };
      r.shipCount++; r.totalPax+=s.PassengerCapacity; r.totalCrew+=s.CrewCount; r.totalYear+=s.YearBuilt; r.totalDWT+=s.DWT;
      return g;
    }, {})).map(r => ({...r, avgYear:Math.round(r.totalYear/r.shipCount)})).sort(cmp(lineSortDir, lineSortKey))
  );
  const st = $derived(filtered.length ? {
    total: filtered.length, pax: sum(filtered,'PassengerCapacity').toLocaleString(),
    crew: sum(filtered,'CrewCount').toLocaleString(), year: Math.round(sum(filtered,'YearBuilt')/filtered.length),
    ratio: (sum(filtered,'PassengerCapacity')/sum(filtered,'CrewCount')).toFixed(1),
    big: filtered.reduce((a,b) => a.GT>b.GT?a:b)
  } : null);
  const byLine   = $derived(Object.entries(baseFiltered.reduce((a,s)=>(a[s.CruiseLine]=(a[s.CruiseLine]||0)+s.PassengerCapacity,a),{})).sort((a,b)=>b[1]-a[1]).slice(0,10));
  const maxPax   = $derived(byLine[0]?.[1]||1);
  const byDecade = $derived(Object.entries(baseFiltered.reduce((a,s)=>{const d=Math.floor(s.YearBuilt/10)*10;a[d]=(a[d]||0)+1;return a;},{})).sort((a,b)=>a[0]-b[0]).map(([d,n])=>[d+'s',n]));
  const maxDec   = $derived(Math.max(...byDecade.map(([,v])=>v),1));
</script>

<div class="app">
  <aside>
    <div class="logo">
      <div style="font-size:28px">⚓</div>
      <h1>Maritime<br/>Registry</h1>
      <small>NOAA 2019</small>
    </div>
    <nav>
      <div class="lbl">Navigation</div>
      {#each [['fleet','🚢 Fleet Registry'],['analytics','📊 Analytics'],['ais','📈 AIS Chart']] as [tab,label]}
        <button class="ni" class:on={activeTab===tab} onclick={()=>activeTab=tab}>{label}</button>
      {/each}
    </nav>
    <div class="filters">
      <div class="lbl">Cruise Line</div>
      {#each lines as l}
        <button class="fb" class:on={selectedLine===l} onclick={()=>selectedLine=l} title={l}>
          {#if l!=='All'}<span style={dot(l,6)}></span>{/if}{l==='All'?'All Lines':l}
        </button>
      {/each}
    </div>
  </aside>

  <main>
    <div class="topbar">
      <h2>{activeTab==='fleet'?'Fleet Registry':activeTab==='analytics'?'Analytics':'AIS Chart'}</h2>
      <div class="tr">
          <label>View
            <select bind:value={chartView}>
              <option value="raw">Raw (Single Day)</option>
              <option value="summary">Summary (Date Range)</option>
            </select>
          </label>
          {#if chartView==='raw'}
            <label>Date <input type="date" bind:value={chartDate}/></label>
          {:else}
            <label>Start <input type="date" bind:value={chartStart}/></label>
            <label>End   <input type="date" bind:value={chartEnd}/></label>
            <label><input type="checkbox" id="showShips" name="showShips" checked>Show ships</label>
            <label><input type="checkbox" id="showCruiseLines" name="showCruiseLines" checked>Show cruise lines/label>
          {/if}
        <button class="ais-btn" onclick={updateChart} disabled={chartLoading}>{chartLoading?'Loading…':'Update Chart'}</button>
        <select bind:value={groupBy}><option value="Ship">By Ship</option><option value="CruiseLine">By Cruise Line</option></select>
        <input type="text" placeholder="🔍  Search ships..." bind:value={search}/>
      </div>
    </div>

    <div class="content">

      {#if st}
      <div class="cards">
        {#each [['Total Ships',st.total,'in selection'],['Passengers',st.pax,'combined berths'],['Total Crew',st.crew,'crew members'],['Avg Build Year',st.year,'fleet vintage'],['Passengers / Crew',st.ratio,'passengers per crew'],['Largest Ship',st.big['Ship Name'],`${st.big.GT.toLocaleString()} GT`,'sm']] as [lbl,val,sub,cls]}
          <div class="card"><span class="clbl">{lbl}</span><div class="val {cls||''}">{val}</div><small>{sub}</small></div>
        {/each}
      </div>
      {/if}

      {#if activeTab==='analytics'}
      <div class="charts">
        <div class="chart">
          <h3>Passenger Capacity by Line</h3>
          {#each byLine as [l,pax]}
            <div class="br"><div class="bl" title={l}><span style={dot(l,6)}></span>{l}</div><div class="bt"><div class="bf" style="width:{(pax/maxPax*100).toFixed(1)}%;background:{lc(l)}"><span>{pax.toLocaleString()}</span></div></div></div>
          {/each}
        </div>
        <div class="chart">
          <h3>Ships Built by Decade</h3>
          {#each byDecade as [d,n]}
            <div class="br"><div class="bl">{d}</div><div class="bt"><div class="bf" style="width:{(n/maxDec*100).toFixed(1)}%;background:linear-gradient(90deg,#1a4a6e,#c9a84c)"><span>{n} ships</span></div></div></div>
          {/each}
        </div>
      </div>
      {/if}

      {#if activeTab==='ais'}
      <div class="ais-wrap">
        <div class="ais-controls">
          <label>View
            <select bind:value={chartView}>
              <option value="raw">Raw (Single Day)</option>
              <option value="summary">Summary (Date Range)</option>
            </select>
          </label>
          {#if chartView==='raw'}
            <label>Date <input type="date" bind:value={chartDate}/></label>
          {:else}
            <label>Start <input type="date" bind:value={chartStart}/></label>
            <label>End   <input type="date" bind:value={chartEnd}/></label>
          {/if}
          <label>Filter
            <select bind:value={chartFilter}>
              <option>Ship Name</option><option>Cruise Line</option><option>None</option>
            </select>
          </label>
          {#if chartFilter==='Ship Name'}
            <label>Ship <select bind:value={chartShip}>{#each shipNames as n}<option>{n}</option>{/each}</select></label>
          {:else if chartFilter==='Cruise Line'}
            <label>Line <select bind:value={chartLine}>{#each lines.slice(1) as l}<option>{l}</option>{/each}</select></label>
          {/if}
          <button class="ais-btn" onclick={updateChart} disabled={chartLoading}>{chartLoading?'Loading…':'Update Chart'}</button>
        </div>
        {#if chartError}<p class="ais-err">{chartError}</p>{/if}
        <div class="ais-chart-box"><canvas bind:this={chartCanvas}></canvas></div>
      </div>
      {/if}

      {#if activeTab!=='ais'}
      <div class="tw">
        {#if groupBy==='Ship'}
          <div class="th"><h3>Fleet Registry</h3><span>{filtered.length} vessels</span></div>
          <table>
            <thead><tr>{#each SHIP_COLS as [k,lbl]}<th onclick={()=>toggleSort(k)}>{lbl}{sortKey===k?(sortDir>0?' ↑':' ↓'):''}</th>{/each}</tr></thead>
            <tbody>
              {#each filtered as s}
                <tr onclick={()=>selectedShip=s}>
                  <td><span class="sn">{s['Ship Name']}</span></td>
                  <td><span style={dot(s.CruiseLine)}></span>{s.CruiseLine}</td>
                  <td>{s.YearBuilt}</td><td>{s.GT.toLocaleString()}</td>
                  <td>{s.PassengerCapacity.toLocaleString()}</td><td>{s.CrewCount.toLocaleString()}</td>
                  <td>{s.DWT.toLocaleString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <div class="th"><h3>Cruise Line Summary</h3><span>{lineGroups.length} lines</span></div>
          <table>
            <thead><tr>{#each LINE_COLS as [k,lbl]}<th onclick={()=>toggleSort(k,true)}>{lbl}{lineSortKey===k?(lineSortDir>0?' ↑':' ↓'):''}</th>{/each}</tr></thead>
            <tbody>
              {#each lineGroups as l}
                <tr>
                  <td><span style={dot(l.CruiseLine,8)}></span><span class="sn">{l.CruiseLine}</span></td>
                  <td>{l.shipCount}</td><td>{l.totalPax.toLocaleString()}</td>
                  <td>{l.totalCrew.toLocaleString()}</td><td>{l.avgYear}</td><td>{l.totalDWT.toLocaleString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
      {/if}

    </div>
  </main>
</div>

{#if selectedShip}
<div class="ov" onclick={(e)=>e.target===e.currentTarget&&(selectedShip=null)} onkeydown={(e)=>e.key==='Escape'&&(selectedShip=null)} role="dialog" aria-modal="true" tabindex="-1">
  <div class="mo">
    <button class="xb" onclick={()=>selectedShip=null}>✕</button>
    <h2>{selectedShip['Ship Name']}</h2>
    <div class="bar"></div>
    <div class="li"><span style={dot(selectedShip.CruiseLine,10)}></span>{selectedShip.CruiseLine}</div>
    <div class="mg">
      {#each [['Year Built',selectedShip.YearBuilt,`${2019-selectedShip.YearBuilt} years in service`],['Gross Tonnage',selectedShip.GT.toLocaleString(),'GT — total ship volume'],['Passengers',selectedShip.PassengerCapacity.toLocaleString(),'max capacity'],['Crew Members',selectedShip.CrewCount.toLocaleString(),`${(selectedShip.PassengerCapacity/selectedShip.CrewCount).toFixed(1)} pax per crew`],['Dead Weight Tonnage',selectedShip.DWT.toLocaleString(),'DWT — vessel mass']] as [lbl,val,sub]}
        <div class="ms"><span class="clbl">{lbl}</span><div class="mv">{val}</div><small>{sub}</small></div>
      {/each}
    </div>
  </div>
</div>
{/if}
