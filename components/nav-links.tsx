'use client';

import { globe, award, sun, plus, profileIcon } from "@/utils/showIcons";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { getUser } from "@/utils/auth";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    {
        name: 'Daily',
        href: '/daily',
        icon: sun(),
    },
    { name: 'Quizzes', href: '/quizzes', icon: globe() },
    { name: 'Add Quiz', href: '/create-quiz', icon: plus() },
];

export default function NavLinks() {

    let user = getUser();
    const pathname = usePathname();



    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={
                            `flex h-[48px] 
                            grow 
                            items-center justify-center gap-2 rounded-md bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
                            ${pathname === link.href ? 'text-blue-600 bg-sky-100': 'text-white'}
                            `
                        }
                    >
                        {link.icon}
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
            {user && user?.user_id && (
                <Link
                    key="Profile"
                    href="/profile"
                    className={clsx(
                        'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                        {
                            'bg-sky-100 text-blue-600': pathname === "/profile",
                        },
                    )}
                >
                    {/* <LinkIcon className="w-6" /> */}
                    {profileIcon()}
                    <p className="hidden md:block">Profile</p>
                </Link>
            )}
        </>
    );
}
