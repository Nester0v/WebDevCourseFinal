document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registration-form');
    const successBanner = document.getElementById('successBanner');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Validate form inputs
        const topic = document.getElementById('topic').value.trim();
        const message = document.getElementById('message').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const history = document.getElementById('history').value;
        const agree = document.getElementById('agree').checked;

        // Reset previous error classes
        resetErrors();

        // Validate and display errors
        if (topic === '') {
            displayError('topic', 'Please enter a topic.');
        }

        if (message === '') {
            displayError('message', 'Please enter a message.');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            displayError('email', 'Please enter a valid email.');
        }

        const phonePattern = /^\+[0-9]{12}$/;
        if (!phonePattern.test(phone)) {
            displayError('phone', 'Please enter a valid phone number (e.g., +380883426950).');
        }

        // If all validations pass, send the data via AJAX
        const formData = {
            topic: topic,
            message: message,
            email: email,
            phone: phone,
            history: history,
            agree: agree
        };

        fetch('http://localhost:3000/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log(data);

                // Show the success banner
                successBanner.style.display = 'block';

                // Automatically close the banner after 5 seconds
                setTimeout(function () {
                    successBanner.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    function displayError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        const errorLabel = document.createElement('span');
        errorLabel.classList.add('error-message');
        errorLabel.textContent = errorMessage;
        field.parentNode.appendChild(errorLabel);
    }

    function resetErrors() {
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            const errorLabel = field.parentNode.querySelector('.error-message');
            if (errorLabel) {
                field.parentNode.removeChild(errorLabel);
            }
        });
    }
});
