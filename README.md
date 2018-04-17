# nexrad-webgl-plotter
-
### v0.1.0
> This is an example of how you might plot radar data which has been decoded using [nexrad-radar-data](https://github.com/bartholomew91/nexrad-radar-data). The points are plotted using THREE.js. I'm no expert with THREE.js so some points might be plotted wrong, but it provides a general idea of what you can use the data for.

## Running
``` bash
git clone git@github.com:bartholomew91/nexrad-webgl-plotter.git

cd nexrad-webgl-plotter
cd dist
npm install
node index.js
```
## Using the Example
Go to the [plotter](http://localhost:8080) webpage (it should be running at http://localhost:8080).

Select a radar file to load from the dropdown and click "Load File"

After the radar file has been loaded you can click on "Start Sweep" and it should start plotting the data.

![image](https://i.imgur.com/om2p7Eq.jpg)

## ToDo
* More accurate plotting
* Alternate colortables
* Increase plotting speed
