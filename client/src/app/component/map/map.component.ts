import { Component, inject, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';


declare global {
  interface Window {
    initMap:() => void;
    google:any
  }
}

declare var google:any

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{

  private apiSvc = inject(APIService)

  map!: google.maps.Map;

  userLat !: number
  userLong !: number


  async ngOnInit(): Promise<void> {
    await this.apiSvc.retrieveApiKeys()
    console.log(this.apiSvc.mapsApiKey)
    await this.loadGoogleMapsScript()
    await this.getUserCurrentPosition()
    await this.initMap()
    //await this.nearbySearch()
  }

  async loadGoogleMapsScript(): Promise<void> {
    return new Promise(
      (resolve, reject) => {
        if (typeof google != 'undefined' && google.maps) {
          resolve();
          return;
        }
        const mapKey = this.apiSvc.mapsApiKey
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&v=weekly&callback=initMap&loading=async&libraries=places,marker,core`
        script.async=true
        script.defer=true
        window['initMap'] = this.initMap.bind(this)
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
        console.log(this.userLat, this.userLong)
      },
      error => {
        console.error("error getting location: ", error)
      }
    )
  }

  async initMap() {
    const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    let center = new google.maps.LatLng(this.userLat, this.userLong);
    console.log("there")

    this.map = new Map(document.getElementById('map') as HTMLElement, {
      center: center,
      zoom: 11,
      mapId: 'DEMO_MAP_ID',
    });
    const request = {
      fields: ['displayName', 'location', 'businessStatus'],
      locationRestriction: {
        center: center,
        radius: 2500,
      },
      includedPrimaryTypes: ['doctor', 'hospital'],
      maxResultCount: 5,
      rankPreference: SearchNearbyRankPreference.POPULARITY,
      language: 'en-US',
      region: 'us',
    };

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
      });

      this.map.fitBounds(bounds);

    } else {
      console.log("No results");
    }
    
  }

  // async nearbySearch() {
  //   const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
  //   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  //   console.log("in")
  //   let center = new google.maps.LatLng(this.userLat, this.userLong);

  //   const request = {
  //     fields: ['displayName', 'location', 'businessStatus'],
  //     locationRestriction: {
  //       center: center,
  //       radius: 2500,
  //     },
  //     includedPrimaryTypes: ['doctor', 'hospital'],
  //     maxResultCount: 5,
  //     rankPreference: SearchNearbyRankPreference.POPULARITY,
  //     language: 'en-US',
  //     region: 'us',
  //   };

  //   const { places } = await Place.searchNearby(request);

  //   if (places.length) {
  //     console.log(places);

  //     const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
  //     const bounds = new LatLngBounds();

  //     // Loop through and get all the results.
  //     places.forEach((place) => {
  //       const marker = new AdvancedMarkerElement({
  //         map: this.map,
  //         position: place.location,
  //         title: place.displayName,
  //       });
  //       marker.addListener(
  //         'click', ()=>{
  //           const lat = marker.position?.lat
  //           const lng = marker.position?.lng
  //           window.open(
  //             `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  //             '_blank'
  //           )
  //         }
  //       )

  //       bounds.extend(place.location as google.maps.LatLng);
  //     });

  //     this.map.fitBounds(bounds);

  //   } else {
  //     console.log("No results");
  //   }
  // }

}
