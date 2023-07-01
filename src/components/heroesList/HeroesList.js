
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {

    const {
        data: heroes = [],
        isLoading,
        isError,
    } = useGetHeroesQuery();
    
    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter)

    const heroesToShow = useMemo(() => {
        const heroesToShow = heroes.slice();
        if (activeFilter === 'all') {
            return heroesToShow;
        } else {
            return heroesToShow.filter(item => item.element === activeFilter)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [heroes, activeFilter])


    const onDelete = useCallback((id) => {
        deleteHero(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
        return <h5 className="text-center mt-5">Помилка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition classNames="hero" timeout={0}>
                    <h5 className="text-center mt-5">Героїв поки немає</h5>
                </CSSTransition>
            );
            
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition key={id} classNames="hero" timeout={400}>
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            );
        })
    }

    const elements = renderHeroesList(heroesToShow);
    return (
        <TransitionGroup component={'ul'}>
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;