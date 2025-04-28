import React, { useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState({
    fullName: 'Иван Иванов',
    email: 'ivan@example.com',
    solvedEasy: 10,
    solvedMedium: 5,
    solvedHard: 2,
    notifications: [
      'Ваша задача была одобрена модератором',
      'Новый отзыв о вашей задаче'
    ]
  });

  const [editMode, setEditMode] = useState(false);
  const [editableProfile, setEditableProfile] = useState({ ...profile });

  const handleSave = () => {
    setProfile(editableProfile);
    setEditMode(false);
  };

  return (
    <div className="profile-page">
      <h2>Профиль</h2>
      {!editMode ? (
        <>
          <p><strong>ФИО:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p>
            <strong>Пройдено задач:</strong> Лёгких {profile.solvedEasy}, Средних {profile.solvedMedium}, Сложных {profile.solvedHard}
          </p>
          <h3>Уведомления</h3>
          <ul>
            {profile.notifications.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
          <button onClick={() => setEditMode(true)}>
            Редактировать профиль
          </button>
        </>
      ) : (
        <>
          <label>ФИО:</label>
          <input 
            type="text" 
            value={editableProfile.fullName} 
            onChange={(e) => setEditableProfile({ ...editableProfile, fullName: e.target.value })}
          />
          <label>Email:</label>
          <input 
            type="email" 
            value={editableProfile.email} 
            onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })}
          />
          <button onClick={handleSave}>Сохранить</button>
        </>
      )}
    </div>
  );
}

export default Profile;
