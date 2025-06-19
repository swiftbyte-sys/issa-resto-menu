document.addEventListener('DOMContentLoaded', function () {
  const stars = document.querySelectorAll('.rating-stars i');
  const ratingInput = document.getElementById('rating');
  const form = document.getElementById('feedback-form');
  const thankYouPopup = document.getElementById('thank-you-popup');
  const closePopupBtn = document.getElementById('close-popup');

  // Star rating selection
  stars.forEach(star => {
    star.addEventListener('click', function () {
      const rating = parseInt(this.getAttribute('data-rating'));
      ratingInput.value = rating;

      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('fas');
          s.classList.remove('far');
        } else {
          s.classList.add('far');
          s.classList.remove('fas');
        }
      });
    });
  });

  // Handle form submit
  form.addEventListener('submit', function (e) {
    if (ratingInput.value === '0') {
      e.preventDefault();
      alert('Please select a star rating before submitting.');
      return;
    }

    // Intercept Formspree submission
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          form.reset();
          stars.forEach(s => {
            s.classList.remove('fas');
            s.classList.add('far');
          });
          ratingInput.value = '0';
          thankYouPopup.classList.remove('hidden');
        } else {
          response.json().then(data => {
            alert(data.errors?.[0]?.message || 'Submission failed.');
          });
        }
      })
      .catch(() => alert('There was a problem submitting the form.'));
  });

  // Close popup
  closePopupBtn.addEventListener('click', function () {
    thankYouPopup.classList.add('hidden');
  });
});
