import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { url } from "./Vars";

export type User = {
  id: string;
  profile_img: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  plan: string;
} | null;

type MeResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    profile_img: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    plan: string;
  };
};

type UserContextValue = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function toStr(v: unknown) {
  return v === null || v === undefined ? "" : String(v);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const cachedId = localStorage.getItem("userId");
    if (cachedId) {
      setUser({
        id: cachedId,
        profile_img: localStorage.getItem("userProfileImg") || "",
        first_name: localStorage.getItem("userFirstName") || "",
        last_name: localStorage.getItem("userLastName") || "",
        email: localStorage.getItem("userEmail") || "",
        role: localStorage.getItem("userRole") || "",
        plan: localStorage.getItem("userPlan") || "",
      });
    }

    (async () => {
      try {
        const res = await fetch(`${url}/v1/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("userId");
            localStorage.removeItem("userProfileImg");
            localStorage.removeItem("userFirstName");
            localStorage.removeItem("userLastName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userPlan");
            setUser(null);
          } else {
            if (user === undefined) setUser(null);
          }
          return;
        }

        const payload = (await res.json()) as MeResponse;
        const data = payload?.data;

        if (!data?.id) {
          setUser(null);
          return;
        }

        const fresh = {
          id: toStr(data.id),
          profile_img: toStr(data.profile_img),
          first_name: toStr(data.first_name),
          last_name: toStr(data.last_name),
          email: toStr(data.email),
          role: toStr(data.role),
          plan: toStr(data.plan),
        };

        localStorage.setItem("userId", fresh.id);
        localStorage.setItem("userProfileImg", fresh.profile_img);
        localStorage.setItem("userFirstName", fresh.first_name);
        localStorage.setItem("userLastName", fresh.last_name);
        localStorage.setItem("userEmail", fresh.email);
        localStorage.setItem("userRole", fresh.role);
        localStorage.setItem("userPlan", fresh.plan);

        setUser(fresh);
      } catch {
        if (user === undefined) setUser(null);
      }
    })();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
