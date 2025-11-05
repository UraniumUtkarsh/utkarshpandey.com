// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    let isUnlocked = false; // Flag to ensure unlock only happens once

    // --- Part 1: Gift Box Logic ---
    const giftScreen = document.getElementById('gift-screen');
    const mainContent = document.getElementById('main-content');
    const giftBox = document.getElementById('gift-box');

    giftBox.addEventListener('click', () => {
        // 1. Hide the gift screen
        giftScreen.style.display = 'none';

        // 2. Show the main content (which is just the header initially)
        mainContent.style.display = 'block';

        // 3. Start the age counter
        updateAgeCounter(); 
        setInterval(updateAgeCounter, 1000);
    });

    // --- Part 2: Carousel Logic ---
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let carouselInterval = null; // NEW: Variable to hold the interval timer

    function showSlide(n) {
        slides.forEach(slide => (slide.style.display = 'none'));
        
        if (n >= slides.length) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = n;
        }

        if (slides[currentSlide]) {
            slides[currentSlide].style.display = 'block';
        }
    }

    // NEW: Function to start or reset the autoplay timer
    function startCarousel() {
        // Clear any existing timer
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
        
        // Start a new timer
        carouselInterval = setInterval(() => {
            showSlide(currentSlide + 1); // Advance to the next slide
        }, 3000); // Set slide duration to 3 seconds (3000ms)
    }


    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            startCarousel(); // Reset timer on manual click
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            startCarousel(); // Reset timer on manual click
        });
    }
    // Show the first slide
    showSlide(currentSlide);
    // NEW: Start the carousel autoplay
    startCarousel();

    // --- Part 3: Video Modal Logic ---
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('modal-video');
    const closeBtn = document.querySelector('.modal-close');
    const friendCards = document.querySelectorAll('.friend-card');

    friendCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.getAttribute('data-video-src');
            if (videoSrc && videoPlayer) {
                videoPlayer.src = videoSrc;
                modal.style.display = 'block';
                videoPlayer.play();
            }
        });
    });

    function closeModal() {
        if (modal && videoPlayer) {
            modal.style.display = 'none';
            videoPlayer.pause();
            videoPlayer.src = ""; 
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Part 4: Age Counter Logic ---
    function updateAgeCounter() {
        // !! IMPORTANT: REPLACE THIS WITH HER ACTUAL BIRTH DATE AND TIME !!
        // Format: YYYY-MM-DDTHH:MM:SS (e.g., '2004-11-05T00:00:00')
        const birthDate = new Date('2004-11-05T00:00:00'); 
        const now = new Date();

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();
        let hours = now.getHours() - birthDate.getHours();
        let minutes = now.getMinutes() - birthDate.getMinutes();
        let seconds = now.getSeconds() - birthDate.getSeconds();

        // Handle "borrowing"
        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) { months += 12; years--; }

        // Update HTML
        const pad = (num) => (num < 10 ? '0' + num : num);
        document.getElementById('age-years') && (document.getElementById('age-years').innerText = years);
        document.getElementById('age-months') && (document.getElementById('age-months').innerText = pad(months));
        document.getElementById('age-days') && (document.getElementById('age-days').innerText = pad(days));
        document.getElementById('age-hours') && (document.getElementById('age-hours').innerText = pad(hours));
        document.getElementById('age-minutes') && (document.getElementById('age-minutes').innerText = pad(minutes));
        document.getElementById('age-seconds') && (document.getElementById('age-seconds').innerText = pad(seconds));

        // Unlock Logic
        if (years >= 21 && !isUnlocked) {
            isUnlocked = true; 
            
            const unlockedContent = document.getElementById('unlocked-content');
            if (unlockedContent) {
                unlockedContent.classList.remove('hidden');
                unlockedContent.style.animation = "fadeIn 1.5s ease-in forwards";
            }
            
            startConfetti(); 
        }
    }

    // --- Part 5: Confetti Logic ---
    function createConfetti() {
        const colors = ['#0077b6', '#a0c4ff', '#f7faff', '#ffc300', '#ff5733'];
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        const duration = (Math.random() * 3000 + 4000);
        const xDrift = (Math.random() * 200 - 100) + 'px';
        
        confetti.animate(
            [
                { transform: `translateY(-10vh) translateX(0) rotate(0)` },
                { transform: `translateY(110vh) translateX(${xDrift}) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ],
            { duration: duration, easing: 'linear', fill: 'forwards' }
        );

        document.body.appendChild(confetti);
        setTimeout(() => { confetti.remove(); }, duration + 500);
    }

    function startConfetti() {
        setInterval(createConfetti, 100);
    }

});