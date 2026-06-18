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
        scale = 1.3;
        translateZ = 50;
        rotateY = 0;
        opacity = 1;
        zIndex = 20;

        if (description) {
            description.style.opacity = '1';
            description.style.maxHeight = '100px';
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