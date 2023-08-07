<!-- Code used to create the pie chart was adapted from the original bar chart code.
   Specific modifications were made to the code to generate a Pie chart. -->
<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js/auto'
const apiURL = import.meta.env.VITE_ROOT_API

export default {
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(`${apiURL}/clients/zipcode`)
        const data = response.data
        console.log('Data:', data)
        const canvas = document.getElementById('myChart')
        const chartData = {
          labels: data.map((item) => item._id),
          datasets: [
            {
              data: data.map((item) => item.count),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#FF8C00',
                '#9370DB',
                '#1E90FF',
                '#FFD700',
                '#FF1493',
                '#32CD32',
                '#FF69B4',
                '#00BFFF',
                '#8A2BE2',
                '#00CED1',
                '#FFA07A',
                '#00FA9A',
                '#FF00FF',
                '#DC143C',
                '#7B68EE',
                '#00BFFFF',
                '#FF6347',
                '#FFFF00'
              ]
            }
          ]
        }
        console.log('ChartData:', chartData)
        const options = {
          responsive: true,
          maintainAspectRatio: false
        }
        new Chart(canvas, {
          type: 'pie',
          data: chartData,
          options
        })
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: 'Server Response',
            message: err.message
          }
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: 'Unable to Reach Server',
            message: err.message
          }
        } else {
          // There's probably an error in your code
          this.error = {
            title: 'Application Error',
            message: err.message
          }
        }
      }
      this.loading = false
    }
  }
}
</script>
