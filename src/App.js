import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Picker from 'emoji-picker-react';
import db from './firebaseConfig';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const LoveDiary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState([]);
  const [entries, setEntries] = useState({});
  const [viewingEntry, setViewingEntry] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [specialDayLabel, setSpecialDayLabel] = useState('');
  const [comment, setComment] = useState('');
  const isSharedView = new URLSearchParams(window.location.search).get('shared') === 'true';

  const handleNoteChange = (e) => setNote(e.target.value);
  const handleSpecialDayChange = (e) => setSpecialDayLabel(e.target.value);
  const handleCommentChange = (e) => setComment(e.target.value);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setNote(prevNote => prevNote + emojiObject.emoji);
  };

  const handleSave = async () => {
    const newEntry = { note, photos: photos.map(photo => photo.name), comments: [], specialDayLabel };
    const dateKey = selectedDate.toDateString();

    await setDoc(doc(collection(db, "entries"), dateKey), newEntry);

    setEntries({ ...entries, [dateKey]: newEntry });
    setNote('');
    setPhotos([]);
    setSpecialDayLabel('');
    setViewingEntry(null);
  };

  const handleViewEntry = async (date) => {
    const dateKey = date.toDateString();
    const docRef = doc(collection(db, "entries"), dateKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setViewingEntry(docSnap.data());
    } else {
      setViewingEntry(null);
    }

    setSelectedDate(date);
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      const dateKey = selectedDate.toDateString();
      const updatedEntry = { ...viewingEntry, comments: [...(viewingEntry.comments || []), comment] };

      await setDoc(doc(collection(db, "entries"), dateKey), updatedEntry);

      setEntries({ ...entries, [dateKey]: updatedEntry });
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-pink-300 bg-white rounded-xl shadow-lg p-4">
          <Calendar 
            onChange={handleViewEntry} 
            value={selectedDate} 
            className="w-full mb-4"
          />
        </div>

        <div className="border border-purple-300 bg-white rounded-xl shadow-lg p-4">
          {viewingEntry ? (
            <div>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Viewing Entry for {selectedDate.toDateString()}</h2>
              <p className="mb-4 text-gray-700">{viewingEntry.note}</p>
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Comments</h3>
                <textarea value={comment} onChange={handleCommentChange} placeholder="Write a comment..." className="mb-4 w-full p-2 border border-gray-300 rounded-xl"></textarea>
                <button onClick={handleAddComment} className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 mb-4">Add Comment</button>
                <div>
                  {viewingEntry.comments && viewingEntry.comments.map((com, index) => (
                    <div key={index} className="p-2 mb-2 bg-gray-200 rounded">{com}</div>
                  ))}
                </div>
              </div>
              <button onClick={() => setViewingEntry(null)} className="bg-purple-500 text-white py-2 px-4 rounded-xl hover:bg-purple-600">Back to Add Entry</button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-pink-700 mb-4">Add Entry for {selectedDate.toDateString()}</h2>
              <textarea value={note} onChange={handleNoteChange} placeholder="Write your note here..." className="mb-4 w-full p-2 border border-pink-300 rounded-xl"></textarea>
              <input type="text" value={specialDayLabel} onChange={handleSpecialDayChange} placeholder="Special Day (e.g., Anniversary)" className="mb-4 w-full p-2 border border-yellow-300 rounded-xl" />
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mb-4 bg-purple-500 text-white py-2 px-4 rounded-xl hover:bg-purple-600">{showEmojiPicker ? 'Hide Emoji Picker' : 'Add Emoji'}</button>
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}  
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="mb-4" />
              <button onClick={handleSave} className="bg-purple-500 text-white py-2 px-4 rounded-xl hover:bg-purple-600">Save Entry</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoveDiary;
