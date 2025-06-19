document.addEventListener('DOMContentLoaded', function () {
  const stars = document.querySelectorAll('.rating-stars i');
  const ratingInput = document.getElementById('rating');
  const feedbackForm = document.querySelector('.feedback-form');
  const submitBtn = feedbackForm.querySelector('.submit-feedback');

  // Accessibility: set ARIA roles on stars container
  const starsContainer = document.querySelector('.rating-stars');
  starsContainer.setAttribute('role', 'radiogroup');

  // Initialize stars with role and tabindex for accessibility
  stars.forEach((star, index) => {
    star.setAttribute('role', 'radio');
    star.setAttribute('tabindex', index === 0 ? '0' : '-1');
    star.setAttribute('aria-checked', 'false');
    star.setAttribute('aria-label', `${index + 1} star${index + 1 > 1 ? 's' : ''}`);
  });

  // Update stars display and aria-checked attributes
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
    ratingInput.value = rating;
  }

  // Clear hover styles
  function clearHover() {
    stars.forEach(star => star.classList.remove('hover'));
  }

  // Star event handlers
  stars.forEach((star, index) => {
    // Click selects rating
    star.addEventListener('click', () => {
      updateStars(index + 1);
    });

    // Keyboard support: space or enter selects rating
    star.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        updateStars(index + 1);
      }
      // Left and Up arrow move focus to previous star
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = index > 0 ? index - 1 : stars.length - 1;
        stars[prevIndex].focus();
      }
      // Right and Down arrow move focus to next star
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = index < stars.length - 1 ? index + 1 : 0;
        stars[nextIndex].focus();
      }
    });

    // Hover effects
    star.addEventListener('mouseover', () => {
      stars.forEach((s, i) => {
        if (i <= index) s.classList.add('hover');
        else s.classList.remove('hover');
      });
    });

    star.addEventListener('mouseout', clearHover);
  });

  // Form submission validation with basic email regex
  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const rating = ratingInput.value;
    const comments = document.getElementById('comments').value.trim();

    // Basic email regex (simple check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      alert('Please enter your name.');
      return;
    }
    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (rating === '0') {
      alert('Please provide a rating.');
      return;
    }
    if (!comments) {
      alert('Please enter your feedback.');
      return;
    }

    // Disable submit to prevent multiple submits
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Simulate server request with timeout (replace with real AJAX/fetch)
    setTimeout(() => {
      alert('Thank you for your feedback!');
      feedbackForm.reset();
      updateStars(0); // reset stars
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Feedback';
    }, 800);
  });
});
