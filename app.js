document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteModal = document.getElementById('note-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const noteTitleInput = document.getElementById('note-title');
    const noteBodyInput = document.getElementById('note-body');

    let notes = JSON.parse(localStorage.getItem('nightnotes_data')) || [];
    let currentEditingId = null;

    function saveToLocalStorage() {
        localStorage.setItem('nightnotes_data', JSON.stringify(notes));
    }

    function renderNotes() {
        notesList.innerHTML = '';
        
        if (notes.length === 0) {
            notesList.innerHTML = '<div class="empty-state">No notes yet. Tap + to create one!</div>';
            return;
        }

        // Sort notes by date descending
        const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);

        sortedNotes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <button class="delete-btn" data-id="${note.id}">✕</button>
                <h3>${escapeHtml(note.title || 'Untitled')}</h3>
                <p>${escapeHtml(note.body)}</p>
            `;
            
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    deleteNote(note.id);
                } else {
                    openNote(note.id);
                }
            });
            
            notesList.appendChild(card);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function openNote(id) {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        
        currentEditingId = id;
        noteTitleInput.value = note.title;
        noteBodyInput.value = note.body;
        
        noteModal.classList.add('active');
        modalOverlay.classList.add('active');
    }

    function deleteNote(id) {
        notes = notes.filter(n => n.id !== id);
        saveToLocalStorage();
        renderNotes();
    }

    function createNewNote() {
        currentEditingId = null;
        noteTitleInput.value = '';
        noteBodyInput.value = '';
        noteModal.classList.add('active');
        modalOverlay.classList.add('active');
        noteTitleInput.focus();
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
            notes[index] = { ...notes[index], title, body, timestamp: Date.now() };
        } else {
            const newNote = {
                id: Date.now(),
                title,
                body,
                timestamp: Date.now()
            };
            notes.push(newNote);
        }

        saveToLocalStorage();
        renderNotes();
        closeModal();
    }

    function closeModal() {
        noteModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        currentEditingId = null;
    }

    addNoteBtn.addEventListener('click', createNewNote);
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    saveNoteBtn.addEventListener('click', saveNote);

    renderNotes();
});