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
            
            // Initialize projects page functionality
            setupProjectsPage();
            
            // Initialize contact form if present
            setupContactForm();
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
    // Robust mobile menu: reliable selector, remove inline onclick, close on link click/outside click
    const mobileMenuButton = document.querySelector('button[onclick*="mobile-menu"]') ||
                             document.querySelector('button.md\\:hidden.text-energy-blue') ||
                             document.querySelector('button[class*="md:hidden"]');
    const mobileMenu = document.getElementById('mobile-menu');

    console.log('Mobile menu elements:', { mobileMenuButton, mobileMenu });

    if (!mobileMenuButton || !mobileMenu) {
        console.error('Mobile menu elements not found:', { mobileMenuButton, mobileMenu });
        return;
    }

    // Remove any inline onclick handlers to avoid duplicate toggles
    if (mobileMenuButton.getAttribute && mobileMenuButton.getAttribute('onclick')) {
        mobileMenuButton.removeAttribute('onclick');
    }

    const setIconBars = () => {
        const icon = mobileMenuButton.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
    };

    const setIconTimes = () => {
        const icon = mobileMenuButton.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-times';
    };

    mobileMenuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) setIconBars(); else setIconTimes();
    });

    // Close mobile menu when any link inside it is clicked (delegation)
    mobileMenu.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (link) {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                setIconBars();
            }
        }
    });

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && event.target !== mobileMenuButton) {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                setIconBars();
            }
        }
    });

    console.log('Mobile menu functionality initialized');
}

// ========== SMOOTH SCROLLING ==========
function setupSmoothScrolling() {
    document.addEventListener('click', function(event) {
        // Check if clicked element is an anchor link
        const target = event.target;
        const link = target.closest('a[href^="#"]');
        
        if (link) {
            event.preventDefault();
            
            const targetId = link.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        
                        // Reset menu icon
                        const menuButton = document.querySelector('button.md\\:hidden.text-energy-blue');
                        if (menuButton) {
                            const icon = menuButton.querySelector('i');
                            if (icon) {
                                icon.className = 'fa-solid fa-bars';
                            }
                        }
                    }
                }
            }
        }
    });
}

// ========== PROJECTS PAGE FUNCTIONALITY ==========
function setupProjectsPage() {
    // Projects toggle for mobile
    const projectsToggle = document.getElementById('projectsToggle');
    const projectsGrid = document.getElementById('projectsGrid');
    const toggleText = document.getElementById('toggleText');
    const toggleIcon = document.getElementById('toggleIcon');
    const mobileProjectsMessage = document.getElementById('mobileProjectsMessage');
    
    if (projectsToggle && projectsGrid) {
        projectsToggle.addEventListener('click', function() {
            const isHidden = projectsGrid.classList.contains('hidden');
            
            if (isHidden) {
                // Show projects
                projectsGrid.classList.remove('hidden');
                projectsGrid.classList.add('block');
                if (mobileProjectsMessage) {
                    mobileProjectsMessage.classList.add('hidden');
                }
                if (toggleText) {
                    toggleText.textContent = 'Hide Projects';
                }
                if (toggleIcon) {
                    toggleIcon.className = 'fa-solid fa-chevron-up ml-2';
                }
            } else {
                // Hide projects
                projectsGrid.classList.add('hidden');
                projectsGrid.classList.remove('block');
                if (mobileProjectsMessage) {
                    mobileProjectsMessage.classList.remove('hidden');
                }
                if (toggleText) {
                    toggleText.textContent = 'Show Projects';
                }
                if (toggleIcon) {
                    toggleIcon.className = 'fa-solid fa-chevron-down ml-2';
                }
            }
        });
    }
    
    // Add smooth scrolling for contact links in projects page
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const headerOffset = 80;
                const elementPosition = contactSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== CONTACT FORM FUNCTIONALITY ==========
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = form.querySelector('#btnText');
            const loadingSpinner = form.querySelector('#loadingSpinner');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            
            // Hide messages
            if (successMessage) successMessage.classList.add('hidden');
            if (errorMessage) errorMessage.classList.add('hidden');
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    field.classList.remove('focus:border-energy-blue');
                } else {
                    field.classList.remove('border-red-500');
                    field.classList.add('focus:border-energy-blue');
                }
            });
            
            if (!isValid) {
                if (errorText) errorText.textContent = 'Please fill in all required fields.';
                if (errorMessage) errorMessage.classList.remove('hidden');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (loadingSpinner) loadingSpinner.classList.remove('hidden');
            
            try {
                // Send form data to Formspree
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    if (successMessage) successMessage.classList.remove('hidden');
                    form.reset();
                } else {
                    // Error from Formspree
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Network or other error
                if (errorText) errorText.textContent = 'There was an error sending your message. Please try again.';
                if (errorMessage) errorMessage.classList.remove('hidden');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (loadingSpinner) loadingSpinner.classList.add('hidden');
            }
        });
        
        // Remove red border when user starts typing
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('border-red-500');
                    this.classList.add('focus:border-energy-blue');
                }
            });
        });
    }
}

// ========== CLIENT PORTAL MODAL FUNCTIONS ==========
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

// ========== READ MORE TOGGLE FUNCTIONS ==========
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

// ========== INITIALIZATION ==========
// Initialize everything when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing GeoSpring GeoSystems website...');
    
    // Load all content as single page
    loadSinglePageContent().then(() => {
        console.log('Website initialization complete!');
    });
});