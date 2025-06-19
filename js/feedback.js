document.addEventListener('DOMContentLoaded', function() {
  const stars = document.querySelectorAll('.rating-stars i');
  const ratingInput = document.getElementById('rating');
  const feedbackForm = document.querySelector('.feedback-form');
  const formStatus = document.getElementById('form-status');

  // Helper to update stars visuals and aria-checked
  function updateStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas');
        star.setAttribute('aria-checked', 'true');
        star.tabIndex = 0;
      } else {
        star.classList.remove('fas');
        star.classList.add('far');
        star.setAttribute('aria-checked', 'false');
        star.tabIndex = -1;
      }
    });
  }

  // Initialize rating stars
  updateStars(0);

  // Star rating click and keyboard handling
  stars.forEach((star, index) => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      ratingInput.value = rating;
      updateStars(rating);
      formStatus.textContent = `Rating set to ${rating} star${rating > 1 ? 's' : ''}`;
    });

    star.addEventListener('mouseover', function() {
      const hoverRating = parseInt(this.getAttribute('data-rating'));
      stars.forEach((s, i) => {
        if (i < hoverRating) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
    });

    star.addEventListener('mouseout', function() {
      stars.forEach(s => s.classList.remove('hover'));
    });

    // Keyboard navigation for stars (left/right arrows)
    star.addEventListener('keydown', function(e) {
      let newIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % stars.length;
        stars[newIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + stars.length) % stars.length;
        stars[newIndex].focus();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Form submission
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const rating = ratingInput.value;
    const comments = document.getElementById('comments').value.trim();

    if (!name || !email || rating === '0' || !comments) {
      formStatus.textContent = 'Please fill out all required fields.';
      formStatus.style.color = 'red';
      return;
    }

    // Simulate sending data
    console.log('Feedback submitted:', { name, email, rating, comments });

    // Success message
    formStatus.textContent = 'Thank you for your feedback!';
    formStatus.style.color = 'green';

    feedbackForm.reset();
    updateStars(0);

    // Move focus back to the name input for better UX
    document.getElementById('name').focus();
  });
});
