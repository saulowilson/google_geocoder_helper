import {Alert, Platform} from 'react-native';
import {LatLng, Region} from 'react-native-maps';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import Axios from 'axios';
import {
  IGeocoderResponse,
  IGeocoderResponseProps,
  AddressComponent,
  Location,
} from './GoogleGeocodeType';
import {GOOGLE_CLOUD_MAPS_KEY} from '../consts';
import {store} from '../../store';
import {changeHomeFormFields} from '../../actions/home';

export const checkLocationPermission = async () => {
  try {
    const permissionByPlatform = Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    });
    const permission_result = await request(permissionByPlatform!);
    store.dispatch(
      changeHomeFormFields({location_permission: permission_result}),
    );
    return permission_result;
  } catch (err) {}
};

export const getCurrentLocation = async (): Promise<Region | any> => {
  const permission = await checkLocationPermission();
  if (permission == 'granted') {
    return await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        ({coords: {latitude, longitude}}) => {
          resolve({
            latitude,
            longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          });
          return;
        },
        (error) => {
          reject({error, msg: 'Erro ao recuperar a localização'});
          return;
        },
        {enableHighAccuracy: true, timeout: 15},
      );
    });
  } else {
    return new Error('Permission denied.')
  }
  //reject({ permission_result, msg: "Erro ao solicitar a permissão" })
};

export const getCoordinatesByAddress = async (
  address: string,
): Promise<Region | any> => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  return new Promise<Region | {}>((resolve, reject) => {
    Axios({
      url: baseUrl,
      params: {
        address: address,
        key: GOOGLE_CLOUD_MAPS_KEY,
      },
    }).then(
      (response) => {
        const geocodeResponse: IGeocoderResponse = response.data;

        if (geocodeResponse.status == 'OK') {
          for (let i = 0; i < geocodeResponse.results.length; i++) {
            const el: IGeocoderResponseProps = geocodeResponse.results[i];

            const route = el.address_components?.filter(
              (el: AddressComponent) => el.types.includes('route'),
            )[0]!;
            const number = el.address_components?.filter((el) =>
              el.types.includes('street_number'),
            )[0]!;
            const {lat, lng}: Location = el.geometry?.location!;
            const region: Region = {
              latitude: lat,
              latitudeDelta: 0.002,
              longitude: lng,
              longitudeDelta: 0.002,
            };

            resolve({success: true, route, number, region});
          }
        } else {
          reject({
            success: false,
            msg: 'Não foi possível obter os dados.',
            code: geocodeResponse.status,
          });
        }
      },
      (error) => reject(error),
    );
  });
};

export const getAddressByCoordinates = (latlng: LatLng) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  return new Promise((resolve, reject) => {
    Axios({
      url: baseUrl,
      params: {
        latlng: `${latlng.latitude},${latlng.longitude}`,
        key: GOOGLE_CLOUD_MAPS_KEY,
      },
    }).then(
      (response) => {
        const geocodeResponse: IGeocoderResponse = response.data;
        if (geocodeResponse.status == 'OK') {
          for (let i = 0; i < geocodeResponse.results.length; i++) {
            const el: IGeocoderResponseProps = geocodeResponse.results[i];

            const route =
              el.address_components?.filter((el: AddressComponent) =>
                el.types.includes('route'),
              )[0]! || '';
            const number =
              el.address_components?.filter((el) =>
                el.types.includes('street_number'),
              )[0]! || '';
            const city =
              el.address_components?.filter((el) =>
                el.types.includes('administrative_area_level_2'),
              )[0]! || '';
            const postal_code =
              el.address_components?.filter((el) =>
                el.types.includes('postal_code'),
              )[0]! || '';

            resolve({
              success: true,
              rua: route.long_name,
              numero: number.long_name,
              cidade: city.long_name,
              cep: postal_code.long_name,
            });
          }
        } else {
          reject({
            success: false,
            msg: 'Não foi possível obter os dados.',
            code: geocodeResponse.status,
          });
        }
      },
      (error) => reject(error),
    );
  });
};

export const calDelta = (
  lat: number,
  long: number,
  accuracy: number,
): Region => {
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
  const latDelta = accuracy / oneDegreeOfLatitudeInMeters;
  const longDelta =
    accuracy / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));

  return {
    latitude: lat,
    longitude: long,
    latitudeDelta: latDelta,
    longitudeDelta: longDelta,
  };
};
