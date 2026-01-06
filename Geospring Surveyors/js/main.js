// ========== SINGLE PAGE CONTENT LOADER ==========
// Load all sections and combine them into one continuous page
async function loadSinglePageContent() {
    try {
        console.log('Loading single page content...');
        
        // Array of all section IDs and their files
        const sections = [
            { id: 'home', file: 'home.html' },
            { id: 'about', file: 'about.html' },
            { id: 'services', file: 'services.html' },
            { id: 'projects', file: 'projects.html' },
            { id: 'resources', file: 'resources.html' },
            { id: 'contact', file: 'contact.html' }
        ];
        
        let combinedHTML = '';
        
        // Load content for each section and combine
        for (const section of sections) {
            console.log(`Loading section: ${section.file}`);
            
            const response = await fetch(`sections/${section.file}`);
            
            if (response.ok) {
                const content = await response.text();
                // Wrap each section's content in its respective section tag
                combinedHTML += `<section id="${section.id}" class="scroll-smooth">${content}</section>`;
            } else {
                console.error(`Failed to load ${section.file}: ${response.status}`);
                combinedHTML += `<section id="${section.id}" class="scroll-smooth"><div class="container mx-auto px-4 py-16"><p>Content loading failed for ${section.id}</p></div></section>`;
            }
        }
        
        // Load footer separately
        const footerResponse = await fetch('sections/footer.html');
        if (footerResponse.ok) {
            const footerContent = await footerResponse.text();
            combinedHTML += `<footer class="bg-energy-blue pt-16 pb-8 text-white relative pattern-overlay mt-auto">${footerContent}</footer>`;
        }
        
        // Insert all content into the main area
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.innerHTML = combinedHTML;
            console.log('All sections loaded successfully!');
            
            // REINITIALIZE ALL FUNCTIONALITY AFTER CONTENT LOADS
            setupNavigationHighlighting();
            setupMobileMenu();
            setupSmoothScrolling();
            setupEquipmentSlideshow(); // ← ADDED: Equipment slideshow
        } else {
            // Fallback: insert after navigation
            const nav = document.querySelector('nav');
            if (nav) {
                nav.insertAdjacentHTML('afterend', combinedHTML);
            }
        }
        
    } catch (error) {
        console.error('Error loading page content:', error);
        // Show error message
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.innerHTML = `
                <section class="py-16">
                    <div class="container mx-auto px-4 text-center">
                        <h2 class="text-2xl text-red-600">Error loading content</h2>
                        <p class="text-gray-600 mt-4">Please check your internet connection and try again.</p>
                    </div>
                </section>
            `;
        }
    }
}

// ========== NAVIGATION HIGHLIGHTING ==========
// Highlight active navigation link based on scroll position
function setupNavigationHighlighting() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // If scrolled past this section (with offset for fixed header)
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ========== MOBILE MENU FUNCTIONALITY ==========
function setupMobileMenu() {
    // Close mobile menu when a link is clicked
     const mobileMenuButton = document.querySelector('button[onclick*="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');
    
    console.log('Mobile menu elements:', { mobileMenuButton, mobileMenu });
    
    if (mobileMenuButton && mobileMenu) {
        // Remove the inline onclick and use event listener instead
        mobileMenuButton.removeAttribute('onclick');
        
        mobileMenuButton.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('Mobile menu button clicked');
            mobileMenu.classList.toggle('hidden');
            
            // Change icon based on menu state
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fa-solid fa-bars';
            } else {
                icon.className = 'fa-solid fa-times';
            }
        });
        
        // Close mobile menu when a link is clicked
        mobileMenu.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                console.log('Mobile menu link clicked, closing menu');
                mobileMenu.classList.add('hidden');
                
                // Reset icon to bars
                const icon = mobileMenuButton.querySelector('i');
                icon.className = 'fa-solid fa-bars';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileMenu && !mobileMenu.contains(event.target) && event.target !== mobileMenuButton) {
                mobileMenu.classList.add('hidden');
                
                // Reset icon to bars
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
        
        console.log('Mobile menu functionality initialized');
    } else {
        console.error('Mobile menu elements not found:', {
            button: mobileMenuButton,
            menu: mobileMenu
        });
    }
}

// ========== SMOOTH SCROLLING ==========
function setupSmoothScrolling() {
    document.addEventListener('click', function(event) {
        // Check if clicked element is an anchor link
        if (event.target.matches('a[href^="#"]') || event.target.closest('a[href^="#"]')) {
            event.preventDefault();
            
            const targetId = event.target.getAttribute('href') || 
                            event.target.closest('a[href^="#"]').getAttribute('href');
            
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
}

// ========== CLIENT PORTAL MODAL FUNCTIONS ========== // ← ADDED
function showComingSoon() {
    console.log('Client Portal button clicked!');
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('comingSoonModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ========== MOBILE-FRIENDLY EQUIPMENT SLIDESHOW ==========
function setupEquipmentSlideshow() {
    console.log('🔄 Setting up equipment slideshow...');
    
    const slides = document.querySelectorAll('.equipment-slide');
    const dots = document.querySelectorAll('.equipment-dot');
    const pauseBtn = document.querySelector('.equipment-pause');
    
    console.log('Found:', {
        slides: slides.length,
        dots: dots.length,
        pauseBtn: !!pauseBtn
    });
    
    // Exit if no slides found
    if (slides.length === 0) {
        console.log('❌ No equipment slides found');
        return;
    }
    
    let currentSlide = 0;
    let isPlaying = true;
    let slideInterval;
    
    function showSlide(index) {
        console.log('🖼️ Showing slide:', index);
        
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.add('opacity-0');
            slide.classList.remove('opacity-100');
        });
        
        // Remove active state from all dots
        dots.forEach(dot => {
            dot.classList.add('opacity-50');
            dot.classList.remove('opacity-100');
        });
        
        // Show current slide
        slides[index].classList.remove('opacity-0');
        slides[index].classList.add('opacity-100');
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.remove('opacity-50');
            dots[index].classList.add('opacity-100');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        let nextSlideIndex = (currentSlide + 1) % slides.length;
        showSlide(nextSlideIndex);
    }
    
    function startSlideshow() {
        console.log('▶️ Starting slideshow interval');
        clearInterval(slideInterval); // Clear any existing interval
        
        slideInterval = setInterval(() => {
            if (isPlaying) {
                nextSlide();
            }
        }, 3000); // Change slide every 3 seconds
    }
    
    function togglePause() {
        isPlaying = !isPlaying;
        console.log('⏸️ Pause state:', isPlaying);
        if (pauseBtn) {
            pauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
        }
        
        if (isPlaying) {
            startSlideshow();
        } else {
            clearInterval(slideInterval);
        }
    }
    
    // Initialize the slideshow
    showSlide(0); // Show first slide immediately
    startSlideshow(); // Start auto-advancing
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log('🔘 Dot clicked:', index);
            showSlide(index);
            // Reset timer when user interacts
            clearInterval(slideInterval);
            startSlideshow();
        });
    });
    
    // Pause/play button
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }
    
    console.log('✅ Equipment slideshow initialized with', slides.length, 'slides');
}

// ========== READ MORE TOGGLE FUNCTION ==========
function toggleReadMore(button) {
    const content = button.previousElementSibling;
    const icon = button.querySelector('i');
    
    if (content.classList.contains('hidden')) {
        // Show content
        content.classList.remove('hidden');
        button.innerHTML = 'Read Less <i class="fa-solid fa-arrow-up ml-1"></i>';
    } else {
        // Hide content
        content.classList.add('hidden');
        button.innerHTML = 'Read More <i class="fa-solid fa-arrow-down ml-1"></i>';
    }
}
function toggleEquipmentInfo(button) {
    const content = button.nextElementSibling;

    if (!content) return;

    content.classList.toggle('hidden');

    // Change icon direction
    const icon = button.querySelector('i');
    if (content.classList.contains('hidden')) {
        button.innerHTML = `View Equipment List <i class="fa-solid fa-arrow-down ml-1"></i>`;
    } else {
        button.innerHTML = `Hide Equipment List <i class="fa-solid fa-arrow-up ml-1"></i>`;
    }
}

// Re-initialize navigation when new content is loaded (for dynamic updates)
function reinitializeNavigation() {
    setupNavigationHighlighting();
    setupSmoothScrolling();
}


// ========== INITIALIZATION ==========
// Initialize everything when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Kiyooto Surveyors website...');
    
    // Load all content as single page
    loadSinglePageContent().then(() => {
        console.log('Website initialization complete!');
    });
});