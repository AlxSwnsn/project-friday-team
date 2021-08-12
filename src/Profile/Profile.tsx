import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {logoutTC} from '../state/login-reducer';
import {AppRootStateType} from '../state/store';
import s from './Profile.module.css';
import {Tables} from '../Table/Table';
import userAva from '../common/images/UserAvatar.png'
import {Button} from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import SuperDoubleRange from '../Test/h11/common/c8-SuperDoubleRange/SuperDoubleRange';

export function Profile() {
    const dispatch = useDispatch();

    let user = useSelector<AppRootStateType, any>(state => state.login.user)

    const isLoginIn = useSelector<AppRootStateType, boolean>(
        (state) => state.login.isLoggedIn
    );

    const logoutHandler = () => {
        dispatch(logoutTC());
    };

    const maxCardsCount = useSelector<AppRootStateType, number>(
        (state) => state.table.maxCardsCount
    )
    const minCardsCount = useSelector<AppRootStateType, number>(
        (state) => state.table.minCardsCount
    )

    const [value1, setValue1] = useState<number>(minCardsCount)
    const [value2, setValue2] = useState<number>(maxCardsCount)

    if (!isLoginIn) {
        return <Redirect to={'/login'}/>;
    }
    return (
        <div className={s.profile}>
            <div className={s.profileContainer}>
                <div className={s.profileInfo}>
                    <div className={s.profileMain}>
                        <div className={s.photoProfile}>
                            {!user.avatar ?  <img src={userAva} alt=""/> : <img src={user.avatar} alt=""/> }
                        </div>
                        <div>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <Button>
                            Edit profile
                        </Button>
                        </div>
                        <div>
                            <Button onClick={logoutHandler}>Sing out</Button>
                        </div>
                    </div>
                   <div className={s.numberOfCards}>
                       <p>Number of cards</p>
                       <div>
                           <SuperDoubleRange
                               value1={value1}
                               setValue1={setValue1}
                               setValue2={setValue2}
                               value2={value2}
                               max={maxCardsCount}
                               component={'profile'}
                           />
                       </div>
                   </div>
                </div>
                <div className={s.table}>
                    <Tables/>
                </div>
                
            </div>
        </div>
    );
}
