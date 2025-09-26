// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'

// ** Third Party Components
import { ArrowDown } from 'react-feather'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from '../../utility/Utils'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <span>{`LKR ${formatNumber(payload[0].value)}.00`}</span>
      </div>
    )
  }

  return null
}

const TSaleByDateLineChart = ({ warning, data }) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Tickets Sales</CardTitle>
        </div>
        
      </CardHeader>

      <CardBody>
        <div className='recharts-wrapper'>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid />
              <XAxis dataKey='name' />
              <YAxis type="number" domain={[0, 'auto']}/>
              <Tooltip content={CustomTooltip} />
              <Line dataKey='pv' stroke={warning} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default TSaleByDateLineChart
