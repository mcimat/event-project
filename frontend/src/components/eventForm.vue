<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API
import { ref, computed, onMounted } from 'vue'

export default {
  // Component name
  setup() {
    // Refs
    const recentServices = ref([])

    // Fetch recent services
    const fetchRecentServices = () => {
      axios.get(`${apiURL}/services`)
        .then(res => {
          recentServices.value = res.data
        })
    }

    // Call fetchRecentServices action when component is mounted
    onMounted(() => {
      fetchRecentServices()
    })

    // Filter active services
    const activeServices = computed(() => {
      return recentServices.value.filter(service => service.status === 'active')
    })

    // Use Vuelidate
    return { v$: useVuelidate({ $autoDirty: true }), recentServices, activeServices }
  },
  data() {
    return {
      event: {
        name: '',
        services: [],
        date: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          county: '',
          zip: ''
        },
        description: ''
      }
    }
  },
  // Methods
  methods: {
    // Add service to event
    async handleSubmitForm() {
      const isFormCorrect = await this.v$.$validate()
      if (isFormCorrect) {
        const selectedServices = this.recentServices.filter(service => service.includeInEvent)
        // console.log(this.event)
        this.event.services = selectedServices
        axios.post(`${apiURL}/events`, this.event)
          .then(() => {
            alert('Event has been added.')
            this.$router.push({ name: 'findevents' })
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  },
  validations() {
    return {
      event: {
        name: { required },
        date: { required }
      }
    }
  }
}
</script>



<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Create New Event
      </h1>
    </div>
    <div class="px-10 py-20">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Event Details</h2>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Event Name</span>
              <span style="color: #ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.name"
              />
              <span class="text-black" v-if="v$.event.name.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.name.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Date</span>
              <span style="color: #ff0000">*</span>
              <input
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.date"
                type="date"
              />
              <span class="text-black" v-if="v$.event.date.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.date.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </label>
          </div>

          <div></div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Description</span>
              <textarea
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="2"
              ></textarea>
            </label>
          </div>

          <div></div>
          <div></div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col grid-cols-3">
            <label>Services Offered at Event</label>
            <!-- table -->
            <div class="table-container">
              <table class="services-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Include in Event</th>
                  </tr>
                </thead>
              <tbody>
                <!-- loop through active services -->
                <tr v-for="service in activeServices" :key="service._id">
                  <td>{{ service.name }}</td>
                  <td>{{ service.description }}</td>
                  <td>
                    <input type="checkbox" class="action-checkbox" v-model="service.includeInEvent">
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

        <!-- grid container -->
        <div
          class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Address</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.line1"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.line2"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.city"
              />
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.county"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.zip"
              />
            </label>
          </div>
        </div>

        <div class="flex justify-between mt-10 mr-20">
          <button class="bg-red-700 text-white rounded" type="submit">
            Add New Event
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style>

/* table styles */
.services-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.services-table th, .services-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.services-table th {
  background-color: #f2f2f2;
}

.services-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.action-checkbox {
  margin-right: 5px;
}

.table-container {
  width: 800px;
  margin: 0 auto;
}
</style>