const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { Level2Radar } = require('../nexrad')
import * as tf from '@tensorflow/tfjs'

let radar = null
let fileLoading = false

Math.radians = function(degrees) {
    return degrees * Math.PI / 180
}

app.use('/', express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', client => {
    // load and parse the radar file
    client.on('loadFile', file => {
        client.emit('fileLoading', true)
        fileLoading = true
        radar = new Level2Radar(file).then(radarData => {
            radar = radarData
            fileLoading = false
            client.emit('fileLoading', false)
            client.emit('setScans', radarData.getScans())
        })
    })

    // set elevation for the scan
    client.on('setElevation', elevation => {
        if(radar) {
            radar.setElevation(elevation)
        } else {
            client.emit('error', {message: 'No file loaded'})
        }
    })

    // grab radar moment data for the current sweep
    client.on('sweep', sweep => {
        /**
         * If we have a radar data file loaded we go ahead
         * and do some calculations to plot the data to their
         * x,y coordinates. We then emit that information to
         * the client for plotting with THREE.js
         */
        if(radar) {
            let reflectivity = radar.getHighresReflectivity(sweep)
            let azimuth = tf.scalar(Math.radians(radar.getAzimuth(sweep)))

            let range = tf.range(0, reflectivity.gate_count, 1)
                .mul(tf.scalar(reflectivity.gate_size))
                .add(tf.scalar(reflectivity.first_gate))

            let x = range.mul(tf.sin(azimuth))
            let y = range.mul(tf.cos(azimuth))

            x.data().then(x => {
                let coords = {x: JSON.stringify(x)}
                y.data().then(y => {
                    coords.y = JSON.stringify(y)
                    let data = reflectivity.moment_data
                    client.emit('plot', {coords, data})
                })
            })
        } else {
            client.emit('error', {message: 'No file loaded'})
        }
    })
})

http.listen(8080, () => {
    console.log('Listening on *:3000')
})