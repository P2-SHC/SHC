import { useContext, useState } from 'react';
import { AlarmContext } from '../components/AlarmContext.jsx';
import { UserContext } from '../components/UserContext.jsx';
import './AlarmPage.css';

// ─── Time Alarm Section ───────────────────────────────────────────────────────
function TimeAlarmSection({ title, icon, alarms, onAdd, onUpdate, onDelete }) {
  const [newTime, setNewTime] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTime, setEditTime] = useState('');

  const handleAdd = () => {
    if (!newTime) return;
    onAdd(newTime);
    setNewTime('');
  };

  const startEdit = (alarm) => {
    setEditId(alarm.id);
    setEditTime(alarm.time);
  };

  const saveEdit = (id) => {
    if (!editTime) return;
    onUpdate(id, editTime);
    setEditId(null);
  };

  return (
    <div className="alarm-section">
      <h3 className="alarm-section__title">{icon} {title}</h3>

      <div className="alarm-time-list">
        {alarms.length === 0 && <p className="alarm-empty">설정된 알람 시간이 없습니다</p>}
        {alarms.map(alarm => (
          <div key={alarm.id} className="alarm-time-item">
            {editId === alarm.id ? (
              <>
                <input
                  type="time"
                  className="input alarm-time-input"
                  value={editTime}
                  onChange={e => setEditTime(e.target.value)}
                />
                <div className="alarm-time-item__actions">
                  <button className="btn btn--primary btn--sm" onClick={() => saveEdit(alarm.id)}>저장</button>
                  <button className="btn btn--subtle btn--sm" onClick={() => setEditId(null)}>취소</button>
                </div>
              </>
            ) : (
              <>
                <span className="alarm-time-item__time">🕐 {alarm.time}</span>
                <div className="alarm-time-item__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => startEdit(alarm)}>수정</button>
                  <button className="btn btn--danger btn--sm" onClick={() => onDelete(alarm.id)}>삭제</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="alarm-add-time">
        <input
          type="time"
          className="input alarm-time-input"
          value={newTime}
          onChange={e => setNewTime(e.target.value)}
        />
        <button className="btn btn--outline" onClick={handleAdd} disabled={!newTime}>
          + 시간 추가
        </button>
      </div>
    </div>
  );
}

// ─── Medicine Form ────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', dosage: '', alarmTimes: [], totalCount: '' };

function MedicineForm({ initial = EMPTY_FORM, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [newTime, setNewTime] = useState('');

  const addTime = () => {
    if (!newTime || form.alarmTimes.includes(newTime)) return;
    setForm(f => ({ ...f, alarmTimes: [...f.alarmTimes, newTime].sort() }));
    setNewTime('');
  };

  const removeTime = (t) => setForm(f => ({ ...f, alarmTimes: f.alarmTimes.filter(x => x !== t) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dosage.trim()) return;
    onSubmit(form);
  };

  return (
    <form className="medicine-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>약 이름 *</label>
        <input
          className="input"
          placeholder="예: 혈압약"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div className="form-row">
        <label>1회 복용량 *</label>
        <input
          className="input"
          placeholder="예: 1정, 2캡슐"
          value={form.dosage}
          onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
          required
        />
      </div>
      <div className="form-row">
        <label>총 개수 (선택 — 입력 시 잔여량 자동 관리)</label>
        <input
          className="input"
          type="number"
          min="1"
          placeholder="미입력 시 잔여량 관리 안 함"
          value={form.totalCount}
          onChange={e => setForm(f => ({ ...f, totalCount: e.target.value }))}
        />
      </div>
      <div className="form-row">
        <label>알람 시간</label>
        <div className="alarm-times-editor">
          <div className="alarm-times-chips">
            {form.alarmTimes.length === 0 && <span className="alarm-empty-inline">시간 없음</span>}
            {form.alarmTimes.map(t => (
              <span key={t} className="alarm-chip">
                {t}
                <button type="button" className="alarm-chip__remove" onClick={() => removeTime(t)}>×</button>
              </span>
            ))}
          </div>
          <div className="alarm-time-add-row">
            <input
              type="time"
              className="input alarm-time-input"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
            />
            <button type="button" className="btn btn--ghost" onClick={addTime}>추가</button>
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn--primary">저장</button>
        <button type="button" className="btn btn--subtle" onClick={onCancel}>취소</button>
      </div>
    </form>
  );
}

// ─── Medicine Manager ─────────────────────────────────────────────────────────
function MedicineManager() {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, decreaseMedicineCount } = useContext(AlarmContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (form) => { addMedicine(form); setShowAddForm(false); };
  const handleUpdate = (form) => {
    updateMedicine(editingId, { name: form.name, dosage: form.dosage, alarmTimes: form.alarmTimes, totalCount: form.totalCount });
    setEditingId(null);
  };

  return (
    <div className="alarm-section">
      <div className="alarm-section__header">
        <h3 className="alarm-section__title">💊 복용 중인 약 목록</h3>
        <button
          className="btn btn--primary"
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
        >
          + 약 추가
        </button>
      </div>

      {showAddForm && editingId === null && (
        <div className="medicine-form-wrapper">
          <h4 className="form-subtitle">새 약 추가</h4>
          <MedicineForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {medicines.length === 0 && !showAddForm && (
        <p className="alarm-empty">등록된 약이 없습니다</p>
      )}

      <div className="medicine-list">
        {medicines.map(med => (
          <div key={med.id} className="medicine-card">
            {editingId === med.id ? (
              <div className="medicine-form-wrapper" style={{ flex: 1 }}>
                <h4 className="form-subtitle">약 정보 수정</h4>
                <MedicineForm
                  initial={{ name: med.name, dosage: med.dosage, alarmTimes: med.alarmTimes, totalCount: med.totalCount ?? '' }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <>
                <div className="medicine-card__info">
                  <div className="medicine-card__name">{med.name}</div>
                  <div className="medicine-card__meta">
                    <span>💊 1회 {med.dosage}</span>
                    {med.remainingCount != null && (
                      <span className={`medicine-card__remaining${med.remainingCount <= 5 ? ' medicine-card__remaining--low' : ''}`}>
                        잔여 {med.remainingCount}개
                      </span>
                    )}
                  </div>
                  <div className="medicine-card__times">
                    {med.alarmTimes.length > 0
                      ? med.alarmTimes.map(t => <span key={t} className="alarm-chip">{t}</span>)
                      : <span className="alarm-empty-inline">알람 없음</span>
                    }
                  </div>
                </div>
                <div className="medicine-card__actions">
                  {med.remainingCount != null && (
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => decreaseMedicineCount(med.id)}
                      disabled={med.remainingCount === 0}
                    >
                      복용 완료
                    </button>
                  )}
                  <button
                    className="btn btn--outline btn--sm"
                    onClick={() => { setEditingId(med.id); setShowAddForm(false); }}
                  >
                    수정
                  </button>
                  <button className="btn btn--danger btn--sm" onClick={() => deleteMedicine(med.id)}>
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AlarmPage ────────────────────────────────────────────────────────────────
export default function AlarmPage({ navigate }) {
  const { currentUser } = useContext(UserContext);
  const {
    bloodSugarAlarms, bloodPressureAlarms,
    addBloodSugarAlarm, updateBloodSugarAlarm, deleteBloodSugarAlarm,
    addBloodPressureAlarm, updateBloodPressureAlarm, deleteBloodPressureAlarm,
  } = useContext(AlarmContext);

  const [tab, setTab] = useState('medicine');

  if (!currentUser) {
    return (
      <div className="page">
        <div className="container--sm">
          <div className="alarm-login-prompt">
            <p>로그인 후 이용할 수 있습니다</p>
            <button className="btn btn--primary" onClick={() => navigate('LoginPage')}>로그인</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container--sm">
        <h1 className="alarm-page__title">🔔 건강 알리미</h1>
        <p className="alarm-page__desc">약 복용, 혈당, 혈압 체크 알림을 설정하세요</p>

        <div className="alarm-tabs">
          {[
            { key: 'medicine',       label: '💊 복용 알리미' },
            { key: 'blood_sugar',    label: '🩸 혈당 체크' },
            { key: 'blood_pressure', label: '❤️ 혈압 체크' },
          ].map(t => (
            <button
              key={t.key}
              className={`alarm-tab${tab === t.key ? ' alarm-tab--active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="alarm-tab-content">
          {tab === 'medicine' && <MedicineManager />}
          {tab === 'blood_sugar' && (
            <TimeAlarmSection
              title="혈당 체크 알림"
              icon="🩸"
              alarms={bloodSugarAlarms}
              onAdd={addBloodSugarAlarm}
              onUpdate={updateBloodSugarAlarm}
              onDelete={deleteBloodSugarAlarm}
            />
          )}
          {tab === 'blood_pressure' && (
            <TimeAlarmSection
              title="혈압 체크 알림"
              icon="❤️"
              alarms={bloodPressureAlarms}
              onAdd={addBloodPressureAlarm}
              onUpdate={updateBloodPressureAlarm}
              onDelete={deleteBloodPressureAlarm}
            />
          )}
        </div>
      </div>
    </div>
  );
}
