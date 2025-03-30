import React,{ forwardRef } from 'react';
import { NavLink } from "react-router-dom";

import { navbarLinks } from '../constants';
import logo from '../assets/logo.svg';

import { cn } from '../utils/cn';

import PropTypes from 'prop-types';

export const SideBar = forwardRef(({collapsed}, ref) => {
    return(
        <aside ref={ref} className={cn(
            "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden  border-r rounded-r-[20px] border-slate-300 bg-[#D6D2FF] [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-[#D6D2FF] dark:bg-[#D6D2FF]",
            collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
            collapsed ? "max-md:-left-full" : "max-md:left-0",
        )} >
            <div className="flex gap-x-1 p-2">
                <img
                    src={logo}
                    alt="FinanceMate"
                    className="w-15"
                />
                {!collapsed && <p className="text-2xl font-medium text-black transition-colors m-2 mt-4">FinanceMate</p>}
            </div>
            <div className="">
                <hr className="border-t-2 border-gray-400 mb-2" />
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                            >
                                <link.icon
                                    size={22}
                                    className="flex-shrink-0"
                                />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    )
});

SideBar.displayName = 'SideBar';

SideBar.propTypes = {
    collapsed: PropTypes.bool
}