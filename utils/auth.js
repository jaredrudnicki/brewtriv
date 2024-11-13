const initialState = {
    user_id: null,
    email: null,
    profile_name: "",
    first_name: "",
    last_name: "",
    stripe_customer_id: null,
    stripe_subscription_id: null,
}

export function getUser(){
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user") || null;
        if(!user) {
            localStorage.setItem("user", JSON.stringify(initialState));
            return initialState;
        } else {
            return JSON.parse(user);
        }
    }
}

export function setUser(user){
    if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
    }
}

export function clearUser() {
    if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(initialState));
    }
}