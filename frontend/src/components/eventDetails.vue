<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { DateTime } from 'luxon'
import { onMounted } from 'vue'
import { ref, computed } from 'vue'
const apiURL = import.meta.env.VITE_ROOT_API

export default {
  props: ['id'],
  setup() {

    const recentServices = ref([])
    
    const fetchRecentServices = () => {
      axios.get(`${apiURL}/services`)
        .then(res => {
          recentServices.value = res.data
          // console.log(recentServices.value)
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
    // console.log(activeServices)
  
    return { v$: useVuelidate({ $autoDirty: true }), recentServices, activeServices }
  },
  data() {
    return {
      clientAttendees: [],
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
        description: '',
        attendees: []
      },
      includedServices: []
    }
  },

  created() {
  axios.get(`${apiURL}/events/id/${this.$route.params.id}`).then((res) => {
    this.event = res.data
    // console.log(this.event)
    // Set the initial included services based on the event's services
    this.includedServices = this.event.services.slice()
    // console.log(this.includedServices)

    // console.log(this.event)
    this.event.date = this.formattedDate(this.event.date)
    this.event.attendees.forEach((e) => {
      axios.get(`${apiURL}/clients/id/${e}`).then((res) => {
        this.clientAttendees.push(res.data)
      })
    })

    const serviceRequests = this.event.services.map((serviceID) => axios.get(`${apiURL}/services/id/${serviceID}`))
    Promise.all(serviceRequests).then((responses) => {
      this.event.services = responses.map((response) => response.data)
      // console.log(this.event.services)
    })
  })
},


  methods: {
    // better formatted date, converts UTC to local time
    formattedDate(datetimeDB) {
      const dt = DateTime.fromISO(datetimeDB, {
        zone: 'utc'
      })
      return dt
        .setZone(DateTime.now().zoneName, { keepLocalTime: true })
        .toISODate()
    },
    toggleService(service) {
      const index = this.includedServices.findIndex((s) => s._id === service._id)
      if (index !== -1) {
        this.includedServices.splice(index, 1)
      } else {
        this.includedServices.push(service)
      }
    },
    handleEventUpdate() {
  // First, update the event object with the selected services
  this.event.services = this.includedServices.map((service) => service._id)

  // Then, send the updated event to the API to be saved
  axios.put(`${apiURL}/events/update/${this.id}`, this.event)
    .then(() => {
      alert('Update has been saved.')
      this.$router.back()
    })
    .catch((error) => {
      console.error(error)
      alert('An error occurred while saving the update.')
    })
},

    editClient(clientID) {
      this.$router.push({ name: 'updateclient', params: { id: clientID } })
    },
    eventDelete() {
      axios.delete(`${apiURL}/events/${this.id}`).then(() => {
        alert('Event has been deleted.')
        this.$router.push({ name: 'findevents' })
      })
    }
  },
  // sets validations for the various data properties
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
        Update Event
      </h1>
    </div>
    <div class="px-10 py-20">
      <form @submit.prevent="handleSubmitForm">
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
        <input type="checkbox"
               class="action-checkbox"
               v-model="service.includeInEvent"
               :checked="includedServices.includes(service._id)"
               @change="toggleService(service)">
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

        <!-- grid container -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="handleEventUpdate"
              type="submit"
              class="bg-green-700 text-white rounded"
            >
              Update Event
            </button>
          </div>
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="eventDelete"
              type="submit"
              class="bg-red-700 text-white rounded"
            >
              Delete Event
            </button>
          </div>
          <div class="flex justify-between mt-10 mr-20">
            <button
              type="reset"
              class="border border-red-700 bg-white text-red-700 rounded"
              @click="$router.back()"
            >
              Go back
            </button>
          </div>
        </div>

        <hr class="mt-10 mb-10" />

        <!-- grid container -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <div>
            <h2 class="text-2xl font-bold">List of Attendees</h2>
            <h3 class="italic">Click table row to edit/display an entry</h3>
          </div>
          <div class="flex flex-col col-span-2">
            <table class="min-w-full shadow-md rounded">
              <thead class="bg-gray-50 text-xl">
                <tr>
                  <th class="p-4 text-left">Name</th>
                  <th class="p-4 text-left">City</th>
                  <th class="p-4 text-left">Phone Number</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr
                  @click="editClient(client._id)"
                  v-for="client in clientAttendees"
                  :key="client._id"
                >
                  <td class="p-2 text-left">
                    {{ client.firstName + ' ' + client.lastName }}
                  </td>
                  <td class="p-2 text-left">{{ client.address.city }}</td>
                  <td class="p-2 text-left">
                    {{ client.phoneNumber.primary }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
