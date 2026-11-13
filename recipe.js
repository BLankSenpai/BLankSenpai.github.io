const PRESET_RECIPES = {
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

    for (const [key, preset] of Object.entries(PRESET_RECIPES)) {
        if (preset.url.toLowerCase() === rawUrl.toLowerCase()) {
            loadPreset(key);
            return;
        }
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(rawUrl);
    } catch {
        showStatus('Invalid URL format. Make sure the link starts with https://', 'error');
        return;
    }

    presetChips.forEach(c => c.classList.remove('active'));
    scanUrlBtn.disabled = true;
    showStatus('Scanning webpage for recipe ingredients and instructions...', 'loading');

    try {
        const htmlContent = await fetchExternalHtml(parsedUrl.href);
        const extracted = parseRecipeFromHtml(htmlContent, parsedUrl.href);

        if (!extracted) {
            showStatus('No structured recipe data found on that link. Switch to "Paste Text / HTML" to paste the recipe directly.', 'error');
            scanUrlBtn.disabled = false;
            return;
        }

        hideStatus();
        displayRecipe(extracted);
    } catch {
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

    const extracted = parseRecipeFromHtml(raw, '') || parseRecipeFromPlainText(raw);
    if (!extracted) {
        showStatus('Could not detect ingredients and instructions. Make sure lines are under "Ingredients" and "Instructions" headings.', 'error');
        return;
    }

    presetChips.forEach(c => c.classList.remove('active'));
    displayRecipe(extracted);
}

async function fetchExternalHtml(targetUrl) {
    const proxyEndpoints = [
        async () => {
            const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            if (!r.ok) throw new Error('allorigins failed');
            const j = await r.json();
            if (!j.contents) throw new Error('empty');
            return j.contents;
        },
        async () => {
            const r = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
            if (!r.ok) throw new Error('codetabs failed');
            return await r.text();
        },
        async () => {
            const r = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`);
            if (!r.ok) throw new Error('corsproxy failed');
            return await r.text();
        }
    ];

    for (const attempt of proxyEndpoints) {
        try {
            const text = await attempt();
            if (text && text.length > 100) return text;
        } catch {
            continue;
        }
    }
    throw new Error('All proxy fetches failed');
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
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
        let json;
        try {
            json = JSON.parse(script.textContent);
        } catch {
            continue;
        }

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

        walk(json);

        for (const item of matches) {
            const formatted = formatSchemaRecipe(item);
            if (formatted) return formatted;
        }
    }
    return null;
}

function formatSchemaRecipe(data) {
    const name = cleanStr(data.name || 'Extracted Recipe');
    const ingredients = (data.recipeIngredient || data.ingredients || [])
        .map(cleanStr)
        .filter(Boolean);

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
        return raw.split(/\r?\n+/).map(cleanStr).filter(Boolean);
    }
    if (!Array.isArray(raw)) return result;

    for (const entry of raw) {
        if (typeof entry === 'string') {
            const s = cleanStr(entry);
            if (s) result.push(s);
        } else if (entry && typeof entry === 'object') {
            if (Array.isArray(entry.itemListElement)) {
                result.push(...parseSchemaInstructions(entry.itemListElement));
            } else {
                const s = cleanStr(entry.text || entry.name || '');
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
        .map(el => cleanStr(el.textContent))
        .filter(Boolean);
    const instructions = [...root.querySelectorAll('[itemprop="recipeInstructions"]')]
        .map(el => cleanStr(el.textContent))
        .filter(Boolean);

    if (!ingredients.length && !instructions.length) return null;
    return { name, url: '', meta: {}, ingredients, instructions };
}

function extractDomSelectorsRecipe(doc) {
    const ingQueries = [
        '.wprm-recipe-ingredient',
        '.tasty-recipe-ingredients li',
        '.mv-create-ingredients li',
        '.mntl-structured-ingredients__list-item',
        '.recipe-ingredients li',
        '[class*="ingredient"] li'
    ];
    const stepQueries = [
        '.wprm-recipe-instruction-text',
        '.tasty-recipe-instructions li',
        '.mv-create-instructions li',
        '.recipe-directions__list--item',
        '.recipe-instructions li',
        '[class*="instruction"] li',
        '[class*="direction"] li'
    ];

    let ingredients = [];
    for (const q of ingQueries) {
        const list = [...doc.querySelectorAll(q)].map(el => cleanStr(el.textContent)).filter(Boolean);
        if (list.length >= 2) {
            ingredients = list;
            break;
        }
    }

    let instructions = [];
    for (const q of stepQueries) {
        const list = [...doc.querySelectorAll(q)].map(el => cleanStr(el.textContent)).filter(Boolean);
        if (list.length >= 1) {
            instructions = list;
            break;
        }
    }

    if (!ingredients.length && !instructions.length) return null;
    const name = cleanStr(doc.querySelector('h1')?.textContent || 'Extracted Recipe');
    return { name, url: '', meta: {}, ingredients, instructions };
}

function parseRecipeFromPlainText(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return null;

    let section = 'ingredients';
    const ingredients = [];
    const instructions = [];
    let name = 'Custom Pasted Recipe';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (i === 0 && !/^(ingredients|instructions|directions)/i.test(line) && line.length < 70) {
            name = line.replace(/^#+\s*/, '');
            continue;
        }
        if (/^(ingredients|ingredient list)[:\s]*$/i.test(line)) {
            section = 'ingredients';
            continue;
        }
        if (/^(instructions|directions|steps|method|preparation)[:\s]*$/i.test(line)) {
            section = 'instructions';
            continue;
        }

        const cleaned = line.replace(/^[-*•\d+.)\s]+/, '').trim();
        if (!cleaned) continue;

        if (section === 'ingredients') {
            ingredients.push(cleaned);
        } else {
            instructions.push(cleaned);
        }
    }

    if (!ingredients.length && !instructions.length) return null;
    return { name, url: '', meta: {}, ingredients, instructions };
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

function cleanStr(str) {
    if (!str) return '';
    return String(str).replace(/\s+/g, ' ').trim();
}

loadPreset('cookies');
