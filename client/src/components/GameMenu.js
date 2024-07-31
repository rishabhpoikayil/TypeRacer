import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pic from './Pic';

const GameMenu = props => {
    let navigate = useNavigate();
    return(
        <div className='text-center'>
            <h1>TypeRacer</h1>
            <p>
                Find out how fast you type in comparison to your friends in a race against time!
            </p>
            <button type="button" onClick={()=> navigate('/game/create')}
                                    className="btn btn-primary btn-lg mr-3">Create Game</button>
            <button type="button" onClick={()=> navigate('/game/join')}
                                    className="btn btn-primary btn-lg">Join Game</button>
            <Pic />
        </div>
    )
}

export default GameMenu;