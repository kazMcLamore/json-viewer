// import Lit from CDN
import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';

// import FxJsonAttribute
import './FxJsonAttribute.js';

// Define a new element
export class FxJsonObject extends LitElement {
	static get properties() {
		return {
			json: { type: Object },
			expand: { type: Boolean }
		};
	}

	static get styles() {
		return css`

		:host {
			--font-size: 1rem;
			--font-family: sans-serif;
			font-size: var(--font-size);
			font-family: var(--font-family);
			box-sizing: border-box;
			display: inline;
			width: 100%;
			
		}
		

		:host(.expand) {
			font-size: var(--font-size);
			font-family: var(--font-family);
			box-sizing: border-box;
			display: flex;
			grid-template-columns: 20px auto;
			grid-column-gap: 5px;
			align-items: start;
			width: 100%;
		}

		fx-json-object {
			--font-size: var(--font-size);
			--font-family: var(--font-family);
		}

		fx-json-object.expand {
			margin-left: 1rem;
		}


		button {
			cursor: pointer;
			height: var(--font-size);
			width: var(--font-size);
			padding: 0;
			margin: calc(var(--font-size) * .15) 0;
			font-size: var(--font-size);
			text-align: center;


		}

		div#attributes {
			display: flex;
			flex-direction: column;
		}

		fx-json-attribute {
			display: inline-block;
			width: 100%;
			font-size: var(--font-size);
			font-family: var(--font-family);
		}


		span#key {
			color: gray;
			grid-column: 1;
			padding-right: .2rem;
		}

		fx-json-attribute.string::after,
		fx-json-attribute.number::after,
		fx-json-attribute.boolean::after {
			content: ',';
		}

		fx-json-attribute:nth-last-child(2)::after {
			content: '';
		}

		fx-json-attribute.string span#value::before {
			content: '"';

		}

		fx-json-attribute.string span#value::after {
			content: '"';
		}

		fx-json-attribute.number span#value {
			color: red;

		}

		fx-json-attribute.boolean span#value {
			color: blue;
		}

		fx-json-attribute.string span#value {
			color: green;
		}

		.leading-char, .trailing-char, .is-collapsed {
			display: inline;
			width: 100%;
		}

		.leading-char:hover, .trailing-char:hover, .is-collapsed:hover {
			cursor: pointer;
			color: blue;
		}



		`;
	}

	constructor() {
		super();
		this.json = null;
		this.expand = true;
	}

	set json(val) {
		const isFirst = this.json === null;
		this._json = val;

		if (this._json) {
			this.type = Array.isArray(this.json) ? 'array' : 'object';
			this.classList.add(this.type);
			this.attributeCount = Object.keys(this.json).length;
			this.leadingChar = this.type === 'object' ? '{' : '[';
			this.trailingChar = this.type === 'object' ? '}' : ']';
		}

		if (isFirst) {
			this.expand = this.attributeCount ? true : false;
		}

	}

	get json() {
		return this._json;

	}

	buttonHtml() {
		return html`
		<button @click=${this.toggleChildren}>-</button>
		`;

	}


	render() {

		if (!this.json) {
			return html``;
		} else if (!this.expand) {
			return html`
			<span @click=${this.toggleChildren} class='is-collapsed'>
			${this.leadingChar}
			${this.type} ${this.attributeCount} ${this.type === 'array' ? 'items' : 'attributes'
				}
				${this.trailingChar}</span>
			`;
		}
		return html`

		<div id='attributes'>
		<span @click=${this.toggleChildren} class='leading-char'>${this.leadingChar}</span>
		${Object.keys(this.json).map(key => html`
			<fx-json-attribute .key=${key} .value=${this.json[key]} .parentType=${this.type}></fx-json-attribute>
		`)}
		<span @click=${this.toggleChildren} class='trailing-char'>${this.trailingChar}</span>
		</div>
		`;
	}

	toggleChildren(event) {

		event.stopPropagation();
		this.expand = this.classList.toggle('expand')

	}

	firstUpdated() {
		if (this.expand) {
			this.classList.toggle('expand', true);
		}
	}

}

// Register the new element with the browser
customElements.define('fx-json-object', FxJsonObject);

