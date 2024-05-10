// import Lit from CDN
import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';

// import FXJsonObject
import './FxJsonObject.js';

// Define a new element
export class FxJsonAttribute extends LitElement {
	static get properties() {
		return {
			key: { type: String },
			value: { type: String },
			parentType: { type: String },
		};
	}

	constructor() {
		super();
		this.key = '';
		this.value = '';
		this.type = '';
		this.parentType = '';
	}

	set value(val) {
		this._value = val;
		// get the type of the value
		const type = typeof val;
		// set the type to the type property
		if (this._value) {
			this.classList.add(type);
		}
	}

	get value() {
		return this._value;
	}

	keyFragment() {
		if (this.parentType === 'array') {
			return html`<span id='key'>${this.key}:</span>`
		} else {
			return html`<span id='key'>"${this.key}":</span>`
		}
	}


	render() {
		return html`
		${this.keyFragment()}${typeof this.value === 'object' ?
				html`<fx-json-object .json=${this.value}></fx-json-object>` :
				html`<span id='value'>${this.value}</span>

				`
			}
		`;
	}

	createRenderRoot() {
		return this;
	}

	connectedCallback() {
		super.connectedCallback();

	}

}

// Register the new element with the browser
customElements.define('fx-json-attribute', FxJsonAttribute);