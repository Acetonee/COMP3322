let countries, name_filter, region_filter, sort_by;

function displayData() {
    let content = "";

    countries.forEach(
        function (country) {
            if ((name_filter && !country.name.toLowerCase().includes(name_filter.toLowerCase())) || (region_filter && region_filter !== country.region)) {
                return;
            }

            // start flag image
            content += "<div class='card' id='" + country.name.replace(/\s+/g, '-').toLowerCase() + "'><div class='flag' style='background: url(" + country.flag
            content += ") no-repeat 50%/contain'></div><div class='description'>"


            content += "<h3>" + country.name + "</h3>";
            content += "<b>Population:</b> " + country.population + "<br>";
            content += "<b>Area:</b> " + country.area + "<br>";
            content += "<b>Region:</b> " + country.region + "<br>";
            content += "<b>Subregion:</b> " + country.subregion + "<br>";
            content += "<b>Population:</b> " + country.population + "<br>";

            if (country.latlng) {
                content += "<b>Lat:</b> " + Math.round(country.latlng[0] * 1000) / 1000 + " &nbsp; <b>Lng:</b> " + Math.round(country.latlng[1] * 1000) / 1000 + " &nbsp; ";
                content += "<button onclick='mapHandler(" + country.latlng[1] + ", " + country.latlng[0] + ", " + country.area + ")'>Map</button><br>"
            }

            content += "<b>Code:</b> " + country.alpha3Code + " &nbsp; <b>Calling Code:</b> " + country.callingCodes;
            content += "</div></div>";
        }
    )
    document.getElementById("countries").innerHTML = content;
    document.getElementById("status").innerHTML = "Ordered By: " + sort_by + " &nbsp; Showed Region: " + (region_filter ? region_filter : "All");
}

window.onload = function () {
    document.body.innerHTML = "<header><h1>Countries / Territories / Areas</h1></header><main><div id='toolbar'><input type='text' placeholder='Search name...' onkeydown='search(this)'><button id='search-close' onclick='clearSearch()'>&times;</button><div id='dropdown-con' class='show'><div class='dropdown'><button onclick='sortByMenu()' class='dropbtn'>Sort by</button><div id='sortByMenu' class='dropdown-content'><button onclick='sortCountries(0)'>Area</button><button onclick='sortCountries(1)'>Name</button><button onclick='sortCountries(2)'>Population</button></div></div><div class='dropdown'><button onclick='byRegionMenu()' class='dropbtn'>By Region</button><div id='byRegionMenu' class='dropdown-content'><button onclick='selectRegion()'>All</button><button onclick='selectRegion(\"Africa\")'>Africa</button><button onclick='selectRegion(\"Americas\")'>Americas</button><button onclick='selectRegion(\"Asia\")'>Asia</button><button onclick='selectRegion(\"Europe\")'>Europe</button><button onclick='selectRegion(\"Oceania\")'>Oceania</button><button onclick='selectRegion(\"Polar\")'>Polar</button></div></div></div></div><div id='status'></div><section id='countries'></section></main>";

    fetch("https://restcountries.com/v2/all")
        .then(response => response.json())
        .then(
            data => {
                countries = data;
                sortCountries();
                displayData();
            }
        );
}


function mapHandler(long, lat, area) {
    let map_div = document.createElement("div");
    map_div.id = "map";
    map_div.innerHTML = "<button id='map-close' onclick='mapClose()'>Close</button>";
    document.getElementsByTagName("main")[0].appendChild(map_div);
    let content = "<div id='map'></div>",
        map = new ol.Map({
            target: 'map',
            layers: [ new ol.layer.Tile({ source: new ol.source.OSM() }) ],
            view: new ol.View({
                center: ol.proj.fromLonLat([long, lat]), zoom: 11 - Math.log10(area / (16 - Math.log10(area)))
            })
        });
}

function mapClose() {
    document.getElementById("map").remove();
}

function search(key) {
    console.log(event.key, key.value);
    if (event.key === "Enter") {
        name_filter = key.value;
        displayData();
        if (name_filter) {
            document.getElementById("dropdown-con").classList.remove("show");
        } else {
            document.getElementById("dropdown-con").classList.add("show");
        }
    }
}

function clearSearch() {
    document.getElementsByTagName("input")[0].value = "";
    name_filter = "";
    displayData();
    if (name_filter) {
        document.getElementById("dropdown-con").classList.remove("show");
    } else {
        document.getElementById("dropdown-con").classList.add("show");
    }
}

function sortByMenu() {
    document.getElementById("sortByMenu").classList.toggle("show");
}

function sortCountries(option = 1) {
    switch (option) {
        case 0:
            countries.sort((a, b) => (a.area > b.area) ? -1 : ((b.area > a.area) ? 1 : 0));
            sort_by = "Area";
            break;
        case 2:
            countries.sort((a, b) => (a.population > b.population) ? -1 : ((b.population > a.population) ? 1 : 0));
            sort_by = "Population";
            break;
        default:
            countries.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            sort_by = "Name";
            break;
    }
    displayData();
}

function byRegionMenu() {
    document.getElementById("byRegionMenu").classList.toggle("show");
}

function selectRegion(option = "") {
    region_filter = option;
    displayData();
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i of dropdowns) {
            if (i.classList.contains('show')) {
                i.classList.remove('show');
            }
        }
    }
}
