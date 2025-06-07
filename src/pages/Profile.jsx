import React, { useState } from 'react';
import "./../css/Profile.css"
function Profile() {
  const [profile, setProfile] = useState({
    fullName: 'Иван Иванов',
    tag: 'username',
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
      <div className='profile-block'>
          <div className='self-block'>
              <div className='avatar-block'>
                
              </div>
              <div className='info-block'>
            {!editMode ? (
              <>
                <div className='fullname'>{profile.fullName}</div>
                <div className="user-tag">{profile.tag}</div>
               

                
                <button className='edit' onClick={() => setEditMode(true)}>
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
                <label>tag</label>
                <input 
                  type="text" 
                  value={editableProfile.tag} 
                  onChange={(e) => setEditableProfile({ ...editableProfile, tag: e.target.value })}
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

        </div>
        <div className='stats-title'>
          Tasks solved
        </div>
        <div className='stats-block'>
          <div className='task-diff easy'>
            <div className='stats-content'>
              EASY {profile.solvedEasy}
            </div>
          </div>
          <div className='task-diff medium'>
            <div className='stats-content'>
              MEDIUM {profile.solvedMedium}
            </div>
          </div>
          <div className='task-diff hard'>
            <div className='stats-content'>
              HARD {profile.solvedHard}
            </div>
          </div>
        </div>

      </div>
      <div className='notification-block'>
        <h3>Уведомления</h3>
            <ul>
              {profile.notifications.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
      </div>
    </div>
  );
}

export default Profile;
