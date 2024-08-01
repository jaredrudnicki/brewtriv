"use client"
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/submit-button";
import RegularLayout from "../regular-layout";

const supabase = createClient();

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");

  const handlePasswordUpdate = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      if (data) {
        alert("Password has been updated successfully!");
      }
    } catch (error) {
        // @ts-ignore
        alert(`Error updating password: ${error.message}`);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handlePasswordUpdate(password);
  };

  return (
    <RegularLayout>
    <div className="flex flex-col jcontainer">
        <label htmlFor="new-password">New Password</label>
        <input
            className="rounded-md border bg-inherit px-4 py-2 border-white"
            name="new-password"
            type="password"
            placeholder="••••••••"
            required
            onChange={(e)=> setPassword(e.target.value)} 
        />
        <SubmitButton
          onClick={(e) => handleSubmit(e)}
          className="text-foreground mt-2 rounded-md bg-green-700 px-4 py-2 text-white"
          pendingText="Resetting Password..."
        >
          Change Password
        </SubmitButton>
    </div>
    </RegularLayout>
  );
}