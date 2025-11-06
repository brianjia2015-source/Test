// Smooth scrolling for navigation links
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

// Login/Signup button handlers
document.getElementById('loginBtn')?.addEventListener('click', () => {
    alert('Login functionality coming soon! For now, join our Discord to get early access.');
});

document.getElementById('signupBtn')?.addEventListener('click', () => {
    alert('Sign up functionality coming soon! Join our Discord to be notified when registration opens.');
});

// Freelance marketplace search
const searchBar = document.getElementById('searchBar');
const categoryFilter = document.getElementById('categoryFilter');

function filterListings() {
    const searchTerm = searchBar?.value.toLowerCase() || '';
    const category = categoryFilter?.value || 'All Categories';
    const listings = document.querySelectorAll('.listing-card');
    
    listings.forEach(listing => {
        const text = listing.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm);
        const matchesCategory = category === 'All Categories' || text.includes(category.toLowerCase());
        
        if (matchesSearch && matchesCategory) {
            listing.style.display = 'block';
        } else {
            listing.style.display = 'none';
        }
    });
}

searchBar?.addEventListener('input', filterListings);
categoryFilter?.addEventListener('change', filterListings);

// Contact buttons in freelance section
document.querySelectorAll('.listing-card .btn-secondary').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.listing-card');
        const developer = card.querySelector('.developer-name').textContent;
        alert(`Contacting ${developer}...\n\nMessaging system coming soon! For now, connect via Discord.`);
    });
});

// Product view buttons
document.querySelectorAll('.product-card .btn-secondary').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const productName = card.querySelector('h3').textContent;
        alert(`Viewing details for: ${productName}\n\nProduct pages coming soon!`);
    });
});

// Open source package GitHub links
document.querySelectorAll('.package-card .btn-secondary').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.package-card');
        const packageName = card.querySelector('h3').textContent;
        alert(`Opening ${packageName} on GitHub...\n\nGitHub integration coming soon!`);
    });
});

// Course start buttons
document.querySelectorAll('.course-card .btn-primary').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.course-card');
        const courseName = card.querySelector('h3').textContent;
        alert(`Starting course: ${courseName}\n\nCourse platform coming soon!`);
    });
});

// Voting system
document.querySelector('.voting-section .btn-primary')?.addEventListener('click', () => {
    alert('Voting system coming soon!\n\nJoin our Discord to participate in package voting discussions.');
});

// Funding application
document.querySelectorAll('#funding .btn-primary, #funding .btn-large').forEach(button => {
    button.addEventListener('click', () => {
        alert('Funding application system coming soon!\n\nFor now, present your project in our Discord #funding channel.');
    });
});

// Post a job button
document.querySelector('#freelance .btn-primary')?.addEventListener('click', () => {
    alert('Job posting system coming soon!\n\nPost your requirements in our Discord #jobs channel.');
});

// Sell your product button
document.querySelector('#marketplace .btn-primary')?.addEventListener('click', () => {
    alert('Product listing system coming soon!\n\nShare your products in our Discord #marketplace channel.');
});

// Hero CTA buttons
document.querySelectorAll('.hero .btn-large').forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.textContent.includes('Discord')) {
            alert('Discord links coming soon!\n\nWe\'re preparing our community servers. Stay tuned!');
        } else {
            alert('Registration coming soon!\n\nJoin our Discord to be notified when we launch.');
        }
    });
});

// Featured game play button
document.querySelector('.game-banner .btn-primary')?.addEventListener('click', () => {
    alert('🎮 CATS Arena Reborn - Coming Soon!\n\nAssemble your battle car with up to 3 enchantments:\n\n• Lifesteal - Heal on damage\n• Fire Aspect - Burn enemies\n• Damage Boost - Increase attack power\n• And more!\n\nJoin our Discord to get early access!');
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Add animation on scroll for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.listing-card, .product-card, .package-card, .course-card, .info-card, .term-card, .principle-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
});

// Dynamic stats counter animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const stat = entry.target;
            stat.classList.add('animated');
            
            // You can customize these values
            if (stat.textContent.includes('%')) {
                animateValue(stat, 0, parseFloat(stat.textContent), 1000);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat h3').forEach(stat => {
    statsObserver.observe(stat);
});

// Add loading states to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        const originalText = this.textContent;
        
        // Don't show loading for navigation
        if (this.id === 'loginBtn' || this.id === 'signupBtn') {
            return;
        }
        
        this.disabled = true;
        this.textContent = 'Processing...';
        
        setTimeout(() => {
            this.disabled = false;
            this.textContent = originalText;
        }, 1000);
    });
});

// Simulated live data for featured game
function updateGameStats() {
    const playersOnline = Math.floor(Math.random() * 1000) + 500;
    const dailyMatches = Math.floor(Math.random() * 5000) + 10000;
    
    // You can add these elements to display live stats
    console.log(`Players Online: ${playersOnline}`);
    console.log(`Daily Matches: ${dailyMatches}`);
}

// Update game stats every 30 seconds
setInterval(updateGameStats, 30000);

// Console welcome message
console.log('%c🎮 DevArena Developer Platform', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cBuilt by developers, for developers', 'color: #8b5cf6; font-size: 14px;');
console.log('%cInterested in contributing? Join our Discord!', 'color: #cbd5e1; font-size: 12px;');

// Analytics placeholder (for future integration)
function trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    // Future: Google Analytics, Mixpanel, etc.
}

// Track button clicks
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('click', (e) => {
        const text = e.target.textContent.trim();
        trackEvent('Engagement', 'Click', text);
    });
});

// Form validation placeholder (for future forms)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        alert('🎮 CHEAT CODE ACTIVATED!\n\nYou found the secret! Join our Discord with code: KONAMI_DEV for a special role!');
        konamiCode = [];
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DevArena Platform initialized');
    
    // Add subtle parallax effect to hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
});

// Notification system (placeholder for future)
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Future: Toast notifications
}

// Admin dashboard access (placeholder)
let adminClicks = 0;
document.querySelector('.nav-brand')?.addEventListener('click', () => {
    adminClicks++;
    if (adminClicks === 5) {
        alert('🔐 Admin Access\n\nAdmin dashboard coming soon!\nFor now, admin functions are managed via Discord.');
        adminClicks = 0;
    }
});
