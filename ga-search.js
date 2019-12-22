import {LitElement, html} from 'lit-element';
import Autocomplete from '@trevoreyre/autocomplete-js';

const baseUrl = 'http://mf-chsdi3.int.bgdi.ch/fix_3351/rest/services/api/SearchServer';
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
      featureLayers: {type: String}
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
  }

  slotReady() {
    this.autocomplete = new Autocomplete(this, {
      debounceTime: this.debounceTime,

      search: input => {
        return new Promise(resolve => {
          const urls = [];
          if (input.length >= this.minlength) {
            if (this.types.includes('location')) {
              const locationUrl = locationSearchUrl.replace('{origins}', this.locationOrigins)
              urls.push(locationUrl);
            }
            if (this.types.includes('layer')) {
              urls.push(layerSearchUrl);
            }
            if (this.types.includes('feature') && this.featureLayers) {
              const featureUrl = featureSearchUrl.replace('{layers}', this.featureLayers)
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
            Promise.all(promises)
              .then(results => {
                results = results.filter(result => result.length > 0);
                // FIXME: add header between type
                resolve(results.flat());
              });
          } else {
            resolve([]);
          }
        })
      },

      renderResult: (result, props) => {
        props['data-result-origin'] = result.properties.origin;
        // Match input value except if the string is inside an HTML tag.
        const pattern = `${this.autocomplete.input.value}(?![^<>]*>)`;
        const regexp = new RegExp(pattern, 'ig');
        const label = result.properties.label;
        return `
          <li ${props}>
            ${label.replace(regexp, match => `<span class='highlight'>${match}</span>`)}
          </li>
        `;
      },

      getResultValue: result => {
        return result.properties.label.replace(/<i>.*<\/i>/g, '').replace(/<\/?b>/g, '')
      },

      onSubmit: result => {
        this.dispatchEvent(new CustomEvent('submit', {
          detail: {
            result: result
          }
        }));
      }
    });
  }

  render() {
    return html`
      <slot @slotchange="${this.slotReady}"></slot>
    `;
  }
};

customElements.define('ga-search', GeoadminSearch);
