import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink, useHistory } from 'react-router-dom';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormPage';
import { Modal } from '../../context/Modal';
import LoginForm from '../LoginFormModal/LoginForm';
import SignupForm from '../SignupFormPage/SignUpForm';
import './ProfileButton.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
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
                showMenu && user && (
                    <ul className="profile-dropdown">
                        <li key={user.username}>{user.username}</li>
                        <li key={user.email}>{user.email}</li>
                        <NavLink to='/spots/mine'>
                            <button
                                className='your-spots-button'
                            >Spots</button>
                        </NavLink>
                        <NavLink to='/bookings/mine'>
                            <button className='your-bookings-btn'>
                                Bookings
                            </button>
                        </NavLink>
                        <li>
                            <button
                                className='button-to-log-out'
                                onClick={logout}>Log Out</button>
                        </li>
                    </ul>
                )
            }
            {
                showMenu && !user && (
                    <div className='profile-dropdown-with-no-user'>
                            <button
                                className='button-to-log-in'
                                onClick={() => setShowLoginModal(true)}>Log in</button>
                            <button
                                className='button-to-sign-in'
                                onClick={() => setShowSignupModal(true)}>Sign up</button>
                    </div>
                )
            }
            {showLoginModal && (
                <Modal onClose={() => setShowLoginModal(false)}>
                    <LoginForm setShowLoginModal={setShowLoginModal} />
                </Modal>
            )
            }
            {showSignupModal && (
                <Modal onClose={() => setShowSignupModal(false)}>
                    <SignupForm setShowSignupModal={setShowSignupModal} />
                </Modal>
            )}
        </>
    );
}

export default ProfileButton;
