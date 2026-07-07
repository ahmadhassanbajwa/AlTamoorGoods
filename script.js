/**
 * Barq Cargo Website Functionality
 * Enterprise Edition - Supports Wizard, Dashboard, and Login
 */

document.addEventListener('DOMContentLoaded', () => {
    // Shared Logic
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initFormHandlers();
    initScrollAnimations();
    initCounters();

    // Page Specific Logic
    initTrackingWidget();
    initQuoteWizard();
    // Services Master-Detail
    initServices();
});

/* =========================================
   Shared Interactions
   ========================================= */

// ... (Mobile Menu, Sticky Header, Scroll, Animations, Counters Mocked from previous) ...

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    // Mobile Mega Menu Dropdown Toggle
    const megaToggles = document.querySelectorAll('.nav-item > a');
    megaToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { // Mobile check
                const menu = toggle.nextElementSibling;
                if (menu && menu.classList.contains('mega-menu-container')) {
                    e.preventDefault();
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                    menu.style.visibility = 'visible';
                    menu.style.opacity = '1';
                    menu.style.position = 'relative'; // Flow in document
                }
            }
        });
    });
}

function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                const el = document.querySelector(targetId);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText.replace('+', '');
            const inc = target / 200;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + '+';
            }
        };
        // Simple trigger on load for now, intersection observer ideal
        updateCount();
    });
}

/* =========================================
   Tracking Widget & Logic
   ========================================= */
function initTrackingWidget() {
    // Home Widget Tabs
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.widget-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            contents.forEach(c => c.style.display = 'none');
            document.getElementById(target).style.display = 'block';
        });
    });

    // Tracking Form Submit (Redirects to Tracking Page)
    const trackForm = document.getElementById('track-form');
    if (trackForm) {
        trackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('tracking-id').value;
            if (id) window.location.href = `tracking.html?id=${id}`;
        });
    }
}


/* =========================================
   Quote Wizard Logic
   ========================================= */
function initQuoteWizard() {
    const wizardForm = document.getElementById('wizard-form');
    if (!wizardForm) return;

    let currentStep = 1;
    const totalSteps = 4;
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');

    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
        // Show current
        document.getElementById(`step-${step}`).classList.add('active');

        // Update Progress
        document.querySelectorAll('.step-indicator').forEach(el => {
            const s = parseInt(el.getAttribute('data-step'));
            if (s <= step) el.classList.add('active');
            else el.classList.remove('active');
        });

        // Buttons
        if (step === 1) prevBtn.style.display = 'none';
        else prevBtn.style.display = 'inline-block';

        if (step === totalSteps - 1) { // Step 3
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else if (step === totalSteps) { // Step 4 (Success)
            document.querySelector('.wizard-footer').style.display = 'none';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    nextBtn.addEventListener('click', () => {
        // Simple validation check (can be expanded)
        const currentInputs = document.getElementById(`step-${currentStep}`).querySelectorAll('input[required]');
        let valid = true;
        currentInputs.forEach(input => {
            if (!input.value) {
                input.style.borderColor = 'red';
                valid = false;
            } else {
                input.style.borderColor = '#ddd';
            }
        });

        if (valid) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });

    // Wizard Form Submission (Restored for Vercel/Production)
    wizardForm.onsubmit = (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(wizardForm);

        // Disable captcha for cleaner UX (optional)
        // formData.append("_captcha", "false"); 
        // formData.append("_next", "https://your-site.vercel.app/thanks.html"); // If redirecting

        fetch("https://formsubmit.co/ajax/ahmadhassan59348@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
            .then(response => response.json())
            .then(data => {
                console.log("Success:", data);
                currentStep = 4;
                showStep(currentStep);
                wizardForm.reset();
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Something went wrong. Please try again or contact us directly.");
            })
            .finally(() => {
                submitBtn.innerText = 'Submit Request';
                submitBtn.disabled = false;
            });
    };
}

/* =========================================
   General Form Handlers
   ========================================= */
function initFormHandlers() {
    // Contact Form on Home
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleSimpleSubmit);
    }
}

function handleSimpleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sent!';
    btn.style.background = '#4caf50';
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = ''; // Reset to CSS default
        e.target.reset();
    }, 2000);
}

/**
 * SERVICES: State-Driven Master-Detail Implementation
 * Data is stored locally to ensure instant loading and zero-dependency.
 */
const servicesData = [
    {
        id: "air",
        title: "Air Freight",
        shortDescription: "Time-sensitive global solutions",
        fullDescription: "When speed is paramount, our Air Freight solutions usually deliver within 24-72 hours globally. We leverage strong carrier partnerships to secure capacity even during peak seasons.",
        features: [
            "Express & Standard Service",
            "Global Charter Flights",
            "Door-to-Door & Airport-to-Airport",
            "Dangerous Goods Handling"
        ],
        imageURL: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        icon: "fa-plane"
    },
    {
        id: "sea",
        title: "Sea Freight",
        shortDescription: "Cost-effective global shipping",
        fullDescription: "Flexible and reliable ocean transport for your global trade. From single pallets to manufacturing projects, we optimize routing and costs for your supply chain.",
        features: [
            "FCL (Full Container Load)",
            "LCL (Less than Container Load)",
            "Breakbulk & Project Cargo",
            "Port-to-Port & Door-to-Door"
        ],
        imageURL: "https://plus.unsplash.com/premium_photo-1661873588255-267a9261c03c?q=80&w=1045&auto=format&fit=crop",
        icon: "fa-ship"
    },
    {
        id: "road",
        title: "Road Transport",
        shortDescription: "Cross-border trucking excellence",
        fullDescription: "Connecting markets through our extensive road network. We offer reliable trucking services across Pakistan and cross-border solutions to Afghanistan, China, and Iran.",
        features: [
            "Domestic Distribution",
            "Cross-Border (AFG, CHN, IRN)",
            "FTL (Full Truck Load)",
            "LTL (Less than Truck Load)"
        ],
        imageURL: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        icon: "fa-truck-fast"
    },
    {
        id: "planning",
        title: "Planning",
        shortDescription: "Worry about environment according to latest industry standards",
        fullDescription: "Our planning department ensures your logistics operations are optimized while strictly adhering to the latest environmental and industry standards to minimize carbon footprint.",
        features: [
            "Environmental Compliance",
            "Route Optimization",
            "Carbon Footprint Analysis",
            "Strategic Supply Chain Design"
        ],
        imageURL: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        icon: "fa-clipboard-list"
    },
    {
        id: "list-delivery",
        title: "List Delivery",
        shortDescription: "Invest in our employees to provide better service and company growth",
        fullDescription: "By investing in our delivery personnel and utilizing advanced logistics strategies, we ensure every package is accounted for and delivered with exceptional service.",
        features: [
            "Employee Training Programs",
            "Dedicated Delivery Fleet",
            "Real-time Tracking Updates",
            "Customer Satisfaction Focus"
        ],
        imageURL: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        icon: "fa-list-check"
    },
    {
        id: "inventory",
        title: "Inventory",
        shortDescription: "Investing in technology to provide fast, accurate and cost-effective service",
        fullDescription: "We leverage cutting-edge technology to manage your inventory, ensuring accurate stock levels, fast processing times, and cost-effective warehousing solutions.",
        features: [
            "Advanced WMS Technology",
            "Real-time Stock Visibility",
            "Automated Replenishment",
            "Cost-effective Solutions"
        ],
        imageURL: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        icon: "fa-boxes-stacked"
    }
];

function initServices() {
    const menuContainer = document.getElementById('services-menu');
    const displayContainer = document.getElementById('service-display');

    if (!menuContainer || !displayContainer) return;

    // 1. Generate Menu Buttons
    menuContainer.innerHTML = servicesData.map((service, index) => `
        <button class="service-btn ${index === 0 ? 'active' : ''}" onclick="selectService(${index})">
            <i class="fa-solid ${service.icon}"></i>
            ${service.title}
        </button>
    `).join('');

    // 2. Initial Render
    renderService(0);
}

// Global function to be accessible by onclick
window.selectService = function (index) {
    // UI Updates
    const buttons = document.querySelectorAll('.service-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttons[index]) buttons[index].classList.add('active');

    renderService(index);
};

function renderService(index) {
    const data = servicesData[index];
    const displayContainer = document.getElementById('service-display');
    if (!data || !displayContainer) return;

    displayContainer.innerHTML = `
        <div class="service-content-wrapper">
            <div class="service-content-header" style="background-image: url('${data.imageURL}');">
                <div class="service-header-overlay"></div>
                <div class="service-header-text">
                    <h3>${data.title}</h3>
                    <p>${data.shortDescription}</p>
                </div>
            </div>
            <div class="service-body">
                <p>${data.fullDescription}</p>
                <ul class="feature-list">
                    ${data.features.map(feature => `
                        <li><i class="fa-solid fa-check-circle"></i> ${feature}</li>
                    `).join('')}
                </ul>
                <div style="margin-top:30px;">
                    <a href="quote.html" class="btn btn-primary">Request Rate for ${data.title}</a>
                </div>
            </div>
        </div>
    `;

    // Re-trigger animation
    displayContainer.style.animation = 'none';
    displayContainer.offsetHeight; /* trigger reflow */
    displayContainer.style.animation = 'fadeInContent 0.5s ease forwards';
}

/* =========================================
   Contact Office Tabs Logic
   ========================================= */
const officeData = {
    ravi: {
        name: "Ravi Road Office",
        address: "General Truck Stand, Ravi link road, Lahore",
        phone: "042-37723688",
        email: "ravi@altamoorgoods.com",
        hours: "Mon-Sat: 9:00 AM - 6:00 PM",
        lat: 31.5961955,
        lng: 74.3021160
    },
    gulberg: {
        name: "Gulberg Office",
        address: "79C, 4th floor, Hafeez centre, Gulberg 3 Lahore",
        phone: "024-37723588",
        email: "gulberg@altamoorgoods.com",
        hours: "Mon-Sat: 9:00 AM - 6:00 PM",
        lat: 31.5159977,
        lng: 74.3428656
    }
};

let map = null;
let currentMarker = null;

window.switchOffice = function (city) {
    // Update tabs
    document.querySelectorAll('.office-tab').forEach(tab => tab.classList.remove('active'));
    const activeTab = document.getElementById('tab-' + city);
    if (activeTab) activeTab.classList.add('active');

    // Update details
    const data = officeData[city];
    if (!data) return;

    document.getElementById('office-name').innerText = data.name;
    document.getElementById('office-address').innerText = data.address;
    document.getElementById('office-phone').innerText = data.phone;
    document.getElementById('office-email').innerText = data.email;
    document.getElementById('office-hours').innerText = data.hours;

    // Update map with Leaflet
    if (!map) {
        map = L.map('office-map').setView([data.lat, data.lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([data.lat, data.lng], 15);
    }


    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Custom office marker
    const customIcon = L.divIcon({
        html: '<div style="background-color: var(--color-primary); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white; font-size: 18px;"><i class="fa-solid fa-building"></i></div>',
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    currentMarker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(map);
};

// Initialize the map on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('office-map')) {
        switchOffice('ravi');
    }
    
    // Set current year in footer dynamically
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

/* =========================================
   ScrollSpy Navigation Logic
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        { id: 'services', navId: '#services' },
        { id: 'about-us', navId: '#about-us' },
        { id: 'core-values', navId: '#about-us' },
        { id: 'our-team', navId: '#about-us' },
        { id: 'ceo-message', navId: '#about-us' },
        { id: 'contact', navId: '#contact' }
    ];

    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentNavId = '';
        const scrollY = window.scrollY;

        sections.forEach(sec => {
            const sectionEl = document.getElementById(sec.id);
            if (sectionEl) {
                // Adjust offset to trigger slightly before the top reaches the top of the viewport
                const sectionTop = sectionEl.offsetTop - 150; 
                const sectionHeight = sectionEl.offsetHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentNavId = sec.navId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentNavId && link.getAttribute('href') === currentNavId) {
                link.classList.add('active');
            }
        });
    });
    
    // Trigger once on load
    window.dispatchEvent(new Event('scroll'));
});
