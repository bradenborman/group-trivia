import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Menu from '../menu/menu';
import Game from '../game/game';

import './groupTrivia.scss';

const GroupTrivia: React.FC = (): ReactElement => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Menu />} />
                <Route path="/game/:gameCode" element={<Game />} />
            </Routes>
        </Router>
    );
};

export default GroupTrivia;
