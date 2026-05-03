<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js';
    
    Chart.register(...registerables);
  
    const API = '/api';
    // Full 103-color palette (this is for all ships, all cruise lines, and gloals)
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
    const PALETTE_21 = [
    "#e6194b", // strong red
    "#3cb44b", // bright green
    "#4363d8", // vivid blue
    "#f58231", // orange
    "#911eb4", // purple
    "#46f0f0", // cyan
    "#f032e6", // magenta
    "#bcf60c", // lime
    "#fabebe", // light pink
    "#008080", // teal
    "#e6beff", // lavender
    "#9a6324", // brown
    "#ffe119", // bright yellow
    "#aaffc3", // mint
    "#808000", // olive
    "#ffd8b1", // peach
    "#800000", // deep maroon
    "#000075", // deep navy (not black)
    "#808080", // medium gray (not white/black)
    "#f0e442", // golden yellow
    "#4daf4a"  // forest green
  ];
  
  //------------------------------------------------------------------------------
  //  this function determines which color pallet to use based on what is visible
  //------------------------------------------------------------------------------
  function getActivePalette(visibleShips, visibleLines, totalShips, totalLines) {
    const allShipsVisible = showShips && visibleShips === totalShips;
    const allLinesVisible = showCruiseLines && visibleLines === totalLines;
    const noFilter = chartFilter === 'None' && !chartShip && !chartLine;
    const globalOn = showGlobal;
  
    // Only use full palette when EVERYTHING is on and unfiltered
    if (allShipsVisible && allLinesVisible && globalOn && noFilter) {
      return PALETTE_103;
    }
  
    //Any filtering → use compact palette as all colors are not needed and we want
    //the colors more distinct
    return PALETTE_21;
  }

  //ship column map
  const SHIP_COLS = [['Ship Name','Ship Name'],['CruiseLine','Line'],['YearBuilt','Built'],['GT','GT'],['PassengerCapacity','passengers'],['CrewCount','Crew'],['DWT','DWT']];
  //cruise line column map
  const LINE_COLS = [['CruiseLine','Cruise Line'],['shipCount','Ships'],['totalpassengers','Total passengers'],['totalCrew','Crew'],['avgYear','Avg Built'],['totalDWT','Total DWT']];

  // ---------------------------
  // Fleet & Cruise Line State
  // ---------------------------
  // Lists, search filters, and sorting for the fleet and cruise line tables.1
  let ships = $state([]);
  let search = $state('');
  let selectedLine = $state('All');
  
  let cruise_lines=$state([]);
  let selectedCruiseLine = $state('All');
  let cruiseLineSearch = $state('');

  let sortKey = $state('PassengerCapacity');
  let sortDir = $state(-1);

  let lineSortKey = $state('totalpassengers');
  let lineSortDir = $state(-1);

  // ---------------------------
  // Selection & UI Navigation
  // ---------------------------
  // Tracks which ship/line is selected and which tab is active.
  let selectedShip = $state(null);
  let activeTab = $state('fleet');
  let groupBy = $state('Ship');

  // Visibility toggles for filtering chart/table content.
  let shipVisibility = {};
  let cruiseLineVisibility = {};

  // ---------------------------
  // Chart View State
  // ---------------------------
  // Controls summary/raw mode, filters, date range, and selected ship/line.
  let chartView = $state('summary');
  let chartFilter = $state('None');

  // ---------------------------
  // initial chart date values 
  // ---------------------------
  let chartDate = $state('2019-09-10');
  let chartStart = $state('2019-01-01');
  let chartEnd = $state('2019-12-31');

  let chartShip = $state('');
  let chartLine = $state('');

  // ---------------------------
  // Chart Rendering State
  // ---------------------------
  // Loading/error flags, canvas reference, and Chart.js instance.
  let chartLoading = $state(false);
  let chartError = $state('');
  let chartCanvas = $state(null);
  let chartInst = null;

  // ---------------------------
  // Color Maps
  // ---------------------------
  // Assigned colors for global, ships, and cruise lines.
  let GLOBAL_COLOR={};
  let SHIP_COLORS = {};
  let LINE_COLORS = {};

  // ---------------------------
  // Display Toggles
  // ---------------------------
  // Controls which groups appear in the summary chart.
  let showGlobal = $state(true);
  let showShips = $state(true);
  let showCruiseLines = $state(true);

  // ---------------------------
  // Misc
  // ---------------------------
  // Tracks whether the chart has been initialized and which momentum metric is shown.
  let chartInitialized = false;
  let momentumView = $state("Average_and_Max");


  // --------------------------------------------------
  // this function assigns a stable color to each ship
  // cruise line, and global shown on the graph it will 
  // use the full 103‑color palette only when ALL groups
  // (global, ships, cruise lines) are visible and no 
  // ship or cruise line is selected to be filtered. 
  // Otherwise falls back to the compact 21‑color 
  // palette for clarity.
  // --------------------------------------------------
  function buildColorMaps(shipNames, cruiseLines) {
      // Determine whether to use the full palette or the compact one.
      const useFullPalette =
          showGlobal &&
          showShips &&
          showCruiseLines &&
          selectedShip == null &&
          selectedCruiseLine === 'All';
      // based on what was determined set the color pallet appropriately
      const ACTIVE = useFullPalette ? PALETTE_103 : PALETTE_21;

      // Reset color maps before rebuilding them.
      SHIP_COLORS = {};
      LINE_COLORS = {};

      // Assign colors to ships (wraps around if fewer colors than ships).
      shipNames.forEach((name, i) => {
          SHIP_COLORS[name] = ACTIVE[i % ACTIVE.length];
      });

      // Assign colors to cruise lines (continues after ships).
      cruiseLines.forEach((name, i) => {
          LINE_COLORS[name] = ACTIVE[(i + shipNames.length) % ACTIVE.length];
      });

      //set the global color to white, becasue the background is dark white always stands out well
      GLOBAL_COLOR = "white";
  }

  // -------------------------------------------------------------
  // Reactive defaults for dropdowns
  // -------------------------------------------------------------
  // When switching to Ship Name mode, auto‑select the first ship
  $effect(() => { if (chartFilter === 'Ship Name'  && !chartShip && shipNames.length) chartShip = shipNames[0]; });

  // When switching to Cruise Line mode, auto‑select the first real line
  $effect(() => { if (chartFilter === 'Cruise Line' && !chartLine && lines.length > 1) chartLine = lines[1]; });

  // -------------------------------------------------------------
  // Small UI helpers
  // -------------------------------------------------------------
  // Returns the color assigned to a cruise line (fallback is global color)
  const lc  = (l) => { const i = lines.indexOf(l); return i > 0 ? PALETTE_103[(i-1) % PALETTE_103.length] : '#4a5880'; };
  // Builds a small colored dot for table legends
  const dot = (l, s=8) => `background:${lc(l)};width:${s}px;height:${s}px;border-radius:50%;display:inline-block;margin-right:6px;flex-shrink:0`;

  // -------------------------------------------------------------
  // Data utilities
  // -------------------------------------------------------------
  // Sums a numeric field across an array of objects
  const sum = (a, k) => a.reduce((t, x) => t + (x[k]||0), 0);

  // Generic comparator for sorting tables (string or numeric)
  const cmp = (dir, key) => (a, b) => typeof a[key]==='string' ? dir*a[key].localeCompare(b[key]||'') : dir*((a[key]||0)-(b[key]||0));

  // -------------------------------------------------------------
  // Sorting state toggles
  // -------------------------------------------------------------
  // Toggles sort direction or switches to a new sort key
  const toggleSort = (k, line=false) => line
    ? (lineSortKey===k ? lineSortDir=-lineSortDir : (lineSortKey=k, lineSortDir=-1))
    : (sortKey===k     ? sortDir=-sortDir         : (sortKey=k,     sortDir=-1));

  // -------------------------------------------------------------
  // Initial data load (runs once on component mount)
  // Fetches the full ship dataset from the backend, filters out
  // header rows and invalid entries, and normalizes field names.
  // This populates `ships`, which drives tables, filters, and charts.
  // -------------------------------------------------------------
  onMount(async () => {
    const data = await (await fetch(`${API}/initialize`)).json();
    ships = data
    // must have a name, must have a dead weight tonnage, and skip header
    // row
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

  // -------------------------------------------------------------
  // Build color maps once ships are loaded
  // When `ships` becomes available, extract unique ship names and
  // cruise lines, then generate consistent color assignments for
  // charts and table legends.
  // -------------------------------------------------------------
  $effect(() => {
      if (ships.length > 0) {
        const shipNamesList = [...new Set(ships.map(s => s["Ship Name"]))];
        const cruiseLinesList = [...new Set(ships.map(s => s.CruiseLine))];
        buildColorMaps(shipNamesList, cruiseLinesList);
      }
    });

  // -------------------------------------------------------------
  // Selects the appropriate momentum value for charting.
  // Returns average, max, or both depending on the current view.
  // -------------------------------------------------------------
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
    
    
  // -------------------------------------------------------------
  // Assigns colors to ships and cruise lines using the active palette
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // Fetches chart data based on the current view and filters,
  // then renders the graph
  // -------------------------------------------------------------
  async function updateChart() {
      if (!chartCanvas) return;
      chartLoading = true;
      chartError = '';
    
      try {
        const base = chartView === 'raw'
          ? `${API}/raw?date=${chartDate}`
          : `${API}/summary?start=${chartStart}&end=${chartEnd}`;
    
        const filter =
          chartFilter === 'Ship Name' && chartShip
            ? `&ship_name=${encodeURIComponent(chartShip)}`
            : chartFilter === 'Cruise Line' && chartLine
            ? `&cruise_line=${encodeURIComponent(chartLine)}`
            : '';
    
        const res = await fetch(base + filter);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
        const data = await res.json();
    
        // this calls the real chart
        renderChart(Array.isArray(data) ? data : Object.values(data).flat());
      } catch (e) {
        chartError = String(e);
      } finally {
        chartLoading = false;
      }
    }

      // -------------------------------------------------------------
      // Renders the chart in either RAW (minute-level) or SUMMARY 
      // (daily) mode. Builds datasets dynamically based on visibility 
      // settings, momentum view, and row types returned by the API.
      // -------------------------------------------------------------
      function renderChart(data) {
         if (!data || !data.length) {
           chartError = "No data returned.";
           return;
         }

         // Reset existing chart + legend
         if (chartInst) {
           chartInst.destroy();
           chartInst = null;
         }
        // Remove any existing custom legend
        const oldLegend = chartCanvas?.parentNode?.querySelector('.chartjs-legend');
        if (oldLegend) oldLegend.remove();

        // Determine visible ships and cruise lines
        const visibleShips = shipNames.filter(sh => shipVisibility[sh] !== false);
        const visibleLines = lines.slice(1).filter(cl => cruiseLineVisibility[cl] !== false);
      
        // Assign colors based on active visibility
        assignColors(shipNames, lines.slice(1), visibleShips, visibleLines);

        //the color for the global maximum and average is set to white because it contrasts well with the background
        const GLOBAL_COLOR = "white";
      
        let labels = [];
        let datasets = [];
      
        // ============================================================
        // SHARED DATASET BUILDER (RAW + SUMMARY)
        // ============================================================
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
      
        // ============================================================
        // RAW MODE (minute-by-minute momentum)
        // ============================================================
        if (chartView === "raw") {
          const shipGroups = {};
      
          data.forEach(d => {
            const sh = d.ShipName;
            if (!shipGroups[sh]) shipGroups[sh] = [];
      
            shipGroups[sh].push({
              date: d.BaseDateTime,   // minute-by-minute timestamp
              label: sh,
              value: d.momentum       // RAW momentum
            });
          });
      
          // Collect timestamps
          const allTimes = new Set();
          Object.values(shipGroups).forEach(rows => rows.forEach(r => allTimes.add(r.date)));
          labels = [...allTimes].sort();
      
          // Build datasets for each ship
          Object.keys(shipGroups).forEach(sh => {
            addDataset(shipGroups[sh], SHIP_COLORS);
          });
      
          // ============================================================
          // Build Raw Graph
          // ============================================================
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
                  title: { display: true, text: "Time", color: "#8890b0" }
                },
                y: {
                  ticks: { color: "#8890b0" },
                  grid: { color: "#1a2140" },
                  title: { display: true, text: "Momentum kg·m/s", color: "#8890b0" }
                }
              }
            }
          });
          //this prevents th4e summary logic below from also running
          return; 
        }
      
        // ============================================================
        // SUMMARY MODE (daily aggregated rows)
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
      
          // GLOBAL DAILY
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
      
        // Collect all dates across ships, cruise lines, and global rows
        const allDates = new Set();
        Object.values(shipGroups).forEach(rows => rows.forEach(r => allDates.add(r.date)));
        Object.values(lineGroups).forEach(rows => rows.forEach(r => allDates.add(r.date)));
        globalGroup.forEach(r => allDates.add(r.date));
      
        labels = [...allDates].sort();
      
        // Build datasets
        addDataset(globalGroup, {}, true);
        Object.keys(lineGroups).forEach(cl => addDataset(lineGroups[cl], LINE_COLORS));
        Object.keys(shipGroups).forEach(sh => addDataset(shipGroups[sh], SHIP_COLORS));

      
        // ============================================================
        // Build Summary Graph
        // ============================================================
        chartInst = new Chart(chartCanvas, {
          type: "line",
          data: { labels, datasets },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false}//{ position: "top", labels: { color: "#e8eaf0" } }
            },
            scales: {
              x: {
                ticks: { color: "#8890b0" },
                grid: { color: "#1a2140" },
                title: { display: true, text: "Date", color: "#8890b0" }
              },
              y: {
                ticks: { color: "#8890b0" },
                grid: { color: "#1a2140" },
                title: { display: true, text: "Momentum kg·m/s", color: "#8890b0" }
              }
            }
          }
        });

      // -------------------------------------------------------------
      // Build custom HTML legend (replaces Chart.js default legend)
      // -------------------------------------------------------------
      const legendContainer = document.createElement("div");
      legendContainer.classList.add("chartjs-legend");
      
      // Loop through datasets and build legend items
      chartInst.data.datasets.forEach(ds => {
        const item = document.createElement("div");
        item.classList.add("legend-item");
      
        const box = document.createElement("span");
        box.classList.add("legend-color-box");
        box.style.backgroundColor = ds.borderColor;
      
        const label = document.createElement("span");
        label.textContent = ds.label;
      
        item.appendChild(box);
        item.appendChild(label);
        legendContainer.appendChild(item);
      });
      
      // Insert legend ABOVE the canvas
      chartCanvas.parentNode.insertBefore(legendContainer, chartCanvas);
     }
  
  // ── Derived
  const lines        = $derived(['All', ...[...new Set(ships.map(s=>s.CruiseLine).filter(Boolean))].sort()]);
  const shipNames    = $derived([...new Set(ships.map(s=>s['Ship Name']).filter(Boolean))].sort());
  const baseFiltered = $derived(ships.filter(s => (selectedLine==='All'||s.CruiseLine===selectedLine) && (!search||s['Ship Name'].toLowerCase().includes(search.toLowerCase()))));
  const filtered     = $derived([...baseFiltered].sort(cmp(sortDir, sortKey)));
  const lineGroups   = $derived.by(() =>
    Object.values(baseFiltered.reduce((g, s) => {
      const r = g[s.CruiseLine] ??= { CruiseLine:s.CruiseLine, shipCount:0, totalpassengers:0, totalCrew:0, totalYear:0, totalDWT:0 };
      r.shipCount++; r.totalpassengers+=s.PassengerCapacity; r.totalCrew+=s.CrewCount; r.totalYear+=s.YearBuilt; r.totalDWT+=s.DWT;
      return g;
    }, {})).map(r => ({...r, avgYear:Math.round(r.totalYear/r.shipCount)})).sort(cmp(lineSortDir, lineSortKey))
  );
  const st = $derived(filtered.length ? {
    total: filtered.length, passengers: sum(filtered,'PassengerCapacity').toLocaleString(),
    crew: sum(filtered,'CrewCount').toLocaleString(), year: Math.round(sum(filtered,'YearBuilt')/filtered.length),
    ratio: (sum(filtered,'PassengerCapacity')/sum(filtered,'CrewCount')).toFixed(1),
    big: filtered.reduce((a, b) => (a.GT || 0) > (b.GT || 0) ? a : b)
  } : null);
  const byLine   = $derived(Object.entries(baseFiltered.reduce((a,s)=>(a[s.CruiseLine]=(a[s.CruiseLine]||0)+s.PassengerCapacity,a),{})).sort((a,b)=>b[1]-a[1]).slice(0,10));
  const maxpassengers   = $derived(byLine[0]?.[1]||1);
  const byDecade = $derived(Object.entries(baseFiltered.reduce((a,s)=>{const d=Math.floor(s.YearBuilt/10)*10;a[d]=(a[d]||0)+1;return a;},{})).sort((a,b)=>a[0]-b[0]).map(([d,n])=>[d+'s',n]));
  const maxDec   = $derived(Math.max(...byDecade.map(([,v])=>v),1));
  // Auto‑initialize the AIS chart when the tab becomes active
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
        {#each [['Total Ships',st.total,'in selection'],['Passengers',st.passengers,'combined berths'],['Total Crew',st.crew,'crew members'],['Avg Build Year',st.year,'fleet vintage'],['Passengers / Crew',st.ratio,'passengers per crew'],['Largest Ship',st.big['Ship Name'],`${st.big.GT.toLocaleString()} GT`,'sm']] as [lbl,val,sub,cls]}
          <div class="card"><span class="clbl">{lbl}</span><div class="val {cls||''}">{val}</div><small>{sub}</small></div>
        {/each}
      </div>
      {/if}

      {#if activeTab==='analytics'}
      <div class="charts">
        <div class="chart">
          <h3>Passenger Capacity by Line</h3>
          {#each byLine as [l,passengers]}
            <div class="br"><div class="bl" title={l}><span style={dot(l,6)}></span>{l}</div><div class="bt"><div class="bf" style="width:{(passengers/maxpassengers*100).toFixed(1)}%;background:{lc(l)}"><span>{passengers.toLocaleString()}</span></div></div></div>
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
                  <td>{l.shipCount}</td><td>{l.totalpassengers.toLocaleString()}</td>
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
      {#each [['Year Built',selectedShip.YearBuilt,`${2019-selectedShip.YearBuilt} years in service`],['Gross Tonnage',selectedShip.GT.toLocaleString(),'GT — total ship volume'],['Passengers',selectedShip.PassengerCapacity.toLocaleString(),'max capacity'],['Crew Members',selectedShip.CrewCount.toLocaleString(),`${(selectedShip.PassengerCapacity/selectedShip.CrewCount).toFixed(1)} passengers per crew`],['Dead Weight Tonnage',selectedShip.DWT.toLocaleString(),'DWT — vessel mass']] as [lbl,val,sub]}
        <div class="ms"><span class="clbl">{lbl}</span><div class="mv">{val}</div><small>{sub}</small></div>
      {/each}
    </div>
  </div>
</div>
{/if}
