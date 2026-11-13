const SAMPLE_RECIPES = {
    cookies: {
        name: "Classic Chewy Chocolate Chip Cookies",
        url: "https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/",
        stats: {
            "Prep": "20m",
            "Cook": "10m",
            "Total": "30m",
            "Yield": "24 cookies"
        },
        ingredients: [
            "1 cup unsalted butter, softened",
            "1 cup white granulated sugar",
            "1 cup packed brown sugar",
            "2 large eggs, room temperature",
            "2 teaspoons vanilla extract",
            "1 teaspoon baking soda",
            "2 teaspoons hot water",
            "1/2 teaspoon salt",
            "3 cups all-purpose flour",
            "2 cups semisweet chocolate chips",
            "1 cup chopped walnuts (optional)"
        ],
        instructions: [
            "Preheat your oven to 350°F (175°C) and line two large baking sheets with parchment paper.",
            "Cream together the softened butter, white sugar, and brown sugar in a large bowl until smooth and fluffy.",
            "Beat in the eggs one at a time, then stir in the vanilla extract.",
            "Dissolve the baking soda in the hot water and add to the batter along with the salt.",
            "Gradually stir in the flour until just combined. Fold in the chocolate chips and chopped nuts.",
            "Drop large spoonfuls (about 2 tablespoons each) onto the prepared baking sheets, leaving 2 inches between cookies.",
            "Bake for 9 to 11 minutes until edges are golden brown but centers are still slightly soft.",
            "Cool on the baking sheet for 5 minutes before transferring to a wire rack to cool completely."
        ]
    },
    carbonara: {
        name: "Authentic Roman Spaghetti Carbonara",
        url: "https://www.seriouseats.com/pasta-carbonara-sauce-recipe",
        stats: {
            "Prep": "10m",
            "Cook": "15m",
            "Total": "25m",
            "Yield": "4 servings"
        },
        ingredients: [
            "1 pound spaghetti or rigatoni",
            "1/2 pound guanciale or pancetta, diced into 1/4-inch pieces",
            "4 large egg yolks plus 2 whole large eggs",
            "1 cup freshly grated Pecorino Romano cheese",
            "1/2 cup freshly grated Parmigiano-Reggiano cheese",
            "1 tablespoon freshly cracked coarse black pepper",
            "1 teaspoon kosher salt for pasta water"
        ],
        instructions: [
            "Bring a large pot of salted water to a boil. Cook pasta until 2 minutes shy of al dente.",
            "While pasta cooks, cook the diced guanciale in a large skillet over medium-low heat until crisp and browned, about 8 minutes. Remove skillet from heat.",
            "In a medium bowl, whisk together the egg yolks, whole eggs, grated Pecorino, Parmigiano-Reggiano, and plenty of cracked black pepper until a thick paste forms.",
            "Reserve 1 cup of starchy pasta cooking water, then drain pasta and add directly to the skillet with the rendered pork fat and guanciale.",
            "Toss the hot pasta with the pork for 30 seconds to coat. Allow pan to cool slightly off the heat so eggs don't scramble.",
            "Pour the egg and cheese mixture over pasta while tossing vigorously, adding splashes of warm pasta water until a creamy, glossy emulsion forms.",
            "Season with extra black pepper and serve immediately in warm bowls topped with extra Pecorino."
        ]
    },
    guacamole: {
        name: "Authentic Fresh Guacamole",
        url: "https://www.mexicanplease.com/authentic-guacamole-recipe/",
        stats: {
            "Prep": "15m",
            "Cook": "0m",
            "Total": "15m",
            "Yield": "4 servings"
        },
        ingredients: [
            "3 ripe Hass avocados, halved and pitted",
            "1/2 medium white onion, finely minced",
            "2 serrano or jalapeño peppers, seeded and minced",
            "1/2 cup fresh cilantro leaves, chopped",
            "2 tablespoons fresh lime juice (about 1 lime)",
            "1/2 teaspoon coarse sea salt, or to taste",
            "1 small Roma tomato, seeded and diced (optional)"
        ],
        instructions: [
            "In a molcajete or sturdy mixing bowl, crush half the minced onion, half the peppers, half the cilantro, and the salt with a pestle or fork into a coarse paste.",
            "Scoop avocado flesh into the bowl. Coarsely mash with a fork, leaving plenty of chunks for authentic texture.",
            "Gently fold in the remaining onion, chile peppers, cilantro, lime juice, and diced tomato.",
            "Taste and adjust lime juice and salt as desired.",
            "Serve immediately with warm crispy corn tortilla chips."
        ]
    }
};

let currentRecipe = null;
let currentScale = 1.0;
let checkedIngredients = new Set();
let completedSteps = new Set();

const urlInput = document.getElementById('recipeUrl');
const parseBtn = document.getElementById('parseBtn');
const tabUrlMode = document.getElementById('tabUrlMode');
const tabTextMode = document.getElementById('tabTextMode');
const urlInputContainer = document.getElementById('urlInputContainer');
const textInputContainer = document.getElementById('textInputContainer');
const rawRecipeInput = document.getElementById('rawRecipeInput');
const parseTextBtn = document.getElementById('parseTextBtn');
const errorMsg = document.getElementById('errorMsg');
const loadingSection = document.getElementById('loadingSection');
const loadingText = document.getElementById('loadingText');
const recipeOutput = document.getElementById('recipeOutput');
const recipeName = document.getElementById('recipeName');
const sourceLink = document.getElementById('sourceLink');
const recipeStats = document.getElementById('recipeStats');
const ingredientList = document.getElementById('ingredientList');
const instructionList = document.getElementById('instructionList');
const ingredientCount = document.getElementById('ingredientCount');
const instructionCount = document.getElementById('instructionCount');
const scaleButtons = document.querySelectorAll('.scale-btn');
const copyIngredientsBtn = document.getElementById('copyIngredientsBtn');
const printBtn = document.getElementById('printBtn');
const resetChecksBtn = document.getElementById('resetChecksBtn');
const progressBarFill = document.getElementById('progressBarFill');
const progressText = document.getElementById('progressText');
const sampleButtons = document.querySelectorAll('.pill-btn');

document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    const hash = window.location.hash.replace('#', '');
    if (SAMPLE_RECIPES[hash]) {
        loadSampleRecipe(hash);
    } else {
        loadSampleRecipe('cookies');
    }
});

function initEvents() {
    parseBtn.addEventListener('click', handleUrlParse);
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleUrlParse();
    });

    parseTextBtn.addEventListener('click', handleTextParse);

    tabUrlMode.addEventListener('click', () => switchTab('url'));
    tabTextMode.addEventListener('click', () => switchTab('text'));

    sampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sampleKey = btn.dataset.sample;
            if (SAMPLE_RECIPES[sampleKey]) {
                loadSampleRecipe(sampleKey);
            }
        });
    });

    scaleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const scale = parseFloat(btn.dataset.scale);
            if (!isNaN(scale) && currentRecipe) {
                setScale(scale);
            }
        });
    });

    copyIngredientsBtn.addEventListener('click', handleCopyIngredients);
    printBtn.addEventListener('click', () => window.print());
    resetChecksBtn.addEventListener('click', handleResetProgress);
}

function switchTab(mode) {
    clearError();
    if (mode === 'url') {
        tabUrlMode.classList.add('active');
        tabTextMode.classList.remove('active');
        urlInputContainer.hidden = false;
        textInputContainer.hidden = true;
    } else {
        tabTextMode.classList.add('active');
        tabUrlMode.classList.remove('active');
        textInputContainer.hidden = false;
        urlInputContainer.hidden = true;
    }
}

function showError(msg) {
    errorMsg.textContent = msg;
    loadingSection.hidden = true;
}

function clearError() {
    errorMsg.textContent = '';
}

function setLoading(on, message = 'Fetching and analyzing recipe data...') {
    loadingSection.hidden = !on;
    loadingText.textContent = message;
    parseBtn.disabled = on;
    parseTextBtn.disabled = on;
}

function loadSampleRecipe(key) {
    const sample = SAMPLE_RECIPES[key];
    if (!sample) return;
    clearError();
    urlInput.value = sample.url || '';
    renderRecipe(sample);
}

async function handleUrlParse() {
    const raw = urlInput.value.trim();
    clearError();

    if (!raw) {
        showError('Please enter a recipe URL, or click one of the examples below.');
        return;
    }

    let url;
    try {
        url = new URL(raw);
    } catch {
        showError('Please enter a valid URL starting with https://');
        return;
    }

    setLoading(true, 'Fetching recipe from page...');

    try {
        const html = await fetchPageWithFallbacks(url.href);
        const recipe = extractRecipeFromHtml(html, url.href);

        if (!recipe) {
            showError('Could not find recipe structured data on that page. Try pasting the recipe HTML or text using the "Paste Text / HTML" tab.');
            setLoading(false);
            return;
        }

        renderRecipe(recipe);
        setLoading(false);
        recipeOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        showError('Could not access that website through CORS proxies. You can copy the recipe HTML or text directly and use the "Paste Text / HTML" tab.');
        setLoading(false);
    }
}

async function fetchPageWithFallbacks(targetUrl) {
    const proxies = [
        async () => {
            const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            if (!res.ok) throw new Error('Proxy 1 failed');
            const data = await res.json();
            if (!data.contents) throw new Error('Proxy 1 empty contents');
            return data.contents;
        },
        async () => {
            const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
            if (!res.ok) throw new Error('Proxy 2 failed');
            const text = await res.text();
            if (!text || text.length < 50) throw new Error('Proxy 2 invalid content');
            return text;
        },
        async () => {
            const res = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`);
            if (!res.ok) throw new Error('Proxy 3 failed');
            return await res.text();
        }
    ];

    for (const proxyFn of proxies) {
        try {
            return await proxyFn();
        } catch {
            continue;
        }
    }
    throw new Error('All CORS proxies failed to retrieve URL');
}

function handleTextParse() {
    const raw = rawRecipeInput.value.trim();
    clearError();

    if (!raw) {
        showError('Please paste some recipe text or HTML content.');
        return;
    }

    setLoading(true, 'Parsing content...');
    setTimeout(() => {
        const recipe = extractRecipeFromHtml(raw, null) || extractRecipeFromPlainText(raw);

        if (!recipe) {
            showError('Unable to identify ingredients and instructions. Ensure sections are labeled "Ingredients" and "Instructions" / "Directions".');
            setLoading(false);
            return;
        }

        renderRecipe(recipe);
        setLoading(false);
        recipeOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function extractRecipeFromHtml(html, sourceUrl) {
    if (!html || typeof html !== 'string') return null;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const recipe = extractFromJsonLd(doc) || extractFromMicrodata(doc) || extractFromStandardSelectors(doc);
        if (recipe) {
            if (sourceUrl && !recipe.url) recipe.url = sourceUrl;
            return recipe;
        }
    } catch {
        return null;
    }
    return null;
}

function extractFromJsonLd(doc) {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');

    for (const script of scripts) {
        let data;
        try {
            data = JSON.parse(script.textContent);
        } catch {
            continue;
        }

        const candidates = [];
        const inspect = (node) => {
            if (!node || typeof node !== 'object') return;
            if (Array.isArray(node)) {
                node.forEach(inspect);
            } else {
                if (isRecipeType(node['@type'])) {
                    candidates.push(node);
                }
                if (node['@graph']) inspect(node['@graph']);
            }
        };

        inspect(data);

        for (const item of candidates) {
            const norm = normalizeJsonLd(item);
            if (norm) return norm;
        }
    }
    return null;
}

function isRecipeType(type) {
    if (!type) return false;
    const t = Array.isArray(type) ? type : [type];
    return t.some(x => typeof x === 'string' && x.toLowerCase().includes('recipe'));
}

function normalizeJsonLd(data) {
    const name = cleanText(data.name || 'Extracted Recipe');

    const ingredients = (data.recipeIngredient || data.ingredients || [])
        .map(i => cleanText(i))
        .filter(Boolean);

    const rawInstructions = data.recipeInstructions || data.instructions || [];
    const instructions = flattenInstructions(rawInstructions);

    const stats = {};
    if (data.prepTime) stats['Prep'] = parseDuration(data.prepTime);
    if (data.cookTime) stats['Cook'] = parseDuration(data.cookTime);
    if (data.totalTime) stats['Total'] = parseDuration(data.totalTime);
    if (data.recipeYield) {
        const y = Array.isArray(data.recipeYield) ? data.recipeYield[0] : data.recipeYield;
        stats['Yield'] = cleanText(String(y));
    }

    if (!ingredients.length && !instructions.length) return null;

    return {
        name,
        ingredients,
        instructions,
        stats,
        url: data.mainEntityOfPage || data.url || null
    };
}

function flattenInstructions(raw) {
    const steps = [];
    if (typeof raw === 'string') {
        return raw.split(/\r?\n+/).map(cleanText).filter(s => s.length > 5);
    }
    if (!Array.isArray(raw)) return steps;

    for (const item of raw) {
        if (typeof item === 'string') {
            const text = cleanText(item);
            if (text) steps.push(text);
        } else if (item && typeof item === 'object') {
            if (item['@type'] === 'HowToSection' && item.itemListElement) {
                steps.push(...flattenInstructions(item.itemListElement));
            } else {
                const text = cleanText(item.text || item.name || '');
                if (text) steps.push(text);
            }
        }
    }
    return steps;
}

function extractFromMicrodata(doc) {
    const el = doc.querySelector('[itemtype*="schema.org/Recipe"]');
    if (!el) return null;

    const name = cleanText(el.querySelector('[itemprop="name"]')?.textContent || 'Extracted Recipe');
    const ingredients = [...el.querySelectorAll('[itemprop="recipeIngredient"]')]
        .map(e => cleanText(e.textContent))
        .filter(Boolean);
    const instructions = [...el.querySelectorAll('[itemprop="recipeInstructions"]')]
        .map(e => cleanText(e.textContent))
        .filter(Boolean);

    if (!ingredients.length && !instructions.length) return null;
    return { name, ingredients, instructions, stats: {} };
}

function extractFromStandardSelectors(doc) {
    const ingredientSelectors = [
        '.wprm-recipe-ingredient',
        '.tasty-recipe-ingredients li',
        '.mv-recipe-ingredients li',
        '.recipe-ingredients li',
        '[class*="ingredient"] li',
        '.ingredients li',
        '[itemprop="ingredients"]'
    ];

    const instructionSelectors = [
        '.wprm-recipe-instruction-text',
        '.tasty-recipe-instructions li',
        '.mv-recipe-instructions li',
        '.recipe-directions li',
        '.recipe-instructions li',
        '[class*="instruction"] li',
        '.instructions li'
    ];

    let ingredients = [];
    for (const sel of ingredientSelectors) {
        const found = [...doc.querySelectorAll(sel)].map(e => cleanText(e.textContent)).filter(Boolean);
        if (found.length >= 2) {
            ingredients = found;
            break;
        }
    }

    let instructions = [];
    for (const sel of instructionSelectors) {
        const found = [...doc.querySelectorAll(sel)].map(e => cleanText(e.textContent)).filter(Boolean);
        if (found.length >= 1) {
            instructions = found;
            break;
        }
    }

    if (!ingredients.length && !instructions.length) return null;

    const name = cleanText(
        doc.querySelector('.wprm-recipe-name, .tasty-recipes-title, h1.recipe-title, h1.entry-title, h1')?.textContent || 'Extracted Recipe'
    );

    return { name, ingredients, instructions, stats: {} };
}

function extractRecipeFromPlainText(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return null;

    let inIngredients = false;
    let inInstructions = false;
    const ingredients = [];
    const instructions = [];
    let name = lines[0].replace(/^#+\s*/, '');

    for (const line of lines) {
        const lower = line.toLowerCase();
        if (/^(ingredients|ingredient list|what you need)[:\s]*$/i.test(lower)) {
            inIngredients = true;
            inInstructions = false;
            continue;
        }
        if (/^(instructions|directions|method|preparation|steps)[:\s]*$/i.test(lower)) {
            inInstructions = true;
            inIngredients = false;
            continue;
        }

        const cleaned = line.replace(/^[-*•\d+.)\s]+/, '').trim();
        if (!cleaned) continue;

        if (inIngredients && !inInstructions) {
            ingredients.push(cleaned);
        } else if (inInstructions) {
            instructions.push(cleaned);
        }
    }

    if (!ingredients.length && !instructions.length) return null;
    return { name, ingredients, instructions, stats: {} };
}

function renderRecipe(recipe) {
    currentRecipe = recipe;
    currentScale = 1.0;
    checkedIngredients.clear();
    completedSteps.clear();

    recipeName.textContent = recipe.name || 'Untitled Recipe';

    if (recipe.url) {
        sourceLink.href = recipe.url;
        sourceLink.hidden = false;
    } else {
        sourceLink.hidden = true;
    }

    recipeStats.innerHTML = '';
    const stats = recipe.stats || {};
    const statKeys = Object.keys(stats);

    if (statKeys.length) {
        statKeys.forEach(key => {
            const val = stats[key];
            if (!val) return;
            const div = document.createElement('div');
            div.className = 'stat';
            div.innerHTML = `<span class="stat-label">${key}</span><span class="stat-value">${val}</span>`;
            recipeStats.appendChild(div);
        });
        recipeStats.style.display = 'flex';
    } else {
        recipeStats.style.display = 'none';
    }

    updateScaleButtons();
    renderIngredients();
    renderInstructions();
    updateProgress();

    recipeOutput.hidden = false;
}

function setScale(scale) {
    currentScale = scale;
    updateScaleButtons();
    renderIngredients();
}

function updateScaleButtons() {
    scaleButtons.forEach(btn => {
        const val = parseFloat(btn.dataset.scale);
        btn.classList.toggle('active', val === currentScale);
    });
}

function renderIngredients() {
    ingredientList.innerHTML = '';
    const items = currentRecipe.ingredients || [];
    ingredientCount.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        if (checkedIngredients.has(index)) {
            li.classList.add('checked');
        }

        const scaledText = scaleIngredientText(item, currentScale);

        li.innerHTML = `
            <span class="checkbox-custom">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </span>
            <span class="ingredient-text">${scaledText}</span>
        `;

        li.addEventListener('click', () => {
            if (checkedIngredients.has(index)) {
                checkedIngredients.delete(index);
                li.classList.remove('checked');
            } else {
                checkedIngredients.add(index);
                li.classList.add('checked');
            }
        });

        ingredientList.appendChild(li);
    });
}

function renderInstructions() {
    instructionList.innerHTML = '';
    const steps = currentRecipe.instructions || [];
    instructionCount.textContent = `${steps.length} step${steps.length === 1 ? '' : 's'}`;

    steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.className = 'step-card';
        li.dataset.index = index;

        if (completedSteps.has(index)) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <div class="step-number">
                <span>${index + 1}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="step-text">${step}</div>
        `;

        li.addEventListener('click', () => {
            if (completedSteps.has(index)) {
                completedSteps.delete(index);
                li.classList.remove('completed');
            } else {
                completedSteps.add(index);
                li.classList.add('completed');
            }
            updateProgress();
        });

        instructionList.appendChild(li);
    });
}

function updateProgress() {
    const total = currentRecipe ? (currentRecipe.instructions || []).length : 0;
    const completed = completedSteps.size;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    progressBarFill.style.width = `${pct}%`;
    progressText.textContent = `${completed} of ${total} step${total === 1 ? '' : 's'} completed (${pct}%)`;
}

function handleResetProgress() {
    checkedIngredients.clear();
    completedSteps.clear();
    renderIngredients();
    renderInstructions();
    updateProgress();
}

function handleCopyIngredients() {
    if (!currentRecipe || !currentRecipe.ingredients) return;

    const list = currentRecipe.ingredients.map(ing => {
        return `• ${scaleIngredientText(ing, currentScale)}`;
    }).join('\n');

    const fullText = `${currentRecipe.name} - Ingredients (Scale: ${currentScale}x):\n\n${list}`;

    navigator.clipboard.writeText(fullText).then(() => {
        const originalText = copyIngredientsBtn.querySelector('span').textContent;
        copyIngredientsBtn.querySelector('span').textContent = 'Copied!';
        setTimeout(() => {
            copyIngredientsBtn.querySelector('span').textContent = originalText;
        }, 1800);
    }).catch(() => {
        showError('Unable to copy automatically to clipboard.');
    });
}

function scaleIngredientText(text, scale) {
    if (scale === 1.0) return text;

    const regex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)/;
    const match = text.match(regex);
    if (!match) return text;

    const rawQty = match[1];
    const rest = text.slice(rawQty.length);
    const numeric = parseFraction(rawQty);
    if (isNaN(numeric)) return text;

    const scaled = numeric * scale;
    const formatted = formatFraction(scaled);
    return `${formatted}${rest}`;
}

function parseFraction(str) {
    str = str.trim();
    if (str.includes(' ')) {
        const parts = str.split(/\s+/);
        return parseFloat(parts[0]) + parseFraction(parts[1]);
    }
    if (str.includes('/')) {
        const parts = str.split('/');
        return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return parseFloat(str);
}

function formatFraction(val) {
    const whole = Math.floor(val);
    const frac = val - whole;

    const tol = 0.05;
    let fracStr = '';

    if (Math.abs(frac - 0.25) < tol) fracStr = '1/4';
    else if (Math.abs(frac - 0.333) < tol) fracStr = '1/3';
    else if (Math.abs(frac - 0.5) < tol) fracStr = '1/2';
    else if (Math.abs(frac - 0.666) < tol) fracStr = '2/3';
    else if (Math.abs(frac - 0.75) < tol) fracStr = '3/4';
    else if (Math.abs(frac - 0.125) < tol) fracStr = '1/8';
    else if (frac > 0.05 && frac < 0.95) {
        return val.toFixed(1).replace(/\.0$/, '');
    }

    if (whole > 0 && fracStr) return `${whole} ${fracStr}`;
    if (whole > 0 && !fracStr) return `${whole}`;
    if (fracStr) return fracStr;
    return val.toFixed(1).replace(/\.0$/, '');
}

function parseDuration(iso) {
    if (!iso) return '';
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
    if (!match) return iso;
    const h = parseInt(match[1] || 0, 10);
    const m = parseInt(match[2] || 0, 10);
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    if (m) return `${m}m`;
    return iso;
}

function cleanText(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
}
