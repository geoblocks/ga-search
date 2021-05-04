import {LitElement, html} from 'lit-element';
import Autocomplete from '@trevoreyre/autocomplete-js';
import Storage from './storage';

const baseUrl = 'https://api3.geo.admin.ch/rest/services/api/SearchServer';
const searchUrl = baseUrl + '?geometryFormat=geojson&sr={sr}&lang={lang}&limit={limit}&searchText={input}';
const locationSearchUrl = searchUrl + '&type=locations&origins={origins}';
const layerSearchUrl = searchUrl + '&type=layers';
const featureSearchUrl = searchUrl + '&type=featuresearch&features={layers}';

class GeoadminSearch extends LitElement {

  static get properties() {
    return {
      minlength: {type: Number},
      limit: {type: Number},
      debounceTime: {type: Number},
      lang: {type: String},
      types: {type: String},
      sr: {type: String},
      locationOrigins: {type: String},
      featureLayers: {type: String},
      filterResults: {type: Object},
      renderResult: {type: Object},
      additionalSource: {type: Object},
      storage: {type: Object}
    };
  }

  constructor() {
    super();

    this.minlength = 1;
    this.limit = 15;
    this.debounceTime = 200;
    this.types = 'location';
    this.sr = '4326';
    this.locationOrigins = 'zipcode,gg25';
    this.filterResults = undefined;
    this.renderResult = undefined;
    this.additionalSource = undefined;
    this.storage = new Storage();
    this.storage.setLimit(10);
  }

  slotReady() {
    this.autocomplete = new Autocomplete(this, {
      debounceTime: this.debounceTime,

      search: input => {
        return new Promise(resolve => {
          const urls = [];
          if (input.length < this.minlength) {
            const history = this.storage.getHistory();
            resolve(history);
          }
          if (input.length >= this.minlength) {
            if (this.types.includes('location')) {
              const locationUrl = locationSearchUrl.replace('{origins}', this.locationOrigins);
              urls.push(locationUrl);
            }
            if (this.types.includes('layer')) {
              urls.push(layerSearchUrl);
            }
            if (this.types.includes('feature') && this.featureLayers) {
              const featureUrl = featureSearchUrl.replace('{layers}', this.featureLayers);
              urls.push(featureUrl);
            }
            const promises = urls.map(url => {
              url = url
                .replace('{lang}', this.lang || document.documentElement.lang)
                .replace('{sr}', this.sr)
                .replace('{limit}', this.limit)
                .replace('{input}', input);
              return fetch(url)
                .then(response => response.json())
                .then(featureCollection => featureCollection.features);
            });
            if (this.additionalSource) {
              promises.push(this.additionalSource.search(input)
                .then(results => results.map(result => {
                  return {
                    type: 'additionalSource',
                    result: result
                  };
                }))
              );
            }

            Promise.all(promises)
              .then(results => {
                results = results.flat();
                if (this.filterResults) {
                  results = results.filter(this.filterResults);
                }
                // FIXME: add header between type
                resolve(results);
              });
          } else {
            resolve([]);
          }
        });
      },

      renderResult: (result, props) => {
        // Match input value except if the string is inside an HTML tag.
        const pattern = `${escapeRegExp(this.autocomplete.input.value)}(?![^<>]*>)`;
        const regexp = new RegExp(pattern, 'ig');

        const label = this.getLabelFromResult(result).replace(regexp, match => `<span class='highlight'>${match}</span>`);
        return `
          <li ${props}>
            ${this.renderResult ? this.renderResult(result, label) : label}
          </li>
        `;
      },

      getResultValue: result => {
        return this.getLabelFromResult(result).replace(/<i>.*<\/i>/g, '').replace(/<\/?b>/g, '');
      },

      onSubmit: result => {
        if (result) {
          this.dispatchEvent(new CustomEvent('submit', {
            bubbles: true,
            composed: true,
            detail: {
              result: result.type === 'additionalSource' ? result.result : result
            }
          }));
          this.storage.addEntry(result);
        }
      }
    });
  }

  getLabelFromResult(result) {
    if (result.type === 'additionalSource') {
      return this.additionalSource.getResultValue(result.result);
    } else {
      return result.properties.label;
    }
  }

  render() {
    return html`
      <slot @slotchange="${this.slotReady}"></slot>
    `;
  }
};

function escapeRegExp(string) {
  return string ? string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&') : string;
}


customElements.define('ga-search', GeoadminSearch);
