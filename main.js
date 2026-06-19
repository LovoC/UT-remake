function showSection(sectionId, button) {

    let sections = document.querySelectorAll(".Section");

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.display = "none";
    });


    let selectedSection = document.getElementById(sectionId);

    if (selectedSection) {

        selectedSection.style.display = "block";

        setTimeout(() => {
            selectedSection.style.opacity = "1";
        }, 10);

    }


    // remove active from all buttons
    let buttons = document.querySelectorAll(".tab-button");

    buttons.forEach(btn => {
        btn.classList.remove("active");
    });


    // add active to clicked button
    if (button) {
        button.classList.add("active");
    }
}


showSection("overview", document.querySelector(".tab-button"));

let currentIndex = 0;
let autoRotateInterval;

function initCarousel() {
    const cards = document.querySelectorAll('.character-card');
    const dotsContainer = document.querySelector('.carousel-dots');

    for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }

    updateCarousel();
    startAutoRotate();

    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
}

function updateCarousel() {
    const cards = document.querySelectorAll('.character-card');
    const dots = document.querySelectorAll('.dot');
    const totalCards = cards.length;

    if (!cards.length) return;

    cards.forEach((card, index) => {
        const relativePos = getRelativePosition(index, currentIndex, totalCards);
        applyCardTransform(card, relativePos, index === currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function getRelativePosition(cardIndex, centerIndex, total) {
    let diff = cardIndex - centerIndex;

    if (diff > total / 2) {
        diff -= total;
    } else if (diff < -total / 2) {
        diff += total;
    }

    return diff;
}

function applyCardTransform(card, relativePos, isCenter) {
    const spacing = 280;
    const rotationAngle = 45;
    const depthOffset = 180;

    let translateX = relativePos * spacing;
    let translateZ = -Math.abs(relativePos) * depthOffset;
    let rotateY = relativePos * rotationAngle;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10;

    const description = card.querySelector('.character-description');

    if (isCenter) {
        scale = 1.35;
        translateZ = 50;
        rotateY = 0;
        opacity = 1;
        zIndex = 20;

        if (description) {
            description.style.opacity = '1';
            description.style.maxHeight = '150px';

            if (!description.scrollInterval) {
                description.scrollTop = 0;

                setTimeout(() => {
                    description.scrollInterval = setInterval(() => {
                        if (description.scrollTop < description.scrollHeight - description.clientHeight) {
                            description.scrollTop += 0.5;
                        } else {
                            description.scrollTop = 0;
                        }
                    }, 30);
                }, 700);
            }
        }
    } else {
        if (Math.abs(relativePos) === 1) {
            scale = 0.85;
            opacity = 0.85;
            zIndex = 15;
        } else if (Math.abs(relativePos) === 2) {
            scale = 0.7;
            opacity = 0.6;
            zIndex = 10;
        } else {
            scale = 0.5;
            opacity = 0.3;
            zIndex = 5;
        }

        if (description) {
            if (description.scrollInterval) {
                clearInterval(description.scrollInterval);
                description.scrollInterval = null;
            }
            description.scrollTop = 0;
            description.style.opacity = '0';
            description.style.maxHeight = '0';
        }
    }

    card.style.transform = `
        translate(-50%, -50%)
        translateX(${translateX}px)
        translateZ(${translateZ}px)
        rotateY(${rotateY}deg)
        scale(${scale})
    `;
    card.style.opacity = opacity;
    card.style.zIndex = zIndex;
}

function moveCarousel(direction) {
    const cards = document.querySelectorAll('.character-card');
    const totalCards = cards.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalCards - 1;
    } else if (currentIndex >= totalCards) {
        currentIndex = 0;
    }

    updateCarousel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

function startAutoRotate() {
    stopAutoRotate();
    autoRotateInterval = setInterval(() => {
        moveCarousel(1);
    }, 4000);
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
    }
}

window.addEventListener('load', initCarousel);
window.addEventListener('resize', updateCarousel);

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveCarousel(1);
    }
});

// Add smooth section transitions
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Add a subtle scale animation on click
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    });
});

// Add hover sound effect simulation (visual feedback)
document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.3)';
    });
    dot.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = 'scale(1)';
        }
    });
});

// Enhanced carousel interaction - swipe detection for touch devices
let touchStartX = 0;
let touchEndX = 0;

const carouselElement = document.querySelector('.carousel');

if (carouselElement) {
    carouselElement.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselElement.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - go to next
            moveCarousel(1);
        } else {
            // Swipe right - go to previous
            moveCarousel(-1);
        }
    }
}

// Add parallax effect to title on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const title = document.querySelector('.title');
    if (title) {
        title.style.transform = `translateY(${scrolled * 0.5}px)`;
        title.style.opacity = Math.max(0, 1 - scrolled / 400);
    }
});

// Animate sections when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, observerOptions);

// Add animation for sections
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Observe sections for animation
document.querySelectorAll('.Section').forEach(section => {
    sectionObserver.observe(section);
});

// Interactive feature cards for Overview section
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
        const wasExpanded = this.classList.contains('expanded');

        document.querySelectorAll('.feature-card').forEach(c => {
            c.classList.remove('expanded');
        });

        if (!wasExpanded) {
            this.classList.add('expanded');
        }
    });
});

// Toggle route cards for Gameplay section
function toggleRouteCard(card) {
    const wasExpanded = card.classList.contains('expanded');

    document.querySelectorAll('.route-card').forEach(c => {
        c.classList.remove('expanded');
    });

    if (!wasExpanded) {
        card.classList.add('expanded');
    }
}

// Toggle timeline items for Story section
function toggleTimelineItem(item) {
    const wasExpanded = item.classList.contains('expanded');

    document.querySelectorAll('.timeline-item').forEach(i => {
        i.classList.remove('expanded');
    });

    if (!wasExpanded) {
        item.classList.add('expanded');
    }
}