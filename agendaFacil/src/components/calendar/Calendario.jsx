import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

export default function Calendario({ data, setData }) {
    const handleDateChange = (newDate) => {
        setData(newDate)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                value={data}
                onChange={handleDateChange}
                sx={{
                    borderRadius: 2,
                    border: "1.5px solid #ccc",
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                    width: "100%",
                    transform: 'scale(0.58)',
                    transformOrigin: 'top center',
                }}
            />
        </LocalizationProvider>
    )
}