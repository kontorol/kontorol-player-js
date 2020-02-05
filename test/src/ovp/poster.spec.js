import {addKontorolPoster} from '../../../src/ovp/poster';
import * as TestUtils from '../utils/test-utils';
import {setup} from '../../../src/setup';
import {Provider} from 'pakhshkit-js-providers';

const targetId = 'player-placeholder_ovp/poster.spec';

describe('addKontorolPoster', function() {
  it('should append width and height to kontorol poster', function() {
    const mediaSources = {poster: '/p/1091/thumbnail/entry_id/0_wifqaipd/2'};
    const playerSources = {poster: '/p/1091/thumbnail/entry_id/0_wifqaipd/2'};
    addKontorolPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('/p/1091/thumbnail/entry_id/0_wifqaipd/2/height/360/width/640');
  });

  it('should not append width and height to non kontorol poster', function() {
    const mediaSources = {poster: 'https//my/kontorol/poster'};
    const playerSources = {poster: 'https//my/kontorol/poster'};
    addKontorolPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('https//my/kontorol/poster');
  });

  it('should not append width and height to configured kontorol poster', function() {
    const mediaSources = {poster: 'https//my/kontorol/poster'};
    const playerSources = {poster: 'https//my/non/kontorol/poster'};
    addKontorolPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('https//my/non/kontorol/poster');
  });

  describe('Poster Integration', function() {
    let config, kontorolPlayer, sandbox, provider;
    const myCustomPosterUrl = 'https://www.elastic.co/assets/bltada7771f270d08f6/enhanced-buzz-1492-1379411828-15.jpg';
    const entryId = '0_wifqaipd';
    const alterEntryId = '0_4ktof5po';
    const partnerId = 1091;
    const env = {
      cdnUrl: 'http://qa-apache-php7.dev.kontorol.com/',
      serviceUrl: 'http://qa-apache-php7.dev.kontorol.com/api_v3'
    };

    before(function() {
      TestUtils.createElement('DIV', targetId);
    });

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      provider = new Provider({
        partnerId: partnerId,
        env: env
      });
      config = {
        targetId: targetId,
        provider: {
          partnerId: partnerId,
          env: env
        },
        sources: {}
      };
    });

    afterEach(function() {
      sandbox.restore();
      kontorolPlayer.destroy();
      provider = null;
      TestUtils.removeVideoElementsFromTestPage();
    });

    after(function() {
      TestUtils.removeElement(targetId);
    });

    it('should choose configured poster', function(done) {
      config.sources.poster = myCustomPosterUrl;
      kontorolPlayer = setup(config);
      kontorolPlayer.loadMedia({entryId: entryId}).then(() => {
        kontorolPlayer.config.sources.poster.should.equal(myCustomPosterUrl);
        done();
      });
    });

    it('should choose backend poster', function(done) {
      kontorolPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        kontorolPlayer.loadMedia({entryId: entryId}).then(() => {
          kontorolPlayer.config.sources.poster.should.have.string(mediaConfig.sources.poster);
          done();
        });
      });
    });

    it('should choose backend poster on change media', function(done) {
      kontorolPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        kontorolPlayer.loadMedia({entryId: entryId}).then(() => {
          kontorolPlayer.config.sources.poster.should.have.string(mediaConfig.sources.poster);
          provider.getMediaConfig({entryId: alterEntryId}).then(alterMediaConfig => {
            kontorolPlayer.loadMedia({entryId: alterEntryId}).then(() => {
              kontorolPlayer.config.sources.poster.should.have.string(alterMediaConfig.sources.poster);
              done();
            });
          });
        });
      });
    });

    it('should choose configured poster on change media', function(done) {
      kontorolPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        kontorolPlayer.loadMedia({entryId: entryId}).then(() => {
          kontorolPlayer.config.sources.poster.should.have.string(mediaConfig.sources.poster);
          kontorolPlayer.reset();
          kontorolPlayer.configure({
            sources: {
              poster: myCustomPosterUrl
            }
          });
          kontorolPlayer.loadMedia({entryId: alterEntryId}).then(() => {
            kontorolPlayer.config.sources.poster.should.equal(myCustomPosterUrl);
            done();
          });
        });
      });
    });
  });
});
