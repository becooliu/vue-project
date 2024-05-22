<script setup>
    import {ref, computed} from "vue"

    const props = defineProps({
        data: Array,
        columns: Array,
        filterKey: String
    })
    const sortKey = ref('')

    const sortOrders = ref(
        props.columns.reduce((acc,key) => ((acc[key] = 1), acc), {})
    )

    const filteredData = computed(() => {
        let {data, filterKey} = props
        if(filterKey) {
            filterKey = filterKey.toLowerCase()
            data = data.filter(row => {
                return Object.keys(row).some((key)=> {
                    return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                })
            })
        }

        const key = sortKey.value
        if(key) {
            const order = sortOrders.value[key]
            data = data.slice().sort((a,b) => {
                a = a[key]
                b = b[key]
                return (a === b ? 0 : a > b ? 1 : -1) * order
            })
        }

        return data
    })

    function sortBy(key) {
      sortKey.value = key
      sortOrders.value[key] *= -1
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="key in columns" :key="key">{{capitalize(key)}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData" :key="entry.name">
        <td v-for="key in columns" :key="key">{{entry[key]}}</td>
      </tr>
    </tbody>
  </table>

</template>

<style>
table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 100px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>