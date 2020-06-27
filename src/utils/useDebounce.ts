import { useEffect } from "react";

export default function useDebounce<T>(value: T, time: number, callback: (value: T) => void) {
    useEffect(() => {
        const timer = setTimeout(() => callback(value), time);
        return () => clearTimeout(timer);
    }, [JSON.stringify(value)]);
}