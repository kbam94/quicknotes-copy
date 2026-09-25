const notesList = document.getElementById('notes-list');
const addNoteBtn = document.getElementById('add-note-btn');
const noteModal = document.getElementById('note-modal');
const closeModalBtn = document.getElementById('close-modal');
const saveNoteBtn = document.getElementById('save-note');
const noteTitleInput = document.getElementById('note-title');
const noteBodyInput = document.getElementById('note-body');

let notes = JSON.parse(localStorage.getItem('quicknotes_data')) || [];
let currentEditingId = null;

function saveToStorage() {
    localStorage.setItem('quicknotes_data', JSON.stringify(notes));
}

function renderNotes() {
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p style="text-align:center; width:100%; color:gray; margin-top:40px;">No notes yet. Tap + to create one!</p>';
        return;
    }

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <h3>${note.title || 'Untitled'}</h3>
            <p>${note.body || 'No content'}</p>
            <button class="delete-btn" data-id="${note.id}">Delete</button>
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            openModal(note.id);
        });

        notesList.appendChild(card);
    });

    // Attach delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            deleteNote(id);
        });
    });
}

function openModal(id = null) {
    currentEditingId = id;
    if (id) {
        const note = notes.find(n => n.id === id);
        noteTitleInput.value = note.title;
        noteBodyInput.value = note.body;
    } else {
        noteTitleInput.value = '';
        noteBodyInput.value = '';
    }
    noteModal.style.display = 'flex';
    noteTitleInput.focus();
}

function closeModal() {
    noteModal.style.display = 'none';
    currentEditingId = null;
}

function saveNote() {
    const title = noteTitleInput.value.trim();
    const body = noteBodyInput.value.trim();

    if (!title && !body) {
        closeModal();
        return;
    }

    if (currentEditingId) {
        const index = notes.findIndex(n => n.id === currentEditingId);
        notes[index] = { ...notes[index], title, body };
    } else {
        const newNote = {
            id: Date.now(),
            title,
            body,
            date: new Date().toISOString()
        };
        notes.unshift(newNote);
    }

    saveToStorage();
    renderNotes();
    closeModal();
}

function deleteNote(id) {
    if (confirm('Delete this note?')) {
        notes = notes.filter(n => n.id !== id);
        saveToStorage();
        renderNotes();
    }
}

addNoteBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
saveNoteBtn.addEventListener('click', saveNote);

// Close modal when clicking outside content
noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) closeModal();
});

// Initial render
renderNotes();