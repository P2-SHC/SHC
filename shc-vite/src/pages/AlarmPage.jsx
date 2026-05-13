import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlarmContext } from '../components/AlarmContext.jsx';
import { UserContext } from '../components/UserContext.jsx';
import './AlarmPage.css';

// ─── Time Alarm Section ───────────────────────────────────────────────────────
function TimeAlarmSection({ title, icon, alarms, onAdd, onUpdate, onDelete }) {
  const { t } = useTranslation();
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
        {alarms.length === 0 && <p className="alarm-empty">{t('alarm.no_time_set')}</p>}
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
                  <button className="btn btn--primary btn--sm" onClick={() => saveEdit(alarm.id)}>{t('common.save')}</button>
                  <button className="btn btn--subtle btn--sm" onClick={() => setEditId(null)}>{t('common.cancel')}</button>
                </div>
              </>
            ) : (
              <>
                <span className="alarm-time-item__time">🕐 {alarm.time}</span>
                <div className="alarm-time-item__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => startEdit(alarm)}>{t('common.edit')}</button>
                  <button className="btn btn--danger btn--sm" onClick={() => onDelete(alarm.id)}>{t('common.delete')}</button>
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
          {t('alarm.add_time')}
        </button>
      </div>
    </div>
  );
}

// ─── Medicine Form ────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', dosage: '', alarmTimes: [], totalCount: '' };

function MedicineForm({ initial = EMPTY_FORM, onSubmit, onCancel }) {
  const { t } = useTranslation();
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
        <label>{t('alarm.med_name')}</label>
        <input
          className="input"
          placeholder={t('alarm.med_name_placeholder')}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div className="form-row">
        <label>{t('alarm.dosage')}</label>
        <input
          className="input"
          placeholder={t('alarm.dosage_placeholder')}
          value={form.dosage}
          onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
          required
        />
      </div>
      <div className="form-row">
        <label>{t('alarm.total_count')}</label>
        <input
          className="input"
          type="number"
          min="1"
          placeholder={t('alarm.total_count_placeholder')}
          value={form.totalCount}
          onChange={e => setForm(f => ({ ...f, totalCount: e.target.value }))}
        />
      </div>
      <div className="form-row">
        <label>{t('alarm.alarm_time')}</label>
        <div className="alarm-times-editor">
          <div className="alarm-times-chips">
            {form.alarmTimes.length === 0 && <span className="alarm-empty-inline">{t('alarm.no_time')}</span>}
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
            <button type="button" className="btn btn--ghost" onClick={addTime}>{t('common.add')}</button>
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn--primary">{t('common.save')}</button>
        <button type="button" className="btn btn--subtle" onClick={onCancel}>{t('common.cancel')}</button>
      </div>
    </form>
  );
}

// ─── Medicine Manager ─────────────────────────────────────────────────────────
function MedicineManager() {
  const { t } = useTranslation();
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
        <h3 className="alarm-section__title">{t('alarm.med_list_title')}</h3>
        <button
          className="btn btn--primary"
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
        >
          {t('alarm.add_med')}
        </button>
      </div>

      {showAddForm && editingId === null && (
        <div className="medicine-form-wrapper">
          <h4 className="form-subtitle">{t('alarm.add_med_title')}</h4>
          <MedicineForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {medicines.length === 0 && !showAddForm && (
        <p className="alarm-empty">{t('alarm.no_med_registered')}</p>
      )}

      <div className="medicine-list">
        {medicines.map(med => (
          <div key={med.id} className="medicine-card">
            {editingId === med.id ? (
              <div className="medicine-form-wrapper" style={{ flex: 1 }}>
                <h4 className="form-subtitle">{t('alarm.edit_med_title')}</h4>
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
                    <span>{t('alarm.dosage_info', { dosage: med.dosage })}</span>
                    {med.remainingCount != null && (
                      <span className={`medicine-card__remaining${med.remainingCount <= 5 ? ' medicine-card__remaining--low' : ''}`}>
                        {t('alarm.remaining_count', { count: med.remainingCount })}
                      </span>
                    )}
                  </div>
                  <div className="medicine-card__times">
                    {med.alarmTimes.length > 0
                      ? med.alarmTimes.map(t => <span key={t} className="alarm-chip">{t}</span>)
                      : <span className="alarm-empty-inline">{t('alarm.no_time')}</span>
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
                      {t('alarm.med_taken')}
                    </button>
                  )}
                  <button
                    className="btn btn--outline btn--sm"
                    onClick={() => { setEditingId(med.id); setShowAddForm(false); }}
                  >
                    {t('common.edit')}
                  </button>
                  <button className="btn btn--danger btn--sm" onClick={() => deleteMedicine(med.id)}>
                    {t('common.delete')}
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
  const { t } = useTranslation();
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
            <p>{t('alarm.login_required')}</p>
            <button className="btn btn--primary" onClick={() => navigate('LoginPage')}>{t('common.login')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container--sm">
        <h1 className="alarm-page__title">{t('alarm.page_title')}</h1>
        <p className="alarm-page__desc">{t('alarm.page_desc')}</p>

        <div className="alarm-tabs">
          {[
            { key: 'medicine',       label: t('alarm.tab_med') },
            { key: 'blood_sugar',    label: t('alarm.tab_blood_sugar') },
            { key: 'blood_pressure', label: t('alarm.tab_blood_pressure') },
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
              title={t('alarm.blood_sugar_title')}
              icon="🩸"
              alarms={bloodSugarAlarms}
              onAdd={addBloodSugarAlarm}
              onUpdate={updateBloodSugarAlarm}
              onDelete={deleteBloodSugarAlarm}
            />
          )}
          {tab === 'blood_pressure' && (
            <TimeAlarmSection
              title={t('alarm.blood_pressure_title')}
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
