<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);

  const API = '/api';
  // Full 103-color palette (your existing one)
  const PALETTE_103 = [
  "hsl(0,65%,50%)","hsl(3.4951456310679615,65%,50%)","hsl(6.990291262135923,65%,50%)",
  "hsl(10.485436893203883,65%,50%)","hsl(13.980582524271844,65%,50%)","hsl(17.475728155339806,65%,50%)",
  "hsl(20.970873786407767,65%,50%)","hsl(24.46601941747573,65%,50%)","hsl(27.96116504854369,65%,50%)",
  "hsl(31.45631067961165,65%,50%)","hsl(34.95145631067961,65%,50%)","hsl(38.44660194174757,65%,50%)",
  "hsl(41.94174757281553,65%,50%)","hsl(45.436893203883495,65%,50%)","hsl(48.932038834951456,65%,50%)",
  "hsl(52.42718446601942,65%,50%)","hsl(55.922330097087376,65%,50%)","hsl(59.41747572815534,65%,50%)",
  "hsl(62.9126213592233,65%,50%)","hsl(66.40776699029126,65%,50%)","hsl(69.90291262135922,65%,50%)",
  "hsl(73.39805825242718,65%,50%)","hsl(76.89320388349515,65%,50%)","hsl(80.38834951456311,65%,50%)",
  "hsl(83.88349514563107,65%,50%)","hsl(87.37864077669903,65%,50%)","hsl(90.87378640776699,65%,50%)",
  "hsl(94.36893203883495,65%,50%)","hsl(97.86407766990291,65%,50%)","hsl(101.35922330097087,65%,50%)",
  "hsl(104.85436893203883,65%,50%)","hsl(108.34951456310679,65%,50%)","hsl(111.84466019417475,65%,50%)",
  "hsl(115.33980582524272,65%,50%)","hsl(118.83495145631067,65%,50%)","hsl(122.33009708737863,65%,50%)",
  "hsl(125.8252427184466,65%,50%)","hsl(129.32038834951457,65%,50%)","hsl(132.81553398058252,65%,50%)",
  "hsl(136.31067961165048,65%,50%)","hsl(139.80582524271846,65%,50%)","hsl(143.30097087378642,65%,50%)",
  "hsl(146.79611650485436,65%,50%)","hsl(150.29126213592232,65%,50%)","hsl(153.78640776699028,65%,50%)",
  "hsl(157.28155339805825,65%,50%)","hsl(160.7766990291262,65%,50%)","hsl(164.27184466019418,65%,50%)",
  "hsl(167.76699029126214,65%,50%)","hsl(171.2621359223301,65%,50%)","hsl(174.75728155339806,65%,50%)",
  "hsl(178.25242718446602,65%,50%)","hsl(181.74757281553398,65%,50%)","hsl(185.24271844660194,65%,50%)",
  "hsl(188.7378640776699,65%,50%)","hsl(192.23300970873786,65%,50%)","hsl(195.72815533980582,65%,50%)",
  "hsl(199.22330097087378,65%,50%)","hsl(202.71844660194175,65%,50%)","hsl(206.2135922330097,65%,50%)",
  "hsl(209.70873786407767,65%,50%)","hsl(213.20388349514563,65%,50%)","hsl(216.6990291262136,65%,50%)",
  "hsl(230.67961165048544,65%,50%)","hsl(234.1747572815534,65%,50%)","hsl(237.66990291262137,65%,50%)",
  "hsl(241.16504854368933,65%,50%)","hsl(244.6601941747573,65%,50%)","hsl(248.15533980582525,65%,50%)",
  "hsl(251.6504854368932,65%,50%)","hsl(255.14563106796118,65%,50%)","hsl(258.6407766990291,65%,50%)",
  "hsl(262.1359223300971,65%,50%)","hsl(265.63106796116505,65%,50%)","hsl(269.126213592233,65%,50%)",
  "hsl(272.62135922330097,65%,50%)","hsl(276.1165048543689,65%,50%)","hsl(279.6116504854369,65%,50%)",
  "hsl(283.10679611650484,65%,50%)","hsl(286.6019417475728,65%,50%)","hsl(290.0970873786408,65%,50%)",
  "hsl(293.5922330097087,65%,50%)","hsl(297.0873786407767,65%,50%)","hsl(300.58252427184466,65%,50%)",
  "hsl(304.0776699029126,65%,50%)","hsl(307.5728155339806,65%,50%)","hsl(311.06796116504854,65%,50%)",
  "hsl(314.5631067961165,65%,50%)","hsl(318.05825242718447,65%,50%)","hsl(321.5533980582524,65%,50%)",
  "hsl(325.0485436893204,65%,50%)","hsl(328.5436893203883,65%,50%)","hsl(332.0388349514563,65%,50%)",
  "hsl(335.53398058252427,65%,50%)","hsl(339.0291262135922,65%,50%)","hsl(342.5242718446602,65%,50%)",
  "hsl(346.01941747572817,65%,50%)","hsl(349.5145631067961,65%,50%)","hsl(353.0097087378641,65%,50%)",
  "hsl(220.19417475728155,65%,50%)","hsl(227.18446601941748,65%,50%)","hsl(356.50485436893204,65%,50%)",
  "hsl(223.6893203883495,65%,50%)"
  ];

  // 21-color evenly spaced palette (20 ships + 1 cruise line)
  const PALETTE_21 = Array.from({ length: 21 }, (_, i) => {
    const hue = (360 / 21) * i;
    return `hsl(${hue}, 65%, 50%)`;
  });
  function getActivePalette(visibleShips, visibleLines, totalShips, totalLines) {
    const allShipsVisible = visibleShips === totalShips;
    const allLinesVisible = visibleLines === totalLines;
  
    // If everything is visible → use full palette
    if (allShipsVisible && allLinesVisible) {
      return PALETTE_103;
    }
  
    // Otherwise → use 21-color palette
    return PALETTE_21;
  }

  const SHIP_COLS = [['Ship Name','Ship Name'],['CruiseLine','Line'],['YearBuilt','Built'],['GT','GT'],['PassengerCapacity','Pax'],['CrewCount','Crew'],['DWT','DWT']];
  const LINE_COLS = [['CruiseLine','Cruise Line'],['shipCount','Ships'],['totalPax','Total Pax'],['totalCrew','Crew'],['avgYear','Avg Built'],['totalDWT','Total DWT']];

  let ships = $state([]), search = $state(''), selectedLine = $state('All');
  let cruise_lines=$state([]);
  let selectedCruiseLine = $state('All');
  let cruiseLineSearch = $state('');
  let sortKey = $state('PassengerCapacity'), sortDir = $state(-1);
  let lineSortKey = $state('totalPax'), lineSortDir = $state(-1);
  let selectedShip = $state(null), activeTab = $state('fleet'), groupBy = $state('Ship');
 
  let chartView = $state('summary'), chartFilter = $state('None');
  let chartDate = $state('2019-05-09'), chartStart = $state('2019-01-01'), chartEnd = $state('2019-12-31');
  let chartShip = $state(''), chartLine = $state('');
  let chartLoading = $state(false), chartError = $state(''), chartCanvas = $state(null);
  let chartInst = null;
  let GLOBAL_COLOR={};
  let SHIP_COLORS = {};
  let LINE_COLORS = {};
  let showGlobal = $state(true);
  let showShips = $state(true);
  let showCruiseLines = $state(true);
  let chartInitialized = false;
  let momentumView = $state("Average_and_Max");

  function buildColorMaps(shipNames, cruiseLines) {
    // Ships: 0–91
    shipNames.forEach((name, i) => {
      SHIP_COLORS[name] = PALETTE_103[i];
    });
  
    // Cruise lines: 92–101
    cruiseLines.forEach((name, i) => {
      LINE_COLORS[name] = PALETTE_103[shipNames.length + i];
    });
  
    // Global line is always black
    GLOBAL_COLOR = "black";
  }
  $effect(() => { if (chartFilter === 'Ship Name'  && !chartShip && shipNames.length) chartShip = shipNames[0]; });
  $effect(() => { if (chartFilter === 'Cruise Line' && !chartLine && lines.length > 1) chartLine = lines[1]; });

  const lc  = (l) => { const i = lines.indexOf(l); return i > 0 ? PALETTE_103[(i-1) % PALETTE_103.length] : '#4a5880'; };
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
                 "Ship Name": s.ShipName,
                  CruiseLine: s.CruiseLine || '',
                  DWT: s.DWT || 0,
                  GT: s.GT || 0,
                  YearBuilt: s.YearBuilt || 0,
                  PassengerCapacity: s.PassengerCapacity || 0,
                  CrewCount: s.CrewCount || 0
    }));

  });
  $effect(() => {
    if (ships.length > 0) {
      const shipNamesList = [...new Set(ships.map(s => s["Ship Name"]))];
      const cruiseLinesList = [...new Set(ships.map(s => s.CruiseLine))];
      buildColorMaps(shipNamesList, cruiseLinesList);
    }
  });
  function pickMomentum(d) {
    if (momentumView === "Average") {
      return {
        avg: (
          d.ship_avg_momentum ??
          d.cruiseline_avg_momentum ??
          d.global_avg_momentum ??
          d.avg_momentum ??
          null
        ),
        max: null
      };
    }
  
    if (momentumView === "Max") {
      return {
        avg: null,
        max: (
          d.ship_max_momentum ??
          d.cruiseline_max_momentum ??
          d.global_max_momentum ??
          d.max_momentum ??
          null
        )
      };
    }
  
    // BOTH
    return {
      avg: (
        d.ship_avg_momentum ??
        d.cruiseline_avg_momentum ??
        d.global_avg_momentum ??
        d.avg_momentum ??
        null
      ),
      max: (
        d.ship_max_momentum ??
        d.cruiseline_max_momentum ??
        d.global_max_momentum ??
        d.max_momentum ??
        null
      )
    };
  }
  
  

  function assignColors(shipNames, cruiseLines, visibleShips, visibleLines) {
    const ACTIVE = getActivePalette(
      visibleShips.length,
      visibleLines.length,
      shipNames.length,
      cruiseLines.length
    );
  
    SHIP_COLORS = {};
    LINE_COLORS = {};
  
    shipNames.forEach((sh, i) => {
      SHIP_COLORS[sh] = ACTIVE[i % ACTIVE.length];
    });
  
    cruiseLines.forEach((cl, i) => {
      LINE_COLORS[cl] = ACTIVE[(i + 10) % ACTIVE.length];
    });
  }
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
    if (!data || !data.length) {
      chartError = "No data returned.";
      return;
    }
  
    if (chartInst) {
      chartInst.destroy();
      chartInst = null;
    }
  
    // Determine visible ships and cruise lines
    const visibleShips = shipNames.filter(sh => shipVisibility[sh]);
    const visibleLines = cruiseLines.filter(cl => cruiseLineVisibility[cl]);
  
    // Assign colors dynamically
    assignColors(shipNames, cruiseLines, visibleShips, visibleLines);
  
    const GLOBAL_COLOR = "black";
  
    let labels = [];
    let datasets = [];
  
    // ============================================================
    // SUMMARY MODE (DUPLICATED ROWS)
    // ============================================================
    const shipGroups = {};
    const lineGroups = {};
    let globalGroup = [];
  
    data.forEach(d => {
      const type = d.row_type;
  
      // SHIP DAILY
      if (type === "ship_daily" && showShips) {
        const sh = d.ShipName;
        if (!shipGroups[sh]) shipGroups[sh] = [];
  
        if (momentumView !== "Max") {
          shipGroups[sh].push({
            date: d.date,
            label: `${sh} (Avg)`,
            value: d.ship_avg_momentum
          });
        }
        if (momentumView !== "Average") {
          shipGroups[sh].push({
            date: d.date,
            label: `${sh} (Max)`,
            value: d.ship_max_momentum
          });
        }
      }
  
      // CRUISE LINE DAILY
      if (type === "cruiseline_daily" && showCruiseLines) {
        const cl = d.CruiseLine;
        if (!lineGroups[cl]) lineGroups[cl] = [];
  
        if (momentumView !== "Max") {
          lineGroups[cl].push({
            date: d.date,
            label: `${cl} (Avg)`,
            value: d.cruiseline_avg_momentum
          });
        }
        if (momentumView !== "Average") {
          lineGroups[cl].push({
            date: d.date,
            label: `${cl} (Max)`,
            value: d.cruiseline_max_momentum
          });
        }
      }
  
      // GLOBAL DAILY — ALWAYS INCLUDED IF showGlobal = true
      if (type === "global_daily" && showGlobal) {
        if (momentumView !== "Max") {
          globalGroup.push({
            date: d.date,
            label: "Global (Avg)",
            value: d.global_avg_momentum
          });
        }
        if (momentumView !== "Average") {
          globalGroup.push({
            date: d.date,
            label: "Global (Max)",
            value: d.global_max_momentum
          });
        }
      }
    });
  
    // Collect all dates
    const allDates = new Set();
    Object.values(shipGroups).forEach(rows => rows.forEach(r => allDates.add(r.date)));
    Object.values(lineGroups).forEach(rows => rows.forEach(r => allDates.add(r.date)));
    globalGroup.forEach(r => allDates.add(r.date));
  
    labels = [...allDates].sort();
  
    // Build datasets
    const addDataset = (rows, colorMap, isGlobal = false) => {
      const byLabel = {};
  
      rows.forEach(r => {
        if (!byLabel[r.label]) byLabel[r.label] = [];
        byLabel[r.label].push(r);
      });
  
      Object.keys(byLabel).forEach(label => {
        const map = new Map(byLabel[label].map(r => [r.date, r.value]));
  
        datasets.push({
          label,
          data: labels.map(d => map.get(d) ?? null),
          borderColor: isGlobal ? GLOBAL_COLOR : colorMap[label.split(" (")[0]],
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: isGlobal ? 5 : label.includes("(Max)") ? 4 : 2,
          pointRadius: 3,
          spanGaps: true
        });
      });
    };
  
    Object.keys(shipGroups).forEach(sh => addDataset(shipGroups[sh], SHIP_COLORS));
    Object.keys(lineGroups).forEach(cl => addDataset(lineGroups[cl], LINE_COLORS));
    addDataset(globalGroup, {}, true);
  
    // Build chart
    chartInst = new Chart(chartCanvas, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top", labels: { color: "#e8eaf0" } }
        },
        scales: {
          x: {
            ticks: { color: "#8890b0" },
            grid: { color: "#1a2140" },
            title: {
              display: true,
              text: "Date",
              color: "#8890b0"
            }
          },
          y: {
            ticks: { color: "#8890b0" },
            grid: { color: "#1a2140" },
            title: {
              display: true,
              text: "Momentum kg·m/s",
              color: "#8890b0"
            }
          }
        }
      }
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
    big: filtered.reduce((a, b) => (a.GT || 0) > (b.GT || 0) ? a : b)
  } : null);
  const byLine   = $derived(Object.entries(baseFiltered.reduce((a,s)=>(a[s.CruiseLine]=(a[s.CruiseLine]||0)+s.PassengerCapacity,a),{})).sort((a,b)=>b[1]-a[1]).slice(0,10));
  const maxPax   = $derived(byLine[0]?.[1]||1);
  const byDecade = $derived(Object.entries(baseFiltered.reduce((a,s)=>{const d=Math.floor(s.YearBuilt/10)*10;a[d]=(a[d]||0)+1;return a;},{})).sort((a,b)=>a[0]-b[0]).map(([d,n])=>[d+'s',n]));
  const maxDec   = $derived(Math.max(...byDecade.map(([,v])=>v),1));
  // Auto-run when switching to AIS tab
$effect(() => {
  if (activeTab === 'ais' && chartCanvas && !chartInitialized) {
    chartInitialized = true;
    updateChart();
  }
});
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
            <label><input type="checkbox" bind:checked={showShips}>Show ships</label>
            <label><input type="checkbox" bind:checked={showCruiseLines}>Show cruise lines</label>
            <label><input type="checkbox" bind:checked={showGlobal}>Show global totals</label>
            <label>Momentum Type
            <select bind:value={momentumView}>
              <option value="Average">Average momentum</option>
              <option value="Max">Maximum momentum</option>
              <option value="Average_and_Max">Averge momentum and Maximum momentum</option>
            </select>
          </label>
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

  {#if activeTab === 'ais'}
  <div class="ais-wrap">
    <div class="ais-chart-box">
      <canvas bind:this={chartCanvas}></canvas>
    </div>
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
