// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import CrmAward from 'src/views/dashboards/crm/CrmAward'
import CrmTable from 'src/views/dashboards/crm/CrmTable'
import CrmTotalGrowth from 'src/views/dashboards/crm/CrmTotalGrowth'
import CrmTotalProfit from 'src/views/dashboards/crm/CrmTotalProfit'
import CrmMonthlyBudget from 'src/views/dashboards/crm/CrmMonthlyBudget'
import CrmExternalLinks from 'src/views/dashboards/crm/CrmExternalLinks'
import CrmWeeklyOverview from 'src/views/dashboards/crm/CrmWeeklyOverview'
import CrmPaymentHistory from 'src/views/dashboards/crm/CrmPaymentHistory'
import CrmOrganicSessions from 'src/views/dashboards/crm/CrmOrganicSessions'
import CrmProjectTimeline from 'src/views/dashboards/crm/CrmProjectTimeline'
import CrmMeetingSchedule from 'src/views/dashboards/crm/CrmMeetingSchedule'
import CrmSocialNetworkVisits from 'src/views/dashboards/crm/CrmSocialNetworkVisits'
import CrmMostSalesInCountries from 'src/views/dashboards/crm/CrmMostSalesInCountries'
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {get} from "lodash";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import DatePicker from "react-datepicker";
import {useState,forwardRef} from "react";
import format from "date-fns/format";
import {TextField} from "@mui/material";
import DatePickerWrapper from "../../@core/styles/libs/react-datepicker";

const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates
  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
const Dashboard = () => {
  const [endDateRange, setEndDateRange] = useState(null)
  const [startDateRange, setStartDateRange] = useState(null)
  const [dates, setDates] = useState([])
  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }
  return (
    <ApexChartWrapper>
      <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Dashboard'/>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Date'
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={4} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='office-status-select'>Departments</InputLabel>
                    <Select
                      fullWidth
                      value={''}
                      sx={{mr: 4, mb: 2}}
                      label='Select office'
                      onChange={(e) => console.log(e)}
                      labelId='office-status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <CrmAward />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CardStatisticsVertical
            stats='155k'
            color='primary'
            trendNumber='+22%'
            title='Total Orders'
            chipText='Last 4 Month'
            icon={<Icon icon='mdi:cart-plus' />}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CardStatisticsVertical
            stats='$13.4k'
            color='success'
            trendNumber='+38%'
            title='Total Sales'
            chipText='Last Six Month'
            icon={<Icon icon='mdi:currency-usd' />}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CrmTotalProfit />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CrmTotalGrowth />
        </Grid>
        <Grid item xs={12} md={4}>
          <CrmOrganicSessions />
        </Grid>
        <Grid item xs={12} md={8}>
          <CrmProjectTimeline />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmWeeklyOverview />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmSocialNetworkVisits />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmMonthlyBudget />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmMeetingSchedule />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmExternalLinks />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmPaymentHistory />
        </Grid>
        <Grid item xs={12} md={4}>
          <CrmMostSalesInCountries />
        </Grid>
        <Grid item xs={12} md={8}>
          <CrmTable />
        </Grid>
      </Grid>
      </DatePickerWrapper>
    </ApexChartWrapper>
  )
}

export default Dashboard
