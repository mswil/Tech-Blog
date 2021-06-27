async function newFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const content = document.querySelector('textarea[name="content"]').value;

    if(!title) {
        alert('Please enter a title');
        return;
    }

    if(!content) {
        alert(`Please enter the post's content`)
    }

    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } 
    else if (response.status === 401) {
        window.location.href='/login';
    }
    else {
        alert(response.statusText);
    }
}

const createPostEl = document.querySelector('.create-post');

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
document.querySelector('#new-post-btn').addEventListener('click', () => createPostEl.classList.toggle('hidden'));
