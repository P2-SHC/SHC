import { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext.jsx';

export const AlarmContext = createContext();

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function storageKey(type, username) {
  return `shc_${type}_${username}`;
}

function loadFromStorage(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function AlarmProvider({ children }) {
  const { currentUser } = useContext(UserContext);
  const username = currentUser?.username ?? null;

  const [medicines, setMedicines] = useState([]);
  const [bloodSugarAlarms, setBloodSugarAlarms] = useState([]);
  const [bloodPressureAlarms, setBloodPressureAlarms] = useState([]);

  useEffect(() => {
    if (!username) {
      setMedicines([]);
      setBloodSugarAlarms([]);
      setBloodPressureAlarms([]);
      return;
    }
    setMedicines(loadFromStorage(storageKey('medicines', username)));
    setBloodSugarAlarms(loadFromStorage(storageKey('blood_sugar', username)));
    setBloodPressureAlarms(loadFromStorage(storageKey('blood_pressure', username)));
  }, [username]);

  // Medicine CRUD
  const addMedicine = ({ name, dosage, alarmTimes = [], totalCount }) => {
    const totalNum = totalCount !== '' && totalCount != null ? Number(totalCount) : null;
    const newMed = { id: genId(), name, dosage, alarmTimes, totalCount: totalNum, remainingCount: totalNum };
    setMedicines(prev => {
      const next = [...prev, newMed];
      if (username) save(storageKey('medicines', username), next);
      return next;
    });
  };

  const updateMedicine = (id, updates) => {
    setMedicines(prev => {
      const next = prev.map(m => {
        if (m.id !== id) return m;
        const merged = { ...m, ...updates };
        if ('totalCount' in updates) {
          merged.totalCount = updates.totalCount !== '' && updates.totalCount != null ? Number(updates.totalCount) : null;
          merged.remainingCount = merged.totalCount;
        }
        return merged;
      });
      if (username) save(storageKey('medicines', username), next);
      return next;
    });
  };

  const deleteMedicine = (id) => {
    setMedicines(prev => {
      const next = prev.filter(m => m.id !== id);
      if (username) save(storageKey('medicines', username), next);
      return next;
    });
  };

  const decreaseMedicineCount = (id) => {
    setMedicines(prev => {
      const next = prev.map(m => {
        if (m.id !== id || m.remainingCount == null) return m;
        return { ...m, remainingCount: Math.max(0, m.remainingCount - 1) };
      });
      if (username) save(storageKey('medicines', username), next);
      return next;
    });
  };

  // Blood Sugar CRUD
  const addBloodSugarAlarm = (time) => {
    const newAlarm = { id: genId(), time };
    setBloodSugarAlarms(prev => {
      const next = [...prev, newAlarm];
      if (username) save(storageKey('blood_sugar', username), next);
      return next;
    });
  };

  const updateBloodSugarAlarm = (id, time) => {
    setBloodSugarAlarms(prev => {
      const next = prev.map(a => a.id === id ? { ...a, time } : a);
      if (username) save(storageKey('blood_sugar', username), next);
      return next;
    });
  };

  const deleteBloodSugarAlarm = (id) => {
    setBloodSugarAlarms(prev => {
      const next = prev.filter(a => a.id !== id);
      if (username) save(storageKey('blood_sugar', username), next);
      return next;
    });
  };

  // Blood Pressure CRUD
  const addBloodPressureAlarm = (time) => {
    const newAlarm = { id: genId(), time };
    setBloodPressureAlarms(prev => {
      const next = [...prev, newAlarm];
      if (username) save(storageKey('blood_pressure', username), next);
      return next;
    });
  };

  const updateBloodPressureAlarm = (id, time) => {
    setBloodPressureAlarms(prev => {
      const next = prev.map(a => a.id === id ? { ...a, time } : a);
      if (username) save(storageKey('blood_pressure', username), next);
      return next;
    });
  };

  const deleteBloodPressureAlarm = (id) => {
    setBloodPressureAlarms(prev => {
      const next = prev.filter(a => a.id !== id);
      if (username) save(storageKey('blood_pressure', username), next);
      return next;
    });
  };

  return (
    <AlarmContext.Provider value={{
      medicines, bloodSugarAlarms, bloodPressureAlarms,
      addMedicine, updateMedicine, deleteMedicine, decreaseMedicineCount,
      addBloodSugarAlarm, updateBloodSugarAlarm, deleteBloodSugarAlarm,
      addBloodPressureAlarm, updateBloodPressureAlarm, deleteBloodPressureAlarm,
    }}>
      {children}
    </AlarmContext.Provider>
  );
}
