import React, { useState } from "react";
import CalendarView from "./components/CalendarView";
import DaySchedule from "./components/DaySchedule";

function App() {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div>
            {!selectedDate ? (
                <CalendarView onDayClick={setSelectedDate} />
            ) : (
                <DaySchedule date={selectedDate} onBack={() => setSelectedDate(null)} />
            )}
        </div>
    );
}

export default App;
