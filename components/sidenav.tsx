"use client";
import Link from 'next/link';
import NavLinks from '@/components/nav-links';
import AuthButton from './auth/AuthButton';
import { useEffect, useState } from 'react';
import { getUser } from '@/utils/actions';
import { User } from '@supabase/supabase-js';

export default function SideNav() {
  
    let [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async() => {
            user = await getUser();
            setUser(user);
            setIsLoading(false);
        })();
    }, []);


    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">

            <Link
                className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-700 p-4 md:h-40 gap-1"
                href="/"
            >
                <img src='icon.ico' width={24} height={24} />
                <div className="w-32 text-white md:w-40">
                    <p>BrewTriv</p>
                </div>
            </Link>
            <div>
                <div className="flex grow flex-row justify-start space-x-2 md:flex-col md:space-x-0 md:space-y-2 mb-2">
                    <NavLinks />
                </div>
                {!user && (
                    <AuthButton />
                )}
        
            </div>

        </div>
    );
}
