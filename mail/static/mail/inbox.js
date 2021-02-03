document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', submit_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function submit_email(event) {
  event.preventDefault()

  fetch('/emails' , {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result)
  });

  load_mailbox('sent');
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name & clear previous child elements
  const email_view = document.querySelector('#emails-view')
  email_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // const ul = document.createElement('ul')
  // ul.className = "list-group"
  // email_view.appendChild(ul)

  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
    // Generate HTML for each email
    emails.forEach(email => {
        let div = document.createElement('div');
        div.className = email['read'] ? "email-list-item-read" : "email-list-item-unread"
        div.innerHTML = `
            <span class="sender col-3">
              <b>${email['sender']}</b>
            </span>
            <span class="subject col-6">
              ${email['subject']}
            </span>
            <span class="timestamp col-3">
              ${email['timestamp']}
            </span>
        `;
        email_view.appendChild(div);
    });

  })
}
