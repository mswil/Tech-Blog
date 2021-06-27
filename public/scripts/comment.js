async function commentFormHandler(event) {
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    if (!comment_text) {
        alert('Comment is empty');
        return;
    }

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
            post_id,
            comment_text
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } 
    else if (response.status === 401) {
        window.location.href='/login';
    }
    else {
        alert(response.statusText);
    }

}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);
