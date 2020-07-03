import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, time: number = 1000): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), time);
        return () => clearTimeout(timer);
    }, [value, time]);

    return debounced;
}