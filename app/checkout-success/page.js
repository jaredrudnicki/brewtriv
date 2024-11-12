"use client";

import { useSearchParams } from 'next/navigation';
import { React, useEffect, useState } from "react";
import { getUser, setSubscriptionId } from "@/utils/actions";
import { useRouter } from "next/navigation";

export default function Success() {
    const { push } = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)
 
    const subscriptionId = searchParams.get('subscriptionId');
    const userId = searchParams.get('userId');
    const redirectUrl = searchParams.get('redirectUrl');
    const quizTitle = searchParams.get('quizTitle')
    const quizDescription = searchParams.get('quizDescription')

    useEffect(() => {
        (async() => {

            const user = await getUser();
            if(user.id === userId) {
                await setSubscriptionId(userId, subscriptionId);
                return push(`${redirectUrl}?quizTitle=${quizTitle}&quizDescription=${quizDescription}`);
            }
            else{
                console.log("incorrect user");
                setError("incorrect user")
            }

            setIsLoading(false);
        })();
    }, []);


    return(
        <>
        {!isLoading && (
            <>
            {error && (
                <p>{error}</p>
            )}
            </>
        )}
        </>
    );
}