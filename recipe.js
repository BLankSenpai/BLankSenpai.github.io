const PRESET_RECIPES = {
    salmon: {
        name: "Pan-Seared Salmon Bites (Honey Sesame Soy)",
        url: "https://www.bowlofdelicious.com/salmon-bites/",
        meta: {
            "Prep Time": "5 mins",
            "Cook Time": "5 mins",
            "Total Time": "10 mins",
            "Servings": "4 servings"
        },
        ingredients: [
            "1 lb salmon fillet, skinless or skin-on, cut into 1-inch bite-sized cubes",
            "2 tablespoons low-sodium soy sauce (or tamari / coconut aminos)",
            "1 tablespoon honey (or maple syrup)",
            "1 tablespoon toasted sesame oil",
            "1 tablespoon olive oil or avocado oil, for searing",
            "1 tablespoon toasted sesame seeds, for garnish",
            "2 green onions, thinly sliced, for garnish"
        ],
        instructions: [
            "Pat the salmon fillet dry with a paper towel and cut into even 1-inch bite-sized cubes.",
            "In a medium bowl, whisk together the soy sauce, honey, and toasted sesame oil. Add the salmon cubes and toss gently to coat.",
            "Heat 1 tablespoon of cooking oil in a large non-stick or cast-iron skillet over medium-high heat until shimmering and very hot.",
            "Add the salmon bites to the skillet in a single layer using a slotted spoon, reserving the excess marinade in the bowl. Work in batches if needed so the pan is not crowded.",
            "Sear undisturbed for 2 minutes until golden-brown and caramelized on the bottom.",
            "Flip or toss the salmon bites, pour in any remaining marinade from the bowl, and cook for 1 to 2 minutes more until the sauce glazes the salmon and the fish is cooked through.",
            "Remove from heat immediately, garnish with sesame seeds and sliced green onions, and serve warm over rice or vegetables."
        ]
    },
    cookies: {
        name: "Classic Chewy Chocolate Chip Cookies",
        url: "https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/",
        meta: {
            "Prep Time": "20 mins",
            "Cook Time": "10 mins",
            "Total Time": "30 mins",
            "Servings": "24 cookies"
        },
        ingredients: [
            "1 cup unsalted butter, softened",
            "1 cup white granulated sugar",
            "1 cup packed brown sugar",
            "2 large eggs",
            "2 teaspoons vanilla extract",
            "1 teaspoon baking soda",
            "2 teaspoons hot water",
            "1/2 teaspoon salt",
            "3 cups all-purpose flour",
            "2 cups semisweet chocolate chips",
            "1 cup chopped walnuts"
        ],
        instructions: [
            "Preheat oven to 350 degrees F (175 degrees C). Line two baking sheets with parchment paper.",
            "Cream together the softened butter, white sugar, and brown sugar until smooth and light.",
            "Beat in the eggs one at a time, then stir in the vanilla extract.",
            "Dissolve baking soda in hot water and add to the batter along with the salt.",
            "Stir in the flour, chocolate chips, and chopped walnuts until evenly combined.",
            "Drop large spoonfuls of dough 2 inches apart onto the prepared baking sheets.",
            "Bake for about 10 minutes in the preheated oven, or until the edges are nicely browned.",
            "Cool on the baking sheets briefly before transferring to wire racks to cool completely."
        ]
    },
    carbonara: {
        name: "Traditional Roman Spaghetti Carbonara",
        url: "https://www.seriouseats.com/pasta-carbonara-sauce-recipe",
        meta: {
            "Prep Time": "10 mins",
            "Cook Time": "15 mins",
            "Total Time": "25 mins",
            "Servings": "4 servings"
        },
        ingredients: [
            "1 pound dry spaghetti",
            "1/2 pound guanciale or pancetta, diced",
            "4 large egg yolks",
            "2 whole large eggs",
            "1 cup freshly grated Pecorino Romano cheese",
            "1/2 cup freshly grated Parmigiano-Reggiano",
            "1 tablespoon freshly cracked black pepper",
            "1 teaspoon kosher salt"
        ],
        instructions: [
            "Bring a large pot of salted water to a rolling boil and cook spaghetti until al dente.",
            "While the pasta cooks, saute the diced guanciale in a large skillet over medium-low heat until crisp and rendered, about 8 minutes.",
            "Whisk together the egg yolks, whole eggs, grated cheeses, and cracked black pepper in a bowl until a smooth paste forms.",
            "Reserve 1 cup of starchy pasta cooking water, then drain the pasta and transfer it to the skillet with the guanciale off the heat.",
            "Toss pasta for 30 seconds to coat in the rendered fat and allow the pan to cool slightly.",
            "Pour in the egg and cheese mixture along with a splash of warm pasta water, tossing rapidly to create a glossy, creamy sauce.",
            "Serve immediately topped with extra grated Pecorino Romano and black pepper."
        ]
    },
    guacamole: {
        name: "Fresh Molcajete Guacamole",
        url: "https://www.simplyrecipes.com/recipes/perfect_guacamole/",
        meta: {
            "Prep Time": "15 mins",
            "Cook Time": "0 mins",
            "Total Time": "15 mins",
            "Servings": "4 servings"
        },
        ingredients: [
            "3 ripe Hass avocados, halved and pitted",
            "1/2 small white onion, finely diced",
            "2 serrano chiles, stems and seeds removed, minced",
            "1/2 cup fresh cilantro leaves, finely chopped",
            "2 tablespoons fresh lime juice",
            "1/2 teaspoon coarse sea salt",
            "1 ripe Roma tomato, seeds and pulp removed, chopped"
        ],
        instructions: [
            "Cut the avocados in half, remove the pit, and scoop the flesh into a mixing bowl.",
            "Using a fork, coarsely mash the avocado to your desired texture, leaving some small chunks.",
            "Add the minced onion, serrano chiles, cilantro, lime juice, and salt to the mashed avocado.",
            "Stir gently to combine all ingredients evenly.",
            "Fold in the chopped tomato just before serving and taste to adjust salt or lime juice."
        ]
    }
};

let activeRecipe = null;
let activeScale = 1;
const checkedIngredients = new Set();
const checkedSteps = new Set();

const modeUrlBtn = document.getElementById('modeUrlBtn');
const modeTextBtn = document.getElementById('modeTextBtn');
const urlForm = document.getElementById('urlForm');
const textForm = document.getElementById('textForm');
const urlInput = document.getElementById('urlInput');
const scanUrlBtn = document.getElementById('scanUrlBtn');
const rawInput = document.getElementById('rawInput');
const scanTextBtn = document.getElementById('scanTextBtn');
const presetChips = document.querySelectorAll('.preset-chip');
const statusBox = document.getElementById('statusBox');

const recipeCard = document.getElementById('recipeCard');
const recipeTitle = document.getElementById('recipeTitle');
const recipeSourceLink = document.getElementById('recipeSourceLink');
const recipeMetaBar = document.getElementById('recipeMetaBar');
const scaleButtons = document.querySelectorAll('.scale-btn');
const copyBtn = document.getElementById('copyBtn');
const copyBtnText = document.getElementById('copyBtnText');
const printBtn = document.getElementById('printBtn');
const resetBtn = document.getElementById('resetBtn');
const ingredientBadge = document.getElementById('ingredientBadge');
const instructionBadge = document.getElementById('instructionBadge');
const ingredientsList = document.getElementById('ingredientsList');
const instructionsList = document.getElementById('instructionsList');

modeUrlBtn.addEventListener('click', () => setMode('url'));
modeTextBtn.addEventListener('click', () => setMode('text'));

scanUrlBtn.addEventListener('click', handleScanUrl);
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleScanUrl();
});

scanTextBtn.addEventListener('click', handleScanText);

presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const key = chip.dataset.preset;
        loadPreset(key);
    });
});

scaleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const val = parseFloat(btn.dataset.scale);
        if (!isNaN(val) && activeRecipe) {
            activeScale = val;
            scaleButtons.forEach(b => b.classList.toggle('active', parseFloat(b.dataset.scale) === activeScale));
            renderIngredientsList();
        }
    });
});

copyBtn.addEventListener('click', copyIngredientsToClipboard);
printBtn.addEventListener('click', () => window.print());
resetBtn.addEventListener('click', () => {
    checkedIngredients.clear();
    checkedSteps.clear();
    renderIngredientsList();
    renderInstructionsList();
});

function setMode(mode) {
    hideStatus();
    if (mode === 'url') {
        modeUrlBtn.classList.add('active');
        modeTextBtn.classList.remove('active');
        urlForm.classList.remove('hidden');
        textForm.classList.add('hidden');
    } else {
        modeTextBtn.classList.add('active');
        modeUrlBtn.classList.remove('active');
        textForm.classList.remove('hidden');
        urlForm.classList.add('hidden');
    }
}

function showStatus(message, type = 'loading') {
    statusBox.textContent = message;
    statusBox.className = `status-box ${type}`;
}

function hideStatus() {
    statusBox.className = 'status-box hidden';
    statusBox.textContent = '';
}

function normalizeUrlForCompare(u) {
    return u.trim().toLowerCase().replace(/\/+$/, '');
}

function loadPreset(key) {
    const preset = PRESET_RECIPES[key];
    if (!preset) return;
    hideStatus();
    setMode('url');
    urlInput.value = preset.url;
    presetChips.forEach(c => c.classList.toggle('active', c.dataset.preset === key));
    displayRecipe(preset);
}

async function handleScanUrl() {
    const rawUrl = urlInput.value.trim();
    hideStatus();

    if (!rawUrl) {
        showStatus('Please paste a recipe URL above.', 'error');
        return;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
    } catch {
        showStatus('Invalid URL format. Make sure the link starts with https://', 'error');
        return;
    }

    presetChips.forEach(c => c.classList.remove('active'));
    scanUrlBtn.disabled = true;
    showStatus('Scanning webpage for recipe ingredients and instructions...', 'loading');

    try {
        const extracted = await scanRecipeFromUrl(parsedUrl);
        if (extracted) {
            hideStatus();
            displayRecipe(extracted);
            return;
        }

        const normalizedInput = normalizeUrlForCompare(parsedUrl.href);
        for (const [key, preset] of Object.entries(PRESET_RECIPES)) {
            if (normalizeUrlForCompare(preset.url) === normalizedInput) {
                loadPreset(key);
                return;
            }
        }

        showStatus('No structured recipe data found on that link. Switch to "Paste Text / HTML" to paste the recipe directly.', 'error');
    } catch {
        const normalizedInput = normalizeUrlForCompare(parsedUrl.href);
        for (const [key, preset] of Object.entries(PRESET_RECIPES)) {
            if (normalizeUrlForCompare(preset.url) === normalizedInput) {
                loadPreset(key);
                return;
            }
        }
        showStatus('Unable to reach that website due to browser CORS protection. Use the "Paste Text / HTML" tab or try a sample link above.', 'error');
    } finally {
        scanUrlBtn.disabled = false;
    }
}

function handleScanText() {
    const raw = rawInput.value.trim();
    hideStatus();

    if (!raw) {
        showStatus('Please paste recipe HTML or plain text into the box.', 'error');
        return;
    }

    const extracted = parseRecipeFromHtml(raw, '') || parseRecipeFromPlainText(raw, '');
    if (!extracted) {
        showStatus('Could not detect ingredients and instructions. Make sure lines are under "Ingredients" and "Instructions" headings.', 'error');
        return;
    }

    presetChips.forEach(c => c.classList.remove('active'));
    displayRecipe(extracted);
}

async function fetchWithTimeout(resource, options = {}, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(resource, { cache: 'no-store', ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

function decodeDataUriIfNeeded(content) {
    if (!content || typeof content !== 'string') return '';
    const trimmed = content.trim();
    if (!trimmed.startsWith('data:')) return content;

    const base64Marker = ';base64,';
    const idx = trimmed.indexOf(base64Marker);
    if (idx === -1) return content;

    try {
        const b64 = trimmed.slice(idx + base64Marker.length);
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
    } catch {
        return content;
    }
}

async function scanRecipeFromUrl(parsedUrl) {
    const targetUrl = parsedUrl.href;

    const wpRecipe = await tryWordPressRestApi(parsedUrl);
    if (wpRecipe) return wpRecipe;

    const htmlStrategies = [
        async () => {
            const r = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            if (!r.ok) throw new Error('allorigins get failed');
            const j = await r.json();
            return decodeDataUriIfNeeded(j.contents);
        },
        async () => {
            const r = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
            if (!r.ok) throw new Error('allorigins raw failed');
            return await r.text();
        },
        async () => {
            const r = await fetchWithTimeout(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
            if (!r.ok) throw new Error('codetabs failed');
            return await r.text();
        },
        async () => {
            const r = await fetchWithTimeout(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
            if (!r.ok) throw new Error('corsproxy failed');
            return await r.text();
        }
    ];

    for (const getHtml of htmlStrategies) {
        try {
            const html = await getHtml();
            if (!html || html.length < 100) continue;
            const recipe = parseRecipeFromHtml(html, targetUrl);
            if (recipe) return recipe;
        } catch {
            continue;
        }
    }

    try {
        const r = await fetchWithTimeout(`https://r.jina.ai/${targetUrl}`, {}, 10000);
        if (r.ok) {
            const readerText = await r.text();
            const recipe = parseRecipeFromPlainText(readerText, targetUrl);
            if (recipe) return recipe;
        }
    } catch {
        // Ignore reader fallback error
    }

    return null;
}

async function tryWordPressRestApi(parsedUrl) {
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    if (!pathSegments.length) return null;

    const slug = pathSegments[pathSegments.length - 1];
    if (!slug || slug.includes('.')) return null;

    const wpApiUrl = `${parsedUrl.origin}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`;

    const fetchJsonCandidates = [
        async () => {
            const r = await fetchWithTimeout(wpApiUrl, {}, 5000);
            if (!r.ok) throw new Error('direct wp-json failed');
            return await r.json();
        },
        async () => {
            const r = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(wpApiUrl)}`, {}, 6000);
            if (!r.ok) throw new Error('proxied wp-json failed');
            const wrapper = await r.json();
            const decoded = decodeDataUriIfNeeded(wrapper.contents);
            return JSON.parse(decoded);
        },
        async () => {
            const r = await fetchWithTimeout(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(wpApiUrl)}`, {}, 6000);
            if (!r.ok) throw new Error('codetabs wp-json failed');
            return await r.json();
        }
    ];

    for (const getJson of fetchJsonCandidates) {
        try {
            const posts = await getJson();
            if (!Array.isArray(posts) || !posts.length) continue;
            const post = posts[0];

            if (post.yoast_head_json && post.yoast_head_json.schema) {
                const fromSchema = extractFromSchemaObject(post.yoast_head_json.schema, parsedUrl.href);
                if (fromSchema) return fromSchema;
            }

            const combinedHtml = `
                <!DOCTYPE html><html><head>${post.yoast_head || ''}</head>
                <body>
                    <h1>${post.title?.rendered || ''}</h1>
                    ${post.content?.rendered || ''}
                </body></html>
            `;
            const fromHtml = parseRecipeFromHtml(combinedHtml, parsedUrl.href);
            if (fromHtml) return fromHtml;
        } catch {
            continue;
        }
    }

    return null;
}

function extractFromSchemaObject(schemaObj, sourceUrl) {
    const matches = [];
    const walk = (node) => {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) {
            node.forEach(walk);
            return;
        }
        const typeVal = node['@type'];
        const types = Array.isArray(typeVal) ? typeVal : [typeVal];
        if (types.some(t => typeof t === 'string' && t.toLowerCase().includes('recipe'))) {
            matches.push(node);
        }
        if (node['@graph']) walk(node['@graph']);
    };

    walk(schemaObj);

    for (const item of matches) {
        const formatted = formatSchemaRecipe(item);
        if (formatted) {
            if (sourceUrl && !formatted.url) formatted.url = sourceUrl;
            return formatted;
        }
    }
    return null;
}

function parseRecipeFromHtml(htmlString, sourceUrl) {
    if (!htmlString || !htmlString.includes('<')) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const recipe = extractJsonLdRecipe(doc) || extractMicrodataRecipe(doc) || extractDomSelectorsRecipe(doc);
    if (recipe) {
        if (sourceUrl && !recipe.url) recipe.url = sourceUrl;
        return recipe;
    }
    return null;
}

function extractJsonLdRecipe(doc) {
    const scripts = doc.querySelectorAll('script[type*="ld+json"]');
    for (const script of scripts) {
        let json;
        try {
            json = JSON.parse(script.textContent);
        } catch {
            continue;
        }

        const found = extractFromSchemaObject(json, '');
        if (found) return found;
    }
    return null;
}

function formatSchemaRecipe(data) {
    const name = cleanStr(data.name || 'Extracted Recipe');
    const rawIng = data.recipeIngredient || data.ingredients || [];
    const ingArray = Array.isArray(rawIng) ? rawIng : [rawIng];
    const ingredients = ingArray.map(cleanIngredientStr).filter(Boolean);

    const instructions = parseSchemaInstructions(data.recipeInstructions || data.instructions || []);

    if (!ingredients.length && !instructions.length) return null;

    const meta = {};
    if (data.prepTime) meta['Prep Time'] = formatIsoDuration(data.prepTime);
    if (data.cookTime) meta['Cook Time'] = formatIsoDuration(data.cookTime);
    if (data.totalTime) meta['Total Time'] = formatIsoDuration(data.totalTime);
    if (data.recipeYield) {
        const y = Array.isArray(data.recipeYield) ? data.recipeYield[0] : data.recipeYield;
        meta['Servings'] = cleanStr(String(y));
    }

    return {
        name,
        url: typeof data.url === 'string' ? data.url : '',
        meta,
        ingredients,
        instructions
    };
}

function parseSchemaInstructions(raw) {
    const result = [];
    if (typeof raw === 'string') {
        return raw.split(/\r?\n+/).map(cleanStepStr).filter(Boolean);
    }
    if (!Array.isArray(raw)) {
        if (raw && typeof raw === 'object') {
            return parseSchemaInstructions([raw]);
        }
        return result;
    }

    for (const entry of raw) {
        if (typeof entry === 'string') {
            const s = cleanStepStr(entry);
            if (s) result.push(s);
        } else if (entry && typeof entry === 'object') {
            if (Array.isArray(entry.itemListElement)) {
                result.push(...parseSchemaInstructions(entry.itemListElement));
            } else if (entry.itemListElement) {
                result.push(...parseSchemaInstructions([entry.itemListElement]));
            } else {
                const s = cleanStepStr(entry.text || entry.description || entry.name || '');
                if (s) result.push(s);
            }
        }
    }
    return result;
}

function extractMicrodataRecipe(doc) {
    const root = doc.querySelector('[itemtype*="schema.org/Recipe"]');
    if (!root) return null;

    const name = cleanStr(root.querySelector('[itemprop="name"]')?.textContent || 'Extracted Recipe');
    const ingredients = [...root.querySelectorAll('[itemprop="recipeIngredient"], [itemprop="ingredients"]')]
        .map(el => cleanIngredientStr(extractSpacedText(el)))
        .filter(Boolean);
    const instructions = [...root.querySelectorAll('[itemprop="recipeInstructions"]')]
        .map(el => cleanStepStr(extractSpacedText(el)))
        .filter(Boolean);

    if (!ingredients.length && !instructions.length) return null;
    return { name, url: '', meta: {}, ingredients, instructions };
}

function extractSpacedText(el) {
    if (!el) return '';
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.wprm-checkbox-container, input, svg, style, script').forEach(n => n.remove());
    clone.querySelectorAll('*').forEach(child => {
        child.insertAdjacentText('afterend', ' ');
    });
    return clone.textContent || '';
}

function extractDomSelectorsRecipe(doc) {
    const ingQueries = [
        '.wprm-recipe-ingredient',
        '.tasty-recipe-ingredients li',
        '.tasty-recipes-ingredients li',
        '.mv-create-ingredients li',
        '.mntl-structured-ingredients__list-item',
        '.recipe-ingredients li',
        '.ingredients-item',
        '[class*="ingredient"] li'
    ];
    const stepQueries = [
        '.wprm-recipe-instruction',
        '.wprm-recipe-instruction-text',
        '.tasty-recipe-instructions li',
        '.tasty-recipes-instructions li',
        '.mv-create-instructions li',
        '.recipe-directions__list--item',
        '.recipe-instructions li',
        '[class*="instruction"] li',
        '[class*="direction"] li'
    ];

    let ingredients = [];
    for (const q of ingQueries) {
        const list = [...doc.querySelectorAll(q)]
            .map(el => cleanIngredientStr(extractSpacedText(el)))
            .filter(Boolean);
        if (list.length >= 2) {
            ingredients = list;
            break;
        }
    }

    let instructions = [];
    for (const q of stepQueries) {
        const list = [...doc.querySelectorAll(q)]
            .map(el => cleanStepStr(extractSpacedText(el)))
            .filter(Boolean);
        if (list.length >= 1) {
            instructions = list;
            break;
        }
    }

    if (!ingredients.length && !instructions.length) return null;

    const titleEl = doc.querySelector(
        '.wprm-recipe-name, .tasty-recipes-title, .mv-create-title, h1.entry-title, h1'
    );
    const name = cleanStr(titleEl?.textContent || 'Extracted Recipe');
    return { name, url: '', meta: {}, ingredients, instructions };
}

function parseRecipeFromPlainText(text, sourceUrl = '') {
    const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (rawLines.length < 3) return null;

    let name = 'Extracted Recipe';
    const titleMatch = text.match(/^Title:\s*(.+)$/im) || text.match(/^#\s+(.+)$/m);
    if (titleMatch) {
        name = cleanStr(titleMatch[1]);
    } else if (rawLines[0].length < 80 && !/^(ingredients|instructions|directions)/i.test(rawLines[0])) {
        name = cleanStr(rawLines[0].replace(/^#+\s*/, ''));
    }

    let section = null;
    const ingredients = [];
    const instructions = [];

    for (const line of rawLines) {
        const headingClean = line.replace(/^[#*_\-\s]+|[#*_:.\s]+$/g, '').trim();

        if (/^(ingredients|ingredient list|what you'll need|what you need)$/i.test(headingClean)) {
            section = 'ingredients';
            continue;
        }
        if (/^(instructions|directions|steps|method|preparation|how to make.*)$/i.test(headingClean)) {
            section = 'instructions';
            continue;
        }
        if (section === 'instructions' && /^(notes|recipe notes|nutrition|nutrition information|did you make this|leave a reply|comments)$/i.test(headingClean)) {
            break;
        }

        if (!section) continue;

        if (/^!\[.*\]\(.*\)$/.test(line) || /^https?:\/\//i.test(line)) continue;
        if (/^(prep time|cook time|total time|servings|yield|course|cuisine|calories|author)\b/i.test(headingClean)) continue;

        if (section === 'ingredients') {
            const item = cleanIngredientStr(line);
            if (item && item.length > 2 && item.length < 220) {
                ingredients.push(item);
            }
        } else if (section === 'instructions') {
            const step = cleanStepStr(line);
            if (step && step.length > 8) {
                instructions.push(step);
            }
        }
    }

    if (!ingredients.length && !instructions.length) {
        let fallbackSection = 'ingredients';
        for (let i = 1; i < rawLines.length; i++) {
            const l = rawLines[i];
            const c = cleanIngredientStr(l);
            if (!c) continue;
            if (c.length > 90 || /^\d+\.\s/.test(l)) {
                fallbackSection = 'instructions';
            }
            if (fallbackSection === 'ingredients') {
                ingredients.push(c);
            } else {
                instructions.push(cleanStepStr(l));
            }
        }
    }

    if (ingredients.length < 2 || instructions.length < 1) return null;
    return { name, url: sourceUrl, meta: {}, ingredients, instructions };
}

function displayRecipe(recipe) {
    activeRecipe = recipe;
    activeScale = 1;
    checkedIngredients.clear();
    checkedSteps.clear();

    scaleButtons.forEach(b => b.classList.toggle('active', parseFloat(b.dataset.scale) === 1));

    recipeTitle.textContent = recipe.name || 'Untitled Recipe';

    if (recipe.url) {
        recipeSourceLink.href = recipe.url;
        recipeSourceLink.classList.remove('hidden');
    } else {
        recipeSourceLink.classList.add('hidden');
    }

    recipeMetaBar.innerHTML = '';
    const metaEntries = Object.entries(recipe.meta || {}).filter(([, v]) => Boolean(v));
    if (metaEntries.length) {
        metaEntries.forEach(([label, val]) => {
            const item = document.createElement('div');
            item.className = 'meta-item';
            item.innerHTML = `<span class="meta-label">${label}</span><span class="meta-val">${val}</span>`;
            recipeMetaBar.appendChild(item);
        });
        recipeMetaBar.classList.remove('hidden');
    } else {
        recipeMetaBar.classList.add('hidden');
    }

    renderIngredientsList();
    renderInstructionsList();
    recipeCard.classList.remove('hidden');
}

function renderIngredientsList() {
    ingredientsList.innerHTML = '';
    const items = activeRecipe?.ingredients || [];
    ingredientBadge.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;

    items.forEach((rawItem, idx) => {
        const li = document.createElement('li');
        li.className = 'ingredient-row' + (checkedIngredients.has(idx) ? ' done' : '');

        const scaledText = scaleQuantity(rawItem, activeScale);

        li.innerHTML = `
            <span class="check-box">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </span>
            <span class="ingredient-label">${scaledText}</span>
        `;

        li.addEventListener('click', () => {
            if (checkedIngredients.has(idx)) {
                checkedIngredients.delete(idx);
                li.classList.remove('done');
            } else {
                checkedIngredients.add(idx);
                li.classList.add('done');
            }
        });

        ingredientsList.appendChild(li);
    });
}

function renderInstructionsList() {
    instructionsList.innerHTML = '';
    const steps = activeRecipe?.instructions || [];
    instructionBadge.textContent = `${steps.length} step${steps.length === 1 ? '' : 's'}`;

    steps.forEach((stepText, idx) => {
        const li = document.createElement('li');
        li.className = 'instruction-step' + (checkedSteps.has(idx) ? ' done' : '');

        li.innerHTML = `
            <div class="step-badge">${idx + 1}</div>
            <div class="step-body">${stepText}</div>
        `;

        li.addEventListener('click', () => {
            if (checkedSteps.has(idx)) {
                checkedSteps.delete(idx);
                li.classList.remove('done');
            } else {
                checkedSteps.add(idx);
                li.classList.add('done');
            }
        });

        instructionsList.appendChild(li);
    });
}

function scaleQuantity(ingredient, factor) {
    if (factor === 1) return ingredient;

    const match = ingredient.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(.*)$/);
    if (!match) return ingredient;

    const numPart = match[1].trim();
    const rest = match[2];

    const value = parseFractionString(numPart);
    if (isNaN(value)) return ingredient;

    return `${formatScaledNumber(value * factor)}${rest}`;
}

function parseFractionString(str) {
    if (str.includes(' ')) {
        const [whole, frac] = str.split(/\s+/);
        return parseFloat(whole) + parseFractionString(frac);
    }
    if (str.includes('/')) {
        const [num, den] = str.split('/');
        return parseFloat(num) / parseFloat(den);
    }
    return parseFloat(str);
}

function formatScaledNumber(val) {
    const whole = Math.floor(val + 1e-6);
    const rem = val - whole;
    const fractions = [
        [0.125, '1/8'],
        [0.25, '1/4'],
        [0.333, '1/3'],
        [0.5, '1/2'],
        [0.666, '2/3'],
        [0.75, '3/4']
    ];

    for (const [dec, label] of fractions) {
        if (Math.abs(rem - dec) < 0.05) {
            return whole > 0 ? `${whole} ${label}` : label;
        }
    }

    if (rem < 0.05) return String(whole);
    return val.toFixed(1).replace(/\.0$/, '');
}

function copyIngredientsToClipboard() {
    if (!activeRecipe) return;
    const lines = activeRecipe.ingredients.map(i => `- ${scaleQuantity(i, activeScale)}`);
    const text = `${activeRecipe.name} (${activeScale}x)\n\n${lines.join('\n')}`;

    navigator.clipboard.writeText(text).then(() => {
        copyBtnText.textContent = 'Copied!';
        setTimeout(() => {
            copyBtnText.textContent = 'Copy List';
        }, 1600);
    });
}

function formatIsoDuration(iso) {
    if (!iso || typeof iso !== 'string') return '';
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
    if (!m) return iso;
    const hrs = parseInt(m[1] || '0', 10);
    const mins = parseInt(m[2] || '0', 10);
    if (hrs && mins) return `${hrs}h ${mins}m`;
    if (hrs) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    if (mins) return `${mins} mins`;
    return iso;
}

const entityDecoder = document.createElement('textarea');

function decodeEntities(str) {
    if (!str) return '';
    const withoutTags = String(str).replace(/<[^>]*>/g, ' ');
    entityDecoder.innerHTML = withoutTags;
    return entityDecoder.value;
}

function replaceUnicodeFractions(str) {
    const map = {
        '½': ' 1/2',
        '⅓': ' 1/3',
        '⅔': ' 2/3',
        '¼': ' 1/4',
        '¾': ' 3/4',
        '⅕': ' 1/5',
        '⅖': ' 2/5',
        '⅗': ' 3/5',
        '⅘': ' 4/5',
        '⅙': ' 1/6',
        '⅚': ' 5/6',
        '⅛': ' 1/8',
        '⅜': ' 3/8',
        '⅝': ' 5/8',
        '⅞': ' 7/8'
    };
    return str.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, m => map[m] || m);
}

function cleanStr(str) {
    if (!str) return '';
    return replaceUnicodeFractions(decodeEntities(str))
        .replace(/\s+/g, ' ')
        .trim();
}

function cleanIngredientStr(str) {
    if (!str) return '';
    return cleanStr(str)
        .replace(/^[▢□☐☑✓✔\-*•+·\s]+/, '')
        .trim();
}

function cleanStepStr(str) {
    if (!str) return '';
    return cleanStr(str)
        .replace(/^(step\s*\d+[:.)\-]*|\d+[:.)\-]+|[-*•▢□☐\s]+)\s*/i, '')
        .trim();
}

loadPreset('salmon');
