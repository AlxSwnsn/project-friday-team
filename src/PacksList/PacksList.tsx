import {useDispatch, useSelector} from 'react-redux'
import React, {ChangeEvent, useCallback, useEffect, useState} from 'react'
import {AppRootStateType} from '../state/store'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import {
    CreatNewPackListTC,
    DeletePackListTC,
    setPacksListTC,
    setPageAC, UpdatePackTC,
} from '../state/table-reducer'
import {Redirect, useHistory} from 'react-router-dom'
import s from './PacksList.module.css'
import {Paginator} from '../common/Pagination/Pagination'
import SuperInputText from '../Test/h4/common/c1-SuperInputText/SuperInputText'
import moment from 'moment'
import SuperDoubleRange from '../Test/h11/common/c8-SuperDoubleRange/SuperDoubleRange'
import {SortElement} from '../components/SortElement/SortElement'
import {Modal} from '../Modal/Modal';

export function PacksList() {
    const dispatch = useDispatch()
    const history = useHistory()
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        dispatch(
            setPacksListTC({
                page,
                pageCount,
                min: minCardsCount,
                max: maxCardsCount,
                sortPacks,
            })
        )
    }, [])

    const isLoginIn = useSelector<AppRootStateType, boolean>(
        (state) => state.login.isLoggedIn
    )

    const profile = useSelector<AppRootStateType, any>(
        (state) => state.login.user
    )

    let {cardPacks, page, pageCount, cardPacksTotalCount, sortPacks} =
        useSelector<AppRootStateType, any>((state: AppRootStateType) => state.table)
    console.log('render packslist', cardPacks)

    const onPageChanged = useCallback(
        (page: number) => {
            if (filter === 'my') {
                profile._id &&
                dispatch(
                    setPacksListTC({
                        user_id: profile._id,
                        page,
                        pageCount,
                        packName: inputValue,
                        min: value1,
                        max: value2,
                        sortPacks: sortTitle,
                    })
                )
            } else {
                dispatch(
                    setPacksListTC({
                        page,
                        pageCount,
                        packName: inputValue,
                        min: value1,
                        max: value2,
                        sortPacks: sortTitle,
                    })
                )
            } //что бы менялась страница по клику при запросе на сервер
        },
        [page]
    )

    //search
    const [inputValue, setInputValue] = useState<string>('')
    const inputHandler = (e: ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.currentTarget.value)

    const onSearch = () => dispatch(setPacksListTC({packName: inputValue}))

    const CreateNewPackList = () => {
        dispatch(
            CreatNewPackListTC(
                {cardsPack: {name: title, path: profile.name}},
                {}
            )
        )
        setTitle('')
        setCreate(false)
    }

    const UpdateCardPack = (id: string) => {
        dispatch(
            UpdatePackTC(
                {cardsPack: {_id: id, name: title}},
                {}
            )
        )
        setTitle('')
        setUpdatingPackId('')
    }

    //filter
    const onClickSetMyFilter = () => {
        setFilter('my')
        profile._id && dispatch(setPacksListTC({user_id: profile._id}))
    }

    const onClickSetAllFilter = () => {
        setFilter('all')
        dispatch(setPacksListTC())
    }

    //sort
    const [sortTitle, setSortTitle] = useState(sortPacks)

    const Sort1 = () => {
        if (filter === 'my') {
            setSortTitle('1updated')
            profile._id &&
            dispatch(
                setPacksListTC({user_id: profile._id, sortPacks: '1updated'})
            )
        } else {
            setSortTitle('1updated')
            profile._id && dispatch(setPacksListTC({sortPacks: '1updated'}))
        }
    }
    const Sort2 = () => {
        if (filter === 'my') {
            setSortTitle('0updated')
            profile._id &&
            dispatch(
                setPacksListTC({user_id: profile._id, sortPacks: '0updated'})
            )
        } else {
            setSortTitle('0updated')
            profile._id && dispatch(setPacksListTC({sortPacks: '0updated'}))
        }
    }

    //min - max

    const maxCardsCount = useSelector<AppRootStateType, number>(
        (state) => state.table.cardPacksTotalCount
    )

    const minCardsCount = useSelector<AppRootStateType, number>(
        (state) => state.table.minCardsCount
    )

    const [value1, setValue1] = useState<number>(minCardsCount)
    const [value2, setValue2] = useState<number>(maxCardsCount)

    const [isCreate, setCreate] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const createTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const [updatingPackId, setUpdatingPackId] = useState('')
    const onCloseUpdate = () => setUpdatingPackId('')

    const [deletedPackId, setDeletedPackId] = useState('')
    const onCloseDelete = () => setDeletedPackId('')
    const onClose = () => setCreate(false)

    if (!isLoginIn) {
        return <Redirect to={'/login'}/>
    }


    return (
        <div
            className={s.packList}
            style={{
                margin: '0 0px',
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className={s.packContainer}>
                <div className={s.mainPacks}>
                    <p>Show packs cards</p>
                    <div>
                        <Button onClick={onClickSetMyFilter}>My</Button>
                        <Button onClick={onClickSetAllFilter}>All</Button>
                    </div>
                    <div className={s.numberOfCards}>
                        <p>Number of cards</p>
                        <SuperDoubleRange
                            value1={value1}
                            setValue1={setValue1}
                            setValue2={setValue2}
                            value2={value2}
                        />
                    </div>
                </div>

                <div className={s.packTable}>
                    <h2>Packs list</h2>
                    <div className={s.searchBlock}>
                        <div className={s.search}>
                            <SuperInputText
                                className={s.searchBoxInput}
                                placeholder={'Search...'}
                                onChange={inputHandler}
                            />
                            <Button variant="contained" color="primary" onClick={onSearch}>
                                search
                            </Button>
                        </div>
                        {isCreate &&
                        <Modal
                            show={true}
                            title={'Enter title'}
                            content={<input value={title} onChange={createTitle}/>}
                            footer={<tr>
                                <button onClick={CreateNewPackList}>add</button>
                                <button onClick={onClose}>Close</button>
                            </tr>}
                            onClose={onClose}
                        />
                        }
                        <Button
                            onClick={() => setCreate(true)}
                            variant="contained"
                            color="primary"
                            className={s.addNewPack}
                        >
                            Add new pack
                        </Button>
                    </div>
                    <div className={s.table}>
                        <TableContainer component={Paper} className={s.tableContainer}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="center">Cards</TableCell>
                                        <TableCell align="center">
                                            Last updated <Button onClick={Sort1}>ᐁ</Button>
                                            <Button onClick={Sort2}>/\</Button>
                                        </TableCell>
                                        <TableCell align="center">Created by</TableCell>
                                        <TableCell align="center"> Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cardPacks.map((row: any) => {
                                        const getCards = () => {
                                            history.push(`/cards/${row._id}`)
                                        }
                                        return (
                                            <TableRow key={row._id}>
                                                {updatingPackId === row._id &&
                                                <Modal
                                                    show={updatingPackId === row._id}
                                                    title={'Enter new title'}
                                                    content={<input value={title} onChange={createTitle}/>}
                                                    footer={<tr key={row._id}>
                                                        <button onClick={() => UpdateCardPack(row._id)}>update</button>
                                                        <button onClick={onCloseUpdate}>Close</button>
                                                    </tr>}
                                                    onClose={() => setUpdatingPackId('')}
                                                />}
                                                {deletedPackId === row._id &&
                                                <Modal
                                                    show={deletedPackId === row._id}
                                                    title={'Do you want delete?'}
                                                    content={`Click "yes" if you want`}
                                                    footer={<tr key={row._id}>
                                                        <button
                                                            onClick={() => dispatch(DeletePackListTC(row._id))}>Yes
                                                        </button>
                                                        <button onClick={onCloseDelete}>No</button>
                                                    </tr>}
                                                    onClose={onCloseDelete}
                                                />}
                                                <TableCell onClick={getCards} component="th" scope="row">
                                                    {row.name}{' '}
                                                </TableCell>
                                                <TableCell align="center">{row.cardsCount}</TableCell>
                                                <TableCell align="center">
                                                    {moment(row.updated).format('DD.MM.YYYY')}
                                                </TableCell>
                                                <TableCell align="center">{row.path}</TableCell>
                                                <TableCell align="center">
                                                    {row.user_id == profile._id ? (
                                                        <div>
                                                            <Button
                                                                onClick={() => setDeletedPackId(row._id)}
                                                                variant="contained"
                                                                color="secondary"
                                                            >
                                                                Delete
                                                            </Button>
                                                            <Button
                                                                onClick={() => setUpdatingPackId(row._id)}
                                                                variant="contained" color="primary">
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                            >
                                                                Learn
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                        >
                                                            Learn
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <Paginator
                        page={page}
                        onPageChanged={onPageChanged}
                        pageCount={pageCount}
                        totalItemsCount={cardPacksTotalCount}
                    />
                </div>
            </div>
        </div>
    )
}
