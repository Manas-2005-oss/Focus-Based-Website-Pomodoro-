
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Trash2, Save, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const Notepad = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('pomodoro-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('pomodoro-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
    toast({
      title: "Note deleted",
      description: "Your note has been removed.",
    });
  };

  const startEditing = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      title: editTitle || 'Untitled',
      content: editContent,
      updatedAt: new Date()
    };

    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    ));
    
    setSelectedNote(updatedNote);
    setIsEditing(false);
    
    toast({
      title: "Note saved",
      description: "Your changes have been saved.",
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
    }
  };

  const selectNote = (note: Note) => {
    if (isEditing) {
      // If currently editing, save first
      saveNote();
    }
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-2">
              <FileText className="w-6 h-6 text-teal-600" />
              <span>📝 Notepad</span>
            </CardTitle>
            <Button 
              onClick={createNewNote}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 mb-3">Your Notes ({notes.length})</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedNote?.id === note.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => selectNote(note)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{note.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(note.updatedAt)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {note.content.substring(0, 50)}...
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {notes.length === 0 && (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    No notes yet. Create your first note to get started!
                  </p>
                )}
              </div>
            </div>

            {/* Note Editor */}
            <div className="md:col-span-2">
              {selectedNote ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                      {isEditing ? 'Edit Note' : 'View Note'}
                    </h3>
                    <div className="space-x-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" size="sm" onClick={cancelEditing}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={saveNote}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => startEditing(selectedNote)}
                          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Note title..."
                        className="text-lg font-semibold"
                      />
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Start writing your note..."
                        className="min-h-80 resize-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(selectedNote.createdAt)}
                        {selectedNote.updatedAt.getTime() !== selectedNote.createdAt.getTime() && (
                          <span> • Updated: {formatDate(selectedNote.updatedAt)}</span>
                        )}
                      </div>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {selectedNote.content || 'This note is empty. Click Edit to add content.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a note to view or create a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notepad;
