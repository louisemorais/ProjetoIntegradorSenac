import * as React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs from 'dayjs'

export default function Calendario() {
    const [selectedDate, setSelectedDate] = React.useState(dayjs())

    // atualiza a data quando o usuário selecionar uma nova
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                sx={{
                    borderRadius: 2,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                    p: 1,
                    width: 350,
                    margin: '0 auto',
                }}
            />
        </LocalizationProvider>
    )
}