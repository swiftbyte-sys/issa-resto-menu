document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('rating');
    const feedbackForm = document.querySelector('.feedback-form');
    const statusMessage = document.getElementById('form-status');

    // Utility to update ARIA attributes on stars
    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.setAttribute('aria-checked', 'true');
                star.setAttribute('tabindex', '0');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.setAttribute('aria-checked', 'false');
                star.setAttribute('tabindex', '-1');
            }
        });
    }

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            updateStars(rating);
            statusMessage.textContent = `You rated ${rating} star${rating > 1 ? 's' : ''}.`;
        });

        star.addEventListener('mouseover', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < hoverRating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });

        star.addEventListener('mouseout', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });

        // Keyboard support for stars
        star.addEventListener('keydown', function(e) {
            const currentRating = parseInt(ratingInput.value) || 0;
            let newRating;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowUp':
                    e.preventDefault();
                    newRating = Math.min(currentRating + 1, stars.length);
                    ratingInput.value = newRating;
                    updateStars(newRating);
                    stars[newRating - 1].focus();
                    statusMessage.textContent = `You rated ${newRating} star${newRating > 1 ? 's' : ''}.`;
                    break;
                case 'ArrowLeft':
                case 'ArrowDown':
                    e.preventDefault();
                    newRating = Math.max(currentRating - 1, 1);
                    ratingInput.value = newRating;
                    updateStars(newRating);
                    stars[newRating - 1].focus();
                    statusMessage.textContent = `You rated ${newRating} star${newRating > 1 ? 's' : ''}.`;
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    const rating = parseInt(this.getAttribute('data-rating'));
                    ratingInput.value = rating;
                    updateStars(rating);
                    statusMessage.textContent = `You rated ${rating} star${rating > 1 ? 's' : ''}.`;
                    break;
            }
        });
    });

    // Initialize stars with zero rating
    updateStars(0);

    // Form submission
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const rating = ratingInput.value;
        const comments = document.getElementById('comments').value.trim();

        if (!name || !email || rating === '0' || !comments) {
            statusMessage.textContent = 'Please fill out all fields.';
            statusMessage.focus();
            return;
        }

        // Here you would typically send the data to a server
        console.log('Feedback submitted:', { name, email, rating, comments });

        statusMessage.textContent = 'Thank you for your feedback!';

        feedbackForm.reset();
        updateStars(0);
        ratingInput.value = '0';
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('rating');
    const feedbackForm = document.querySelector('.feedback-form');

    // Handle star rating selection
    stars.forEach((star, index) => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;

            stars.forEach((s, i) => {
                s.classList.toggle('fas', i < rating);
                s.classList.toggle('far', i >= rating);
            });
        });

        star.addEventListener('mouseover', function () {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, i) => s.classList.toggle('hover', i < hoverRating));
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });

    // Form submission handler
    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const rating = ratingInput.value;
        const comments = document.getElementById('comments').value.trim();

        if (!name || !email || rating === '0' || !comments) {
            alert('Please fill out all fields and select a rating.');
            return;
        }

        // Show thank you popup
        alert('✅ Thank you for your feedback!');

        // Reset form and stars
        feedbackForm.reset();
        ratingInput.value = '0';
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
    });
});
