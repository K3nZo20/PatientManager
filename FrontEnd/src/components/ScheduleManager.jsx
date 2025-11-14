import React, { useState } from "react";
import WeekCalendar from "./WeekCalendar";
import SchedulePage from "./SchedulePage";

function ScheduleManager() {
    const [selectedDate, setSelectedDate] = useState(null); // jeœli null — pokazujemy kalendarz
    const [view, setView] = useState("day"); // "week" lub "day"

    return (
        <div>
            {view === "week" && (
                <WeekCalendar
                    onDaySelect={(date) => {
                        setSelectedDate(date);
                        setView("day");
                    }}
                />
            )}

            {view === "day" && (
                <SchedulePage
                    selectedDate={selectedDate}
                    onBack={() => setView("week")}
                />
            )}
        </div>
    );
}

export default ScheduleManager;
