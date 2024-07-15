declare global {
	interface Window {
    dataLayer: {
      push: (...args: any[]) => any
    };
	}
}

export {}
