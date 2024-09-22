'use client'

import { User } from 'lucia';
import { useEffect, useState } from 'react';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch('/api/user');
                if (response.status === 200) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, []);

    return { user, isLoading };
}
