const root = document.documentElement;
var btnToTop;

function calcHeight() {
    let iframe = document.querySelector('iframe');
    let iframeHeight = iframe?.contentWindow.document.body.scrollHeight;
    if (iframeHeight !== undefined) {
        iframe.height = iframeHeight + 33;
    }
}

function textBoxBehaviorChange(e) {
    if (e.key === 'Tab') {
        // https://stackoverflow.com/a/6637396
        e.preventDefault();
        let start = e.target.selectionStart;
        let end = e.target.selectionEnd;
        e.target.value = `${e.target.value.substring(0, start)}    ${e.target.value.substring(end)}`;
        e.target.selectionStart = e.target.selectionEnd = start + 4;
    }
}

function showReplyForm(elementId) {
    if (lastEdit !== '') {
        editingSnippetComment(lastEdit);
    }
    let elem = document.getElementById(elementId);
    let formLoc = elem.querySelector('.snippetcomment-reply-div');
    if (formLoc.childNodes.length > 0) {
        let card = formLoc.querySelector('#reply-card');
        card = formLoc.removeChild(card);
        card.querySelector('#id_code').value = '';
        card.querySelector('#id_comment-id').value = '0';
        document.getElementById('hidden-c-form').appendChild(card);
        card.querySelector('#btn-cancel-reply').removeAttribute('onclick');
        lastReply = '';
    } else {
        let card = document.getElementById('reply-card');
        card = card.parentNode.removeChild(card);
        card.querySelector('#id_comment-id').value = elem.id.split('comment-')[1] ?? elem.dataset.commentId;
        let code = card.querySelector('#id_code');
        code.value = elem.dataset.replyTo !== undefined ? elem.dataset.replyTo + '\n' : '';
        formLoc.appendChild(card);
        code.focus();
        card.querySelector('button[type="submit"]').scrollIntoView({behavior: 'smooth'});
        card.querySelector('#btn-cancel-reply').onclick = () => showReplyForm(elementId);
        lastReply = elementId;
    }
}

function cardClickHandler(e) {
    if (e.target.classList.contains('footer-btn')) { return; }
    document.location.href = e.currentTarget.dataset.snippetUrl;
}

function copyCodeToClipboard(obj) {
    let code = obj.dataset.code;
    if (!navigator.clipboard || !window.isSecureContext) {
        window.alert('Kopiointi epäonnistui.')
        return;
    }
    console.log(obj);
    navigator.clipboard.writeText(code);
    let iElem = obj.firstElementChild;
    iElem.classList.toggle('copy-code-animated');
    setTimeout(() => {
        iElem.classList.toggle('copy-code-animated');
        obj.classList.toggle('btn-copied');
    }, 1250);
    obj.classList.toggle('btn-copied');
}

function editingSnippetComment(elementId) {
    if (lastReply !== '') {
        showReplyForm(lastReply);
    }
    let elem = document.getElementById(elementId);
    let formLoc = elem.querySelector('.snippetcomment-edit');
    if (formLoc.childNodes.length > 0) {
        let form = formLoc.querySelector('#snippetcomment-u-form');
        form = formLoc.removeChild(form);
        form.querySelector('#id_code').value = '';
        form.querySelector('#id_language').value = 'text';
        form.querySelector('#id_style').value = 'friendly';
        form.querySelector('#id_linenos').value = false;
        document.getElementById('hidden-u-form').appendChild(form);
        lastEdit = '';
    } else {
        let form;
        if (lastEdit !== '') {
            let lastElem = document.getElementById(lastEdit);
            lastElem.querySelector('.btn-edit').classList.toggle('hidden-element');
            lastElem.querySelector('.btn-save').classList.toggle('hidden-element');
            lastElem.querySelector('.btn-delete').classList.toggle('hidden-element');
            lastElem.querySelector('.btn-cancel').classList.toggle('hidden-element');
            lastElem.querySelector('.snippetcomment-code').classList.toggle('hidden-element');
            lastElem.querySelector('.snippetcomment-edit').classList.toggle('hidden-element');
            form = lastElem.querySelector('#snippetcomment-u-form');
        } else {
            form = document.getElementById('snippetcomment-u-form');
        }
        form = form.parentNode.removeChild(form);
        form.querySelector('#id_comment-id').value = elem.id.split('reply-')[1] ?? elem.id.split('comment-')[1];
        let code = form.querySelector('#id_code');
        code.value = elem.dataset.code;
        form.querySelector('#id_language').value = elem.dataset.language;
        form.querySelector('#id_style').value = elem.dataset.style;
        form.querySelector('#id_linenos').checked = elem.dataset.linenos === 'True';
        formLoc.appendChild(form);
        setTimeout(() => {
            code.focus();
            elem.querySelector('button[type="submit"]').scrollIntoView({behavior: 'smooth'});
        }, 10);
        lastEdit = elementId;
    }
    elem.querySelector('.btn-edit').classList.toggle('hidden-element');
    elem.querySelector('.btn-save').classList.toggle('hidden-element');
    elem.querySelector('.btn-delete').classList.toggle('hidden-element');
    elem.querySelector('.btn-cancel').classList.toggle('hidden-element');
    elem.querySelector('.snippetcomment-code').classList.toggle('hidden-element');
    elem.querySelector('.snippetcomment-edit').classList.toggle('hidden-element');
}

function deleteSnippetComment(id) {
    let res = window.confirm('Oletko varma, että haluat poistaa viestin?');
    if (res) {
        let form = document.getElementById('hidden-d-form');
        form.querySelector('#id_comment-id').value = id;
        form.submit();
    }
}

function scrollToTop() {
    root.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// async function getSnippet(id, type = 'comments') {
//     let uri = `/api/snippets-${type}/${id}/`;
//     let result = await fetch(uri);
//     return result.status === 200 ? await result.json() : { code: '', language: 'text', style: 'friendly', linenos: false };
// }

window.onload = () => {
    mainCard = document.querySelector('main')
    btnToTop = document.getElementById('btn-to-top');
    if (btnToTop) {
        btnToTop.style.visibility = scrollY >= 75 ? 'visible' : 'hidden';
    }
    let textarea = document.querySelector('textarea');
    let cards = document.querySelectorAll('.list-card');
    if (textarea !== null) {
        textarea.addEventListener('keydown', textBoxBehaviorChange);
    }
    cards.forEach(card => card.addEventListener('click', cardClickHandler));
};

window.onscroll = () => {
    if (btnToTop) {
        btnToTop.style.visibility = scrollY >= 75 ? 'visible' : 'hidden';
    }
};