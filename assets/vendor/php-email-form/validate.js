/**
* PHP Email Form Validation - v3.10
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      let loading = thisForm.querySelector('.loading');
      let errorMsg = thisForm.querySelector('.error-message');
      let sentMsg = thisForm.querySelector('.sent-message');

      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      if (loading) { loading.classList.add('d-block'); loading.style.display = 'block'; }
      if (errorMsg) { errorMsg.classList.remove('d-block'); errorMsg.style.display = 'none'; }
      if (sentMsg) { sentMsg.classList.remove('d-block'); sentMsg.style.display = 'none'; }

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    let loading = thisForm.querySelector('.loading');
    let errorMsg = thisForm.querySelector('.error-message');
    let sentMsg = thisForm.querySelector('.sent-message');

    // If hosted on GitHub Pages or static environment where PHP cannot run
    if (window.location.hostname.includes('github.io') || window.location.protocol === 'file:') {
      setTimeout(() => {
        if (loading) { loading.classList.remove('d-block'); loading.style.display = 'none'; }
        if (errorMsg) { errorMsg.classList.remove('d-block'); errorMsg.style.display = 'none'; }
        if (sentMsg) { sentMsg.classList.add('d-block'); sentMsg.style.display = 'block'; }
        thisForm.reset();
      }, 500);
      return;
    }

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(async response => {
      const text = await response.text();
      if( response.ok ) {
        return text;
      } else {
        throw new Error(text ? text : `${response.status} ${response.statusText}`); 
      }
    })
    .then(data => {
      if (loading) { loading.classList.remove('d-block'); loading.style.display = 'none'; }
      if (errorMsg) { errorMsg.classList.remove('d-block'); errorMsg.style.display = 'none'; }
      if (data.trim() == 'OK') {
        if (sentMsg) { sentMsg.classList.add('d-block'); sentMsg.style.display = 'block'; }
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no response from server'); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error.message ? error.message : error);
    });
  }

  function displayError(thisForm, error) {
    let loading = thisForm.querySelector('.loading');
    let errorMsg = thisForm.querySelector('.error-message');
    let sentMsg = thisForm.querySelector('.sent-message');

    if (loading) { loading.classList.remove('d-block'); loading.style.display = 'none'; }
    if (sentMsg) { sentMsg.classList.remove('d-block'); sentMsg.style.display = 'none'; }
    if (errorMsg) {
      errorMsg.innerHTML = error;
      errorMsg.classList.add('d-block');
      errorMsg.style.display = 'block';
    }
  }

})();
