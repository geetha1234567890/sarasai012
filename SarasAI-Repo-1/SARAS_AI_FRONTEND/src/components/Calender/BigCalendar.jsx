import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'moment/locale/en-gb';
import './BigCal.css';

import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import ScheduleSession from '../availability/ScheduleSession';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);
const allViews = Object.keys(Views).map(k => Views[k]);

const CalendarComponent = ({ eventsList, addEvent, slotData }) => {
    const [myEventsList, setMyEventsList] = useState([]);
    // const [slots, setSlots] = useState([]);

    const showSessionPopUp = () => {
        console.log('clicked');
    };

    const eventStyleGetter = event => {
        console.log('EVENT : ', event);
        return {
            style: {
                backgroundColor: '#28a745', // Match the green color in your design
                color: 'white',
                borderRadius: '5px',
                border: '1px solid #caffd8',
                width: '95%',
                left: '6%',
                bottom: '0%',
            },
        };
    };

    const slotPropGetter = date => {
        const dateString = moment(date).format('YYYY-MM-DD');
        const timeString = moment(date).format('HH:mm');

        for (let i = 0; i < slotData.length; i++) {
            const slot = slotData[i];
            const slotDate = moment(slot.startDate).format('YYYY-MM-DD');
            const slotStartTime = moment(slot.startDate).format('HH:mm');
            const slotEndTime = moment(slot.endDate).format('HH:mm');

            if (
                dateString === slotDate &&
                timeString >= slotStartTime &&
                timeString < slotEndTime
            ) {
                return {
                    style: {
                        backgroundColor: '#B0FC38',
                        opacity: 0.5,
                        border: 'none',
                    },
                };
            }
        }
        return {};
    };

    return (
        <>
            {/* <Header />
      <Sidebar /> */}
            <div style={{ height: 700 }}>
                <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    startAccessor="start"
                    endAccessor="end"
                    events={eventsList}
                    eventPropGetter={eventStyleGetter}
                    slotPropGetter={slotPropGetter}
                    onSelectEvent={showSessionPopUp}
                    step={30}
                    selectable
                    views={{ week: true }} // Only show week view
                    defaultView={Views.WEEK} // Set default view to week
                />
            </div>
        </>
    );
};

export default CalendarComponent;
