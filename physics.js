(() => {
    // Theme toggle setup
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const updateToggleState = (isDark) => {
            document.documentElement.classList.toggle('dark-mode', isDark);
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        };

        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('theme') || new URLSearchParams(location.search).get('theme');
        } catch (e) {}
        updateToggleState(savedTheme === 'dark');

        themeToggle.addEventListener('click', () => {
            const isDark = !document.documentElement.classList.contains('dark-mode');
            updateToggleState(isDark);
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (e) {}
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.add('theme-ready');
            });
        });
    }

    // DOM elements
    const stage = document.getElementById('fieldStage');
    const canvas = document.getElementById('physicsCanvas');
    const ctx = canvas.getContext('2d');
    const overlay = document.getElementById('fieldOverlay');
    const objectCountEl = document.getElementById('objectCount');
    const colorPicker = document.getElementById('colorPicker');
    const customColorWrap = colorPicker ? colorPicker.closest('.custom-color-wrap') : null;
    const customColorRing = document.getElementById('customColorRing');
    const swatchBtns = document.querySelectorAll('.swatch');
    const sizePills = document.querySelectorAll('.size-pill');
    const gravityBtn = document.getElementById('gravityBtn');
    const undoBtn = document.getElementById('undoBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Drawing state
    let currentColor = '#2563eb';
    let currentThickness = 14;

    // Physics world state
    const bodies = [];
    const GRAVITY_MODES = [
        { label: 'Normal', g: 980 },
        { label: 'Low-G', g: 320 },
        { label: 'Zero-G', g: 0 },
        { label: 'Heavy', g: 1850 }
    ];
    let gravityIndex = 0;

    let viewWidth = 800;
    let viewHeight = 600;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Interaction state
    let activePointerId = null;
    let mode = 'idle'; // 'idle' | 'drawing' | 'grabbing'
    let rawStroke = [];
    let grabbedBody = null;
    let grabLocalAnchor = { x: 0, y: 0 };
    let pointerPos = { x: 0, y: 0 };
    let pointerHistory = []; // [{ x, y, t }]

    // Resize handling
    function resizeCanvas() {
        const rect = stage.getBoundingClientRect();
        const prevW = viewWidth;
        const prevH = viewHeight;
        viewWidth = Math.max(300, rect.width);
        viewHeight = Math.max(300, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(viewWidth * dpr);
        canvas.height = Math.round(viewHeight * dpr);

        // Keep existing objects inside resized bounds
        if (prevW > 0 && prevH > 0) {
            for (const b of bodies) {
                const margin = b.boundRadius || 20;
                if (b.x > viewWidth - margin) b.x = Math.max(margin, viewWidth - margin);
                if (b.y > viewHeight - margin) b.y = Math.max(margin, viewHeight - margin);
            }
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Toolbar UI handlers
    function setActiveColor(color, fromCustomPicker = false) {
        currentColor = color;
        if (colorPicker && !fromCustomPicker) {
            colorPicker.value = color;
        }
        swatchBtns.forEach(btn => {
            const match = btn.dataset.color.toLowerCase() === color.toLowerCase() && !fromCustomPicker;
            btn.classList.toggle('active', match);
            btn.setAttribute('aria-checked', String(match));
        });
        if (customColorWrap) {
            customColorWrap.classList.toggle('active', fromCustomPicker);
        }
        if (customColorRing) {
            customColorRing.style.backgroundColor = fromCustomPicker ? color : 'transparent';
        }
    }

    swatchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveColor(btn.dataset.color, false);
        });
    });

    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            setActiveColor(e.target.value, true);
        });
        colorPicker.addEventListener('click', (e) => {
            setActiveColor(e.target.value, true);
        });
    }

    sizePills.forEach(pill => {
        pill.addEventListener('click', () => {
            currentThickness = Number(pill.dataset.size) || 14;
            sizePills.forEach(p => p.classList.toggle('active', p === pill));
        });
    });

    if (gravityBtn) {
        gravityBtn.addEventListener('click', () => {
            gravityIndex = (gravityIndex + 1) % GRAVITY_MODES.length;
            const modeObj = GRAVITY_MODES[gravityIndex];
            gravityBtn.textContent = `Gravity: ${modeObj.label}`;
            // Give sleeping/settled objects a tiny nudge when gravity changes
            for (const b of bodies) {
                if (modeObj.g === 0 && Math.hypot(b.vx, b.vy) < 25) {
                    b.vy -= 45;
                    b.omega += (Math.random() - 0.5) * 0.8;
                }
            }
        });
    }

    function updateObjectCounter() {
        const count = bodies.length;
        if (objectCountEl) {
            objectCountEl.textContent = `${count} ${count === 1 ? 'object' : 'objects'}`;
        }
        if (overlay) {
            overlay.classList.toggle('hidden', count > 0 || mode === 'drawing');
        }
    }

    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            if (bodies.length > 0) {
                const removed = bodies.pop();
                if (grabbedBody === removed) {
                    grabbedBody = null;
                    mode = 'idle';
                }
                updateObjectCounter();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            bodies.length = 0;
            grabbedBody = null;
            mode = 'idle';
            updateObjectCounter();
        });
    }

    // Geometry & Polyline Simplification (Ramer-Douglas-Peucker + Resampling)
    function distToSegmentSq(px, py, ax, ay, bx, by) {
        const dx = bx - ax;
        const dy = by - ay;
        const lenSq = dx * dx + dy * dy;
        let t = 0;
        if (lenSq > 1e-8) {
            t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
        }
        const cx = ax + t * dx;
        const cy = ay + t * dy;
        return {
            distSq: (px - cx) * (px - cx) + (py - cy) * (py - cy),
            cx,
            cy,
            t
        };
    }

    function simplifyPath(points, epsilon) {
        if (points.length <= 2) return points.slice();
        let maxDistSq = 0;
        let index = 0;
        const first = points[0];
        const last = points[points.length - 1];

        for (let i = 1; i < points.length - 1; i++) {
            const dSq = distToSegmentSq(points[i].x, points[i].y, first.x, first.y, last.x, last.y).distSq;
            if (dSq > maxDistSq) {
                index = i;
                maxDistSq = dSq;
            }
        }

        if (maxDistSq > epsilon * epsilon) {
            const left = simplifyPath(points.slice(0, index + 1), epsilon);
            const right = simplifyPath(points.slice(index), epsilon);
            return left.slice(0, left.length - 1).concat(right);
        }
        return [first, last];
    }

    function pointInPolygon(px, py, pts) {
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const xi = pts[i].x, yi = pts[i].y;
            const xj = pts[j].x, yj = pts[j].y;
            const intersect = ((yi > py) !== (yj > py)) &&
                (px < (xj - xi) * (py - yi) / ((yj - yi) || 1e-9) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    // Build a 2D rigid body from drawn points
    function createBodyFromStroke(rawPoints, color, thickness) {
        if (!rawPoints || rawPoints.length === 0) return null;

        // Calculate total path length
        let totalLength = 0;
        for (let i = 1; i < rawPoints.length; i++) {
            totalLength += Math.hypot(rawPoints[i].x - rawPoints[i - 1].x, rawPoints[i].y - rawPoints[i - 1].y);
        }

        // Single click/tap or tiny drag -> create a solid circular ball
        if (totalLength < 10) {
            const p = rawPoints[0];
            const radius = Math.max(12, thickness * 1.15);
            const mass = Math.PI * radius * radius * 0.015;
            const inertia = 0.5 * mass * radius * radius;
            const body = {
                x: p.x,
                y: p.y,
                vx: 0,
                vy: 0,
                angle: 0,
                omega: 0,
                radius,
                color,
                isCircle: true,
                isClosed: true,
                localRenderPts: [{ x: 0, y: 0 }],
                localCollisionPts: [{ x: 0, y: 0 }],
                worldCollisionPts: [{ x: p.x, y: p.y }],
                segments: [{ a: 0, b: 0 }],
                mass,
                invMass: 1 / mass,
                inertia,
                invInertia: 1 / inertia,
                boundRadius: radius,
                aabb: { minX: p.x - radius, minY: p.y - radius, maxX: p.x + radius, maxY: p.y + radius }
            };
            return body;
        }

        // Smooth raw points slightly for clean visual rendering
        const renderPts = simplifyPath(rawPoints, 2.0);
        // Coarser simplification for fast, stable capsule collision segments (cap at ~28 vertices)
        let collisionEps = Math.max(5.5, totalLength / 26);
        let colPts = simplifyPath(rawPoints, collisionEps);
        while (colPts.length > 30) {
            collisionEps *= 1.3;
            colPts = simplifyPath(colPts, collisionEps);
        }

        // Check if path forms a closed shape
        const startPt = rawPoints[0];
        const endPt = rawPoints[rawPoints.length - 1];
        const endGap = Math.hypot(endPt.x - startPt.x, endPt.y - startPt.y);
        const isClosed = colPts.length >= 4 && totalLength > thickness * 4 && endGap < Math.max(38, thickness * 2.6);

        if (isClosed) {
            // Snap last point to first if very close
            if (endGap < thickness * 1.2 && colPts.length > 3) {
                colPts.pop();
            }
        }

        // Compute mass-weighted centroid along segments
        const segments = [];
        for (let i = 0; i < colPts.length - 1; i++) {
            segments.push({ a: i, b: i + 1 });
        }
        if (isClosed && colPts.length >= 3) {
            segments.push({ a: colPts.length - 1, b: 0 });
        }

        let sumX = 0;
        let sumY = 0;
        let sumWeight = 0;

        for (const seg of segments) {
            const pA = colPts[seg.a];
            const pB = colPts[seg.b];
            const len = Math.hypot(pB.x - pA.x, pB.y - pA.y) + 1.0;
            const midX = 0.5 * (pA.x + pB.x);
            const midY = 0.5 * (pA.y + pB.y);
            sumX += midX * len;
            sumY += midY * len;
            sumWeight += len;
        }

        const cx = sumWeight > 0 ? sumX / sumWeight : colPts[0].x;
        const cy = sumWeight > 0 ? sumY / sumWeight : colPts[0].y;

        // Convert both renderPts and colPts to local coordinates relative to center of mass
        const localRenderPts = renderPts.map(p => ({ x: p.x - cx, y: p.y - cy }));
        const localCollisionPts = colPts.map(p => ({ x: p.x - cx, y: p.y - cy }));

        // If closed, add 1-2 internal cross-struts for collision solidity so small balls cannot poke inside a closed block
        const baseVertexCount = localCollisionPts.length;
        if (isClosed && baseVertexCount >= 4) {
            const half = Math.floor(baseVertexCount / 2);
            segments.push({ a: 0, b: half });
            if (baseVertexCount >= 6) {
                const quarter = Math.floor(baseVertexCount / 4);
                segments.push({ a: quarter, b: quarter + half });
            }
        }

        const radius = thickness * 0.5;
        let maxR = radius;
        for (const p of localCollisionPts) {
            const d = Math.hypot(p.x, p.y) + radius;
            if (d > maxR) maxR = d;
        }

        // Compute mass and rotational moment of inertia
        const density = 0.012;
        let mass = Math.max(1.2, sumWeight * thickness * density);
        if (isClosed) {
            // Add polygon interior area contribution
            let area2 = 0;
            for (let i = 0; i < baseVertexCount; i++) {
                const p1 = localCollisionPts[i];
                const p2 = localCollisionPts[(i + 1) % baseVertexCount];
                area2 += (p1.x * p2.y - p2.x * p1.y);
            }
            mass += Math.abs(area2) * 0.5 * density * 0.45;
        }

        let inertia = 0;
        for (const seg of segments) {
            const pA = localCollisionPts[seg.a];
            const pB = localCollisionPts[seg.b];
            const len = Math.hypot(pB.x - pA.x, pB.y - pA.y) + 1.0;
            const segMass = mass * (len / (sumWeight || 1));
            const midX = 0.5 * (pA.x + pB.x);
            const midY = 0.5 * (pA.y + pB.y);
            const distSq = midX * midX + midY * midY;
            inertia += segMass * ((len * len) / 12 + 0.5 * radius * radius + distSq);
        }
        // Minimum rotational inertia floor for rock-solid angular stability
        inertia = Math.max(inertia, mass * Math.max(180, maxR * maxR * 0.25));

        const body = {
            x: cx,
            y: cy,
            vx: 0,
            vy: 0,
            angle: 0,
            omega: 0,
            radius,
            color,
            isCircle: false,
            isClosed,
            baseVertexCount,
            localRenderPts,
            localCollisionPts,
            worldCollisionPts: localCollisionPts.map(p => ({ x: cx + p.x, y: cy + p.y })),
            segments,
            mass,
            invMass: 1 / mass,
            inertia,
            invInertia: 1 / inertia,
            boundRadius: maxR,
            aabb: { minX: cx - maxR, minY: cy - maxR, maxX: cx + maxR, maxY: cy + maxR }
        };
        updateBodyWorldGeometry(body);
        return body;
    }

    function updateBodyWorldGeometry(b) {
        const cos = Math.cos(b.angle);
        const sin = Math.sin(b.angle);
        const r = b.radius;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        for (let i = 0; i < b.localCollisionPts.length; i++) {
            const lp = b.localCollisionPts[i];
            const wx = b.x + lp.x * cos - lp.y * sin;
            const wy = b.y + lp.x * sin + lp.y * cos;
            b.worldCollisionPts[i].x = wx;
            b.worldCollisionPts[i].y = wy;
            if (wx - r < minX) minX = wx - r;
            if (wy - r < minY) minY = wy - r;
            if (wx + r > maxX) maxX = wx + r;
            if (wy + r > maxY) maxY = wy + r;
        }
        b.aabb.minX = minX;
        b.aabb.minY = minY;
        b.aabb.maxX = maxX;
        b.aabb.maxY = maxY;
    }

    function worldToLocal(b, wx, wy) {
        const dx = wx - b.x;
        const dy = wy - b.y;
        const cos = Math.cos(-b.angle);
        const sin = Math.sin(-b.angle);
        return {
            x: dx * cos - dy * sin,
            y: dx * sin + dy * cos
        };
    }

    function localToWorld(b, lx, ly) {
        const cos = Math.cos(b.angle);
        const sin = Math.sin(b.angle);
        return {
            x: b.x + lx * cos - ly * sin,
            y: b.y + lx * sin + ly * cos
        };
    }

    // Hit test for clicking/tapping an existing object
    function findBodyAtPoint(px, py) {
        const grabPadding = 14; // Generous touch/click tolerance
        // Search top-most (most recently created) first
        for (let idx = bodies.length - 1; idx >= 0; idx--) {
            const b = bodies[idx];
            const tol = b.radius + grabPadding;
            if (
                px < b.aabb.minX - grabPadding ||
                px > b.aabb.maxX + grabPadding ||
                py < b.aabb.minY - grabPadding ||
                py > b.aabb.maxY + grabPadding
            ) {
                continue;
            }

            if (b.isCircle) {
                if (Math.hypot(px - b.x, py - b.y) <= tol) {
                    return b;
                }
                continue;
            }

            // Check distance to any stroke segment
            for (const seg of b.segments) {
                const pA = b.worldCollisionPts[seg.a];
                const pB = b.worldCollisionPts[seg.b];
                const dSq = distToSegmentSq(px, py, pA.x, pA.y, pB.x, pB.y).distSq;
                if (dSq <= tol * tol) {
                    return b;
                }
            }

            // If closed shape, also check interior polygon
            if (b.isClosed && b.baseVertexCount >= 3) {
                const polyPts = b.worldCollisionPts.slice(0, b.baseVertexCount);
                if (pointInPolygon(px, py, polyPts)) {
                    return b;
                }
            }
        }
        return null;
    }

    // Closest points between two 2D line segments P1-Q1 and P2-Q2
    function closestPointsBetweenSegments(p1x, p1y, q1x, q1y, p2x, p2y, q2x, q2y) {
        const d1x = q1x - p1x, d1y = q1y - p1y;
        const d2x = q2x - p2x, d2y = q2y - p2y;
        const rx = p1x - p2x, ry = p1y - p2y;
        const a = d1x * d1x + d1y * d1y;
        const e = d2x * d2x + d2y * d2y;
        const f = d2x * rx + d2y * ry;

        let s = 0, t = 0;
        if (a <= 1e-8 && e <= 1e-8) {
            return { c1x: p1x, c1y: p1y, c2x: p2x, c2y: p2y };
        }
        if (a <= 1e-8) {
            t = Math.max(0, Math.min(1, f / e));
        } else {
            const c = d1x * rx + d1y * ry;
            if (e <= 1e-8) {
                s = Math.max(0, Math.min(1, -c / a));
            } else {
                const b = d1x * d2x + d1y * d2y;
                const denom = a * e - b * b;
                if (denom !== 0) {
                    s = Math.max(0, Math.min(1, (b * f - c * e) / denom));
                }
                t = (b * s + f) / e;
                if (t < 0) {
                    t = 0;
                    s = Math.max(0, Math.min(1, -c / a));
                } else if (t > 1) {
                    t = 1;
                    s = Math.max(0, Math.min(1, (b - c) / a));
                }
            }
        }
        return {
            c1x: p1x + d1x * s,
            c1y: p1y + d1y * s,
            c2x: p2x + d2x * t,
            c2y: p2y + d2y * t
        };
    }

    // Rigid-body impulse helper
    function applyContactImpulse(bA, bB, contactX, contactY, nx, ny, penetration, restitution, friction) {
        // Positional correction (Baumgarte / projection)
        const slop = 0.08;
        const percent = 0.65;
        const totalInvMass = bA.invMass + (bB ? bB.invMass : 0);
        if (totalInvMass <= 0) return;

        const corrMag = Math.max(0, penetration - slop) / totalInvMass * percent;
        bA.x -= nx * corrMag * bA.invMass;
        bA.y -= ny * corrMag * bA.invMass;
        if (bB) {
            bB.x += nx * corrMag * bB.invMass;
            bB.y += ny * corrMag * bB.invMass;
        }

        const rAx = contactX - bA.x;
        const rAy = contactY - bA.y;
        const rBx = bB ? contactX - bB.x : 0;
        const rBy = bB ? contactY - bB.y : 0;

        // Relative velocity at contact point: vB - vA
        const vAx = bA.vx - bA.omega * rAy;
        const vAy = bA.vy + bA.omega * rAx;
        const vBx = bB ? (bB.vx - bB.omega * rBy) : 0;
        const vBy = bB ? (bB.vy + bB.omega * rBx) : 0;

        const rvx = vBx - vAx;
        const rvy = vBy - vAy;

        const velAlongNormal = rvx * nx + rvy * ny;
        if (velAlongNormal > 0) return; // Already separating

        const rAcrossN = rAx * ny - rAy * nx;
        const rBcrossN = bB ? (rBx * ny - rBy * nx) : 0;

        const invMassSum = bA.invMass + (bB ? bB.invMass : 0) +
            (rAcrossN * rAcrossN) * bA.invInertia +
            (bB ? (rBcrossN * rBcrossN) * bB.invInertia : 0);

        // Low-speed impacts don't bounce perpetually (resting contact threshold)
        const e = Math.abs(velAlongNormal) < 42 ? 0.0 : restitution;
        let j = -(1 + e) * velAlongNormal / invMassSum;

        const impulseX = j * nx;
        const impulseY = j * ny;

        bA.vx -= impulseX * bA.invMass;
        bA.vy -= impulseY * bA.invMass;
        bA.omega -= (rAx * impulseY - rAy * impulseX) * bA.invInertia;

        if (bB) {
            bB.vx += impulseX * bB.invMass;
            bB.vy += impulseY * bB.invMass;
            bB.omega += (rBx * impulseY - rBy * impulseX) * bB.invInertia;
        }

        // Tangential friction impulse
        let tx = rvx - velAlongNormal * nx;
        let ty = rvy - velAlongNormal * ny;
        const tLen = Math.hypot(tx, ty);
        if (tLen > 1e-5) {
            tx /= tLen;
            ty /= tLen;
            const rAcrossT = rAx * ty - rAy * tx;
            const rBcrossT = bB ? (rBx * ty - rBy * tx) : 0;
            const invMassTangent = bA.invMass + (bB ? bB.invMass : 0) +
                (rAcrossT * rAcrossT) * bA.invInertia +
                (bB ? (rBcrossT * rBcrossT) * bB.invInertia : 0);

            let jt = -(rvx * tx + rvy * ty) / invMassTangent;
            const maxFriction = j * friction;
            if (Math.abs(jt) > maxFriction) {
                jt = Math.sign(jt) * maxFriction;
            }

            const fImpulseX = jt * tx;
            const fImpulseY = jt * ty;

            bA.vx -= fImpulseX * bA.invMass;
            bA.vy -= fImpulseY * bA.invMass;
            bA.omega -= (rAx * fImpulseY - rAy * fImpulseX) * bA.invInertia;

            if (bB) {
                bB.vx += fImpulseX * bB.invMass;
                bB.vy += fImpulseY * bB.invMass;
                bB.omega += (rBx * fImpulseY - rBy * fImpulseX) * bB.invInertia;
            }
        }
    }

    // Physics simulation step
    function stepPhysics(dt) {
        const subSteps = 6;
        const subDt = dt / subSteps;
        const g = GRAVITY_MODES[gravityIndex].g;
        const wallRestitution = 0.48;
        const bodyRestitution = 0.42;
        const friction = 0.36;

        for (let s = 0; s < subSteps; s++) {
            // 1. Integrate forces & velocities
            for (const b of bodies) {
                if (b === grabbedBody) {
                    // Spring-damper pull from grabbed local anchor to pointer position
                    const worldAnchor = localToWorld(b, grabLocalAnchor.x, grabLocalAnchor.y);
                    const dx = pointerPos.x - worldAnchor.x;
                    const dy = pointerPos.y - worldAnchor.y;

                    // Target velocity pulls anchor point directly toward cursor
                    const pullStiffness = 28;
                    const targetVx = dx * pullStiffness;
                    const targetVy = dy * pullStiffness;

                    const rX = worldAnchor.x - b.x;
                    const rY = worldAnchor.y - b.y;
                    const anchorVx = b.vx - b.omega * rY;
                    const anchorVy = b.vy + b.omega * rX;

                    const dvx = (targetVx - anchorVx) * 0.45;
                    const dvy = (targetVy - anchorVy + g * subDt) * 0.45;

                    b.vx += dvx;
                    b.vy += dvy;
                    // Apply angular torque if grabbed off-center so object swings naturally
                    const torqueImpulse = (rX * dvy - rY * dvx) * b.mass * 0.35;
                    b.omega += torqueImpulse * b.invInertia;
                    b.omega *= 0.92;
                } else {
                    b.vy += g * subDt;
                    // Gentle air drag
                    const linDamp = Math.pow(0.996, subDt * 60);
                    const angDamp = Math.pow(0.992, subDt * 60);
                    b.vx *= linDamp;
                    b.vy *= linDamp;
                    b.omega *= angDamp;
                }

                // Clamp maximum velocities for stability
                const speed = Math.hypot(b.vx, b.vy);
                const maxSpeed = 2400;
                if (speed > maxSpeed) {
                    b.vx = (b.vx / speed) * maxSpeed;
                    b.vy = (b.vy / speed) * maxSpeed;
                }
                b.omega = Math.max(-22, Math.min(22, b.omega));

                b.x += b.vx * subDt;
                b.y += b.vy * subDt;
                b.angle += b.omega * subDt;

                updateBodyWorldGeometry(b);
            }

            // 2. Boundary wall collisions (floor, ceiling, left, right)
            for (const b of bodies) {
                const r = b.radius;
                for (let i = 0; i < b.worldCollisionPts.length; i++) {
                    const wp = b.worldCollisionPts[i];
                    // Floor (y = viewHeight, normal pointing down into wall: (0, 1))
                    if (wp.y + r > viewHeight) {
                        applyContactImpulse(b, null, wp.x, viewHeight, 0, 1, (wp.y + r) - viewHeight, wallRestitution, friction);
                        updateBodyWorldGeometry(b);
                    }
                    // Ceiling (y = 0, normal pointing up into wall: (0, -1))
                    if (wp.y - r < 0) {
                        applyContactImpulse(b, null, wp.x, 0, 0, -1, r - wp.y, wallRestitution, friction);
                        updateBodyWorldGeometry(b);
                    }
                    // Left wall (x = 0, normal pointing left: (-1, 0))
                    if (wp.x - r < 0) {
                        applyContactImpulse(b, null, 0, wp.y, -1, 0, r - wp.x, wallRestitution, friction);
                        updateBodyWorldGeometry(b);
                    }
                    // Right wall (x = viewWidth, normal pointing right: (1, 0))
                    if (wp.x + r > viewWidth) {
                        applyContactImpulse(b, null, viewWidth, wp.y, 1, 0, (wp.x + r) - viewWidth, wallRestitution, friction);
                        updateBodyWorldGeometry(b);
                    }
                }
            }

            // 3. Body-vs-Body capsule collisions
            const n = bodies.length;
            for (let i = 0; i < n; i++) {
                const bA = bodies[i];
                for (let j = i + 1; j < n; j++) {
                    const bB = bodies[j];
                    // Broadphase AABB check
                    if (
                        bA.aabb.maxX < bB.aabb.minX ||
                        bA.aabb.minX > bB.aabb.maxX ||
                        bA.aabb.maxY < bB.aabb.minY ||
                        bA.aabb.minY > bB.aabb.maxY
                    ) {
                        continue;
                    }

                    const combinedR = bA.radius + bB.radius;
                    const combinedRSq = combinedR * combinedR;

                    for (let sa = 0; sa < bA.segments.length; sa++) {
                        const segA = bA.segments[sa];
                        const p1 = bA.worldCollisionPts[segA.a];
                        const q1 = bA.worldCollisionPts[segA.b];

                        for (let sb = 0; sb < bB.segments.length; sb++) {
                            const segB = bB.segments[sb];
                            const p2 = bB.worldCollisionPts[segB.a];
                            const q2 = bB.worldCollisionPts[segB.b];

                            const cp = closestPointsBetweenSegments(
                                p1.x, p1.y, q1.x, q1.y,
                                p2.x, p2.y, q2.x, q2.y
                            );

                            const dx = cp.c2x - cp.c1x;
                            const dy = cp.c2y - cp.c1y;
                            const distSq = dx * dx + dy * dy;

                            if (distSq < combinedRSq) {
                                const dist = Math.sqrt(distSq);
                                let nx = 0, ny = 1;
                                if (dist > 1e-5) {
                                    nx = dx / dist;
                                    ny = dy / dist;
                                } else {
                                    const cdx = bB.x - bA.x;
                                    const cdy = bB.y - bA.y;
                                    const cLen = Math.hypot(cdx, cdy) || 1;
                                    nx = cdx / cLen;
                                    ny = cdy / cLen;
                                }
                                const penetration = combinedR - dist;
                                const contactX = cp.c1x + nx * bA.radius;
                                const contactY = cp.c1y + ny * bA.radius;

                                applyContactImpulse(bA, bB, contactX, contactY, nx, ny, penetration, bodyRestitution, friction);
                                updateBodyWorldGeometry(bA);
                                updateBodyWorldGeometry(bB);
                            }
                        }
                    }
                }
            }
        }
    }

    // Helper to convert hex color to rgba for translucent closed-shape fills
    function hexToRgba(hex, alpha) {
        const clean = hex.replace('#', '');
        if (clean.length !== 6) return `rgba(37, 99, 235, ${alpha})`;
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Render loop
    function render() {
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, viewWidth, viewHeight);

        const isDark = document.documentElement.classList.contains('dark-mode');

        // Draw all physics bodies
        for (const b of bodies) {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.angle);

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = b.color;
            ctx.lineWidth = b.radius * 2;

            // Subtle drop shadow for physical depth
            ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(24, 24, 27, 0.14)';
            ctx.shadowBlur = b === grabbedBody ? 14 : 6;
            ctx.shadowOffsetY = b === grabbedBody ? 5 : 2;

            if (b.isCircle) {
                ctx.beginPath();
                ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.fill();

                // Orientation indicator dot so spin is visible on balls
                ctx.shadowColor = 'transparent';
                ctx.beginPath();
                ctx.arc(b.radius * 0.42, 0, Math.max(2.2, b.radius * 0.18), 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
                ctx.fill();
            } else {
                const pts = b.localRenderPts;
                if (pts.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(pts[0].x, pts[0].y);
                    for (let i = 1; i < pts.length - 1; i++) {
                        const xc = 0.5 * (pts[i].x + pts[i + 1].x);
                        const yc = 0.5 * (pts[i].y + pts[i + 1].y);
                        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
                    }
                    if (pts.length > 1) {
                        const last = pts[pts.length - 1];
                        ctx.lineTo(last.x, last.y);
                    }
                    if (b.isClosed) {
                        ctx.closePath();
                        ctx.fillStyle = hexToRgba(b.color, isDark ? 0.24 : 0.18);
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        // Draw active grab anchor & tether while dragging an object
        if (mode === 'grabbing' && grabbedBody) {
            const worldAnchor = localToWorld(grabbedBody, grabLocalAnchor.x, grabLocalAnchor.y);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(worldAnchor.x, worldAnchor.y);
            ctx.lineTo(pointerPos.x, pointerPos.y);
            ctx.strokeStyle = isDark ? 'rgba(240, 240, 242, 0.45)' : 'rgba(24, 24, 27, 0.35)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(worldAnchor.x, worldAnchor.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#f0f0f2' : '#18181b';
            ctx.fill();
            ctx.restore();
        }

        // Draw live freehand stroke while drawing
        if (mode === 'drawing' && rawStroke.length > 0) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentThickness;
            ctx.shadowColor = hexToRgba(currentColor, 0.35);
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.moveTo(rawStroke[0].x, rawStroke[0].y);
            for (let i = 1; i < rawStroke.length; i++) {
                ctx.lineTo(rawStroke[i].x, rawStroke[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
    }

    // Pointer coordinate helper
    function getPointerCoords(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.max(4, Math.min(viewWidth - 4, e.clientX - rect.left)),
            y: Math.max(4, Math.min(viewHeight - 4, e.clientY - rect.top))
        };
    }

    function recordPointerSample(x, y) {
        const now = performance.now();
        pointerHistory.push({ x, y, t: now });
        // Keep last 90ms of samples for responsive flick/throw calculation
        while (pointerHistory.length > 2 && now - pointerHistory[0].t > 90) {
            pointerHistory.shift();
        }
    }

    function computeLaunchVelocity() {
        if (pointerHistory.length < 2) return { vx: 0, vy: 0 };
        const first = pointerHistory[0];
        const last = pointerHistory[pointerHistory.length - 1];
        const dt = (last.t - first.t) / 1000;
        if (dt < 0.004) return { vx: 0, vy: 0 };

        // Boost throw velocity slightly for a snappy, satisfying launch feel
        const boost = 1.25;
        let vx = ((last.x - first.x) / dt) * boost;
        let vy = ((last.y - first.y) / dt) * boost;

        const maxLaunch = 2100;
        const speed = Math.hypot(vx, vy);
        if (speed > maxLaunch) {
            vx = (vx / speed) * maxLaunch;
            vy = (vy / speed) * maxLaunch;
        }
        return { vx, vy };
    }

    // Pointer Events (unified mouse + touch + pen)
    canvas.addEventListener('pointerdown', (e) => {
        if (activePointerId !== null) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        activePointerId = e.pointerId;

        const pt = getPointerCoords(e);
        pointerPos.x = pt.x;
        pointerPos.y = pt.y;
        pointerHistory = [];
        recordPointerSample(pt.x, pt.y);

        // Check if clicking/tapping an existing physics object
        const hit = findBodyAtPoint(pt.x, pt.y);
        if (hit) {
            mode = 'grabbing';
            grabbedBody = hit;
            grabLocalAnchor = worldToLocal(hit, pt.x, pt.y);
            // Bring grabbed object to front of render order
            const idx = bodies.indexOf(hit);
            if (idx !== -1 && idx !== bodies.length - 1) {
                bodies.splice(idx, 1);
                bodies.push(hit);
            }
            canvas.classList.remove('hover-grab-cursor');
            canvas.classList.add('grabbing-cursor');
        } else {
            mode = 'drawing';
            rawStroke = [pt];
            updateObjectCounter();
        }
    });

    canvas.addEventListener('pointermove', (e) => {
        const pt = getPointerCoords(e);

        if (activePointerId === null) {
            // Update hover cursor on desktop when hovering over an object
            if (e.pointerType === 'mouse') {
                const hit = findBodyAtPoint(pt.x, pt.y);
                canvas.classList.toggle('hover-grab-cursor', Boolean(hit));
            }
            return;
        }

        if (e.pointerId !== activePointerId) return;
        e.preventDefault();

        pointerPos.x = pt.x;
        pointerPos.y = pt.y;
        recordPointerSample(pt.x, pt.y);

        if (mode === 'drawing') {
            const last = rawStroke[rawStroke.length - 1];
            if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 3.5) {
                rawStroke.push(pt);
            }
        }
    });

    function finishPointerInteraction(e) {
        if (e.pointerId !== activePointerId) return;
        e.preventDefault();

        if (mode === 'drawing') {
            const newBody = createBodyFromStroke(rawStroke, currentColor, currentThickness);
            if (newBody) {
                bodies.push(newBody);
            }
            rawStroke = [];
        } else if (mode === 'grabbing' && grabbedBody) {
            recordPointerSample(pointerPos.x, pointerPos.y);
            const launch = computeLaunchVelocity();
            if (Math.hypot(launch.vx, launch.vy) > 35) {
                const worldAnchor = localToWorld(grabbedBody, grabLocalAnchor.x, grabLocalAnchor.y);
                const rX = worldAnchor.x - grabbedBody.x;
                const rY = worldAnchor.y - grabbedBody.y;

                grabbedBody.vx = launch.vx;
                grabbedBody.vy = launch.vy;
                // Impart natural spin based on off-center release
                grabbedBody.omega += (rX * launch.vy - rY * launch.vx) * grabbedBody.mass * 0.18 * grabbedBody.invInertia;
                grabbedBody.omega = Math.max(-18, Math.min(18, grabbedBody.omega));
            }
            grabbedBody = null;
        }

        activePointerId = null;
        mode = 'idle';
        canvas.classList.remove('grabbing-cursor');
        updateObjectCounter();
    }

    canvas.addEventListener('pointerup', finishPointerInteraction);
    canvas.addEventListener('pointercancel', finishPointerInteraction);

    // Optional preview/demo state for landing page screenshot (?demo=1)
    if (new URLSearchParams(location.search).get('demo') === '1') {
        const cx = viewWidth * 0.5;
        const cy = viewHeight * 0.52;

        // 1. Wide U-cradle / ramp
        const rampPts = [];
        for (let i = 0; i <= 20; i++) {
            const t = (i / 20) * Math.PI - Math.PI;
            rampPts.push({
                x: cx + Math.cos(t) * 190,
                y: cy + 70 + Math.sin(-t) * 95
            });
        }
        const ramp = createBodyFromStroke(rampPts, '#3f3f46', 16);
        if (ramp) bodies.push(ramp);

        // 2. Closed Cobalt Hexagon/Box
        const boxPts = [];
        for (let i = 0; i <= 6; i++) {
            const a = (i / 6) * Math.PI * 2 + 0.25;
            boxPts.push({
                x: cx - 70 + Math.cos(a) * 52,
                y: cy - 35 + Math.sin(a) * 52
            });
        }
        const box = createBodyFromStroke(boxPts, '#2563eb', 14);
        if (box) {
            box.angle = 0.22;
            updateBodyWorldGeometry(box);
            bodies.push(box);
        }

        // 3. Closed Crimson Triangle
        const triPts = [
            { x: cx + 65, y: cy - 95 },
            { x: cx + 125, y: cy + 5 },
            { x: cx + 5, y: cy + 5 },
            { x: cx + 65, y: cy - 95 }
        ];
        const tri = createBodyFromStroke(triPts, '#dc2626', 14);
        if (tri) {
            tri.angle = -0.18;
            updateBodyWorldGeometry(tri);
            bodies.push(tri);
        }

        // 4. Emerald Spiral / Wave
        const wavePts = [];
        for (let i = 0; i <= 16; i++) {
            const u = i / 16;
            wavePts.push({
                x: cx - 150 + u * 130,
                y: cy - 135 + Math.sin(u * Math.PI * 2) * 28
            });
        }
        const wave = createBodyFromStroke(wavePts, '#16a34a', 14);
        if (wave) bodies.push(wave);

        // 5. Amber & Violet Bouncy Balls
        const ball1 = createBodyFromStroke([{ x: cx + 5, y: cy - 140 }], '#d97706', 22);
        const ball2 = createBodyFromStroke([{ x: cx + 110, y: cy - 115 }], '#7c3aed', 16);
        if (ball1) bodies.push(ball1);
        if (ball2) bodies.push(ball2);

        updateObjectCounter();
    }

    // Main animation loop
    let lastTime = performance.now();
    function tick(now) {
        const dt = Math.min(0.032, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        stepPhysics(dt);
        render();
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();
