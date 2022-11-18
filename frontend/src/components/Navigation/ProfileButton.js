import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink, useHistory } from 'react-router-dom';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();
    // const iconsArr = ["fa-solid fa-person-swimming", "fa-solid fa-person-skiing", "fa-solid fa-person-snowboarding",
    //     "fa-solid fa-person-hiking", "fa-solid fa-person-biking", "fa-solid fa-person-snowboarding",
    //     "fa-solid fa-person-skating"];
    // const icon = iconsArr[Math.floor(Math.random() * 7)]

    const openMenu = () => {
        // const icon = iconsArr[Math.floor(Math.random() * 7)]

        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        // const icon = iconsArr[Math.floor(Math.random() * 7)]

        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        history.push('/')
    };
    return (
        <>

            <button onClick={openMenu} className="profile-btn">
                <i class="fa-solid fa-person-running" ></i>
            </button>
            {
                showMenu && (
                    <ul className="profile-dropdown">
                        <li key={user.username}>{user.username}</li>
                        <li key={user.email}>{user.email}</li>
                        <NavLink to='/spots/mine'>
                            <button>Your Spots</button>
                        </NavLink>
                        <li>
                            <button onClick={logout}>Log Out</button>
                        </li>
                    </ul>
                )
            }
        </>
    );
}

export default ProfileButton;
