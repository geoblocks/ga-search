# `<ga-search>`

A web component element to access the [GeoAdmin search API](https://api3.geo.admin.ch/services/sdiservices.html#search).

## Installation

```sh
npm install @geoblocks/ga-search
```

## Example Usage

```html
<ga-search limit="42">
  <input placeholder="Search...">
  <ul></ul>
</ga-search>
```

The component has to have an `input` and `ul` as children element. The query text is taken from the input and the results are displayed in the ul.

## API

### Properties/Attributes

| Name               | Type       | Default          | Description
| ------------------ | ---------- | ---------------- | -----------
| `minlength`        | `number`   | `1`              | The minimum number of characters of the input to start a search.
| `limit`            | `number`   | `15`             | The number of result per type.
| `debounceTime`     | `number`   | `200`            | Time in milliseconds that the component should wait after last keystroke before calling search function.
| `lang`             | `string`   |                  | Default is the `lang` attribute of the HTML document.
| `types`            | `string`   | `'location'`     | The types of search to use. Can be a combinaison of `'location'`, `'layer'` and `'feature'`
| `sr`               | `string`   | `'4326'`         | The spatial reference for output geometries. Can be `21781`, `2056`, `3857` or `4326`
| `locationOrigins`  | `string`   | `'zipcode,gg25'` | A comma separated list of location origins. Possible origins are: zipcode, gg25, district, kantone, gazetteer,address, parcel.
| `featureLayers`    | `string`   |                  | A comma separated list of technical layer names to be used by the `feature` search.
| `filterResults`    | `function` |                  | Filter function applied to the result array. The function accepts three arguments: `element`, `index` and `array` and must return a `boolean`.


## Events

| Name     | Detail              | Description
| -------- | ------------------- | -----------
| `submit` | `{result: Feature}` | Fired when a search result is selected.

## Running the demo

```sh
npm i
npm run start
```
