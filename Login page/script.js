document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {
        alert('Please enter a valid email address.');
        return;
    }

    // If the email is valid, proceed with form submission
    alert('OTP requested successfully!');
    // You can add further actions here, such as sending the OTP request to the server
});
