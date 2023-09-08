/// <reference path="node_modules/@zeppos/device-types/index.d.ts" />

declare module 'zosLoader:./[name].[pf].layout.js' {
	interface ILayout {
		render(vm: any): void
	}
  export const layout: ILayout;
}