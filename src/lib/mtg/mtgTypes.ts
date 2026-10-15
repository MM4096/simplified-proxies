export enum ReminderTextBehavior {
	NORMAL,
	ITALIC,
	HIDDEN,
}

export enum FlavorTextBehavior {
	NAME,
	NONE,
	BOTH,
}

export type MTGAPIImportIdType = {
	name?: string;
	quantity: number;
	id?: string;
};

export type MTGAPIImportType = {
	importBasicLands?: boolean;
	reminderTextBehavior?: ReminderTextBehavior;
	flavorTextBehavior?: FlavorTextBehavior;
	importTemplates?: boolean;
	includeTokens?: boolean;
	splitDFCs?: boolean;
	importNote?: string;
	suppressWarnings?: boolean;
	includeMessages?: boolean;
} & (| {
	cards: string;
	ids?: never;
} | {
	cards?: never;
	ids: Array<MTGAPIImportIdType>;
});

export enum MatchType {
	STARTSWITH,
	COMPLETEMATCH,
	ENDSWITH,
}