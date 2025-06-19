document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('rating');
    const feedbackForm = document.querySelector('.feedback-form');
    
    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
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
    });
    
    // Form submission
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const rating = ratingInput.value;
        const comments = document.getElementById('comments').value.trim();
        
        if (!name || !email || rating === '0' || !comments) {
            alert('Please fill out all fields');
            return;
        }
        
        // Here you would typically send the data to a server
        console.log('Feedback submitted:', { name, email, rating, comments });
        
        // Show thank you message
        alert('Thank you for your feedback!');
        feedbackForm.reset();
        
        // Reset stars
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
        ratingInput.value = '0';
    });
});
