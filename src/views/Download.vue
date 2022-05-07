<template>
  <div id="download-data">
    <form class="form-password">
      <div>
        <label for="form-name">Masukan Password</label><br />
        <input
          type="text"
          class="form-name"
          name="form-name"
          placeholder="password"
          maxlength="140"
          v-model="password"
        />
      </div>
    </form>
    <button
      type="submit"
      class="btn btn-primary mb-2 btn-confirmation"
      @click="checkPassword"
    >
      Download Data
    </button>
    <p>{{ confirmation }}</p>
  </div>
</template>

<script>
import { useLoadUsers } from '@/firebase'

export default {
  name: 'Download',
  data() {
    return {
      password: '',
      headers: {
        attendance: 'Kehadiran',
        message: 'Pesan',
        name: 'Nama',
        relation: 'Relasi'
      },
      attendance: '',
      confirmation: ''
    }
  },
  methods: {
    async checkPassword() {
      if (this.password === process.env.VUE_APP_ATTENDANCE_KEY) {
        const users = await useLoadUsers()
        console.log(users, 'pppp')
        this.exportCSVFile(this.headers, users._rawValue, `DATA ${new Date()}`)
        this.confirmation = 'BERHASIL DOWNLOAD'
      } else this.confirmation = 'PASSWORD SALAH'
    },
    convertToCsv(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
      var str = ''

      for (var i = 0; i < array.length; i++) {
        var line = ''
        for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index]
        }

        str += line + '\r\n'
      }

      return str
    },
    exportCSVFile(headers, items, fileTitle) {
      if (headers) {
        items.unshift(headers)
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items)

      var csv = this.convertToCsv(jsonObject)

      var exportedFilenmae = fileTitle + '.csv' || 'export.csv'

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae)
      } else {
        var link = document.createElement('a')
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportedFilenmae)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    }
  }
}
</script>

<style scoped>
#download-data {
  background-color: #e4d7d7;
  height: 100vh;
  padding: 10vh;
}

.form-password {
  text-align: center;
}

.btn-confirmation {
  margin-top: 3vh;
}
</style>
