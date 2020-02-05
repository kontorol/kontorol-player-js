import '../../src/index';
import {setup} from '../../src/setup';
import * as TestUtils from './utils/test-utils';
import StorageWrapper from '../../src/common/storage/storage-wrapper';

const targetId = 'player-placeholder_setup.spec';

describe('setup', function() {
  let config, kontorolPlayer, sandbox;
  const entryId = '0_wifqaipd';
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
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId,
        env: env
      }
    };
  });

  afterEach(function() {
    sandbox.restore();
    kontorolPlayer.destroy();
    kontorolPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function() {
    TestUtils.removeElement(targetId);
  });

  it('should create a full player', function(done) {
    kontorolPlayer = setup(config);
    kontorolPlayer.loadMedia.should.exist;
    kontorolPlayer.loadMedia({entryId: entryId}).then(() => {
      kontorolPlayer.config.sources.id.should.equal(entryId);
      kontorolPlayer.config.session.partnerId.should.equal(partnerId);
      done();
    });
  });

  it('should create an empty player', function() {
    kontorolPlayer = setup(config);
    (!kontorolPlayer.config.id).should.be.true;
  });

  it('should decorate the selected source by session id', function(done) {
    kontorolPlayer = setup(config);
    kontorolPlayer.loadMedia.should.exist;
    kontorolPlayer.loadMedia({entryId: entryId}).then(() => {
      kontorolPlayer.ready().then(() => {
        let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
        sessionIdRegex.exec(kontorolPlayer.src)[1].should.equal(kontorolPlayer.config.session.id);
        done();
      });
      kontorolPlayer.load();
    });
  });

  it('should set text style from storage', function() {
    let textStyle = {
      fontSize: '20%',
      fontFamily: 'sans-serif',
      fontColor: [14, 15, 0],
      fontOpacity: 0,
      backgroundColor: [1, 2, 3],
      backgroundOpacity: 1,
      fontEdge: [],
      fontScale: 1
    };
    sandbox
      .stub(StorageWrapper, 'getItem')
      .withArgs('textStyle')
      .returns(textStyle);
    kontorolPlayer = setup(config);
    kontorolPlayer.textStyle.should.deep.equal(textStyle);
  });

  it('should configure sources', function(done) {
    const url = 'http://cfvod.kontorol.com/pd/p/2196781/sp/219678100/serveFlavor/entryId/1_afvj3z0u/v/1/flavorId/1_vpmhfzgl/name/a.mp4';
    config.sources = {
      progressive: [
        {
          id: 'id',
          mimetype: 'video/mp4',
          url
        }
      ]
    };
    kontorolPlayer = setup(config);
    kontorolPlayer.load();
    kontorolPlayer.ready().then(() => {
      kontorolPlayer.src.should.equal(url);
      done();
    });
  });
});
