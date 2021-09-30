import { AfterViewInit, Component, Output, EventEmitter } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { InspectionSite } from "src/app/models/classes";
import { SearchService, StateService } from "src/app/providers";
import {
  mapboxAccessToken,
  S4_DARK_D,
  S4_DARK_L,
  S4_TEAL_DARK,
  changingStations,
  S4_ORANGE,
  S4_BLUE,
  S4_TEAL,
  S4_YELLOW,
  S4_RED,
  S4_BLUE_DARK,
  S4_DARK,
} from "../../utilities";
import * as turf from "@turf/turf";
@Component({
  selector: "map",
  template: ` <div id="map"></div> `,
})
export class MapComponent implements AfterViewInit {
  @Output() loaded = new EventEmitter<boolean>();
  constructor(private _state: StateService, private _search: SearchService) {}
  ngAfterViewInit(): void {
    this._renderMap();
  }

  private _renderMap(): void {
    const map = new mapboxgl.Map({
      accessToken: mapboxAccessToken,
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: <mapboxgl.LngLatLike>[-83.21, 27.945],
      minZoom: 3,
      maxZoom: 22,
      zoom: 5,
      maxPitch: 0,
      pitchWithRotate: false,
      dragRotate: false,
      bounds: [
        -88.7913555870355, 23.1833657804932, -78.759563547487, 32.2458363737886,
      ],
      maxBounds: [
        [-99.0, 18.205],
        [-65.0, 34.047],
      ],
    });
    map.once("load", () => {
      map.loadImage('assets/images/map-marker.png', (error, image) => {
        if (error) throw error;
        if(image) map.addImage("marker", image, { sdf: true });
        map
          .addSource(changingStations, {
            type: "vector",
            url: "mapbox://signalfourlab.cktzwz1i40m0d27oejuztpb1f-2d92m",
            minzoom: 8,
          })
          .addLayer({
            id: changingStations,
            type: "symbol",
            source: changingStations,
            "source-layer": changingStations,
            layout:{
              'icon-image': 'marker',
              'icon-anchor': "bottom",
              "icon-size": [
                "interpolate",
                ["exponential", 1.1],
                ["zoom"],
                5,
                0.7,
                12,
                1,
                22,
                2.5,
              ],
            },
            paint: {
              "icon-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                S4_RED,
                ["boolean", ["feature-state", "hovered"], false],
                S4_ORANGE,
                S4_BLUE,
              ]
            },
          })
          .on("click", changingStations, (evt: any) => this.onSelect(evt))
          .on("mouseenter", changingStations, (evt) => this.onHover(evt, map))
          .on("mouseleave", changingStations, (evt) =>
            this.onHoverEnd(evt, map)
          )
          .on("moveend", () => this.updateCardList(map));

        this._state.map = map;
        this.loaded.emit(true);
      });
    });
  }
  private onHover = (evt: any, map: mapboxgl.Map) => {
    map.getCanvas().style.cursor = "pointer";
    if (evt.features.length > 0) {
      let key = evt.features[0].id;
      if (key !== this._state.selected.value) {
        this._state.setFeatureState("hovered", true, key);
        this._state.hovered.next(key);
      }
    }
  };
  private onHoverEnd = (evt: any, map: mapboxgl.Map) => {
    map.getCanvas().style.cursor = "";
    if (this._state.hovered.value) {
      this._state.setFeatureState("hovered", false, this._state.hovered.value);
      this._state.hovered.next(undefined);
    }
  };
  private onSelect = (evt: any) => {
    if (evt.features.length > 0) {
      let key = evt.features[0].id;
      this._state.select(key);
    }
  };

  private updateCardList = (map: mapboxgl.Map) => {
    if (map.getZoom() >= 8) {
      setTimeout(() => {
        let windowSize = {width: window.innerWidth, height: window.innerHeight};
        let activePanels = this._state.activePanels;
        let searchBoundary: any;
        if (activePanels === 'bottom') {
          searchBoundary = [[0,(windowSize.height - 230)],[(windowSize.width), 60]];
        }
        else if (activePanels === 'left') {
          searchBoundary = [[420,(windowSize.height) ],[(windowSize.width), 60]]
        }
        else if (activePanels === 'both') {
          searchBoundary = [[420,(windowSize.height - 230)],[(windowSize.width),60]];
        }
        else {
          searchBoundary = [[0, (windowSize.height)],[(windowSize.width), 60]]
        }
        console.log(searchBoundary)
        let featureCollection = map.queryRenderedFeatures(searchBoundary, {
          layers: [changingStations],
        });
        console.log(featureCollection);
        if (featureCollection.length > 0) {
          let features: InspectionSite[] = featureCollection.map(
            (feature: any) => {
              return {
                id: feature.id,
                ...feature.geometry,
                ...feature.properties,
              } as InspectionSite;
            }
          );
          if (this._state.selected.value !== undefined) {
            let selected = this._state.getSelectedSite(
              this._state.selected.value
            );
            console.log(selected);
            if (selected) features.unshift(selected);
          }
          let withoutDuplicates: InspectionSite[] = [];
          let lngLat: any, from: any, options: any;
          if (this._state.marker !== undefined) {
            lngLat = this._state.marker.getLngLat();
            from = turf.point([lngLat.lng, lngLat.lat]);
            options = { units: "miles" };
          }
          features.forEach((feature, i) => {
            let exists = withoutDuplicates.find((f) => f.id === feature.id);
            if (!exists) {
              if (from !== undefined && options !== undefined) {
                const to = turf.point(feature.coordinates);
                let distance = parseFloat(
                  turf.distance(from, to, options).toFixed(2)
                );
                console.log(distance);
                feature.distance = distance;
              }
              withoutDuplicates.push(feature);
            }
          });

          this._state.cardList.next(withoutDuplicates);
        } else {
          this._state.cardList.next([]);
        }
      }, 250);
    } else {
      this._state.cardList.next([]);
    }
  };
}
