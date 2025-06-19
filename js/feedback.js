document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('rating');
    const feedbackForm = document.getElementById('feedback-form');
    const thankYouPopup = document.getElementById('thank-you-popup');
    const closePopupBtn = document.getElementById('close-popup');

    let selectedRating = 0;

    // Star rating logic
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            ratingInput.value = selectedRating;

            stars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });

        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.getAttribute('data-rating'));
            stars.forEach((s, i) => {
                s.classList.toggle('hover', i < hoverRating);
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });

    // Form submission
    feedbackForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const comments = document.getElementById('comments').value.trim();
        const rating = parseInt
