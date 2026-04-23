import React, { createContext, useState, useEffect, useContext } from 'react';

// [createContext] 공유 데이터의 바구니를 만듭니다.
export const LocationContext = createContext();

export function LocationProvider({ children }) {
    // [useState] 데이터와 로딩 상태를 상자에 담습니다.
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiKey = import.meta.env.VITE_IP_GEOLOCATION_API_KEY;
    const url = "https://geo.ipify.org/api/v1?apiKey=" + apiKey;


    // [useEffect] 화면에 처음 나타날 때 딱 한 번만 API를 호출합니다.
    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch()를 사용하여 실제 API 요청을 보냅니다.
                const res = await fetch(url);
                if (!res.ok) throw new Error('Network response was not ok');

                const data = await res.json();

                // 데이터 로드 후 상태 업데이트
                setLocationData(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch location:", error);
                setLoading(false); // 에러 발생 시에도 로딩은 종료
            }
        };

        fetchData();
    }, []); // [] 이 부분이 '한 번만'을 결정하는 핵심입니다!

    return (
        <LocationContext.Provider value={{ locationData, loading }}>
            {children}
        </LocationContext.Provider>
    );

}
