import React from 'react';
import CoachMenu from './CoachMenu';
import ScheduledCall from '../../../components/RoleRoute/CommonComponent/ScheduledCall';

const CoachMenuScheduledcall = () => {
    return (
        <div>
            <CoachMenu />
            <ScheduledCall role="Coach" />
        </div>
    );
};

export default CoachMenuScheduledcall;
