export type Styles = {
	authContainer: string;
	card: string;
	cardRow: string;
	cardText: string;
	cardTitle: string;
	container: string;
	form: string;
	input: string;
	loginButton: string;
	main: string;
	pinkSpan: string;
	showcaseContainer: string;
	showcaseText: string;
	submitButton: string;
	title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
