import { createContext, useState } from 'react';

export const UserContext = createContext();

const USERS_KEY = 'shc_users';
const CURRENT_USER_KEY = 'shc_current_user';

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const getUsers = () => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const register = async ({ username, password, name, age, interests }) => {
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, error: '이미 사용 중인 아이디입니다.' };
    }
    const hashedPassword = await hashPassword(password);
    localStorage.setItem(USERS_KEY, JSON.stringify([
      ...users,
      { username, password: hashedPassword, name, age, interests }
    ]));
    return { success: true };
  };

  const login = async (username, password) => {
    const users = getUsers();
    const hashedPassword = await hashPassword(password);
    const user = users.find(u => u.username === username && u.password === hashedPassword);
    if (!user) {
      return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }
    const { password: _pw, ...safeUser } = user;
    setCurrentUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <UserContext.Provider value={{ currentUser, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
