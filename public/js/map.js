
getBuilding = async () => {
    try {
        const response = await fetch("/buildings");
        const result = await response.json();
        result.forEach(function (element) {

            //"POLYGON((-81.6943286353165 41.5051124769817,-81.......,-81.6943286353165 41.5051124769817))"            
            var pntsString = element.geom.replace("POLYGON((", "").replace("))", "");
            var pntsList = pntsString.split(",");
            points = [];
            pntsList.forEach(function (latlon) {
                points.push([Number(latlon.split(" ")[1]), Number(latlon.split(" ")[0])])
            });

            var polygon = L.polygon(points).addTo(mymap);

        });
    } catch (err) {
        alert(err);
    }
};


var mymap = L.map('mapid').setView([41.505095, -81.693569], 17);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


getBuilding();


var popup = L.popup();

onMapClick = async (e) => {
    try {
        var pnt = {
            name: 'Hole',
            lon: e.latlng.lng,
            lat: e.latlng.lat
        };

        const headers = {
            "content-type": "application/json",
            accept: "application/json"
        };

        //Insert pnt
        var body = JSON.stringify(pnt);
        var response = await fetch(`/defects`, {
            method: "POST",
            headers,
            body
        });

        const result = await response.json();

        alert(result);

    } catch (err) {
        alert(err);
    }
}

mymap.on('click', onMapClick);
