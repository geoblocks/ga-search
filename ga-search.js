import {LitElement, html} from 'lit-element';
import Autocomplete from '@trevoreyre/autocomplete-js';

const searchUrl = 'https://api3.geo.admin.ch/rest/services/api/SearchServer?lang={lang}&limit={limit}&searchText={input}';
const locationSearchUrl = searchUrl + '&origins={origins}&geometryFormat=geojson&sr={sr}&type=locations';
// const layersSearchUrl = searchUrl + '&type=layers';
// const featuresSearchUrl = searchUrl + '&sr={sr}&type=featuresearch&features={layers}';

class GeoadminSearch extends LitElement {
  static get properties() {
    return {
      types: {type: String},
      minlength: {type: Number},
      locationOrigins: {type: String},
      sr: {type: String},
      lang: {type: String},
      limit: {type: Number}
    };
  }

  constructor() {
    super();

    this.minlength = 1;
    this.sr = '4326';
    this.types = 'location';
    this.locationOrigins = 'zipcode,gg25';
    this.limit = 15;
  }

  slotReady() {
    this.autocomplete = new Autocomplete(this, {

      search: input => {
        return new Promise(resolve => {
          if (input.length >= this.minlength) {
            const locationUrl = locationSearchUrl
              .replace('{lang}', this.lang || document.documentElement.lang)
              .replace('{origins}', this.locationOrigins)
              .replace('{sr}', this.sr)
              .replace('{limit}', this.limit)
              .replace('{input}', input);
            fetch(locationUrl)
              .then(response => response.json())
              .then(featureCollection => featureCollection.features)
              .then(features => resolve(features));
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
