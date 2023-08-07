export const pieChartData = {
  type: 'pie',
  // Define the labels for each data point
  data: {
    labels: [
      '77001',
      '77002',
      '77003',
      '77043',
      '77051',
      '77403',
      '77031',
      '90201'
    ],
    // Define the datasets used to render the data point
    datasets: [
      {
        label: 'Zip-Code',
        data: [23, 34, 10, 22, 34, 54, 27, 14],
        backgroundColor: [
          'rgba(255, 0, 0, 0.5)', // Red
          'rgba(0, 0, 255, 0.5)', // Blue
          'rgba(0, 255, 0, 0.5)', // Green
          'rgba(255, 255, 0, 0.5)', // Yellow
          'rgba(255, 0, 255, 0.5)', // Magenta
          'rgba(0, 255, 255, 0.5)', // Cyan
          'rgba(255, 165, 0, 0.5)', // Orange
          'rgba(128, 0, 128, 0.5)' // Purple
        ],
        borderColor: '#17202A',
        borderWidth: 3
      }
    ]
  },
  // Define the options for the char
  options: {
    responsive: true,
    lineTension: 1
  }
}

export default pieChartData
