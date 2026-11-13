const F150_PARTS = {
    "engine": {
        id: "engine",
        name: "5.0L / 5.8L Windsor V8 & EFI Bay",
        category: "powertrain",
        categoryLabel: "POWERTRAIN",
        oemRef: "F4TZ-6007-ARM / E7TE",
        diag: "EEC-IV OBD-I",
        years: "'92-'96 OBS",
        description: "The 1995 F-150 powertrain featured roller-cam 302ci (5.0L) and 351W (5.8L) small-block V8s, or the durable 4.9L 300 Inline-6, all equipped with Speed-Density or Mass Air Flow (MAF) Multi-Port Electronic Fuel Injection (EFI).",
        quirk: "1995 California models and some 5.0L automatics received true Mass Air Flow (MAF) sequential EFI with dual oxygen sensors, while most 49-state models remained Speed Density with bank-fire injection. Remote TFI ignition module sits on the driver inner fender well with an aluminum heatsink.",
        specs: [
            { label: "Oil Capacity", value: "6.0 Quarts (10W-30 / 5W-30)" },
            { label: "Firing Order (5.0L)", value: "1-3-7-2-6-5-4-8 (HO Order)" },
            { label: "Timing Base", value: "10° BTDC with SPOUT removed" },
            { label: "Common Issue", value: "PIP Stator Distributor Failure" }
        ]
    },
    "transmission": {
        id: "transmission",
        name: "E4OD 4-Speed Auto / M5OD-R2 Manual",
        category: "powertrain",
        categoryLabel: "POWERTRAIN",
        oemRef: "F5TZ-7000 / BorgWarner 1356",
        diag: "Trans Solenoid Pack (EEC-IV)",
        years: "'89-'97 OBS",
        description: "The electronic 4-speed automatic (E4OD) features a locking torque converter and overdrive cancel button on the gearshift stalk. Manual models use the rugged Mazda-designed M5OD-R2 5-speed with internal hydraulic concentric slave cylinder.",
        quirk: "1995 was the updated E4OD year featuring improved center support bushings and upgraded solenoid packs. Overdrive (OD) OFF light flashing on the shifter tip indicates an active diagnostic trouble code stored in the EEC-IV computer.",
        specs: [
            { label: "Fluid Type (Auto)", value: "Mercon V ATF (15.5-16.5 qts total)" },
            { label: "Fluid Type (Manual)", value: "Mercon ATF (3.8 qts in M5OD)" },
            { label: "Transfer Case", value: "BorgWarner 1356 (Manual / Electric)" },
            { label: "Common Issue", value: "M5OD rubber shift top plugs leaking" }
        ]
    },
    "driveshaft": {
        id: "driveshaft",
        name: "Driveshaft, Slip Yoke & Universal Joints",
        category: "powertrain",
        categoryLabel: "POWERTRAIN",
        oemRef: "F4TZ-4602-A / Spicer 1330",
        diag: "Mechanical Balance",
        years: "'92-'96 OBS",
        description: "Heavy-duty steel or aluminum drive tube connecting the transmission or transfer case to the rear differential. Uses Spicer 1330 series external snap-ring universal joints.",
        quirk: "SuperCab and Long Bed configurations feature a 2-piece split driveshaft with a rubber-isolated center carrier bearing. A common 'clunk' when accelerating from a stop is caused by dry slip-yoke splines needing Ford PTFE Teflon grease.",
        specs: [
            { label: "U-Joint Series", value: "Spicer 1330 (3.625\" cap width)" },
            { label: "Fastener Torque", value: "Pinion flange bolts: 70-95 lb-ft" },
            { label: "Service Interval", value: "Lube greaseable zerks every 5k mi" },
            { label: "Common Issue", value: "Slip yoke spline binding clunk" }
        ]
    },
    "front-suspension": {
        id: "front-suspension",
        name: "Twin-Traction Beam (TTB) / Twin I-Beam",
        category: "suspension",
        categoryLabel: "SUSPENSION",
        oemRef: "Dana 44 TTB / Ford Twin I-Beam",
        diag: "Alignment Camber Bushings",
        years: "'80-'96 F-150",
        description: "Ford's proprietary independent front suspension. 2WD models utilize stamped Twin I-Beams, while 4WD models use the articulated Dana 44 Twin-Traction Beam (TTB) with coil springs and elongated stamped steel radius arms.",
        quirk: "TTB suspension beams swing in opposite arcs. Any suspension lift or sagging coil spring immediately changes both camber and toe angles. Adjustable eccentric upper ball joint alignment bushings are essential for proper tire wear.",
        specs: [
            { label: "Spring Type", value: "Progressive Rate Front Coils" },
            { label: "Front Axle (4x4)", value: "Dana 44 TTB Reverse Spiral Bevel" },
            { label: "Radius Arm Nut", value: "Torque: 80-120 lb-ft" },
            { label: "Common Issue", value: "Degraded radius arm rubber bushings" }
        ]
    },
    "rear-axle": {
        id: "rear-axle",
        name: "Ford 8.8-Inch Rear Differential & Leaf Springs",
        category: "suspension",
        categoryLabel: "SUSPENSION",
        oemRef: "F2TZ-4001 / Ford 8.8 31-Spline",
        diag: "VSS Sensor (Top Housing)",
        years: "'83-'96 F-150",
        description: "The venerable Ford 8.8-inch semi-floating rear axle equipped with 31-spline axle shafts and 2.5-inch wide progressive multi-leaf rear springs. Available in 3.08, 3.31, 3.55, and 4.10 gear ratios, both open and Traction-Lok limited slip.",
        quirk: "The Vehicle Speed Sensor (VSS / ABS sensor) is mounted directly to the top of the rear differential pumpkin. If your speedometer bounces, cruise control fails, or E4OD shifts erratically, this sensor or the tone ring is usually dirty or faulty.",
        specs: [
            { label: "Gear Lubricant", value: "75W-90 / 80W-90 Gear Oil (5.5 pts)" },
            { label: "Friction Modifier", value: "4 oz Ford XL-3 for Traction-Lok" },
            { label: "Cover Bolts", value: "10-bolt cover (28-38 lb-ft)" },
            { label: "Spring Rate", value: "Multi-leaf pack with factory blocks" }
        ]
    },
    "wheels": {
        id: "wheels",
        name: "15\" Forged 10-Hole Alcoa Wheels & Brakes",
        category: "suspension",
        categoryLabel: "SUSPENSION",
        oemRef: "F4TZ-1007 / 5x5.5 Pattern",
        diag: "Rear RABS (Anti-Lock)",
        years: "'92-'96 OBS",
        description: "The world-famous factory 15x7.5 forged aluminum 10-hole bullet-hole rims with deep dish offset, red/black 4x4 manual locking hubs, and all-terrain tires. Front 11.5\" vented disc brakes, rear 11x2.25\" finned drums.",
        quirk: "The F-150 uses a classic 5-lug on 5.5-inch (5x139.7mm) bolt circle with 1/2\"-20 studs. 4x4 models feature manual locking hubs or automatic three-screw plastic locking hubs that often freeze if not exercised annually.",
        specs: [
            { label: "Lug Pattern", value: "5 on 5.5\" (5x139.7 mm)" },
            { label: "Lug Nut Torque", value: "100 lb-ft (1/2-20 thread)" },
            { label: "Brake Type", value: "Front Disc / Rear 11\" Drum (RABS)" },
            { label: "Tire Pressure", value: "32-35 PSI Cold" }
        ]
    },
    "fuel": {
        id: "fuel",
        name: "Dual Fuel Tanks & High-Pressure Delivery",
        category: "fuel",
        categoryLabel: "FUEL SYSTEM",
        oemRef: "F4TZ-9H307 / F1UZ-9B263",
        diag: "Dashboard Dual Tank Switch",
        years: "'90-'96 OBS",
        description: "Famous dual tank setup: midship 19-gallon tank inside the driver frame rail and rear 18.2-gallon tank mounted aft of the rear axle. Each tank contains an integrated high-pressure electric fuel pump and fuel level sender.",
        quirk: "The infamous 'cross-tank filling' condition occurs when a faulty internal check valve in one fuel delivery module allows the active pump to send return fuel into the other tank, causing it to overflow. Solved with Ford recall module kits.",
        specs: [
            { label: "Front Tank Size", value: "19 Gallons (Midship)" },
            { label: "Rear Tank Size", value: "18.2 Gallons (Rear overhang)" },
            { label: "Operating Pressure", value: "35-45 PSI EFI pressure" },
            { label: "Selector Switch", value: "Rocker switch on dash trim" }
        ]
    },
    "exhaust": {
        id: "exhaust",
        name: "Exhaust System & Catalytic Converters",
        category: "fuel",
        categoryLabel: "EXHAUST & EMISSIONS",
        oemRef: "F4TZ-5230 / E9TZ-5E212",
        diag: "HEGO Oxygen Sensor",
        years: "'92-'96 OBS",
        description: "Dual tubular exhaust manifolds feeding into a single Y-pipe, dual catalytic converter assembly (pre-cat and main three-way catalyst), oval reverse-flow muffler, and single 2.25-inch tailpipe exiting behind the passenger rear wheel.",
        quirk: "The secondary air injection (Smog / Thermactor) pump pumps fresh air through crossover tubes on the rear of cylinder heads and directly into the catalytic converter. Check the crossover pipe for rust pinholes causing exhaust ticking.",
        specs: [
            { label: "O2 Sensor", value: "Single Heated HEGO (Dual on MAF)" },
            { label: "Pipe Diameter", value: "2.25\" to 2.5\" OD aluminized steel" },
            { label: "Hanger Type", value: "Heavy-duty rubber isolators" },
            { label: "Common Issue", value: "Exhaust manifold bolt cracking" }
        ]
    },
    "frame": {
        id: "frame",
        name: "High-Strength Steel Ladder Chassis Frame",
        category: "body",
        categoryLabel: "CHASSIS & FRAME",
        oemRef: "Ford Truck Heavy Channel",
        diag: "Visual Inspection",
        years: "'80-'96 Platform",
        description: "Full-perimeter carbon steel ladder chassis featuring heavy C-channel side rails reinforced with stamped steel crossmembers, providing superior torsional rigidity and payload capacity up to 2,000 lbs.",
        quirk: "Rear spring shackle brackets riveted to the rear frame rails above the fuel tank are notorious for catching road salt and rotting out, causing the rear leaf spring to punch upward through the truck bed floor.",
        specs: [
            { label: "Material", value: "High-Tensile Carbon Steel C-Channel" },
            { label: "Wheelbase", value: "116.8\" (Short) / 133\" (Long Bed)" },
            { label: "Tow Capacity", value: "Up to 7,500 lbs (with 5.8L & 3.55+)" },
            { label: "Common Issue", value: "Rusted rear leaf spring hangers" }
        ]
    },
    "bumper-front": {
        id: "bumper-front",
        name: "Front Chrome Step Bumper & Air Dam",
        category: "body",
        categoryLabel: "BODY & TRIM",
        oemRef: "F2TZ-17757-B",
        diag: "Frame Horn Mounting",
        years: "'92-'96 OBS",
        description: "Heavy-gauge die-stamped chrome steel bumper featuring the aerodynamic 1992-1996 contour. Features dual horizontal air intake cooling cutouts for the radiator, black bumper rub strips, and an aerodynamic black lower plastic air deflector.",
        quirk: "Mounted directly to the crumpled frame horns. Diesel and heavy tow models received twin cutout slots with rubber protective rub strips; aftermarket push bars bolt directly to existing bumper mount bolts.",
        specs: [
            { label: "Finish", value: "Triple Nickel Chrome Plate" },
            { label: "Lower Valence", value: "Flexible textured ABS plastic" },
            { label: "Mounting Bolts", value: "Grade 5 carriage bolts (45-55 lb-ft)" },
            { label: "Air Slots", value: "Engine cooling and trans cooler draft" }
        ]
    },
    "headlights-grille": {
        id: "headlights-grille",
        name: "OBS Aero Headlights & Chrome Grille",
        category: "body",
        categoryLabel: "BODY & LIGHTING",
        oemRef: "F2TZ-13008 / F2TZ-8200",
        diag: "Headlight Adjuster Screws",
        years: "'92-'96 OBS",
        description: "The hallmark of the 9th-generation 'OBS' F-150: flush aerodynamic composite polycarbonate headlamp lenses, wraparound amber corner parking/turn signal assemblies, and bright argent/chrome egg-crate front grille with centered Ford Blue Oval badge.",
        quirk: "The plastic header panel (core support header) holds all headlights, turn signals, and the grille. If you bump something, this plastic panel cracks easily, causing headlamps to point downward.",
        specs: [
            { label: "Headlight Bulb", value: "9007 Dual-Filament Halogen (HB5)" },
            { label: "Turn Signal Bulb", value: "3157NA Amber Dual-Filament" },
            { label: "Grille Material", value: "Chrome Plated Injection Molded ABS" },
            { label: "Ford Emblem", value: "7-Inch Acrylic Blue Oval badge" }
        ]
    },
    "hood-fender": {
        id: "hood-fender",
        name: "Aerodynamic Steel Hood & Front Fenders",
        category: "body",
        categoryLabel: "BODY PANELS",
        oemRef: "F2TZ-16612-A / F2TZ-16005",
        diag: "Hood Hinge & Spring Tension",
        years: "'92-'96 OBS",
        description: "Smooth sloping steel hood engineered for lower wind noise and improved aerodynamic drag over the boxy 8th-gen (brick-nose). Front fenders incorporate the famous continuous swage line and stamped wheel eyebrow flares.",
        quirk: "The hood safety latch mechanism in the center core support requires regular white lithium grease. Dry latches can stick open or fail to engage the secondary safety catch.",
        specs: [
            { label: "Panel Gauge", value: "Heavy 18-gauge stamped steel" },
            { label: "Hinge Style", value: "Torsion assist spring hinges" },
            { label: "Emblems", value: "Chrome 'F-150 XLT' badge on fender sides" },
            { label: "Cowl Vent", value: "Stamped slotted air intake for HVAC" }
        ]
    },
    "cab": {
        id: "cab",
        name: "Standard Cab, Driver Door & OBS Interior",
        category: "body",
        categoryLabel: "CAB & INTERIOR",
        oemRef: "F2TZ-Cab Structure",
        diag: "Instrument Cluster Gauges",
        years: "'92-'96 OBS",
        description: "The 1992-1996 redesigned cab features a driver-oriented wrap-around dashboard, triangular front wing vent windows on the doors, flush paddle door handles, integrated roof drip rail molding, and analog instrument cluster.",
        quirk: "The driver door striker bushing made of white plastic wears out, causing the door to rattle loudly over bumps and requiring you to slam the door. Replacing the $5 plastic door striker bushing cures it immediately!",
        specs: [
            { label: "Windshield", value: "Raked laminated safety solar glass (57°)" },
            { label: "Wing Vent Window", value: "Pivoting triangular front glass pane" },
            { label: "Door Bushing", value: "Common striker plastic sleeve wear" },
            { label: "Dashboard", value: "Ergonomic curved OBS instrument cluster" }
        ]
    },
    "mirrors": {
        id: "mirrors",
        name: "OBS Low-Mount Paddle Side Mirrors",
        category: "body",
        categoryLabel: "EXTERIOR TRIM",
        oemRef: "F2TZ-17682 / Swing-Lock",
        diag: "Manual / Power Adjustment",
        years: "'92-'96 OBS",
        description: "Aerodynamic black or chrome low-mount paddle swing mirrors designed for low wind noise and wide-angle field of view. Available in standard manual and dual electric remote power adjustments.",
        quirk: "Unlike the older heavy stainless steel 3-point towing mirrors ('western style'), these sleek paddle mirrors fold flat against the cab for automatic car washes and tight trails.",
        specs: [
            { label: "Mounting", value: "Two-bolt door shell mount" },
            { label: "Control", value: "Electric joystick switch on door armrest" },
            { label: "Option", value: "Manual or Power Heated Glass" },
            { label: "Style", value: "Aerodynamic low-mount breakaway" }
        ]
    },
    "bed": {
        id: "bed",
        name: "6.5ft Styleside Bed & Dual Fuel Doors",
        category: "body",
        categoryLabel: "CARGO BED",
        oemRef: "F2TZ-Bed Assembly",
        diag: "Bed Mounting Carriage Bolts",
        years: "'87-'96 Styleside",
        description: "Double-walled welded steel cargo box featuring smooth outer bodyside panels, top bed rail with stake pockets, continuous swage line, stamped wheel arch flares, and dual fuel filler doors on the driver side.",
        quirk: "Contains dual fuel filler pocket doors on the driver side bed flank. The bed is secured to the frame rails using six large Torx T-50 or T-55 carriage bolts that frequently freeze in place with rust.",
        specs: [
            { label: "Bed Length", value: "6.5 Feet (Short Bed) / 8 Feet (Long Bed)" },
            { label: "Width Between Wells", value: "49.0 Inches (fits 4x8 sheets)" },
            { label: "Dual Filler Doors", value: "Front & Rear filler neck doors" },
            { label: "Hardware", value: "6x Torx T-50/55 frame carriage bolts" }
        ]
    },
    "tailgate": {
        id: "tailgate",
        name: "Tailgate & Rear Step Bumper Assembly",
        category: "body",
        categoryLabel: "REAR ASSEMBLY",
        oemRef: "F2TZ-9940700 / XLT Trim",
        diag: "Tailgate Latch Cables",
        years: "'87-'96 OBS",
        description: "Heavy-duty removable steel tailgate featuring center paddle release handle, internal release rods, support cables, 3-tier vertical wraparound taillights, and on XLT trims, the brushed aluminum decorative finish panel with red reflector banner.",
        quirk: "The steel tailgate support cables can rust and snap under heavy loading. Inspect the dual cables regularly before loading heavy equipment or sitting on the tailgate!",
        specs: [
            { label: "Trim Panel", value: "Brushed Aluminum with Ford Oval (XLT)" },
            { label: "Support", value: "Dual vinyl-coated braided steel cables" },
            { label: "Step Bumper", value: "Chrome steel with 5,000 lb hitch ball hole" },
            { label: "Taillights", value: "3-tier vertical red/white lenses" }
        ]
    }
};

let isExploded = false;
let isTwoTone = true;
let selectedPartId = "engine";
let activeCategoryFilter = "all";

const truckSvg = document.getElementById('truckSvg');
const explodeBtn = document.getElementById('explodeBtn');
const explodeBtnText = document.getElementById('explodeBtnText');
const trimToggleBtn = document.getElementById('trimToggleBtn');
const trimToggleText = document.getElementById('trimToggleText');
const trimStyleLabel = document.getElementById('trimStyleLabel');
const resetBtn = document.getElementById('resetBtn');
const modelStateLabel = document.getElementById('modelStateLabel');
const modelStatePill = document.getElementById('modelStatePill');
const hoverReadout = document.getElementById('hoverReadout');
const canvasHint = document.getElementById('canvasHint');
const searchInput = document.getElementById('searchInput');
const directoryContainer = document.getElementById('directoryContainer');
const directoryCount = document.getElementById('directoryCount');
const copyOemBtn = document.getElementById('copyOemBtn');
const isolatePartBtn = document.getElementById('isolatePartBtn');

const partCategory = document.getElementById('partCategory');
const partTitle = document.getElementById('partTitle');
const partGeneration = document.getElementById('partGeneration');
const partOem = document.getElementById('partOem');
const partDiag = document.getElementById('partDiag');
const partDesc = document.getElementById('partDesc');
const partQuirk = document.getElementById('partQuirk');
const partSpecsList = document.getElementById('partSpecsList');

const partNodes = document.querySelectorAll('.part-node');
const guideLines = document.querySelectorAll('.guide-line');
const twoToneElements = document.querySelectorAll('.two-tone-element');

function setTwoTone(state) {
    isTwoTone = state;
    if (isTwoTone) {
        twoToneElements.forEach(el => el.setAttribute('fill', 'url(#twoToneBand)'));
        trimToggleText.textContent = "Two-Tone XLT";
        trimStyleLabel.textContent = "Two-Tone XLT Package";
    } else {
        twoToneElements.forEach(el => el.setAttribute('fill', 'url(#bodyDark)'));
        trimToggleText.textContent = "Solid Black Trim";
        trimStyleLabel.textContent = "Solid Raven Black Trim";
    }
}

trimToggleBtn.addEventListener('click', () => setTwoTone(!isTwoTone));

function setExploded(state) {
    isExploded = state;
    if (isExploded) {
        truckSvg.classList.add('exploded');
        explodeBtn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white bg-white text-black font-semibold shadow-md transition-all";
        explodeBtnText.textContent = "Assemble Model";
        modelStateLabel.textContent = "Exploded View";
        modelStatePill.className = "w-1.5 h-1.5 rounded-full bg-white animate-ping";
        canvasHint.textContent = "Exploded view active • All 14 OBS subsystems separated for clear inspection";
        isolatePartBtn.textContent = "Assemble";
    } else {
        truckSvg.classList.remove('exploded');
        explodeBtn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-700 bg-surface-subtle text-white font-medium hover:bg-surface-hover transition-all";
        explodeBtnText.textContent = "Explode Model";
        modelStateLabel.textContent = "Assembled View";
        modelStatePill.className = "w-1.5 h-1.5 rounded-full bg-zinc-400";
        canvasHint.textContent = "Click parts to inspect • Toggle Two-Tone trim or Explode view";
        isolatePartBtn.textContent = "Explode";
    }
    updateGuideLineHighlight();
}

explodeBtn.addEventListener('click', () => setExploded(!isExploded));
isolatePartBtn.addEventListener('click', () => setExploded(!isExploded));

window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'e' || e.key === 'E') {
        setExploded(!isExploded);
    }
    if (e.key === 't' || e.key === 'T') {
        setTwoTone(!isTwoTone);
    }
    if (e.key === '/') {
        e.preventDefault();
        searchInput.focus();
    }
});

function selectPart(id) {
    const data = F150_PARTS[id];
    if (!data) return;

    selectedPartId = id;

    partNodes.forEach(node => {
        if (node.dataset.id === id) {
            node.classList.add('active');
        } else {
            node.classList.remove('active');
        }
    });

    partCategory.textContent = data.categoryLabel;
    partTitle.textContent = data.name;
    partGeneration.textContent = data.years;
    partOem.textContent = data.oemRef;
    partDiag.textContent = data.diag;
    partDesc.textContent = data.description;
    partQuirk.textContent = data.quirk;

    partSpecsList.innerHTML = "";
    data.specs.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `flex justify-between ${index !== data.specs.length - 1 ? 'border-b border-surface-border pb-1' : ''}`;
        li.innerHTML = `
            <span class="text-zinc-500">${item.label}:</span>
            <span class="text-white font-medium">${item.value}</span>
        `;
        partSpecsList.appendChild(li);
    });

    updateGuideLineHighlight();
    renderDirectory(activeCategoryFilter, searchInput.value);

    hoverReadout.textContent = `SELECTED: ${data.name.toUpperCase()}`;
    hoverReadout.classList.remove('opacity-0');
}

function updateGuideLineHighlight() {
    guideLines.forEach(line => line.classList.remove('active-guide'));
    if (!isExploded) return;

    const guideMap = {
        'hood-fender': 'guide-hood',
        'cab': 'guide-cab',
        'bed': 'guide-bed',
        'bumper-front': 'guide-bumper-front',
        'headlights-grille': 'guide-grille',
        'tailgate': 'guide-tailgate',
        'front-suspension': 'guide-front-suspension',
        'rear-axle': 'guide-rear-axle',
        'fuel': 'guide-fuel'
    };

    const guideId = guideMap[selectedPartId];
    if (guideId) {
        const guideEl = document.getElementById(guideId);
        if (guideEl) guideEl.classList.add('active-guide');
    }
}

function renderDirectory(filter = "all", query = "") {
    directoryContainer.innerHTML = "";
    let count = 0;
    const term = query.toLowerCase().trim();

    Object.values(F150_PARTS).forEach(part => {
        const matchesCategory = (filter === "all") || (part.category === filter);
        const matchesSearch = !term || 
            part.name.toLowerCase().includes(term) ||
            part.oemRef.toLowerCase().includes(term) ||
            part.description.toLowerCase().includes(term) ||
            part.quirk.toLowerCase().includes(term);

        if (matchesCategory && matchesSearch) {
            count++;
            const isSelected = (part.id === selectedPartId);
            const btn = document.createElement('button');
            btn.className = `w-full text-left p-2 rounded-lg font-mono text-xs transition-all flex items-center justify-between border ${
                isSelected 
                    ? 'bg-white text-black font-semibold border-white shadow-sm' 
                    : 'bg-surface-subtle text-zinc-300 border-surface-border hover:bg-surface-hover hover:text-white'
            }`;

            btn.innerHTML = `
                <div class="flex items-center space-x-2 truncate">
                    <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-zinc-500'}"></span>
                    <span class="truncate">${part.name}</span>
                </div>
                <span class="text-[9px] uppercase px-1.5 py-0.5 rounded border ml-2 ${
                    isSelected ? 'border-zinc-300 text-zinc-700' : 'border-zinc-800 text-zinc-500 bg-black/40'
                }">
                    ${part.category}
                </span>
            `;

            btn.addEventListener('click', () => selectPart(part.id));
            directoryContainer.appendChild(btn);
        }
    });

    directoryCount.textContent = `${count} parts`;
}

partNodes.forEach(node => {
    const id = node.dataset.id;
    const data = F150_PARTS[id];

    node.addEventListener('click', (e) => {
        e.stopPropagation();
        selectPart(id);
    });

    node.addEventListener('mouseenter', () => {
        if (data) {
            hoverReadout.textContent = data.name;
            hoverReadout.classList.remove('opacity-0');
        }
    });

    node.addEventListener('mouseleave', () => {
        if (selectedPartId && F150_PARTS[selectedPartId]) {
            hoverReadout.textContent = `SELECTED: ${F150_PARTS[selectedPartId].name.toUpperCase()}`;
        } else {
            hoverReadout.classList.add('opacity-0');
        }
    });
});

document.querySelectorAll('.jump-pill').forEach(pill => {
    pill.addEventListener('click', () => selectPart(pill.dataset.id));
});

document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => {
            t.className = "filter-tab px-3 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-surface-card transition-all";
        });
        tab.className = "filter-tab active px-3 py-1.5 rounded-md bg-white text-black font-medium transition-all";

        activeCategoryFilter = tab.dataset.category;
        renderDirectory(activeCategoryFilter, searchInput.value);

        partNodes.forEach(node => {
            const id = node.dataset.id;
            const part = F150_PARTS[id];
            if (activeCategoryFilter === "all" || (part && part.category === activeCategoryFilter)) {
                node.style.opacity = "1";
            } else {
                node.style.opacity = "0.18";
            }
        });
    });
});

searchInput.addEventListener('input', (e) => {
    renderDirectory(activeCategoryFilter, e.target.value);
});

copyOemBtn.addEventListener('click', () => {
    const part = F150_PARTS[selectedPartId];
    if (part) {
        navigator.clipboard.writeText(part.oemRef);
        const originalText = copyOemBtn.innerHTML;
        copyOemBtn.innerHTML = `
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Copied!
        `;
        copyOemBtn.classList.add('border-white', 'text-white');
        setTimeout(() => {
            copyOemBtn.innerHTML = originalText;
            copyOemBtn.classList.remove('border-white');
        }, 1400);
    }
});

resetBtn.addEventListener('click', () => {
    setExploded(false);
    setTwoTone(true);
    selectPart('engine');
    document.querySelector('[data-category="all"]').click();
    searchInput.value = "";
    renderDirectory('all', '');
});

setExploded(false);
setTwoTone(true);
selectPart('engine');
renderDirectory();
