import React, { useState, useEffect } from "react";
import { Bell, ChevronsLeft, CircleUserRound } from "lucide-react";

import PropTypes from "prop-types";
import axios from "axios";

export const Header = ({ collapsed, setCollapsed }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await axios.get("http://127.0.0.1:8088/api/v1/users/me", {
              withCredentials: true, // Include cookies in request
            });
            setUser(res.data.data.user);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchUser();
      }, []);

    return (
        <header className="relative z-10 flex h-[80px] items-center justify-between bg-slate-100 px-4 shadow-md transition-colors border-b-2 border-gray-400">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
               
            </div>
            <div className="flex items-center gap-x-3">
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>
                <h3 size="sm" className="text-lg text-slate-900 dark:text-[#7663f0] font-bold"> Hi {user ? user.displayName || user.email.split('@')[0] : "User"} </h3>
                <button className="size-10 overflow-hidden rounded-full">
                    <CircleUserRound
                        size={35}
                        className="text-[#0f0d19]"/>
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};