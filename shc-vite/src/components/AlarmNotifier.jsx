import { useContext, useEffect, useRef, useState } from 'react';
import { AlarmContext } from './AlarmContext.jsx';
import { UserContext } from './UserContext.jsx';
import './AlarmNotifier.css';

export default function AlarmNotifier() {
  const { currentUser } = useContext(UserContext);
  const { medicines, bloodSugarAlarms, bloodPressureAlarms, decreaseMedicineCount } = useContext(AlarmContext);

  const [pendingAlarms, setPendingAlarms] = useState([]);

  const medicinesRef = useRef(medicines);
  const bloodSugarRef = useRef(bloodSugarAlarms);
  const bloodPressureRef = useRef(bloodPressureAlarms);
  const firedRef = useRef(new Set());
  const usernameRef = useRef(currentUser?.username ?? null);

  useEffect(() => { medicinesRef.current = medicines; }, [medicines]);
  useEffect(() => { bloodSugarRef.current = bloodSugarAlarms; }, [bloodSugarAlarms]);
  useEffect(() => { bloodPressureRef.current = bloodPressureAlarms; }, [bloodPressureAlarms]);

  // Load fired-today set from localStorage when user changes
  useEffect(() => {
    usernameRef.current = currentUser?.username ?? null;
    if (!currentUser?.username) {
      firedRef.current = new Set();
      setPendingAlarms([]);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const key = `shc_alarm_fired_${currentUser.username}_${today}`;
    try {
      const saved = localStorage.getItem(key);
      firedRef.current = saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      firedRef.current = new Set();
    }
  }, [currentUser?.username]);

  const saveFired = () => {
    const uname = usernameRef.current;
    if (!uname) return;
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`shc_alarm_fired_${uname}_${today}`, JSON.stringify([...firedRef.current]));
  };

  const checkAlarms = () => {
    if (!usernameRef.current) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAlarms = [];

    medicinesRef.current.forEach(med => {
      (med.alarmTimes || []).forEach(time => {
        const fireKey = `med_${med.id}_${time}`;
        if (time === currentTime && !firedRef.current.has(fireKey)) {
          firedRef.current.add(fireKey);
          newAlarms.push({ id: fireKey, type: 'medicine', message: `${med.name} 복용 시간입니다`, medicineId: med.id });
        }
      });
    });

    bloodSugarRef.current.forEach(alarm => {
      const fireKey = `blood_sugar_${alarm.id}_${alarm.time}`;
      if (alarm.time === currentTime && !firedRef.current.has(fireKey)) {
        firedRef.current.add(fireKey);
        newAlarms.push({ id: fireKey, type: 'blood_sugar', message: '혈당 체크 시간입니다' });
      }
    });

    bloodPressureRef.current.forEach(alarm => {
      const fireKey = `blood_pressure_${alarm.id}_${alarm.time}`;
      if (alarm.time === currentTime && !firedRef.current.has(fireKey)) {
        firedRef.current.add(fireKey);
        newAlarms.push({ id: fireKey, type: 'blood_pressure', message: '혈압 체크 시간입니다' });
      }
    });

    if (newAlarms.length > 0) {
      saveFired();
      setPendingAlarms(prev => [...prev, ...newAlarms]);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    checkAlarms();
    const interval = setInterval(checkAlarms, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.username]);

  const dismiss = (alarm) => {
    if (alarm.type === 'medicine' && alarm.medicineId) {
      decreaseMedicineCount(alarm.medicineId);
    }
    setPendingAlarms(prev => prev.filter(a => a.id !== alarm.id));
  };

  if (!currentUser || pendingAlarms.length === 0) return null;

  const current = pendingAlarms[0];
  const icons = { medicine: '💊', blood_sugar: '🩸', blood_pressure: '❤️' };

  return (
    <div className="alarm-overlay">
      <div className="alarm-modal">
        <div className="alarm-modal__icon">{icons[current.type]}</div>
        <h2 className="alarm-modal__title">건강 알리미</h2>
        <p className="alarm-modal__message">{current.message}</p>
        {pendingAlarms.length > 1 && (
          <p className="alarm-modal__more">+{pendingAlarms.length - 1}개 알림 대기 중</p>
        )}
        <button className="btn btn--primary alarm-modal__btn" onClick={() => dismiss(current)}>
          확인
        </button>
      </div>
    </div>
  );
}
