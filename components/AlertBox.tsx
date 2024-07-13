"use client"
import { alertTriangle, check } from "@/utils/showIcons";

export default function AlertBox(showAlert: boolean = false, type: string  = "error", message: string) {
    
    if(showAlert) {
        return (
            <div className="w-full p-2">
                <div className={`w-full text-white z-100 rounded p-2 border flex flex-row gap-2 ${type === 'error' ? 'bg-yellow-600 border-yellow-400': 'bg-green-600 border-green-400'}`}>
                    { type === 'error' ? (
                        alertTriangle()
                    ) : (
                        check()
                    )}
                    <p>{message}</p>
                </div>
            </div>
        )
    } 
}