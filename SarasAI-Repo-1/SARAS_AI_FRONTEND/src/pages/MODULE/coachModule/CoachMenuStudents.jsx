import React from 'react';
import CoachMenu from './CoachMenu';
import Mystudents from '../../../components/RoleRoute/CommonComponent/Mystudents';

const CoachMenuStudents = () => {
    return (
        <div>
            <CoachMenu />
            <Mystudents role="Coach" />
        </div>
    );
};

export default CoachMenuStudents;
