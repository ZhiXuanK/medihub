import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{

  map!: google.maps.Map;
  // directionService !: google.maps.DirectionsService
  // directionRenderer !: google.maps.DirectionsRenderer

  userLat !: number
  userLong !: number

  async ngOnInit(): Promise<void> {
    await this.loadGoogleMapsScript()
    await this.getUserCurrentPosition()
    await this.initMap()
    await this.nearbySearch()
  }

  async loadGoogleMapsScript(): Promise<void> {
    return new Promise(
      (resolve, reject) => {
        if (typeof google != 'undefined' && google.maps) {
          resolve();
          return;
        }
        const script = document.createElement('script')
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC1M8t4DPilLHeJsmuiloHQT_YAMKFqeCk&loading=async&callback=initMap&libraries=places"
        script.onload = () => { resolve(); }
        script.onerror = (error: any) => { reject(error) }
        document.head.append(script)
      }
    )
  }

  async getUserCurrentPosition() {
    await navigator.geolocation.getCurrentPosition(
      position => {
        this.userLat = position.coords.latitude
        this.userLong = position.coords.longitude
      },
      error => {
        console.error("error getting location: ", error)
      }
    )
  }

  async initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

    let center = new google.maps.LatLng(this.userLat, this.userLong);

    this.map = new Map(document.getElementById('map') as HTMLElement, {
      center: center,
      zoom: 11,
      mapId: 'DEMO_MAP_ID',
    });
    //this.nearbySearch();


    // this.directionService = new google.maps.DirectionsService()
    // this.directionRenderer = new google.maps.DirectionsRenderer()
    // this.directionRenderer.setMap(this.map)
  }

  async nearbySearch() {
    //@ts-ignore
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // Restrict within the map viewport.
    let center = new google.maps.LatLng(this.userLat, this.userLong);

    const request = {
      // required parameters
      fields: ['displayName', 'location', 'businessStatus'],
      locationRestriction: {
        center: center,
        radius: 2500,
      },
      // optional parameters
      includedPrimaryTypes: ['doctor', 'hospital'],
      maxResultCount: 5,
      rankPreference: SearchNearbyRankPreference.POPULARITY,
      language: 'en-US',
      region: 'us',
    };

    //@ts-ignore
    const { places } = await Place.searchNearby(request);

    if (places.length) {
      console.log(places);

      const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
      const bounds = new LatLngBounds();

      // Loop through and get all the results.
      places.forEach((place) => {
        const marker = new AdvancedMarkerElement({
          map: this.map,
          position: place.location,
          title: place.displayName,
        });
        marker.addListener(
          'click', ()=>{
            const lat = marker.position?.lat
            const lng = marker.position?.lng
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
              '_blank'
            )
          }
        )

        bounds.extend(place.location as google.maps.LatLng);
        console.log(place);
      });

      this.map.fitBounds(bounds);

    } else {
      console.log("No results");
    }
  }

}
