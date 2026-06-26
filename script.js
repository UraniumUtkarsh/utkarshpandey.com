/**
 * Utkarsh Pandey | Central Hub - Core Production Systems
 * Runtime Initialization & Modular Engine Pipelines
 * Deployed: 2026 Layout Configuration
 */

// Global Environmental Configurations
const GITHUB_USERNAME = "UraniumUtkarsh";
const REPO_NAME = "utkarshpandey.com";
const SLIDESHOW_FOLDER_PATH = "images";

// UI Core State Management Objects
let slideItems = [];
let currentSlide = 0;

/**
 * 1. LIGHT / DARK SYSTEM THEME CONFIGURATOR
 * Manages runtime theme state persistence across navigation cycles.
 * Configured to force Light Mode as the default layout system.
 */
function initializeThemeEngine() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("theme-toggle-sun-icon");
  const moonIcon = document.getElementById("theme-toggle-moon-icon");

  // Only boot into dark mode if the user explicitly clicked and saved it previously
  const isDarkStored = localStorage.getItem("color-theme") === "dark";

  if (isDarkStored) {
    document.documentElement.classList.add("dark");
    if (sunIcon) sunIcon.classList.remove("hidden");
    if (moonIcon) moonIcon.classList.add("hidden");
  } else {
    // Default system state: Light Mode configuration
    document.documentElement.classList.remove("dark");
    if (moonIcon) moonIcon.classList.remove("hidden");
    if (sunIcon) sunIcon.classList.add("hidden");
    
    // Explicitly seed the theme storage vector if unassigned
    if (!localStorage.getItem("color-theme")) {
      localStorage.setItem("color-theme", "light");
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      if (sunIcon && moonIcon) {
        sunIcon.classList.toggle("hidden");
        moonIcon.classList.toggle("hidden");
      }

      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    });
  }
}

/**
 * 2. SIDE SLIDER CONSOLE INTERFACE MECHANICS
 * Toggles administrative configuration panels
 */
function initializeDrawerMechanics() {
  const drawer = document.getElementById("side-drawer");
  const drawerToggle = document.getElementById("drawer-toggle");
  const drawerClose = document.getElementById("drawer-close");

  if (drawerToggle && drawer) {
    drawerToggle.addEventListener("click", (e) => {
      e.preventDefault();
      drawer.classList.remove("translate-x-full");
    });
  }

  if (drawerClose && drawer) {
    drawerClose.addEventListener("click", (e) => {
      e.preventDefault();
      drawer.classList.add("translate-x-full");
    });
  }
}

/**
 * 3. AUTOMATED REPOSITORY IMAGES STREAM ENGINE
 * Extracts raw picture links directly from your GitHub master branch
 */
async function fetchImagesFromGithub() {
  const container = document.getElementById("slideshow-container");
  const statusMsg = document.getElementById("gallery-status");

  if (!container) return;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${SLIDESHOW_FOLDER_PATH}`,
    );
    if (!response.ok) throw new Error("GitHub API Access Denied");

    const files = await response.json();
    // Extract common image file types cleanly using safe regex filters
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name),
    );

    if (imageFiles.length === 0) {
      if (statusMsg) statusMsg.innerText = "NO_IMGS_IN_TARGET_DIR";
      return;
    }

    container.innerHTML = ""; // Wipe loading indicator

    imageFiles.forEach((file, index) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = `absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${index === 0 ? "opacity-100" : "opacity-0"}`;

      const img = document.createElement("img");
      img.src = file.download_url; // Directly target the raw raw.githubusercontent pipeline
      img.alt = file.name;
      img.className = "w-full h-full object-contain rounded-xl p-2";
      img.loading = "lazy";

      slideDiv.appendChild(img);
      container.appendChild(slideDiv);
      slideItems.push(slideDiv);
    });

    initSliderControls();
  } catch (err) {
    console.error(err);
    if (statusMsg) statusMsg.innerText = "COULD_NOT_ESTABLISH_GIT_STREAM";
  }
}

function initSliderControls() {
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");

  if (slideItems.length <= 1) return;

  function changeSlide(nextIndex) {
    slideItems[currentSlide].classList.replace("opacity-100", "opacity-0");
    currentSlide = (nextIndex + slideItems.length) % slideItems.length;
    slideItems[currentSlide].classList.replace("opacity-0", "opacity-100");
  }

  if (nextBtn)
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      changeSlide(currentSlide + 1);
    });
  if (prevBtn)
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      changeSlide(currentSlide - 1);
    });

  // Automated carousel cycle (5000ms delay configuration)
  setInterval(() => changeSlide(currentSlide + 1), 5000);
}

/**
 * 4. ASYNCHRONOUS BENTO GRID CONFIGURATION PARSER (Upgraded with Thumbnails)
 * Decouples layout configurations and renders local/remote visual media blocks cleanly
 */
async function loadBentoGridConfig() {
  const gridTarget = document.getElementById("bento-grid-target");
  if (!gridTarget) return;

  const urlParams = new URLSearchParams(window.location.search);
  const isPreviewMode = urlParams.get("mode") === "preview";

  try {
    const response = await fetch("./bento-config.json");
    if (!response.ok) throw new Error("Configuration descriptor offline");
    const cardsData = await response.json();

    gridTarget.innerHTML = "";

    cardsData.forEach((card) => {
      if (!isPreviewMode && card.status === "preview") return;

      // Handle standard wide/short column rules
      const colSpanClass = card.isWide
        ? "col-span-1 md:col-span-2 row-span-2"
        : "col-span-1 row-span-2";
      const targetAttr = card.redirectLink.startsWith("http")
        ? 'target="_blank"'
        : "";
      const previewBorderClass =
        card.status === "preview"
          ? "border-dashed border-amber-500/60"
          : "border-slate-200 dark:border-slate-800";

      // IMAGE LOGIC: If a thumbnail path exists, generate a clean HTML element for it
      let thumbnailHTML = "";
      if (card.thumbnail && card.thumbnail.trim() !== "") {
        thumbnailHTML = `
                    <div class="relative w-full h-28 md:h-32 mb-3 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-900/60 shrink-0">
                        <img src="${card.thumbnail}" alt="${card.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.parentElement.style.display='none';">
                    </div>
                `;
      }

      const cardHTML = `
                <a href="${card.redirectLink}" ${targetAttr} class="group relative ${colSpanClass} p-5 rounded-2xl bg-white dark:bg-slate-900/40 border ${previewBorderClass} hover:border-${card.accentColor}-500 dark:hover:border-${card.accentColor}-500/30 shadow-sm hover:shadow-md dark:hover:shadow-${card.accentColor}-950/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-${card.accentColor}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <!-- Top Category Tag Header -->
                    <div class="flex justify-between items-start z-10 mb-2">
                        <div class="p-2 rounded-xl bg-${card.accentColor}-50 dark:bg-${card.accentColor}-950/40 border border-${card.accentColor}-100 dark:border-${card.accentColor}-900/50 text-${card.accentColor}-600 dark:text-${card.accentColor}-400 code-font text-xs font-semibold">
                            [${card.category}] ${card.status === "preview" ? "⚡ PREVIEW_NODE" : ""}
                        </div>
                        <span class="text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300 text-xl font-bold">→</span>
                    </div>

                    <!-- Visual Thumbnail Section (Injected here between header and text details) -->
                    ${thumbnailHTML}

                    <!-- Core Card Content Details -->
                    <div class="z-10 mt-auto">
                     <h2 class="text-lg md:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-${card.accentColor}-600 dark:hover:text-${card.accentColor}-400 transition-colors header-font">${card.title}</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">${card.description}</p>
                    </div></a>
            `;
      gridTarget.innerHTML += cardHTML;
    });
  } catch (err) {
    console.error("Bento Layout Sync Failure:", err);
  }
}

/**
 * 5. HIGH-STABILITY CORES-PROXY SYSTEM STATUS ENGINE
 * Implements strict live timestamp cache-busting logic to prevent 502/404 ghosting
 */
async function checkNodeStatus(url, elementId) {
  const statusContainer = document.getElementById(elementId);
  if (!statusContainer) return;

  const cacheBuster = new Date().getTime();
  const targetWithBuster = url.includes("?")
    ? `${url}&_cb=${cacheBuster}`
    : `${url}?_cb=${cacheBuster}`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetWithBuster)}`;

  try {
    const response = await fetch(proxyUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (response.ok) {
      statusContainer.innerHTML = `
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                <span class="text-emerald-600 dark:text-emerald-400 text-[10px] tracking-wider">ONLINE</span>
            `;
    } else {
      throw new Error("Node threw error header response (e.g. 502/500/404)");
    }
  } catch (error) {
    statusContainer.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            <span class="text-red-600 dark:text-red-400 text-[10px] tracking-wider">OFFLINE</span>
        `;
  }
}

/**
 * 6. DYNAMIC HACKER NEWS FIREHOSE FETCH ENGINE
 * Syncs real-time top trending computer science records via Firebase REST APIs
 */
async function loadHackerNewsStream() {
  const streamTarget = document.getElementById("rss-stream-target");
  if (!streamTarget) return;

  try {
    const topStoriesResponse = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
    );
    if (!topStoriesResponse.ok) throw new Error("HN API Unreachable");
    const storyIds = await topStoriesResponse.json();

    const topSixIds = storyIds.slice(0, 6);
    streamTarget.innerHTML = "";

    for (const id of topSixIds) {
      const itemResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      );
      const item = await itemResponse.json();

      if (item && item.url) {
        const itemHTML = `
                    <div class="flex items-start gap-2 group p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <span class="text-slate-400 dark:text-slate-600 select-none">▲</span>
                        <div class="space-y-0.5 min-w-0">
                            <a href="${item.url}" target="_blank" class="text-slate-800 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 font-medium tracking-tight block truncate transition-colors">
                                ${item.title}
                            </a>
                            <div class="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                                <span>score: ${item.score}</span>
                                <span>•</span>
                                <span>by: ${item.by}</span>
                            </div>
                        </div>
                    </div>
                `;
        streamTarget.innerHTML += itemHTML;
      }
    }
  } catch (err) {
    console.error("HN Firehose Error:", err);
    streamTarget.innerHTML = `<div class="col-span-full p-2 text-red-500">FAILED_TO_SYNC_LIVE_INTELLIGENCE_STREAM</div>`;
  }
}

/**
 * 7. DYNAMIC GITHUB REPOSITORY PRODUCTION TRACKER (With Local Thumbnail Binding)
 * Resolves active codebases, binds local asset thumbnails, and displays telemetry metrics
 */
async function loadGitHubRepositories() {
  const repoTarget = document.getElementById("github-repos-target");
  if (!repoTarget) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`,
    );
    if (!response.ok) throw new Error("GitHub user lookup failure");
    const repos = await response.json();

    // Strip forks and your core website deployment hub to filter out noise
    const filteredRepos = repos
      .filter((repo) => !repo.fork && repo.name !== REPO_NAME)
      .slice(0, 4);

    if (filteredRepos.length === 0) {
      repoTarget.innerHTML = `<div class="col-span-full p-4 text-center text-slate-400 dark:text-slate-500 text-xs font-mono border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">NO_PUBLIC_PRODUCTION_NODES_FOUND</div>`;
      return;
    }

    repoTarget.innerHTML = ""; // Wipe loader sequence

    filteredRepos.forEach((repo) => {
      const langBadge = repo.language
        ? `
                <span class="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                    ${repo.language}
                </span>`
        : "";

      const description =
        repo.description ||
        "Production ecosystem source logs operating in open-source space under development workflows.";

      // AUTOMATED LOCAL THUMBNAIL LOGIC: Maps file path straight to repository variable string
      const localThumbnailPath = `assets/projects/${repo.name}.png`;

      const repoHTML = `
                <a href="${repo.html_url}" target="_blank" class="group relative p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div class="z-10 w-full space-y-2">
                        <!-- Project Asset Header -->
                        <div class="flex justify-between items-center">
                            <h4 class="header-font text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate pr-2">
                            /${repo.name}
                            </h4>
                            <span class="text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300 text-sm font-bold">↗</span>
                        </div>

                        <!-- Dynamic Local Project Snap (Hides automatically if file configuration is missing) -->
                        <div class="relative w-full h-24 my-2.5 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/40 shrink-0">
                            <img src="${localThumbnailPath}" 
                                 alt="${repo.name} Preview" 
                                 class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                                 loading="lazy" 
                                 onerror="this.parentElement.style.display='none';">
                        </div>

                        <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            ${description}
                        </p>
                    </div>

                    <!-- Telemetry Metric Footer Row -->
                    <div class="z-10 flex items-center justify-between mt-4 border-t border-slate-100 dark:border-slate-900/60 pt-3">
                        <div class="flex items-center gap-2">
                            ${langBadge}
                        </div>
                        <div class="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                            <span>★</span>
                            <span>${repo.stargazers_count}</span>
                        </div>
                    </div>
                </a>
            `;
      repoTarget.innerHTML += repoHTML;
    });
  } catch (err) {
    console.error("Git Feed Sync Error:", err);
    repoTarget.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-xs font-mono border border-dashed border-red-200 dark:border-red-900/30 rounded-xl">FAILED_TO_SYNC_PRODUCTION_REPOSITORIES</div>`;
  }
}
/**
 * MASTER CONCURRENT BOOTSTRAP SWEEP
 * Fires execution sequences as soon as the main DOM thread locks down
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeThemeEngine();
  initializeDrawerMechanics();
  fetchImagesFromGithub();
  loadBentoGridConfig();
  loadGitHubRepositories();
  loadHackerNewsStream();
  pushSystemAnnouncement();
  initializeContactForm();
  loadLastTransmittedLog();

  // Execute live infrastructure sweeps immediately
  checkNodeStatus("https://utkarshblogs.in", "status-blog");
  checkNodeStatus("https://dpdp.utkarshpandey.com", "status-dpdp");
  checkNodeStatus("https://upsifs.utkarshpandey.com", "status-upsifs");
});

/**
 * 8. PREMIUM ASYNCHRONOUS FORM PIPELINE
 * Blends custom dashboard loading animations with proven background fetch loops
 */
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const fieldsWrapper = document.getElementById('form-fields-wrapper');
    const overlayScreen = document.getElementById('form-overlay-screen');
    const spinner = document.getElementById('loading-spinner');
    const checkmark = document.getElementById('success-checkmark');
    const title = document.getElementById('overlay-title');
    const desc = document.getElementById('overlay-desc');
    const resetBtn = document.getElementById('form-reset-btn');

    if (!form || !overlayScreen || !fieldsWrapper) return;

    form.addEventListener('submit', function (e) {
        // Stop default native browser tab allocation or page refreshes instantly
        e.preventDefault();

        // Step A: Trigger Dashboard Overlay UI Matrix
        fieldsWrapper.classList.add('blur-sm', 'pointer-events-none');
        overlayScreen.classList.remove('hidden');
        
        title.innerText = "Uplinking...";
        title.className = "text-sm font-bold tracking-wider text-slate-900 dark:text-white uppercase";
        desc.innerText = "Syncing payload packet vectors with master directory grid.";
        spinner.classList.remove('hidden');
        checkmark.classList.add('hidden');
        resetBtn.classList.add('hidden');

        // Pack data parameters using your proven URLSearchParams structure
        const formData = new FormData(this);
        const params = new URLSearchParams(formData);

        // Execute background web pipeline sweep
        fetch(
            "https://script.google.com/macros/s/AKfycbwgovrrnd6Q6SnAPh98AHnW2XmSdNEGsaMwIGqnXerCfE9JmoqwugQUbm-oz31ugqnV6Q/exec",
            {
                method: "POST",
                body: params,
            }
        )
        .then((response) => response.text())
        .then((data) => {
            // Step B: Success state handling
            spinner.classList.add('hidden');
            checkmark.classList.remove('hidden');
            
            title.innerText = "Sent Successfully!";
            title.className = "text-sm font-bold code-font text-emerald-600 dark:text-emerald-400 uppercase tracking-wider";
            desc.innerText = "Transmission confirmed. Message Log index entry updated [STATUS_200].";
            
            resetBtn.innerText = "[TRANSMIT_NEW_LOG]";
            resetBtn.classList.remove('hidden');
            form.reset();
        })
        .catch((error) => {
            // Step C: Failure handling diagnostics
            console.error(error);
            spinner.classList.add('hidden');
            
            title.innerText = "Transmission Failed";
            title.className = "text-sm font-bold code-font text-red-600 dark:text-red-400 uppercase tracking-wider";
            desc.innerText = "Critical pipeline break detected. Please verify your connection matrix.";
            
            resetBtn.innerText = "[RETRY_TRANSMISSION]";
            resetBtn.classList.remove('hidden');
        });
    });
}

/**
 * Resets the contact form view state back to empty inputs
 */
function resetContactFormViewport() {
    const fieldsWrapper = document.getElementById('form-fields-wrapper');
    const overlayScreen = document.getElementById('form-overlay-screen');
    
    if (fieldsWrapper && overlayScreen) {
        fieldsWrapper.classList.remove('blur-sm', 'pointer-events-none');
        overlayScreen.classList.add('hidden');
    }
}

/**
 * 9. RUNTIME SYSTEM ANNOUNCEMENT WIRE (JSON-Fed Engine)
 * Dynamically fetches administrative alerts from announcement-config.json
 */
async function pushSystemAnnouncement() {
    const alertContainer = document.getElementById('announcement-banner');
    const alertTarget = document.getElementById('announcement-text');
    if (!alertTarget || !alertContainer) return;

    try {
        // FIXED: Stripped the leading dot to make routing rock-solid on static servers
        const response = await fetch('/announcement-config.json');
        if (!response.ok) throw new Error('Announcement feed offline');
        
        const data = await response.json();
        // ─── ADD THIS DEBUG LINE HERE ────────────────────────────────────────
        console.log("ANNOUNCEMENT DEBUG:", { data, alertContainer, alertTarget });
        //

        // If the configuration status is explicitly not live, or the alert text string is empty, hide the module safely
        if (data.status !== 'live' || !data.activeAlert || data.activeAlert.trim() === "") {
            alertContainer.style.display = 'none';
            return;
        }

        // Inject the active alert payload text from the JSON structure
        alertTarget.innerText = data.activeAlert;
        alertContainer.style.display = 'flex'; // Ensure container is visible if live
    } catch (err) {
        console.error('Announcement System Sync Failure:', err);
        alertContainer.style.display = 'none'; // Quietly collapse the layout on failure
    }
}
/**
 * 10. PRIVACY MANIFEST INTERACTIVE VIEWPORT
 * Toggles the visibility of the DPDP compliancy notice window
 */
function togglePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}
/**
 * 11. RETRIEVE RECENT DATA MATRIX LOG
 * Connects via GET requests to display the last spreadsheet submission parameters
 */
async function loadLastTransmittedLog() {
    const nameSlot = document.getElementById('last-log-name');
    const msgSlot = document.getElementById('last-log-msg');
    if (!nameSlot || !msgSlot) return;

    const targetUrl = "https://script.google.com/macros/s/AKfycbwgovrrnd6Q6SnAPh98AHnW2XmSdNEGsaMwIGqnXerCfE9JmoqwugQUbm-oz31ugqnV6Q/exec";

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('Failed to read endpoint stream');
        
        const data = await response.json();
        
        // Escape any HTML injection attempts safely
        nameSlot.innerText = data.name || "Anonymous Matrix Node";
        msgSlot.innerText = data.message || "Empty data frame payload.";
    } catch (error) {
        console.error('Error fetching last log:', error);
        nameSlot.innerText = "OFFLINE";
        msgSlot.innerText = "Unable to verify master grid data arrays.";
    }
}
/**
 * 12. PRIVACY AND COMPLIANCE MODAL LAYER CONTROLLER
 * Toggles viewport visibility matrices for the DPDP legal article framework
 */
function toggleDPDPModal(shouldShow) {
    const modal = document.getElementById('dpdp-compliance-modal');
    if (!modal) return;
    
    if (shouldShow) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // Stops main page scrolling behind modal
    } else {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden'); // Restores normal scrolling
    }
}