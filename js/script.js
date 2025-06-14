// Configuración
const CONFIG = {
    dataPath: 'data/chapters.json',
    originalSiteUrl: 'https://biocircuits.github.io/',
    githubRepo: 'https://github.com/tu-usuario/tu-repo'
};

// Estado global
let allChapters = [];
let allAppendices = [];
let currentFilter = 'all';
let searchTerm = '';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        showLoading();
        await loadData();
        setupEventListeners();
        renderContent();
        hideLoading();
    } catch (error) {
        console.error('Error inicializando la app:', error);
        showError('Error cargando el contenido. Por favor, recarga la página.');
    }
}

// Cargar datos
async function loadData() {
    try {
        const response = await fetch(CONFIG.dataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allChapters = data.chapters || [];
        allAppendices = data.appendices || [];
        
        // Actualizar contadores
        updateCounters();
    } catch (error) {
        console.error('Error cargando datos:', error);
        // Usar datos de fallback si no se puede cargar el JSON
        loadFallbackData();
    }
}

function loadFallbackData() {
    // Datos de fallback incluidos directamente en el código
    allChapters = [
        {
            id: 0,
            title: "Configurando tu entorno Python",
            description: "Aprende a configurar Python para computación científica",
            category: "basics",
            icon: "settings",
            gradient: "from-green-400 to-blue-500",
            progress: 0,
            url: "chapters/00_setting_up_python_computing_environment.html"
        },
        {
            id: 1,
            title: "Introducción al diseño de circuitos",
            description: "Conceptos fundamentales del diseño de circuitos biológicos",
            category: "basics",
            icon: "circuit-board",
            gradient: "from-purple-400 to-pink-500",
            progress: 0,
            url: "chapters/01_intro_to_circuit_design.html"
        },
        // ... más capítulos
    ];
    
    allAppendices = [
        {
            title: "Soluciones aproximadas a dinámicas autorrepresivas",
            category: "technical",
            icon: "trending-down",
            url: "technical_appendices/02a_approximate_autorepression_dynamics.html"
        },
        // ... más apéndices
    ];
}

// Event listeners
function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Filtros
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
    
    // Modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Menú móvil
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Botón de inicio
    const startLearning = document.getElementById('startLearning');
    startLearning.addEventListener('click', () => {
        document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Scroll suave para enlaces internos
    setupSmoothScroll();
    
    // Inicializar iconos de Lucide
    lucide.createIcons();
}

// Manejar búsqueda
function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    filterContent();
}

// Manejar filtros
function handleFilter(e) {
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.category;
    filterContent();
}

// Filtrar contenido
function filterContent() {
    const chapterCards = document.querySelectorAll('.chapter-card');
    const appendixCards = document.querySelectorAll('.tech-appendix');
    
    [...chapterCards, ...appendixCards].forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';
        const category = card.dataset.category;
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = currentFilter === 'all' || category === currentFilter;
        
        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Renderizar contenido
function renderContent() {
    renderChapters();
    renderAppendices();
    lucide.createIcons();
}

// Renderizar capítulos
function renderChapters() {
    const grid = document.getElementById('chaptersGrid');
    
    if (allChapters.length === 0) {
        grid.innerHTML = '<div class="error-state"><i data-lucide="book-x"></i><p>No se pudieron cargar los capítulos</p></div>';
        return;
    }
    
    grid.innerHTML = allChapters.map(chapter => `
        <div class="chapter-card card-hover rounded-2xl p-6 cursor-pointer relative overflow-hidden" 
             data-category="${chapter.category}"
             onclick="openChapter('${chapter.url}')">
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-r ${chapter.gradient} opacity-10 rounded-full blur-xl"></div>
            <div class="relative z-10">
                <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-gradient-to-r ${chapter.gradient} rounded-xl flex items-center justify-center">
                        <i data-lucide="${chapter.icon}" class="w-6 h-6 text-white"></i>
                    </div>
                    <span class="chapter-number text-lg font-bold">${chapter.id}</span>
                </div>
                
                <h3 class="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                    ${chapter.title}
                </h3>
                
                <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                    ${chapter.description}
                </p>
                
                <div class="flex items-center justify-between">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${chapter.gradient} text-white">
                        <i data-lucide="clock" class="w-3 h-3 mr-1"></i>
                        15-20 min
                    </span>
                    <span class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center">
                        Comenzar
                        <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
                    </span>
                </div>
                
                ${chapter.progress > 0 ? `
                    <div class="mt-4">
                        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso</span>
                            <span>${chapter.progress}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-1">
                            <div class="progress-bar h-1 rounded-full bg-gradient-to-r ${chapter.gradient}" style="width: ${chapter.progress}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Renderizar apéndices
function renderAppendices() {
    const grid = document.getElementById('appendicesGrid');
    
    if (allAppendices.length === 0) {
        grid.innerHTML = '<div class="error-state"><i data-lucide="file-x"></i><p>No se pudieron cargar los apéndices</p></div>';
        return;
   }
   
   grid.innerHTML = allAppendices.map(appendix => `
       <div class="tech-appendix card-hover rounded-2xl p-6 cursor-pointer border border-gray-200" 
            data-category="${appendix.category}"
            onclick="openAppendix('${appendix.url}')">
           <div class="flex items-start space-x-4">
               <div class="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                   <i data-lucide="${appendix.icon}" class="w-6 h-6 text-white"></i>
               </div>
               <div class="flex-1">
                   <h3 class="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                       ${appendix.title}
                   </h3>
                   <div class="flex items-center justify-between">
                       <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                           <i data-lucide="code" class="w-3 h-3 mr-1"></i>
                           Técnico
                       </span>
                       <span class="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                           Ver
                           <i data-lucide="external-link" class="w-4 h-4 ml-1"></i>
                       </span>
                   </div>
               </div>
           </div>
       </div>
   `).join('');
}

// Funciones de navegación
function openChapter(url) {
   const fullUrl = `${CONFIG.originalSiteUrl}${url}`;
   window.open(fullUrl, '_blank');
   
   // Analytics (opcional)
   if (typeof gtag !== 'undefined') {
       gtag('event', 'chapter_open', {
           'chapter_url': url
       });
   }
}

function openAppendix(url) {
   const fullUrl = `${CONFIG.originalSiteUrl}${url}`;
   window.open(fullUrl, '_blank');
   
   // Analytics (opcional)
   if (typeof gtag !== 'undefined') {
       gtag('event', 'appendix_open', {
           'appendix_url': url
       });
   }
}

// Modo oscuro
function toggleDarkMode() {
   const body = document.body;
   const toggle = document.getElementById('darkModeToggle');
   const icon = toggle.querySelector('i');
   
   body.classList.toggle('dark');
   
   if (body.classList.contains('dark')) {
       icon.setAttribute('data-lucide', 'sun');
       localStorage.setItem('darkMode', 'true');
   } else {
       icon.setAttribute('data-lucide', 'moon');
       localStorage.setItem('darkMode', 'false');
   }
   
   lucide.createIcons();
}

// Inicializar modo oscuro desde localStorage
function initializeDarkMode() {
   const darkMode = localStorage.getItem('darkMode');
   if (darkMode === 'true') {
       document.body.classList.add('dark');
       const toggle = document.getElementById('darkModeToggle');
       const icon = toggle.querySelector('i');
       icon.setAttribute('data-lucide', 'sun');
       lucide.createIcons();
   }
}

// Scroll suave
function setupSmoothScroll() {
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', function (e) {
           e.preventDefault();
           const target = document.querySelector(this.getAttribute('href'));
           if (target) {
               target.scrollIntoView({
                   behavior: 'smooth',
                   block: 'start'
               });
           }
       });
   });
}

// Funciones de utilidad
function showLoading() {
   const spinner = document.getElementById('loadingSpinner');
   spinner.style.display = 'flex';
}

function hideLoading() {
   const spinner = document.getElementById('loadingSpinner');
   spinner.classList.add('fade-out');
   setTimeout(() => {
       spinner.style.display = 'none';
       spinner.classList.remove('fade-out');
   }, 300);
}

function showError(message) {
   hideLoading();
   const chaptersGrid = document.getElementById('chaptersGrid');
   const appendicesGrid = document.getElementById('appendicesGrid');
   
   const errorHTML = `
       <div class="error-state col-span-full">
           <i data-lucide="alert-circle" class="w-16 h-16 text-red-400 mx-auto mb-4"></i>
           <p class="text-lg font-medium text-gray-900 mb-2">¡Oops! Algo salió mal</p>
           <p class="text-gray-600 mb-4">${message}</p>
           <button onclick="location.reload()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
               Reintentar
           </button>
       </div>
   `;
   
   chaptersGrid.innerHTML = errorHTML;
   appendicesGrid.innerHTML = errorHTML;
   lucide.createIcons();
}

function updateCounters() {
   const chaptersCount = document.getElementById('chaptersCount');
   const appendicesCount = document.getElementById('appendicesCount');
   
   if (chaptersCount) chaptersCount.textContent = allChapters.length;
   if (appendicesCount) appendicesCount.textContent = `${allAppendices.length}+`;
}

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
       navigator.serviceWorker.register('sw.js')
           .then((registration) => {
               console.log('SW registered: ', registration);
           })
           .catch((registrationError) => {
               console.log('SW registration failed: ', registrationError);
           });
   });
}

// Inicializar modo oscuro al cargar
document.addEventListener('DOMContentLoaded', initializeDarkMode);