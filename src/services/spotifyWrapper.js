import SpotifyWebApi from 'spotify-web-api-node';
import WebApiRequest from 'spotify-web-api-node/src/webapi-request.js';
import HttpManager from 'spotify-web-api-node/src/http-manager.js';

class CustomSpotifyApi extends SpotifyWebApi {
  constructor({clientId, clientSecret, refreshToken}) {
    super({ clientId, clientSecret, refreshToken });
  }

  getQueue(callback) {
    return WebApiRequest.builder(this.getAccessToken())
      .withPath('/v1/me/player/queue')
      .build()
      .execute(HttpManager.get, callback);
  }
}

export default CustomSpotifyApi;