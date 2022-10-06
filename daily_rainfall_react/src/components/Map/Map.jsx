import { getDatabase, onChildAdded, ref } from "firebase/database"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import React, { useEffect, useRef, useState } from "react"
import { FeatureLayer } from "react-esri-leaflet"
import {
	LayerGroup,
	LayersControl,
	MapContainer,
	Marker,
	Popup,
	TileLayer
} from "react-leaflet"
import LastUpdated from "./LastUpdated"
import "./map.css"

const Map = () => {
	// State to hold the users data forms
	const [rainfallData, setRainfallData] = useState([])
	// State to hold the leaflet map
	const [mapState, setMapState] = useState(null)

	/*
        Listen for any changes to the rainfallData path and append the data to the rainfallData state list
    */
	useEffect(() => {
		const today = new Date()
		const date = `${today.getDate()}-${
			today.getMonth() + 1
		}-${today.getFullYear()}`

		//
		const db = getDatabase()
		// Get Data for the current day
		const dbRef = ref(db, `rainfallData/${date}`)
		onChildAdded(dbRef, (childData) => {
			const returnedData = childData.val()
			// Loop through the hours to access users data
			Object.values(returnedData).map((data) => {
				return setRainfallData((prevRainfallData) => {
					return [...prevRainfallData, data]
				})
			})
		})
	}, [])

	/*
		Add the popup to the SAWS data layer
	*/
	const sawsRef = useRef(null)
	useEffect(() => {
		if (mapState) {
			sawsRef.current.bindPopup((layer) => {
				return L.Util.template(
					"Rainfall Amount: {Rainfall}mm",
					layer.feature.properties
				)
			})
		}
	}, [mapState])

	/*
		Styling for the SAWS data icons
	*/
	const sawsLevel1 = L.icon({
		iconUrl: "/saws_level1.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		className: "saws-marker"
	})

	const sawsLevel2 = L.icon({
		iconUrl: "/saws_level2.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		className: "saws-marker"
	})

	const sawsLevel3 = L.icon({
		iconUrl: "/saws_level3.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		className: "saws-marker"
	})

	const sawsLevel4 = L.icon({
		iconUrl: "/saws_level4.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		className: "saws-marker"
	})

	/*
		Styling for the user data
		Depending on the rainfall amount render a different icon
	*/
	const getUserIcon = (rainAmount) => {
		if (rainAmount > 0 && rainAmount <= 10) {
			return userIconLevel1
		} else if (rainAmount > 10 && rainAmount <= 20) {
			return userIconLevel2
		} else if (rainAmount > 20 && rainAmount <= 50) {
			return userIconLevel3
		} else if (rainAmount > 50) {
			return userIconLevel4
		}
	}

	const userIconLevel1 = L.icon({
		iconUrl: "/user_level1.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [10, -34]
	})

	const userIconLevel2 = L.icon({
		iconUrl: "/user_level2.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [10, -34]
	})

	const userIconLevel3 = L.icon({
		iconUrl: "/user_level3.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [10, -34]
	})

	const userIconLevel4 = L.icon({
		iconUrl: "/user_level4.png",
		iconSize: [30, 30],
		iconAnchor: [12, 41],
		popupAnchor: [10, -34]
	})

	/*
		Add a popup to the EUMETSAT data layer
	*/
	const eumetsatRef = useRef()
	useEffect(() => {
		if (mapState) {
			eumetsatRef.current.bindPopup((layer) => {
				return L.Util.template(
					"Rainfall Amount: {Rainfall}mm",
					layer.feature.properties
				)
			})
		}
	}, [mapState])

	/*
		Adds a legend when the eumetsat layer is toggled on and removes the legend when the layer is toggled off
	*/
	useEffect(() => {
		if (mapState) {
			const legend = L.control({ position: "bottomright" })

			legend.onAdd = () => {
				const div = L.DomUtil.create("div", "legend")
				div.innerHTML = `
					<table id="eumetsat-legend-table">
						<tr>
							<th  colspan="2">Rainfall (mm)</th>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #ffffd9;"></td>
							<td class="center-text">0 - 5</td>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #edf8b1;"></td>
							<td class="center-text">6 - 10</td>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #c7e9b4;"></td>
							<td class="center-text">11 - 15</td>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #7fcdbb;"></td>
							<td class="center-text">16 - 20</td>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #41b6c4;"></td>
							<td class="center-text">21 - 30</td>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #1d91c0;"></td>
							<td class="center-text">31 - 40</td>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #225ea8;"></td>
							<td class="center-text">41 - 50</td>
						</tr>
						<tr>
							<td class="color-width" style="background-color: #0c2c84;"></td>
							<td class="center-text">&gt; 50</td>
						</tr>
					</table>
				`
				return div
			}

			mapState.on({
				// If the overlay added is the eumetsat layer add the legend
				overlayadd: (layer) => {
					if (layer.name === "EUMETSAT Data") {
						mapState.addControl(legend)
					}
				},
				// If the overlay removed is the eumetsat layer remove the legend
				overlayremove: (layer) => {
					if (layer.name === "EUMETSAT Data") {
						mapState.removeControl(legend)
					}
				}
			})
		}
	}, [mapState])

	return (
		<MapContainer
			center={[-28.7, 24.5]}
			zoom={6}
			// Maxzoom limited to not allow users to see exact locations of people that have submitted data
			maxZoom={15}
			ref={setMapState}
		>
			{/* Add a layer conroll to the to right of the map */}
			<LayersControl position="topright">
				{/* 
					Add the following basemaps to the layer controller:
					CARTO Positron
					Stamen Terrain
					MapTiler Satellite  
        		*/}
				<LayersControl.BaseLayer name="Street" checked="true">
					<TileLayer
						attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
						url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
					/>
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name="Satellite">
					<TileLayer
						attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
						url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=eZCyjSWzBFgck1GSe8n5"
					/>
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name="Terrain">
					<TileLayer
						attribution="Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright'>ODbL</a>."
						url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
					/>
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name="Toner">
					<TileLayer
						attribution="Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright'>ODbL</a>."
						url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
					/>
				</LayersControl.BaseLayer>
				{/* Layercontroll option for the user data */}
				<LayersControl.Overlay name="User Data">
					{/* 
						Map through the rainfall data and add a point for each user that has uploaded the data
						Each marker must have a popup with the rainfall amount
					*/}
					<LayerGroup>
						{rainfallData.map((point) => {
							return (
								<Marker
									key={point.formId}
									position={[point.latitude, point.longitude]}
									icon={getUserIcon(point.rainfallAmount)}
								>
									<Popup>Rainfall Amount: {point.rainfallAmount}mm</Popup>
								</Marker>
							)
						})}
					</LayerGroup>
				</LayersControl.Overlay>
				{/* Layer control for the SAWS data */}
				<LayersControl.Overlay checked={true} name="SAWS Data">
					<FeatureLayer
						url={
							"https://services8.arcgis.com/ZhTpwEGNVUBxG9VW/ArcGIS/rest/services/saws_rainfall/FeatureServer/0"
						}
						ref={sawsRef}
						pointToLayer={(geojson, latLng) => {
							if (
								geojson.properties.Rainfall > 0 &&
								geojson.properties.Rainfall <= 10
							) {
								return L.marker(latLng, {
									icon: sawsLevel1
								})
							} else if (
								geojson.properties.Rainfall > 10 &&
								geojson.properties.Rainfall <= 20
							) {
								return L.marker(latLng, {
									icon: sawsLevel2
								})
							} else if (
								geojson.properties.Rainfall > 20 &&
								geojson.properties.Rainfall <= 50
							) {
								return L.marker(latLng, {
									icon: sawsLevel3
								})
							} else if (geojson.properties.Rainfall > 50) {
								return L.marker(latLng, {
									icon: sawsLevel4
								})
							}
						}}
					/>
				</LayersControl.Overlay>
				<LayersControl.Overlay name="EUMETSAT Data">
					<FeatureLayer
						ref={eumetsatRef}
						url={
							"https://services8.arcgis.com/ZhTpwEGNVUBxG9VW/ArcGIS/rest/services/eumetsat_grid/FeatureServer/0"
						}
						style={(feature) => {
							if (feature.properties.Rainfall <= 0) {
								return { color: "transparent" }
							} else if (
								feature.properties.Rainfall > 0 &&
								feature.properties.Rainfall < 6
							) {
								return { color: "#ffffd9", weight: 3 }
							} else if (
								feature.properties.Rainfall >= 6 &&
								feature.properties.Rainfall < 11
							) {
								return { color: "#edf8b1", weight: 3 }
							} else if (
								feature.properties.Rainfall >= 11 &&
								feature.properties.Rainfall < 16
							) {
								return { color: "#c7e9b4", weight: 3 }
							} else if (
								feature.properties.Rainfall >= 16 &&
								feature.properties.Rainfall < 21
							) {
								return { color: "#7fcdbb", weight: 3 }
							} else if (
								feature.properties.Rainfall >= 21 &&
								feature.properties.Rainfall < 31
							) {
								return { color: "#41b6c4", weight: 3 }
							} else if (
								feature.properties.Rainfall >= 31 &&
								feature.properties.Rainfall < 41
							) {
								return { color: "#1d91c0", weight: 3 }
							} else if (
								feature.properties.Rainfall >= 41 &&
								feature.properties.Rainfall <= 50
							) {
								return { color: "#225ea8", weight: 3 }
							} else if (feature.properties.Rainfall > 50) {
								return { color: "#0c2c84", weight: 3 }
							}
						}}
					/>
				</LayersControl.Overlay>
			</LayersControl>
			<LastUpdated mapState={mapState} />
		</MapContainer>
	)
}

export default Map
