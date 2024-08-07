import React from 'react';
import CreateTaMenu from './CreateTaMenu';
import ScheduledCall from '../../../components/RoleRoute/CommonComponent/ScheduledCall';

const TaMenuScheduledCall = () => {
    return (
        <div>
            <CreateTaMenu />
            <ScheduledCall role="TA" />
        </div>
    );
};

export default TaMenuScheduledCall;
